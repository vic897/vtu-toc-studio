'use client';
import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useAutomataStore } from '@/store/useAutomataStore';
import { isEpsilon } from '@/lib/automata/closure';
import { computeLayout, X_GAP, Y_GAP } from '@/lib/automata/layout';

// Small machines would otherwise be blown up to fill the whole canvas.
const MAX_FIT_ZOOM = 1.3;

function fitGraph(cy: cytoscape.Core) {
  cy.resize();
  cy.fit(undefined, 40);
  if (cy.zoom() > MAX_FIT_ZOOM) {
    cy.zoom(MAX_FIT_ZOOM);
    cy.center();
  }
}

export default function AutomataCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const { activeMachine, executionSteps, currentStepIndex } = useAutomataStore();

  // 1. Initialize Graph Topology
  useEffect(() => {
    if (!containerRef.current || !activeMachine) return;

    const elements: cytoscape.ElementDefinition[] = [];
    const { states, start, accept, transitions } = activeMachine;
    const { positions } = computeLayout(activeMachine);

    // Hidden start node to the left of the start state, for the initial arrow
    const startPos = positions[start] ?? { x: 0, y: 0 };
    elements.push({ data: { id: '__start', label: '' }, classes: 'startdot', position: { x: startPos.x - 70, y: startPos.y } });
    elements.push({ data: { id: 'e_start', source: '__start', target: start, label: '' }, classes: 'startedge' });

    states.forEach(state => {
      elements.push({
        data: { id: state, label: state },
        classes: accept.includes(state) ? 'accept' : '',
        position: positions[state],
      });
    });

    // Group transitions by from/to to handle multiple symbols on one edge
    const edgeMap: Record<string, string[]> = {};
    transitions.forEach(t => {
      const key = `${t.from}|${t.to}`;
      const sym = isEpsilon(t.symbol) ? 'ε' : t.symbol;
      if (!edgeMap[key]) edgeMap[key] = [];
      edgeMap[key].push(sym);
    });

    Object.entries(edgeMap).forEach(([key, symbols]) => {
      const [source, target] = key.split('|');
      const a = positions[source];
      const b = positions[target];
      const cols = a && b ? Math.round(Math.abs(b.x - a.x) / X_GAP) : 0;
      const rows = a && b ? Math.round(Math.abs(b.y - a.y) / Y_GAP) : 0;
      // A straight line that jumps over a column (or over a state in the same
      // column) would run through the states in between, so arc it instead.
      // The arc side follows edge direction, so forward and back jumps separate.
      const skips = source !== target && (cols >= 2 || (cols === 0 && rows >= 2));
      elements.push({
        data: { id: `e_${key}`, source, target, label: symbols.join(',') },
        ...(skips && {
          classes: 'skip',
          style: { 'control-point-distances': [30 + 25 * Math.max(cols, rows)] },
        }),
      });
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      layout: { name: 'preset' },
      minZoom: 0.3,
      maxZoom: 2.5,
      style: [
        { selector: 'node', style: { label: 'data(label)', 'text-valign': 'center', 'background-color': '#1e293b', color: '#f8fafc', 'border-width': 2, 'border-color': '#64748b', width: 45, height: 45, 'font-size': 14 } },
        { selector: 'node.accept', style: { 'border-width': 5, 'border-style': 'double' } },
        { selector: 'node.startdot', style: { width: 1, height: 1, 'background-opacity': 0, 'border-width': 0, events: 'no' } },
        { selector: 'edge', style: { width: 2, 'line-color': '#64748b', 'target-arrow-color': '#64748b', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'control-point-step-size': 50, label: 'data(label)', color: '#f8fafc', 'text-background-color': '#0f172a', 'text-background-opacity': 1, 'text-background-padding': '2px', 'font-size': 13 } },
        { selector: 'edge:loop', style: { 'loop-direction': '0deg', 'loop-sweep': '-50deg', 'control-point-step-size': 55 } },
        { selector: 'edge.skip', style: { 'curve-style': 'unbundled-bezier', 'control-point-weights': [0.5] } },
        { selector: 'edge.startedge', style: { 'curve-style': 'straight' } },
        { selector: 'node.active', style: { 'background-color': '#f59e0b', color: '#000', 'border-color': '#f59e0b' } },
        { selector: 'node.active.accept.yes', style: { 'background-color': '#22c55e', color: '#fff', 'border-color': '#22c55e' } },
        { selector: 'node.active.no', style: { 'background-color': '#ef4444', color: '#fff', 'border-color': '#ef4444' } },
        { selector: 'edge.used', style: { 'line-color': '#f59e0b', 'target-arrow-color': '#f59e0b', width: 4 } }
      ]
    });
    cyRef.current = cy;
    fitGraph(cy);

    // Keep the machine framed when the panel resizes (window resize, mobile rotation).
    const observer = new ResizeObserver(() => fitGraph(cy));
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      cy.destroy();
    };
  }, [activeMachine]);

  // 2. Apply Step Highlights
  useEffect(() => {
    if (!cyRef.current || executionSteps.length === 0) return;

    const cy = cyRef.current;
    const currentStep = executionSteps[currentStepIndex];
    const isLastStep = currentStepIndex === executionSteps.length - 1;
    const isOk = currentStep.status === 'accepted';

    cy.elements().removeClass('active used yes no');

    // On the final step, the states the run ended in turn green (accept) or
    // red (reject); a run that died has no active states left to colour.
    currentStep.activeStates.forEach(stateId => {
      const node = cy.getElementById(stateId);
      node.addClass('active');
      if (isLastStep) node.addClass(isOk ? 'yes' : 'no');
    });

    currentStep.activeTransitions.forEach(t => {
      cy.getElementById(`e_${t.from}|${t.to}`).addClass('used');
    });

  }, [executionSteps, currentStepIndex]);

  return <div ref={containerRef} className="w-full h-80 bg-slate-950 rounded-xl border border-slate-800" />;
}

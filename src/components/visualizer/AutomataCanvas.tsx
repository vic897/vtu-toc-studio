'use client';
import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useAutomataStore } from '@/store/useAutomataStore';
import { isEpsilon } from '@/lib/automata/closure';

export default function AutomataCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  
  const { activeMachine, executionSteps, currentStepIndex } = useAutomataStore();

  // 1. Initialize Graph Topology
  useEffect(() => {
    if (!containerRef.current || !activeMachine) return;

    const elements: cytoscape.ElementDefinition[] = [];
    const { states, start, accept, transitions } = activeMachine;

    // Hidden start node for initial arrow
    elements.push({ data: { id: '__start', label: '' }, classes: 'startdot' });
    elements.push({ data: { id: 'e_start', source: '__start', target: start, label: '' }, classes: 'startedge' });

    states.forEach(state => {
      elements.push({
        data: { id: state, label: state },
        classes: accept.includes(state) ? 'accept' : ''
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
      elements.push({
        data: { id: `e_${key}`, source, target, label: symbols.join(',') }
      });
    });

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      layout: { name: 'breadthfirst', directed: true, spacingFactor: 1.2, padding: 30 },
      style: [
        { selector: 'node', style: { label: 'data(label)', 'text-valign': 'center', 'background-color': '#1e293b', color: '#f8fafc', 'border-width': 2, 'border-color': '#64748b', width: 45, height: 45 } },
        { selector: 'node.accept', style: { 'border-width': 5, 'border-style': 'double' } },
        { selector: 'node.startdot', style: { width: 1, height: 1, 'background-opacity': 0 } },
        { selector: 'edge', style: { width: 2, 'line-color': '#64748b', 'target-arrow-color': '#64748b', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', label: 'data(label)', color: '#f8fafc', 'text-background-color': '#0f172a', 'text-background-opacity': 1, 'text-background-padding': '2px', 'font-size': 14 } },
        { selector: 'node.active', style: { 'background-color': '#f59e0b', color: '#000', 'border-color': '#f59e0b' } },
        { selector: 'node.active.accept.yes', style: { 'background-color': '#22c55e', color: '#fff', 'border-color': '#22c55e' } },
        { selector: 'node.dead', style: { 'border-color': '#ef4444' } },
        { selector: 'edge.used', style: { 'line-color': '#f59e0b', 'target-arrow-color': '#f59e0b', width: 4 } }
      ]
    });

    return () => cyRef.current?.destroy();
  }, [activeMachine]);

  // 2. Apply Step Highlights
  useEffect(() => {
    if (!cyRef.current || executionSteps.length === 0) return;
    
    const cy = cyRef.current;
    const currentStep = executionSteps[currentStepIndex];
    const isLastStep = currentStepIndex === executionSteps.length - 1;
    const isOk = currentStep.status === 'accepted';

    cy.elements().removeClass('active used yes dead');

    currentStep.activeStates.forEach(stateId => {
      const node = cy.getElementById(stateId);
      node.addClass('active');
      if (isLastStep && isOk) node.addClass('yes');
    });

    currentStep.activeTransitions.forEach(t => {
      cy.getElementById(`e_${t.from}|${t.to}`).addClass('used');
    });

    if (isLastStep && !isOk) {
      cy.nodes().not('.startdot').addClass('dead');
    }

  }, [executionSteps, currentStepIndex]);

  return <div ref={containerRef} className="w-full h-80 bg-slate-950 rounded-xl border border-slate-800" />;
}
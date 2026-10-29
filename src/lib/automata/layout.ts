import { AutomatonSpec } from '@/types/automata';

export interface Point {
  x: number;
  y: number;
}

export interface MachineLayout {
  positions: Record<string, Point>;
  levels: Record<string, number>; // Column index = BFS distance from the start state
}

export const X_GAP = 140;
export const Y_GAP = 100;

// Textbook-style left-to-right layout: each state sits in the column of its
// BFS distance from the start state, and states sharing a column are stacked
// vertically around the centre line in discovery order. Unreachable states get
// a final column of their own so they stay visible.
export function computeLayout(machine: AutomatonSpec): MachineLayout {
  const levels: Record<string, number> = { [machine.start]: 0 };
  const columns: string[][] = [[machine.start]];
  const queue = [machine.start];

  while (queue.length > 0) {
    const state = queue.shift()!;
    for (const t of machine.transitions) {
      if (t.from !== state || t.to in levels) continue;
      const level = levels[state] + 1;
      levels[t.to] = level;
      (columns[level] ??= []).push(t.to);
      queue.push(t.to);
    }
  }

  const unreachable = machine.states.filter(s => !(s in levels));
  if (unreachable.length > 0) {
    const level = columns.length;
    columns.push(unreachable);
    for (const s of unreachable) levels[s] = level;
  }

  const positions: Record<string, Point> = {};
  columns.forEach((column, level) => {
    column.forEach((state, i) => {
      positions[state] = { x: level * X_GAP, y: (i - (column.length - 1) / 2) * Y_GAP };
    });
  });

  return { positions, levels };
}

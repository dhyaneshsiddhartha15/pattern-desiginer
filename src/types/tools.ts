export interface Point {
  x: number;
  y: number;
}

export interface PatternPiece {
  id: string;
  type: 'line' | 'curve' | 'rectangle' | 'circle';
  points: Point[];
  selected: boolean;
  style: {
    stroke: string;
    strokeWidth: number;
    fill?: string;
  };
  grainline?: {
    type: 'straight' | 'cross' | 'bias' | 'custom';
    angle: number;
  };
  seam?: {
    width: number;
    type: 'normal' | 'felled';
  };
}

export interface PatternState {
  pieces: PatternPiece[];
  selectedPieces: string[];
  zoom: number;
  history: PatternAction[];
  clipboard: PatternPiece | null;
  fabricWidth: number;
  grid: {
    size: number;
    visible: boolean;
  };
}

export interface PatternAction {
  type: 'add' | 'modify' | 'delete' | 'group' | 'ungroup';
  data: any;
  timestamp: number;
}

export interface Tool {
  id: string;
  code: string;
  icon: any;
  label: string;
  description: string;
  action: (state: PatternState, event: any) => PatternState;
  cursor?: string;
}
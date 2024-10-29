import { useState, useCallback } from 'react';
import { PatternState, PatternPiece, Point } from '../types/tools';

export const usePatternTools = () => {
  const [state, setState] = useState<PatternState>({
    pieces: [],
    selectedPieces: [],
    zoom: 1,
    history: [],
    clipboard: null,
    fabricWidth: 1500,
    grid: {
      size: 10,
      visible: true
    }
  });

  const addPiece = useCallback((piece: PatternPiece) => {
    setState(prev => ({
      ...prev,
      pieces: [...prev.pieces, piece],
      history: [...prev.history, {
        type: 'add',
        data: piece,
        timestamp: Date.now()
      }]
    }));
  }, []);

  const selectPiece = useCallback((id: string, multiSelect = false) => {
    setState(prev => ({
      ...prev,
      selectedPieces: multiSelect 
        ? [...prev.selectedPieces, id]
        : [id]
    }));
  }, []);

  const addCurve = useCallback((points: Point[]) => {
    const newPiece: PatternPiece = {
      id: `curve-${Date.now()}`,
      type: 'curve',
      points,
      selected: false,
      style: {
        stroke: '#000000',
        strokeWidth: 2
      }
    };
    addPiece(newPiece);
  }, [addPiece]);

  const addGrainLine = useCallback((pieceId: string, type: 'straight' | 'cross' | 'bias' | 'custom', angle: number) => {
    setState(prev => ({
      ...prev,
      pieces: prev.pieces.map(piece => 
        piece.id === pieceId 
          ? { ...piece, grainline: { type, angle } }
          : piece
      )
    }));
  }, []);

  const addSeamAllowance = useCallback((id: string, width: number) => {
    setState(prev => ({
      ...prev,
      pieces: prev.pieces.map(piece => {
        if (piece.id !== id) return piece;
        
        // Calculate offset points for seam allowance
        const points = piece.points;
        const offsetPoints = points.map((point, i) => {
          const prev = points[(i - 1 + points.length) % points.length];
          const next = points[(i + 1) % points.length];
          
          // Calculate normal vector
          const dx1 = point.x - prev.x;
          const dy1 = point.y - prev.y;
          const dx2 = next.x - point.x;
          const dy2 = next.y - point.y;
          
          // Normalize vectors
          const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
          const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          const nx1 = -dy1 / len1;
          const ny1 = dx1 / len1;
          const nx2 = -dy2 / len2;
          const ny2 = dx2 / len2;
          
          // Average normal vectors
          const nx = (nx1 + nx2) / 2;
          const ny = (ny1 + ny2) / 2;
          const len = Math.sqrt(nx * nx + ny * ny);
          
          return {
            x: point.x + (nx * width) / len,
            y: point.y + (ny * width) / len
          };
        });
        
        return {
          ...piece,
          seam: { width, type: 'normal' },
          points: offsetPoints
        };
      })
    }));
  }, []);

  const cutLine = useCallback((pieceId: string, point: Point) => {
    setState(prev => {
      const piece = prev.pieces.find(p => p.id === pieceId);
      if (!piece) return prev;

      // Find the segment containing the cut point
      let segmentIndex = -1;
      let minDistance = Infinity;
      
      piece.points.forEach((start, i) => {
        const end = piece.points[(i + 1) % piece.points.length];
        const distance = pointToLineDistance(point, start, end);
        if (distance < minDistance) {
          minDistance = distance;
          segmentIndex = i;
        }
      });

      if (segmentIndex === -1) return prev;

      // Create two new pieces from the cut
      const piece1Points = piece.points.slice(0, segmentIndex + 1).concat([point]);
      const piece2Points = [point].concat(piece.points.slice(segmentIndex + 1));

      const newPieces = prev.pieces.filter(p => p.id !== pieceId).concat([
        {
          ...piece,
          id: `${piece.id}-1`,
          points: piece1Points
        },
        {
          ...piece,
          id: `${piece.id}-2`,
          points: piece2Points
        }
      ]);

      return {
        ...prev,
        pieces: newPieces
      };
    });
  }, []);

  const pointToLineDistance = (point: Point, start: Point, end: Point) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.sqrt((point.x - start.x) ** 2 + (point.y - start.y) ** 2);
    
    const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / len2));
    const projX = start.x + t * dx;
    const projY = start.y + t * dy;
    
    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
  };

  return {
    state,
    actions: {
      addPiece,
      selectPiece,
      addCurve,
      addGrainLine,
      addSeamAllowance,
      cutLine
    }
  };
};
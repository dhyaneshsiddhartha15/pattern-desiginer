import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle, Group } from 'react-konva';
import { usePatternTools } from '../hooks/usePatternTools';
import { PatternPiece, Point } from '../types/tools';

interface CanvasProps {
  selectedTool: string;
  patternData?: any;
}

export const Canvas: React.FC<CanvasProps> = ({ selectedTool, patternData }) => {
  const stageRef = useRef(null);
  const { state, actions } = usePatternTools();
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<Point | null>(null);

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const scaled = {
      x: (point.x - stage.x()) / stage.scaleX(),
      y: (point.y - stage.y()) / stage.scaleY()
    };

    switch (selectedTool) {
      case 'line':
      case 'curve':
        setIsDrawing(true);
        setDrawingPoints([scaled]);
        break;
      case 'cut':
        const selectedPiece = state.pieces.find(p => p.id === state.selectedPieces[0]);
        if (selectedPiece) {
          actions.cutLine(selectedPiece.id, scaled);
        }
        break;
      case 'select':
        const clickedPiece = state.pieces.find(piece => isPointInPiece(scaled, piece));
        if (clickedPiece) {
          actions.selectPiece(clickedPiece.id, e.evt.shiftKey);
        }
        break;
    }
  };

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const scaled = {
      x: (point.x - stage.x()) / stage.scaleX(),
      y: (point.y - stage.y()) / stage.scaleY()
    };
    
    setCursorPosition(scaled);

    if (!isDrawing) return;

    switch (selectedTool) {
      case 'line':
        setDrawingPoints(prev => [...prev.slice(0, -1), scaled]);
        break;
      case 'curve':
        setDrawingPoints(prev => [...prev, scaled]);
        break;
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    const newPiece: PatternPiece = {
      id: `piece-${Date.now()}`,
      type: selectedTool === 'line' ? 'line' : 'curve',
      points: drawingPoints,
      selected: false,
      style: {
        stroke: '#000000',
        strokeWidth: 2
      }
    };

    actions.addPiece(newPiece);
    setIsDrawing(false);
    setDrawingPoints([]);
  };

  const isPointInPiece = (point: Point, piece: PatternPiece): boolean => {
    if (piece.points.length < 2) return false;

    for (let i = 0; i < piece.points.length - 1; i++) {
      const start = piece.points[i];
      const end = piece.points[i + 1];
      const distance = pointToLineDistance(point, start, end);
      if (distance < 5) return true; // 5px threshold
    }

    return false;
  };

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

  const renderGrid = () => {
    const { size, visible } = state.grid;
    if (!visible) return null;

    const gridLines = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Vertical lines
    for (let x = 0; x < width; x += size) {
      gridLines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, height]}
          stroke="#eee"
          strokeWidth={0.5}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y < height; y += size) {
      gridLines.push(
        <Line
          key={`h${y}`}
          points={[0, y, width, y]}
          stroke="#eee"
          strokeWidth={0.5}
        />
      );
    }

    return gridLines;
  };

  return (
    <div className="relative bg-white flex-grow">
      <Stage
        ref={stageRef}
        width={window.innerWidth - 80}
        height={window.innerHeight - 64}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {renderGrid()}
          
          {state.pieces.map((piece) => (
            <Group key={piece.id}>
              <Line
                points={piece.points.flatMap(p => [p.x, p.y])}
                stroke={piece.style.stroke}
                strokeWidth={piece.style.strokeWidth}
                tension={piece.type === 'curve' ? 0.5 : 0}
                closed={piece.type === 'rectangle'}
              />
              {piece.grainline && (
                <Line
                  points={calculateGrainlinePoints(piece)}
                  stroke="#000"
                  strokeWidth={1}
                  dash={[5, 5]}
                />
              )}
              {piece.selected && (
                <Circle
                  x={piece.points[0].x}
                  y={piece.points[0].y}
                  radius={4}
                  fill="#00ff00"
                />
              )}
            </Group>
          ))}
          
          {isDrawing && (
            <Line
              points={drawingPoints.flatMap(p => [p.x, p.y])}
              stroke="#000"
              strokeWidth={2}
              tension={selectedTool === 'curve' ? 0.5 : 0}
            />
          )}
          
          {cursorPosition && ['cut', 'select'].includes(selectedTool) && (
            <Circle
              x={cursorPosition.x}
              y={cursorPosition.y}
              radius={3}
              fill={selectedTool === 'cut' ? '#ff0000' : '#00ff00'}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

const calculateGrainlinePoints = (piece: PatternPiece) => {
  if (!piece.grainline) return [0, 0, 0, 0];
  
  // Calculate center point of the piece
  const center = piece.points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  );
  center.x /= piece.points.length;
  center.y /= piece.points.length;
  
  const length = 50; // Length of grainline
  const angle = piece.grainline.angle * (Math.PI / 180);
  
  return [
    center.x - length * Math.cos(angle),
    center.y - length * Math.sin(angle),
    center.x + length * Math.cos(angle),
    center.y + length * Math.sin(angle)
  ];
};
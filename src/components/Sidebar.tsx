import React from 'react';
import {
  Pencil, Circle, ArrowUpDown, RotateCw, Square, Scissors,
  Triangle, Maximize2, Type, Grid, Circle as CircleIcon
} from 'lucide-react';

interface SidebarProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onToolSelect, selectedTool }) => {
  const patternTools = [
    { id: 'line', code: 'PAT001', icon: Pencil, label: 'Line' },
    { id: 'curve', code: 'PAT0012', icon: Circle, label: 'Curve' },
    { id: 'convert', code: 'PAT0013', icon: ArrowUpDown, label: 'Convert' },
    { id: 'rotate', code: 'PAT0014', icon: RotateCw, label: 'Rotate' },
    { id: 'select', code: 'PAT002', icon: Square, label: 'Select' },
    { id: 'cut', code: 'PAT0021', icon: Scissors, label: 'Cut Line' },
    { id: 'rectangle', code: 'PAT003', icon: Square, label: 'Rectangle' },
    { id: 'godet', code: 'PAT0031', icon: Triangle, label: 'Godet' },
    { id: 'mirror', code: 'PAT004', icon: Maximize2, label: 'Mirror' },
  ];

  const patternFeatures = [
    { id: 'type', code: 'PAT0081', icon: Type, label: 'Type' },
    { id: 'grain', code: 'PAT0082', icon: Grid, label: 'Grain' },
    { id: 'notch', code: 'PAT0083', icon: Square, label: 'Notch' },
    { id: 'buttonhole', code: 'PAT0084', icon: Square, label: 'Button Hole' },
    { id: 'button', code: 'PAT00841', icon: CircleIcon, label: 'Button' },
  ];

  return (
    <div className="w-20 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
      {patternTools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`p-2 hover:bg-gray-200 rounded-lg w-16 flex flex-col items-center ${
            selectedTool === tool.id ? 'bg-gray-200' : ''
          }`}
          title={`${tool.code}: ${tool.label}`}
        >
          <tool.icon className="w-6 h-6" />
          <span className="text-xs mt-1 text-center">{tool.label}</span>
        </button>
      ))}
      
      <div className="border-t border-gray-300 w-full my-2" />
      
      {patternFeatures.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`p-2 hover:bg-gray-200 rounded-lg w-16 flex flex-col items-center ${
            selectedTool === tool.id ? 'bg-gray-200' : ''
          }`}
          title={`${tool.code}: ${tool.label}`}
        >
          <tool.icon className="w-6 h-6" />
          <span className="text-xs mt-1 text-center">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};
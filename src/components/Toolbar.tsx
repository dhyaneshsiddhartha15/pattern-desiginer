import React from 'react';
import { 
  Copy, Trash2, Eye, ZoomIn, FlipHorizontal, Type, 
  Clipboard, Square, Ruler, Save, RotateCw, Scissors,
  Circle, Grid
} from 'lucide-react';

interface ToolbarProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string;
  onSave: () => void;
  onExport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onToolSelect, selectedTool, onSave, onExport }) => {
  const tools = [
    { id: 'duplicate', code: 'CON001', icon: Copy, label: 'Duplicate', description: 'Duplicate the pattern block' },
    { id: 'zoom', code: 'CON002', icon: ZoomIn, label: 'Zoom', description: 'Zoom in on an area' },
    { id: 'view', code: 'CON003', icon: Eye, label: 'View', description: 'View pattern at original size' },
    { id: 'copy', code: 'CON004', icon: Clipboard, label: 'Copy', description: 'Copy a line or pattern piece' },
    { id: 'paste', code: 'CON005', icon: Square, label: 'Paste', description: 'Paste the line or pattern piece' },
    { id: 'save', code: 'CON006', icon: Save, label: 'Save', description: 'Save work to library' },
    { id: 'delete', code: 'CON007', icon: Trash2, label: 'Delete', description: 'Delete selected elements' },
    { id: 'seam', code: 'PAT0072', icon: Scissors, label: 'Seam', description: 'Add seam allowance' },
    { id: 'grain', code: 'PAT0082', icon: Grid, label: 'Grain', description: 'Add grain line' },
  ];

  const seams = [
    { id: 'seam-5', code: 'G0041', width: 5, label: '5mm' },
    { id: 'seam-10', code: 'G0042', width: 10, label: '10mm' },
    { id: 'seam-15', code: 'G0043', width: 15, label: '15mm' },
    { id: 'seam-20', code: 'G0044', width: 20, label: '20mm' },
    { id: 'seam-40', code: 'G0045', width: 40, label: '40mm' },
  ];

  return (
    <div className="bg-indigo-900 text-white p-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`p-2 hover:bg-indigo-700 rounded-lg flex flex-col items-center ${
              selectedTool === tool.id ? 'bg-indigo-700' : ''
            }`}
            title={`${tool.code}: ${tool.description}`}
          >
            <tool.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{tool.label}</span>
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative group">
          <button className="p-2 hover:bg-indigo-700 rounded-lg flex flex-col items-center">
            <Scissors className="w-5 h-5" />
            <span className="text-xs mt-1">Seam</span>
          </button>
          <div className="absolute hidden group-hover:block top-full right-0 mt-1 bg-white text-gray-800 rounded-lg shadow-lg">
            {seams.map(seam => (
              <button
                key={seam.id}
                onClick={() => onToolSelect(seam.id)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {seam.label}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={onSave}
          className="p-2 hover:bg-indigo-700 rounded-lg flex flex-col items-center"
        >
          <Save className="w-5 h-5" />
          <span className="text-xs mt-1">Save</span>
        </button>
        <button 
          onClick={onExport}
          className="p-2 hover:bg-indigo-700 rounded-lg flex flex-col items-center"
        >
          <Square className="w-5 h-5" />
          <span className="text-xs mt-1">Export</span>
        </button>
      </div>
    </div>
  );
};
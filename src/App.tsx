import React, { useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';

function App() {
  const [selectedTool, setSelectedTool] = useState('line');
  const [patternData, setPatternData] = useState(null);

  const handleSave = async () => {
    // Implement save functionality
    console.log('Saving pattern...');
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting pattern...');
  };

  return (
    <div className="h-screen flex flex-col">
      <Toolbar 
        onToolSelect={setSelectedTool} 
        selectedTool={selectedTool}
        onSave={handleSave}
        onExport={handleExport}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onToolSelect={setSelectedTool} selectedTool={selectedTool} />
        <Canvas selectedTool={selectedTool} patternData={patternData} />
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { useWheel, WheelItem } from '../context/WheelContext';
import { Trash2, Edit, Check, X, Plus, RotateCw, Save, Share2, History, Settings, Download, Upload } from 'lucide-react';
import clsx from 'clsx';

const WheelControls: React.FC = () => {
  const { 
    items, 
    addItem, 
    updateItem, 
    removeItem, 
    spinWheel, 
    spinning,
    winner,
    resetWheel,
    history,
    clearHistory,
    getShareableLink,
    saveConfiguration,
    loadConfiguration
  } = useWheel();

  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      addItem(newItemText.trim());
      setNewItemText('');
    }
  };

  const handleStartEdit = (item: WheelItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      updateItem(editingId, { text: editText.trim() });
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleColorChange = (id: string, color: string) => {
    updateItem(id, { color });
  };

  const handleWeightChange = (id: string, weight: number) => {
    if (weight >= 1 && weight <= 10) {
      updateItem(id, { weight });
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'spinwheel-config.json');
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        if (Array.isArray(config) && config.length > 0) {
          loadConfiguration(config);
        }
      } catch (error) {
        console.error('Failed to parse configuration file', error);
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 w-full max-w-2xl mx-auto">
      {/* Top controls */}
      <div className="flex flex-wrap gap-2 mb-5 justify-between">
        <button
          className={clsx(
            "flex-grow btn flex items-center justify-center space-x-1 py-3 rounded-lg font-medium text-white shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300",
            spinning ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          )}
          onClick={spinWheel}
          disabled={spinning || items.length < 2}
        >
          <RotateCw size={18} className={spinning ? "animate-spin" : ""} />
          <span>{spinning ? "Spinning..." : "Spin The Wheel"}</span>
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn flex items-center justify-center space-x-1 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        >
          <History size={18} />
          <span className="hidden sm:inline">History</span>
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn flex items-center justify-center space-x-1 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        >
          <Settings size={18} />
          <span className="hidden sm:inline">Options</span>
        </button>
      </div>

      {/* Winner announcement */}
      {winner && !spinning && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md text-center animate-bounce">
          <h3 className="text-lg font-semibold">Winner!</h3>
          <p className="text-2xl font-bold mt-1">{winner.text}</p>
          <button
            onClick={resetWheel}
            className="mt-2 px-3 py-1 bg-white text-purple-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Results History</h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No history yet. Spin the wheel to see results.</p>
          ) : (
            <div className="max-h-40 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {history.map((item, index) => (
                  <li key={index} className="py-2 flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="flex-1">{item.text}</span>
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={saveConfiguration}
              className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              <Save size={18} className="text-gray-700" />
              <span>Save Configuration</span>
            </button>
            
            <button
              onClick={getShareableLink}
              className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              <Share2 size={18} className="text-gray-700" />
              <span>Share Configuration</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              <Download size={18} className="text-gray-700" />
              <span>Export Configuration</span>
            </button>
            
            <label className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload size={18} className="text-gray-700" />
              <span>Import Configuration</span>
              <input 
                type="file" 
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </div>
        </div>
      )}

      {/* Add new item form */}
      <form onSubmit={handleAddItem} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={spinning}
          />
          <button
            type="submit"
            className={clsx(
              "btn flex items-center justify-center p-3 rounded-lg text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300",
              newItemText.trim() && !spinning
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            )}
            disabled={!newItemText.trim() || spinning}
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      {/* Items list */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-700 flex items-center justify-between">
          <span>Wheel Items</span>
          <span className="text-sm text-gray-500">{items.length} items</span>
        </h3>

        {items.length === 0 ? (
          <p className="text-center py-6 text-gray-500">Add items to the wheel to get started.</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className="p-3 bg-white">
                {editingId === item.id ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="Save"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Cancel"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-5 h-5 rounded-full cursor-pointer"
                      style={{ backgroundColor: item.color }}
                      onClick={() => {
                        const newColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                        handleColorChange(item.id, newColor);
                      }}
                      title="Click to change color"
                    ></div>
                    <span className="flex-1 truncate">{item.text}</span>
                    
                    <div className="flex items-center space-x-1 bg-gray-100 rounded px-1">
                      <button
                        className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                        disabled={item.weight <= 1 || spinning}
                        onClick={() => handleWeightChange(item.id, item.weight - 1)}
                      >
                        -
                      </button>
                      <span className="text-sm mx-1">{item.weight}</span>
                      <button
                        className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                        disabled={item.weight >= 10 || spinning}
                        onClick={() => handleWeightChange(item.id, item.weight + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                      title="Edit item"
                      disabled={spinning}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
                      title="Remove item"
                      disabled={spinning}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WheelControls;
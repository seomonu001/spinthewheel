import React, { useState } from 'react';
import { useWheel, WheelItem } from '../context/WheelContext';
import { Trash2, Edit, Check, X, Plus, RotateCw, Save, Share2, History, Settings, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    e.target.value = '';
  };

  return (
    <div className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-auto space-y-6">
      {/* Top controls */}
      <div className="flex flex-wrap gap-3">
        <motion.button
          className={clsx(
            "flex-grow btn-primary flex items-center justify-center gap-2 py-4 text-lg font-semibold",
            spinning ? "opacity-50 cursor-not-allowed" : ""
          )}
          onClick={spinWheel}
          disabled={spinning || items.length < 2}
          whileHover={{ scale: spinning ? 1 : 1.02 }}
          whileTap={{ scale: spinning ? 1 : 0.98 }}
        >
          <RotateCw size={20} className={spinning ? "animate-spin" : ""} />
          <span>{spinning ? "Spinning..." : "Spin The Wheel"}</span>
        </motion.button>

        <motion.button
          onClick={() => setShowHistory(!showHistory)}
          className="btn-secondary flex items-center gap-2 py-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <History size={20} />
          <span className="hidden sm:inline">History</span>
        </motion.button>

        <motion.button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary flex items-center gap-2 py-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings size={20} />
          <span className="hidden sm:inline">Options</span>
        </motion.button>
      </div>

      {/* Winner announcement */}
      <AnimatePresence>
        {winner && !spinning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-2">Winner!</h3>
            <p className="text-3xl font-bold">{winner.text}</p>
            <motion.button
              onClick={resetWheel}
              className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Results History</h3>
                {history.length > 0 && (
                  <motion.button
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-700 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={16} />
                    <span>Clear</span>
                  </motion.button>
                )}
              </div>
              
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No history yet. Spin the wheel to see results.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto">
                  <ul className="space-y-2">
                    {history.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 bg-white/50 rounded-xl"
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="flex-1 font-medium">{item.text}</span>
                        <span className="text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  onClick={saveConfiguration}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={18} />
                  <span>Save Configuration</span>
                </motion.button>
                
                <motion.button
                  onClick={getShareableLink}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={18} />
                  <span>Share Configuration</span>
                </motion.button>
                
                <motion.button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={18} />
                  <span>Export Configuration</span>
                </motion.button>
                
                <motion.label
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload size={18} />
                  <span>Import Configuration</span>
                  <input 
                    type="file" 
                    accept=".json"
                    className="hidden"
                    onChange={handleImport}
                  />
                </motion.label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add new item form */}
      <form onSubmit={handleAddItem}>
        <div className="flex gap-3">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new item..."
            className="input-primary flex-1"
            disabled={spinning}
          />
          <motion.button
            type="submit"
            className={clsx(
              "btn-primary p-4 aspect-square",
              newItemText.trim() && !spinning
                ? "opacity-100"
                : "opacity-50 cursor-not-allowed"
            )}
            disabled={!newItemText.trim() || spinning}
            whileHover={{ scale: newItemText.trim() && !spinning ? 1.05 : 1 }}
            whileTap={{ scale: newItemText.trim() && !spinning ? 0.95 : 1 }}
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </form>

      {/* Items list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Wheel Items</h3>
          <span className="text-sm text-gray-500">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">Add items to the wheel to get started</p>
            <p className="text-sm text-gray-400">Your items will appear here</p>
          </div>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="input-primary flex-1"
                      autoFocus
                    />
                    <motion.button
                      onClick={handleSaveEdit}
                      className="p-2 text-green-600 hover:text-green-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Check size={20} />
                    </motion.button>
                    <motion.button
                      onClick={handleCancelEdit}
                      className="p-2 text-red-600 hover:text-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-6 h-6 rounded-lg cursor-pointer shadow-md"
                      style={{ backgroundColor: item.color }}
                      onClick={() => {
                        const newColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                        handleColorChange(item.id, newColor);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                    <span className="flex-1 font-medium truncate">{item.text}</span>
                    
                    <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                      <motion.button
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                        disabled={item.weight <= 1 || spinning}
                        onClick={() => handleWeightChange(item.id, item.weight - 1)}
                        whileHover={{ scale: item.weight > 1 && !spinning ? 1.1 : 1 }}
                        whileTap={{ scale: item.weight > 1 && !spinning ? 0.9 : 1 }}
                      >
                        -
                      </motion.button>
                      <span className="px-2 font-medium">{item.weight}</span>
                      <motion.button
                        className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                        disabled={item.weight >= 10 || spinning}
                        onClick={() => handleWeightChange(item.id, item.weight + 1)}
                        whileHover={{ scale: item.weight < 10 && !spinning ? 1.1 : 1 }}
                        whileTap={{ scale: item.weight < 10 && !spinning ? 0.9 : 1 }}
                      >
                        +
                      </motion.button>
                    </div>
                    
                    <motion.button
                      onClick={() => handleStartEdit(item)}
                      className="p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                      disabled={spinning}
                      whileHover={{ scale: !spinning ? 1.1 : 1 }}
                      whileTap={{ scale: !spinning ? 0.9 : 1 }}
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400"
                      disabled={spinning}
                      whileHover={{ scale: !spinning ? 1.1 : 1 }}
                      whileTap={{ scale: !spinning ? 0.9 : 1 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WheelControls;
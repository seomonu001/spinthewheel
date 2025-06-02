import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Copy, Trash2, Settings2, Palette } from 'lucide-react';
import { useWheel } from '../context/WheelContext';
import ColorPicker from './ColorPicker';

const WheelTools: React.FC = () => {
  const { items, updateItem, clearItems, duplicateItem } = useWheel();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'wheel-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        if (Array.isArray(config)) {
          // Handle import logic through context
        }
      } catch (error) {
        console.error('Failed to parse configuration file', error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleColorChange = (color: string) => {
    if (selectedItemId) {
      updateItem(selectedItemId, { color });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Wheel Tools</h3>
        <button
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="text-gray-600 hover:text-gray-800"
        >
          <Settings2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={handleExport}
          className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Download size={18} />
          <span>Export</span>
        </button>

        <label className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
          <Upload size={18} />
          <span>Import</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        <button
          onClick={() => clearItems()}
          className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={18} />
          <span>Clear All</span>
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showAdvancedSettings ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Color Theme</span>
            <div className="relative">
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <Palette size={18} />
              </button>
              {selectedItemId && (
                <ColorPicker
                  color={items.find(item => item.id === selectedItemId)?.color || '#000000'}
                  onChange={handleColorChange}
                  isOpen={isColorPickerOpen}
                  onClose={() => setIsColorPickerOpen(false)}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200"
              >
                <div
                  className="w-4 h-4 rounded-full cursor-pointer"
                  style={{ backgroundColor: item.color }}
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setIsColorPickerOpen(true);
                  }}
                />
                <span className="flex-1 truncate text-sm">{item.text}</span>
                <button
                  onClick={() => duplicateItem(item.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WheelTools;
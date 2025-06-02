import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute z-50 mt-2"
        >
          <div className="bg-white rounded-lg shadow-xl p-3">
            <HexColorPicker color={color} onChange={onChange} />
            <button
              onClick={onClose}
              className="mt-2 w-full px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColorPicker;
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

export interface WheelItem {
  id: string;
  text: string;
  color: string;
  weight: number;
}

interface WheelContextType {
  items: WheelItem[];
  addItem: (text: string) => void;
  updateItem: (id: string, updates: Partial<WheelItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  duplicateItem: (id: string) => void;
  spinning: boolean;
  spinWheel: () => void;
  winner: WheelItem | null;
  resetWheel: () => void;
  history: WheelItem[];
  clearHistory: () => void;
  saveConfiguration: () => void;
  loadConfiguration: (config: WheelItem[]) => void;
  getShareableLink: () => string;
}

const defaultColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
  '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E'
];

const defaultItems: WheelItem[] = [
  { id: uuidv4(), text: 'Prize 1', color: defaultColors[0], weight: 1 },
  { id: uuidv4(), text: 'Prize 2', color: defaultColors[1], weight: 1 },
  { id: uuidv4(), text: 'Prize 3', color: defaultColors[2], weight: 1 },
  { id: uuidv4(), text: 'Prize 4', color: defaultColors[3], weight: 1 }
];

const WheelContext = createContext<WheelContextType | undefined>(undefined);

export const WheelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WheelItem[]>(() => {
    const savedItems = localStorage.getItem('wheelItems');
    return savedItems ? JSON.parse(savedItems) : defaultItems;
  });
  
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [history, setHistory] = useState<WheelItem[]>(() => {
    const savedHistory = localStorage.getItem('wheelHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('wheelItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('wheelHistory', JSON.stringify(history));
  }, [history]);

  const addItem = useCallback((text: string) => {
    const newColor = defaultColors[items.length % defaultColors.length];
    const newItem = { 
      id: uuidv4(), 
      text, 
      color: newColor,
      weight: 1 
    };
    setItems(prevItems => [...prevItems, newItem]);
    toast.success('Item added successfully!');
  }, [items]);

  const updateItem = useCallback((id: string, updates: Partial<WheelItem>) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Item removed!');
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
    toast.success('All items cleared!');
  }, []);

  const duplicateItem = useCallback((id: string) => {
    const itemToDuplicate = items.find(item => item.id === id);
    if (itemToDuplicate) {
      const newItem = {
        ...itemToDuplicate,
        id: uuidv4(),
        text: `${itemToDuplicate.text} (Copy)`
      };
      setItems(prevItems => [...prevItems, newItem]);
      toast.success('Item duplicated!');
    }
  }, [items]);

  const spinWheel = useCallback(() => {
    if (items.length < 2) {
      toast.error('Add at least 2 items to spin the wheel!');
      return;
    }
    
    if (spinning) return;
    
    setSpinning(true);
    setWinner(null);
    
    // Calculate total weight
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    
    // Random selection based on weight
    let random = Math.random() * totalWeight;
    let selectedItem: WheelItem | null = null;
    
    for (const item of items) {
      random -= item.weight;
      if (random <= 0) {
        selectedItem = item;
        break;
      }
    }
    
    // Fallback in case of rounding errors
    if (!selectedItem && items.length > 0) {
      selectedItem = items[items.length - 1];
    }
    
    // Simulate spinning delay
    setTimeout(() => {
      if (selectedItem) {
        setWinner(selectedItem);
        setHistory(prev => [selectedItem!, ...prev]);
        
        // Trigger confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        toast.success(`Winner: ${selectedItem.text}!`);
      }
      setSpinning(false);
    }, 3000);
  }, [items, spinning]);

  const resetWheel = useCallback(() => {
    setWinner(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    toast.success('History cleared!');
  }, []);

  const saveConfiguration = useCallback(() => {
    localStorage.setItem('wheelItems', JSON.stringify(items));
    toast.success('Configuration saved!');
  }, [items]);

  const loadConfiguration = useCallback((config: WheelItem[]) => {
    setItems(config);
    toast.success('Configuration loaded!');
  }, []);

  const getShareableLink = useCallback(() => {
    const config = encodeURIComponent(JSON.stringify(items));
    const url = `${window.location.origin}${window.location.pathname}?config=${config}`;
    
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Shareable link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
      
    return url;
  }, [items]);

  return (
    <WheelContext.Provider value={{
      items,
      addItem,
      updateItem,
      removeItem,
      clearItems,
      duplicateItem,
      spinning,
      spinWheel,
      winner,
      resetWheel,
      history,
      clearHistory,
      saveConfiguration,
      loadConfiguration,
      getShareableLink
    }}>
      {children}
    </WheelContext.Provider>
  );
};

export const useWheel = () => {
  const context = useContext(WheelContext);
  if (context === undefined) {
    throw new Error('useWheel must be used within a WheelProvider');
  }
  return context;
};
import React, { useRef, useEffect, useState } from 'react';
import { useWheel } from '../context/WheelContext';

const SpinWheel: React.FC = () => {
  const { items, spinning, winner } = useWheel();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  // Calculate the appropriate canvas size based on screen width
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      let size;
      
      if (screenWidth < 640) {
        size = Math.min(screenWidth - 40, 320);
      } else if (screenWidth < 768) {
        size = 400;
      } else {
        size = 500;
      }
      
      setCanvasSize({ width: size, height: size });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();

    // Draw wheel segments with gradient and shadow
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let startAngle = 0;
    
    items.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI * item.weight) / totalWeight;
      const endAngle = startAngle + sliceAngle;
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      const baseColor = item.color;
      gradient.addColorStop(0, lightenColor(baseColor, 20));
      gradient.addColorStop(1, baseColor);
      
      // Draw slice with shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw slice border
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);
      
      // Text shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Determine text color based on background brightness
      const brightness = getBrightness(item.color);
      ctx.fillStyle = brightness > 128 ? '#000000' : '#ffffff';
      
      ctx.textAlign = 'right';
      ctx.font = 'bold 16px Inter';
      const text = item.text.length > 12 ? item.text.substring(0, 12) + '...' : item.text;
      ctx.fillText(text, radius - 30, 6);
      ctx.restore();
      
      startAngle = endAngle;
    });

    // Draw center decoration
    ctx.save();
    // Outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.12, 0, 2 * Math.PI);
    const centerGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.06,
      centerX, centerY, radius * 0.12
    );
    centerGradient.addColorStop(0, '#ff6b6b');
    centerGradient.addColorStop(1, '#e11d48');
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.restore();

  }, [items, canvasSize]);

  // Handle wheel spinning animation
  useEffect(() => {
    if (spinning) {
      const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
      let winnerIndex = -1;
      
      if (winner) {
        winnerIndex = items.findIndex(item => item.id === winner.id);
      }
      
      const segmentAngle = (2 * Math.PI) / items.length;
      const winnerAngle = winnerIndex >= 0 
        ? (winnerIndex * segmentAngle) + (segmentAngle / 2)
        : Math.random() * 2 * Math.PI;
      
      const spinCount = 5 + Math.random() * 3; // Between 5-8 full rotations
      const targetRotation = (2 * Math.PI * spinCount) + winnerAngle;
      
      setFinalRotation(targetRotation);
      
      let start: number | null = null;
      const duration = 4000; // 4 seconds spin time
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Custom easing function for more dynamic spin
        const easeOut = (t: number) => {
          const c4 = (2 * Math.PI) / 3;
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4);
        };
        
        const currentRotation = easeOut(progress) * targetRotation;
        setRotation(currentRotation);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [spinning, winner, items]);

  // Helper function to lighten a color
  const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  };

  // Helper function to get color brightness
  const getBrightness = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  return (
    <div className="relative max-w-full mx-auto" style={{ width: canvasSize.width, height: canvasSize.height }}>
      <div 
        className="wheel-container relative"
        style={{ 
          transform: `rotate(${rotation}rad)`,
          transition: spinning ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <canvas 
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="wheel-canvas"
        />
      </div>
      
      {/* Animated pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600 filter drop-shadow-lg animate-bounce-slow"></div>
      </div>
    </div>
  );
};

export default SpinWheel;
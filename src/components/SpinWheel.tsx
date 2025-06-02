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
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let startAngle = 0;
    
    items.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI * item.weight) / totalWeight;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw slice border
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);
      
      // Determine text color based on background color brightness
      const r = parseInt(item.color.slice(1, 3), 16);
      const g = parseInt(item.color.slice(3, 5), 16);
      const b = parseInt(item.color.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      ctx.fillStyle = brightness > 128 ? '#000' : '#fff';
      
      ctx.textAlign = 'right';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(item.text.length > 12 ? item.text.substring(0, 12) + '...' : item.text, radius - 20, 5);
      ctx.restore();
      
      startAngle = endAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius - 10, centerY - 15);
    ctx.lineTo(centerX + radius - 10, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#e11d48';
    ctx.fill();

  }, [items, canvasSize]);

  // Handle wheel spinning animation
  useEffect(() => {
    if (spinning) {
      const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
      let winnerIndex = -1;
      
      if (winner) {
        winnerIndex = items.findIndex(item => item.id === winner.id);
      }
      
      // Calculate the angle to land on the winner (or random if no winner)
      const segmentAngle = (2 * Math.PI) / items.length;
      const winnerAngle = winnerIndex >= 0 
        ? (winnerIndex * segmentAngle) + (segmentAngle / 2)
        : Math.random() * 2 * Math.PI;
      
      // Add multiple rotations plus the winner angle
      const spinCount = 4 + Math.random() * 2; // Between 4-6 full rotations
      const targetRotation = (2 * Math.PI * spinCount) + winnerAngle;
      
      // Set the final rotation for the wheel
      setFinalRotation(targetRotation);
      
      let start: number | null = null;
      const duration = 3000; // 3 seconds spin time
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for natural slow-down
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const currentRotation = easeOut(progress) * targetRotation;
        
        setRotation(currentRotation);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [spinning, winner, items]);

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
      
      {/* Static pointer at top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-md"></div>
      </div>
    </div>
  );
};

export default SpinWheel;
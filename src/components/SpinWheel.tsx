import React, { useRef, useEffect, useState } from 'react';
import { useWheel } from '../context/WheelContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import confetti from 'canvas-confetti';

const SpinWheel: React.FC = () => {
  const { items, spinning, winner } = useWheel();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const spinSound = useRef<Howl | null>(null);
  const winSound = useRef<Howl | null>(null);

  // Initialize sounds with better quality effects
  useEffect(() => {
    spinSound.current = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2003/2003.wav'],
      loop: true,
      volume: 0.5,
      rate: 1.2
    });

    winSound.current = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/1435/1435.wav'],
      volume: 0.6,
      rate: 1.1
    });

    return () => {
      spinSound.current?.unload();
      winSound.current?.unload();
    };
  }, []);

  // Responsive canvas size calculation
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

  // Enhanced wheel rendering with better visual effects
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

    // Draw enhanced outer ring with 3D effect
    const ringGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    ringGradient.addColorStop(0, '#3a3a3a');
    ringGradient.addColorStop(0.5, '#5a5a5a');
    ringGradient.addColorStop(1, '#3a3a3a');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 15, 0, 2 * Math.PI);
    ctx.fillStyle = ringGradient;
    ctx.fill();

    // Add metallic shine effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 15, 0, 2 * Math.PI);
    const shineGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
    ctx.fillStyle = shineGradient;
    ctx.fill();

    // Draw wheel segments with enhanced 3D effect
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let startAngle = 0;
    
    items.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.weight) / totalWeight;
      const endAngle = startAngle + sliceAngle;
      
      // Create enhanced 3D gradient
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      const baseColor = item.color;
      gradient.addColorStop(0, lightenColor(baseColor, 40));
      gradient.addColorStop(0.7, baseColor);
      gradient.addColorStop(1, darkenColor(baseColor, 20));
      
      // Draw slice with enhanced shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw slice border with shine effect
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.stroke();
      
      // Add highlight effect
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      const highlightGradient = ctx.createRadialGradient(
        centerX - radius/2, centerY - radius/2, 0,
        centerX, centerY, radius
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.fill();
      ctx.restore();
      
      // Draw enhanced text
      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);
      
      // Enhanced text shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Determine text color with improved contrast
      const brightness = getBrightness(item.color);
      ctx.fillStyle = brightness > 160 ? '#000000' : '#ffffff';
      
      ctx.textAlign = 'right';
      ctx.font = `bold ${radius * 0.08}px Inter`;
      const text = item.text.length > 15 ? item.text.substring(0, 15) + '...' : item.text;
      
      // Draw text with outline for better readability
      if (brightness > 160) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.strokeText(text, radius - 30, 6);
      }
      
      ctx.fillText(text, radius - 30, 6);
      ctx.restore();
      
      startAngle = endAngle;
    });

    // Draw enhanced center decoration
    ctx.save();
    // Outer circle with metallic effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.18, 0, 2 * Math.PI);
    const outerCenterGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius * 0.18
    );
    outerCenterGradient.addColorStop(0, '#ffffff');
    outerCenterGradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = outerCenterGradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    
    // Inner circle with glossy effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    const innerCenterGradient = ctx.createRadialGradient(
      centerX - radius * 0.05, centerY - radius * 0.05, 0,
      centerX, centerY, radius * 0.15
    );
    innerCenterGradient.addColorStop(0, '#ff9f9f');
    innerCenterGradient.addColorStop(0.7, '#e11d48');
    innerCenterGradient.addColorStop(1, '#c01038');
    ctx.fillStyle = innerCenterGradient;
    ctx.fill();

    // Add glossy highlight
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    const glossGradient = ctx.createLinearGradient(
      centerX, centerY - radius * 0.15,
      centerX, centerY + radius * 0.15
    );
    glossGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    glossGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    glossGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
    ctx.fillStyle = glossGradient;
    ctx.fill();
    ctx.restore();

  }, [items, canvasSize, rotation]);

  // Enhanced spinning animation with better physics
  useEffect(() => {
    if (spinning) {
      spinSound.current?.play();
      
      const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
      let winnerIndex = -1;
      
      if (winner) {
        winnerIndex = items.findIndex(item => item.id === winner.id);
      }
      
      const segmentAngle = (2 * Math.PI) / items.length;
      const winnerAngle = winnerIndex >= 0 
        ? (winnerIndex * segmentAngle) + (segmentAngle / 2)
        : Math.random() * 2 * Math.PI;
      
      const spinCount = 6 + Math.random() * 4; // Between 6-10 full rotations
      const targetRotation = (2 * Math.PI * spinCount) + winnerAngle;
      
      setFinalRotation(targetRotation);
      
      let start: number | null = null;
      const duration = 5000; // 5 seconds spin time
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Enhanced easing function for more realistic spin
        const easeOut = (t: number) => {
          const c4 = (2 * Math.PI) / 3;
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4);
        };
        
        const currentRotation = easeOut(progress) * targetRotation;
        setRotation(currentRotation);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          spinSound.current?.stop();
          winSound.current?.play();
          
          // Enhanced confetti effect
          const duration = 3000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

          const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
          };

          const interval: any = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
          }, 250);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [spinning, winner, items]);

  // Helper functions for color manipulation
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

  const darkenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (
      0x1000000 +
      (R > 0 ? R : 0) * 0x10000 +
      (G > 0 ? G : 0) * 0x100 +
      (B > 0 ? B : 0)
    ).toString(16).slice(1);
  };

  const getBrightness = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  return (
    <div className="relative max-w-full mx-auto" style={{ width: canvasSize.width, height: canvasSize.height }}>
      <motion.div 
        className="wheel-container relative"
        style={{ 
          transform: `rotate(${rotation}rad)`,
          transition: spinning ? 'none' : 'transform 0.3s ease-out'
        }}
        animate={spinning ? {
          scale: [1, 1.02, 1],
          transition: { duration: 0.5, repeat: Infinity }
        } : {}}
      >
        <canvas 
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="wheel-canvas"
        />
      </motion.div>
      
      {/* Enhanced pointer design */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
        <motion.div 
          className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[36px] border-l-transparent border-r-transparent border-t-red-600 filter drop-shadow-lg"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute top-[-36px] left-[-12px] w-[24px] h-[24px] bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg" />
        </motion.div>
      </div>

      {/* Enhanced winner celebration overlay */}
      <AnimatePresence>
        {winner && !spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="glass-card p-8 rounded-2xl shadow-2xl transform rotate-12">
              <h3 className="text-2xl font-bold animated-gradient-text mb-2">Winner!</h3>
              <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                {winner.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinWheel;

import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Layers, Eye } from 'lucide-react';

interface ThreeDVisualizationProps {
  models: string[];
  interactions: string[];
  onInteraction: (type: string, data: any) => void;
}

export const ThreeDVisualization: React.FC<ThreeDVisualizationProps> = ({
  models,
  interactions,
  onInteraction
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Create 3D-like visualization
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      
      // Simulate 3D rotation
      if (isRotating) {
        setRotation(prev => ({
          x: prev.x + 0.5,
          y: prev.y + 1,
          z: prev.z + 0.3
        }));
      }

      // Draw based on selected model
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoom, zoom);
      
      if (selectedModel.includes('fraction')) {
        drawFractionVisualization(ctx, rotation);
      } else if (selectedModel.includes('geometric')) {
        drawGeometricShapes(ctx, rotation);
      } else if (selectedModel.includes('molecular')) {
        drawMolecularStructure(ctx, rotation);
      } else {
        drawDefaultVisualization(ctx, rotation);
      }
      
      ctx.restore();
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedModel, isRotating, zoom, rotation.x, rotation.y, rotation.z]);

  const drawFractionVisualization = (ctx: CanvasRenderingContext2D, rot: any) => {
    const radius = 80;
    const segments = 8;
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 + rot.y * 0.01;
      const x = Math.cos(angle) * radius * Math.cos(rot.x * 0.01);
      const y = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius * Math.sin(rot.x * 0.01);
      
      // 3D effect
      const scale = (z + 100) / 200;
      
      ctx.save();
      ctx.translate(x * scale, y * scale);
      ctx.scale(scale, scale);
      
      // Color based on fraction
      const hue = (i / segments) * 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${scale})`;
      
      // Draw segment
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    }
  };

  const drawGeometricShapes = (ctx: CanvasRenderingContext2D, rot: any) => {
    const shapes = [
      { type: 'cube', x: -60, y: -40, color: 'hsl(220, 70%, 60%)' },
      { type: 'sphere', x: 60, y: -40, color: 'hsl(340, 70%, 60%)' },
      { type: 'pyramid', x: 0, y: 40, color: 'hsl(140, 70%, 60%)' }
    ];

    shapes.forEach((shape, index) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      
      const rotX = rot.x * 0.01 + index * 0.5;
      const rotY = rot.y * 0.01 + index * 0.3;
      
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      
      if (shape.type === 'cube') {
        drawCube(ctx, rotX, rotY, 30);
      } else if (shape.type === 'sphere') {
        drawSphere(ctx, rotX, rotY, 25);
      } else if (shape.type === 'pyramid') {
        drawPyramid(ctx, rotX, rotY, 35);
      }
      
      ctx.restore();
    });
  };

  const drawMolecularStructure = (ctx: CanvasRenderingContext2D, rot: any) => {
    const atoms = [
      { x: 0, y: 0, z: 0, color: 'hsl(0, 70%, 60%)', size: 15 },
      { x: 40, y: 20, z: 10, color: 'hsl(120, 70%, 60%)', size: 12 },
      { x: -40, y: 20, z: -10, color: 'hsl(240, 70%, 60%)', size: 12 },
      { x: 0, y: -40, z: 15, color: 'hsl(60, 70%, 60%)', size: 10 }
    ];

    // Draw bonds first
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const atom1 = atoms[i];
        const atom2 = atoms[j];
        
        // Apply 3D rotation
        const rotatedAtom1 = rotate3D(atom1, rot);
        const rotatedAtom2 = rotate3D(atom2, rot);
        
        ctx.beginPath();
        ctx.moveTo(rotatedAtom1.x, rotatedAtom1.y);
        ctx.lineTo(rotatedAtom2.x, rotatedAtom2.y);
        ctx.stroke();
      }
    }

    // Draw atoms
    atoms.forEach(atom => {
      const rotatedAtom = rotate3D(atom, rot);
      const scale = (rotatedAtom.z + 100) / 200;
      
      ctx.save();
      ctx.translate(rotatedAtom.x, rotatedAtom.y);
      ctx.scale(scale, scale);
      
      // Glow effect
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, atom.size);
      gradient.addColorStop(0, atom.color);
      gradient.addColorStop(1, atom.color.replace('60%', '30%'));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, atom.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    });
  };

  const drawDefaultVisualization = (ctx: CanvasRenderingContext2D, rot: any) => {
    // Default animated visualization
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2 + time;
      const radius = 60 + Math.sin(time + i) * 20;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * Math.cos(rot.x * 0.01);
      const z = Math.sin(angle) * radius * Math.sin(rot.x * 0.01);
      
      const scale = (z + 100) / 200;
      const hue = (i / 20) * 360 + time * 50;
      
      ctx.save();
      ctx.translate(x * scale, y * scale);
      ctx.scale(scale, scale);
      
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${scale})`;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  };

  // Helper functions for 3D shapes
  const drawCube = (ctx: CanvasRenderingContext2D, rotX: number, rotY: number, size: number) => {
    // Simplified 3D cube drawing
    ctx.beginPath();
    ctx.rect(-size/2, -size/2, size, size);
    ctx.fill();
    ctx.stroke();
    
    // Add 3D effect with offset squares
    ctx.save();
    ctx.translate(5, -5);
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.rect(-size/2, -size/2, size, size);
    ctx.fill();
    ctx.restore();
  };

  const drawSphere = (ctx: CanvasRenderingContext2D, rotX: number, rotY: number, size: number) => {
    const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, ctx.fillStyle as string);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };

  const drawPyramid = (ctx: CanvasRenderingContext2D, rotX: number, rotY: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size/2, size/2);
    ctx.lineTo(size/2, size/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const rotate3D = (point: any, rot: any) => {
    const { x, y, z } = point;
    const rotX = rot.x * 0.01;
    const rotY = rot.y * 0.01;
    
    // Simple 3D rotation
    const newY = y * Math.cos(rotX) - z * Math.sin(rotX);
    const newZ = y * Math.sin(rotX) + z * Math.cos(rotX);
    const newX = x * Math.cos(rotY) - newZ * Math.sin(rotY);
    const finalZ = x * Math.sin(rotY) + newZ * Math.cos(rotY);
    
    return { x: newX, y: newY, z: finalZ };
  };

  const handleInteraction = (type: string) => {
    onInteraction(type, { model: selectedModel, timestamp: Date.now() });
    
    switch (type) {
      case 'rotate':
        setIsRotating(!isRotating);
        break;
      case 'zoom-in':
        setZoom(prev => Math.min(2, prev + 0.2));
        break;
      case 'zoom-out':
        setZoom(prev => Math.max(0.5, prev - 0.2));
        break;
      case 'reset':
        setZoom(1);
        setRotation({ x: 0, y: 0, z: 0 });
        setIsRotating(true);
        break;
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-background/50 to-background/80 rounded-2xl border border-border/30 overflow-hidden">
      {/* Controls */}
      <div className="p-4 border-b border-border/20 bg-background/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 bg-background/50 border border-border/30 rounded-lg text-sm"
            >
              {models.map(model => (
                <option key={model} value={model}>
                  {model.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            {interactions.includes('rotate') && (
              <button
                onClick={() => handleInteraction('rotate')}
                className={`p-2 rounded-lg transition-all ${
                  isRotating ? 'bg-primary text-primary-foreground' : 'bg-muted/20 hover:bg-muted/30'
                }`}
                title="Toggle rotation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            
            {interactions.includes('zoom') && (
              <>
                <button
                  onClick={() => handleInteraction('zoom-in')}
                  className="p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleInteraction('zoom-out')}
                  className="p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </>
            )}
            
            <button
              onClick={() => handleInteraction('reset')}
              className="p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              title="Reset view"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative h-96 bg-gradient-to-br from-black/20 to-black/40">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Overlay information */}
        <div className="absolute bottom-4 left-4 text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-4">
            <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
            <span className="flex items-center space-x-1">
              <Move3D className="w-3 h-3" />
              <span>{isRotating ? 'Auto' : 'Manual'}</span>
            </span>
          </div>
        </div>

        {/* Model info */}
        <div className="absolute top-4 right-4 text-sm bg-primary/10 text-primary backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-2">
            <Layers className="w-3 h-3" />
            <span>{selectedModel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
        </div>
      </div>

      {/* Interaction Guide */}
      <div className="p-4 bg-background/20 text-xs text-muted-foreground">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Controls:</strong> Use buttons above to interact
          </div>
          <div>
            <strong>Learning:</strong> Observe how shapes change in 3D space
          </div>
        </div>
      </div>
    </div>
  );
};

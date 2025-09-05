import React, { useRef, useEffect } from 'react';

interface Book {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  width: number;
  height: number;
  depth: number;
  subject: string;
}

export const FloatingBooksBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const booksRef = useRef<Book[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize books
    const subjects = ['Math', 'Science', 'History', 'Language', 'Art', 'Music'];
    const colors = [
      'hsl(220, 70%, 60%)', // Blue
      'hsl(140, 70%, 55%)', // Green
      'hsl(340, 70%, 60%)', // Pink
      'hsl(280, 70%, 65%)', // Purple
      'hsl(35, 70%, 60%)',  // Orange
      'hsl(195, 70%, 55%)'  // Cyan
    ];

    booksRef.current = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 200 - 100,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      vz: (Math.random() - 0.5) * 0.3,
      color: colors[i % colors.length],
      width: 40 + Math.random() * 20,
      height: 60 + Math.random() * 30,
      depth: 8 + Math.random() * 6,
      subject: subjects[i % subjects.length]
    }));

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw books
      booksRef.current.forEach(book => {
        // Update position
        book.x += book.vx;
        book.y += book.vy;
        book.z += book.vz;
        
        // Update rotation
        book.rotX += 0.005 + Math.sin(Date.now() * 0.001) * 0.002;
        book.rotY += 0.008 + Math.cos(Date.now() * 0.0015) * 0.003;
        book.rotZ += 0.003;

        // Wrap around screen
        if (book.x < -100) book.x = canvas.width + 100;
        if (book.x > canvas.width + 100) book.x = -100;
        if (book.y < -100) book.y = canvas.height + 100;
        if (book.y > canvas.height + 100) book.y = -100;
        if (book.z < -150) book.z = 150;
        if (book.z > 150) book.z = -150;

        // Draw 3D book
        drawBook(ctx, book);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const drawBook = (ctx: CanvasRenderingContext2D, book: Book) => {
    const scale = (book.z + 200) / 400;
    const opacity = Math.max(0.1, Math.min(0.8, scale));
    
    ctx.save();
    ctx.translate(book.x, book.y);
    ctx.scale(scale, scale);
    
    // Create 3D transformation matrix
    const cos = Math.cos;
    const sin = Math.sin;
    
    // Rotation matrices
    const rotXMatrix = [
      [1, 0, 0],
      [0, cos(book.rotX), -sin(book.rotX)],
      [0, sin(book.rotX), cos(book.rotX)]
    ];
    
    const rotYMatrix = [
      [cos(book.rotY), 0, sin(book.rotY)],
      [0, 1, 0],
      [-sin(book.rotY), 0, cos(book.rotY)]
    ];

    // Book vertices (front face)
    const vertices = [
      [-book.width/2, -book.height/2, book.depth/2],
      [book.width/2, -book.height/2, book.depth/2],
      [book.width/2, book.height/2, book.depth/2],
      [-book.width/2, book.height/2, book.depth/2],
      [-book.width/2, -book.height/2, -book.depth/2],
      [book.width/2, -book.height/2, -book.depth/2],
      [book.width/2, book.height/2, -book.depth/2],
      [-book.width/2, book.height/2, -book.depth/2]
    ];

    // Transform vertices
    const transformedVertices = vertices.map(vertex => {
      let [x, y, z] = vertex;
      
      // Apply rotations
      [x, y, z] = multiplyMatrixVector(rotXMatrix, [x, y, z]);
      [x, y, z] = multiplyMatrixVector(rotYMatrix, [x, y, z]);
      
      return [x, y, z];
    });

    // Draw faces (back to front for proper depth)
    const faces = [
      [4, 5, 6, 7], // Back face
      [1, 5, 6, 2], // Right face
      [0, 4, 7, 3], // Left face
      [0, 1, 2, 3], // Front face
      [0, 1, 5, 4], // Top face
      [3, 2, 6, 7]  // Bottom face
    ];

    // Sort faces by average z-depth
    const facesWithDepth = faces.map(face => {
      const avgZ = face.reduce((sum, i) => sum + transformedVertices[i][2], 0) / face.length;
      return { face, avgZ };
    });
    
    facesWithDepth.sort((a, b) => a.avgZ - b.avgZ);

    // Draw faces
    facesWithDepth.forEach(({ face }, faceIndex) => {
      const isBack = faceIndex === 0;
      const isSpine = faceIndex === 1 || faceIndex === 2;
      const isFront = faceIndex === 3;
      
      ctx.beginPath();
      
      face.forEach((vertexIndex, i) => {
        const [x, y] = transformedVertices[vertexIndex];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.closePath();
      
      // Face coloring and shading
      let faceColor = book.color;
      let faceOpacity = opacity;
      
      if (isBack) {
        faceColor = book.color.replace('60%', '30%');
        faceOpacity *= 0.6;
      } else if (isSpine) {
        faceColor = book.color.replace('60%', '45%');
        faceOpacity *= 0.8;
      } else if (isFront) {
        faceOpacity *= 1.0;
      }
      
      ctx.fillStyle = faceColor.replace(')', `, ${faceOpacity})`).replace('hsl', 'hsla');
      ctx.fill();
      
      // Add glow effect to front face
      if (isFront && opacity > 0.5) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = book.color;
        ctx.strokeStyle = `hsla(${book.color.match(/\d+/g)?.join(', ')}, ${opacity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      // Add book title on front face
      if (isFront && scale > 0.6) {
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
        ctx.font = `${Math.max(8, 12 * scale)}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(book.subject, 0, 0);
      }
    });
    
    ctx.restore();
  };

  const multiplyMatrixVector = (matrix: number[][], vector: number[]): number[] => {
    return [
      matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
      matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
      matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2]
    ];
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'multiply',
        opacity: 0.3
      }}
    />
  );
};
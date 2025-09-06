'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCode = ({ value, size = 200, className = '' }: QRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code generation (demo version)
    const cellSize = 8;
    const margin = 4;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Generate a simple pattern based on the value
    ctx.fillStyle = '#000000';
    const hash = value.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    for (let y = margin; y < size - margin; y += cellSize) {
      for (let x = margin; x < size - margin; x += cellSize) {
        const cellX = Math.floor((x - margin) / cellSize);
        const cellY = Math.floor((y - margin) / cellSize);

        // Create a deterministic pattern based on hash and position
        const shouldFill = (hash + cellX * 7 + cellY * 11) % 3 === 0;

        if (shouldFill) {
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
        }
      }
    }

    // Add corner markers (simplified)
    const markerSize = cellSize * 7;
    const markerPositions = [
      [margin, margin],
      [size - margin - markerSize, margin],
      [margin, size - margin - markerSize],
    ];

    markerPositions.forEach(([x, y]) => {
      // Outer square
      ctx.fillRect(x, y, markerSize, markerSize);
      // Inner square
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        x + cellSize,
        y + cellSize,
        markerSize - cellSize * 2,
        markerSize - cellSize * 2
      );
      // Center square
      ctx.fillStyle = '#000000';
      ctx.fillRect(
        x + cellSize * 2,
        y + cellSize * 2,
        markerSize - cellSize * 4,
        markerSize - cellSize * 4
      );
    });
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export const generateQRData = (data: string): string => {
  return data;
};

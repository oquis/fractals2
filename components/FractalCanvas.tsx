import { useEffect, useRef } from "react";

interface FractalCanvasProps {
  hue: number;
  isJulia: boolean;
  juliaReal: number;
  juliaImag: number;
  iterations: number;
  scale: number;
  panX: number;
  panY: number;
}

export function FractalCanvas({
  hue,
  isJulia,
  juliaReal,
  juliaImag,
  iterations,
  scale,
  panX,
  panY,
}: FractalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const scaleValue = scale / width;

    const imageData = ctx.createImageData(width, height);

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        let x0, y0, x, y;
        if (isJulia) {
          x = (px - width / 2) * scaleValue + panX;
          y = (py - height / 2) * scaleValue + panY;
          x0 = juliaReal;
          y0 = juliaImag;
        } else {
          x0 = (px - width / 2) * scaleValue + panX;
          y0 = (py - height / 2) * scaleValue + panY;
          x = 0;
          y = 0;
        }

        let iteration = 0;

        while (x * x + y * y <= 4 && iteration < iterations) {
          const xtemp: number = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xtemp;
          iteration++;
        }

        const pixelIndex = (py * width + px) * 4;
        if (iteration === iterations) {
          imageData.data[pixelIndex] = 0;
          imageData.data[pixelIndex + 1] = 0;
          imageData.data[pixelIndex + 2] = 0;
        } else {
          const [r, g, b] = hslToRgb(
            ((hue + iteration * 10) % 360) / 360,
            1,
            0.5,
          );
          imageData.data[pixelIndex] = r;
          imageData.data[pixelIndex + 1] = g;
          imageData.data[pixelIndex + 2] = b;
        }
        imageData.data[pixelIndex + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [hue, isJulia, juliaReal, juliaImag, iterations, scale, panX, panY]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      className="w-full md:w-auto border border-gray-300 shadow-lg mb-4 order-first md:order-last"
    />
  );
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

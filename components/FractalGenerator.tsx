"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hue, setHue] = useState(0);
  const [isJulia, setIsJulia] = useState(false);
  const [juliaReal, setJuliaReal] = useState(-0.7);
  const [juliaImag, setJuliaImag] = useState(0.27015);
  const [iterations, setIterations] = useState(5); // Default set to 5

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const scale = 4 / width;

    const imageData = ctx.createImageData(width, height);

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        let x0, y0, x, y;
        if (isJulia) {
          x = (px - width / 2) * scale;
          y = (py - height / 2) * scale;
          x0 = juliaReal;
          y0 = juliaImag;
        } else {
          x0 = (px - width / 2) * scale;
          y0 = (py - height / 2) * scale;
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
  }, [hue, isJulia, juliaReal, juliaImag, iterations]);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="border border-gray-300 shadow-lg mb-4"
      />
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="fractal-type"
            checked={isJulia}
            onCheckedChange={setIsJulia}
          />
          <Label htmlFor="fractal-type">
            {isJulia ? "Julia Set" : "Mandelbrot Set"}
          </Label>
        </div>
        <div>
          <Label htmlFor="iterations">Iterations</Label>
          <Input
            id="iterations"
            type="number"
            value={iterations}
            onChange={(e) =>
              setIterations(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="1"
            className="w-full"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Color Control</h2>
          <Slider
            value={[hue]}
            onValueChange={([value]) => setHue(value)}
            max={360}
            step={1}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-2">Hue: {hue}</div>
        </div>
        {isJulia && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Julia Set Parameters</h2>
            <div>
              <Label htmlFor="julia-real">Real Part</Label>
              <Slider
                id="julia-real"
                value={[juliaReal]}
                onValueChange={([value]) => setJuliaReal(value)}
                min={-2}
                max={2}
                step={0.01}
                className="w-full"
              />
              <div className="text-sm text-gray-600">
                Real: {juliaReal.toFixed(2)}
              </div>
            </div>
            <div>
              <Label htmlFor="julia-imag">Imaginary Part</Label>
              <Slider
                id="julia-imag"
                value={[juliaImag]}
                onValueChange={([value]) => setJuliaImag(value)}
                min={-2}
                max={2}
                step={0.01}
                className="w-full"
              />
              <div className="text-sm text-gray-600">
                Imaginary: {juliaImag.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

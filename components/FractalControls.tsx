import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FractalControlsProps {
  isJulia: boolean;
  setIsJulia: (value: boolean) => void;
  iterations: number;
  setIterations: (value: number) => void;
  scale: number;
  setScale: (value: number) => void;
  panX: number;
  setPanX: (value: number) => void;
  panY: number;
  setPanY: (value: number) => void;
  hue: number;
  setHue: (value: number) => void;
  juliaReal: number;
  setJuliaReal: (value: number) => void;
  juliaImag: number;
  setJuliaImag: (value: number) => void;
}

export function FractalControls({
  isJulia,
  setIsJulia,
  iterations,
  setIterations,
  scale,
  setScale,
  panX,
  setPanX,
  panY,
  setPanY,
  hue,
  setHue,
  juliaReal,
  setJuliaReal,
  juliaImag,
  setJuliaImag,
}: FractalControlsProps) {
  const [fractalType, setFractalType] = useState(
    isJulia ? "julia" : "mandelbrot",
  );

  useEffect(() => {
    setFractalType(isJulia ? "julia" : "mandelbrot");
  }, [isJulia]);

  const calculatePanStep = (scale: number) => {
    // As scale decreases (zooming in), step should decrease
    return Math.max(0.001 / scale, 0.00000001); // Minimum step of 1e-8
  };

  // Use a fixed range for panning
  const PAN_RANGE = 2; // This gives a total range of -2 to 2

  const panStep = calculatePanStep(scale);

  const resetControls = () => {
    setIsJulia(false);
    setFractalType("mandelbrot");
    setIterations(100);
    setScale(4);
    setPanX(0);
    setPanY(0);
    setHue(0);
    setJuliaReal(-0.7);
    setJuliaImag(0.27015);
  };

  return (
    <div className="w-full md:max-w-md bg-white p-4 rounded-lg shadow space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Fractal Set</h2>
        <RadioGroup
          value={fractalType}
          onValueChange={(value) => {
            setFractalType(value);
            setIsJulia(value === "julia");
          }}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mandelbrot" id="mandelbrot" />
            <Label htmlFor="mandelbrot">Mandelbrot Set</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="julia" id="julia" />
            <Label htmlFor="julia">Julia Set</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Iterations</h2>
        <Slider
          value={[iterations]}
          onValueChange={([value]) =>
            setIterations(Math.max(1, Math.round(value)))
          }
          min={1}
          max={1000}
          step={1}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          Iterations: {iterations}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Scale</h2>
        <Slider
          value={[Math.log(scale)]} // Use logarithmic scale
          onValueChange={([value]) => setScale(Math.exp(value))}
          min={Math.log(0.000001)} // Minimum scale (zoomed in)
          max={Math.log(10)} // Maximum scale (zoomed out)
          step={0.1}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          Scale: {scale.toExponential(2)}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Pan X</h2>
        <Slider
          value={[panX]}
          onValueChange={([value]) => setPanX(value)}
          min={-PAN_RANGE}
          max={PAN_RANGE}
          step={panStep}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          Pan X:{" "}
          {panX.toFixed(
            Math.max(2, Math.abs(Math.floor(Math.log10(panStep))) + 2),
          )}
          {" | "}Step: {panStep}
          {" | "}Range: {PAN_RANGE}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Pan Y</h2>
        <Slider
          value={[panY]}
          onValueChange={([value]) => setPanY(value)}
          min={-PAN_RANGE}
          max={PAN_RANGE}
          step={panStep}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          Pan Y:{" "}
          {panY.toFixed(
            Math.max(2, Math.abs(Math.floor(Math.log10(panStep))) + 2),
          )}
          {" | "}Step: {panStep}
          {" | "}Range: {PAN_RANGE}
        </div>
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
      <Button onClick={resetControls} className="w-full">
        Reset Controls
      </Button>
    </div>
  );
}

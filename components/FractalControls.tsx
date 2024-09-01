import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  return (
    <div className="w-full md:max-w-md bg-white p-4 rounded-lg shadow space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Fractal Set</h2>
        <RadioGroup
          defaultValue={isJulia ? "julia" : "mandelbrot"}
          onValueChange={(value) => setIsJulia(value === "julia")}
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
          value={[scale]}
          onValueChange={([value]) => setScale(value)}
          min={0.5}
          max={10}
          step={0.1}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          Scale: {scale.toFixed(2)}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Pan X</h2>
        <Slider
          value={[panX]}
          onValueChange={([value]) => setPanX(value)}
          min={-2}
          max={2}
          step={0.01}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          Pan X: {panX.toFixed(2)}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Pan Y</h2>
        <Slider
          value={[panY]}
          onValueChange={([value]) => setPanY(value)}
          min={-2}
          max={2}
          step={0.01}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-2">
          Pan Y: {panY.toFixed(2)}
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
    </div>
  );
}

import { useEffect, useRef } from "react";
import { computeFractalSet } from "@/lib/fractalComputer";
import { canvasRenderer, RenderFunction } from "@/lib/renderers";
import { webglRenderer } from "@/lib/webglRenderer";

interface FractalCanvasProps {
  hue: number;
  isJulia: boolean;
  juliaReal: number;
  juliaImag: number;
  iterations: number;
  scale: number;
  panX: number;
  panY: number;
  renderer?: RenderFunction;
}
export function FractalCanvas(props: FractalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("webgl") || canvas.getContext("2d");
    if (!ctx) return;

    const fractalParams = {
      isJulia: props.isJulia,
      juliaReal: props.juliaReal,
      juliaImag: props.juliaImag,
      iterations: props.iterations,
      scale: props.scale,
      panX: props.panX,
      panY: props.panY,
    };

    const { data: fractalData, maxIterations } = computeFractalSet(
      fractalParams,
      canvas.width,
      canvas.height,
    );

    const renderFn =
      ctx instanceof WebGLRenderingContext ? webglRenderer : canvasRenderer;
    renderFn(fractalData, props.hue, ctx, maxIterations, fractalParams);
  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      className="w-full md:w-auto border border-gray-300 shadow-lg mb-4 order-first md:order-last"
    />
  );
}

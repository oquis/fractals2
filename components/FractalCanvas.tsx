import { useEffect, useRef } from "react";
import { computeFractalSet } from "@/lib/fractalComputer";
import { canvasRenderer } from "@/lib/renderers";
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
  setScale: (scale: number) => void;
  setPanX: (x: number) => void;
  setPanY: (y: number) => void;
}

export function FractalCanvas(props: FractalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("webgl2") || canvas.getContext("2d");
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
      ctx instanceof WebGL2RenderingContext ? webglRenderer : canvasRenderer;
    renderFn(fractalData, props.hue, ctx, maxIterations, fractalParams);

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const zoomFactor = 1.1;
      const delta = e.deltaY > 0 ? zoomFactor : 1 / zoomFactor;
      props.setScale(props.scale * delta);
    }

    function handleMouseDown(e: MouseEvent) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDraggingRef.current || !canvas) return;

      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      const scaleFactor = props.scale / canvas.width;
      props.setPanX(props.panX - dx * scaleFactor);
      props.setPanY(props.panY + dy * scaleFactor); // Changed negative to positive

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseUp() {
      isDraggingRef.current = false;
    }

    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
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

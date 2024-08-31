"use client";

import { useState } from "react";
import { FractalCanvas } from "./FractalCanvas";
import { FractalControls } from "./FractalControls";

export default function FractalGenerator() {
  const [hue, setHue] = useState(0);
  const [isJulia, setIsJulia] = useState(false);
  const [juliaReal, setJuliaReal] = useState(-0.7);
  const [juliaImag, setJuliaImag] = useState(0.27015);
  const [iterations, setIterations] = useState(100);
  const [scale, setScale] = useState(4);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  return (
    <div className="flex flex-col md:flex-row items-start md:gap-10 min-h-screen bg-gray-100 p-10">
      <FractalCanvas
        hue={hue}
        isJulia={isJulia}
        juliaReal={juliaReal}
        juliaImag={juliaImag}
        iterations={iterations}
        scale={scale}
        panX={panX}
        panY={panY}
      />
      <FractalControls
        isJulia={isJulia}
        setIsJulia={setIsJulia}
        iterations={iterations}
        setIterations={setIterations}
        scale={scale}
        setScale={setScale}
        panX={panX}
        setPanX={setPanX}
        panY={panY}
        setPanY={setPanY}
        hue={hue}
        setHue={setHue}
        juliaReal={juliaReal}
        setJuliaReal={setJuliaReal}
        juliaImag={juliaImag}
        setJuliaImag={setJuliaImag}
      />
    </div>
  );
}

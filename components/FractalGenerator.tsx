"use client";

import { useState, useEffect } from "react";
import { FractalCanvas } from "./FractalCanvas";
import { FractalControls } from "./FractalControls";
import { Button } from "./ui/button";

interface FractalParams {
  hue: number;
  isJulia: boolean;
  juliaReal: number;
  juliaImag: number;
  iterations: number;
  scale: number;
  panX: number;
  panY: number;
}

const STORAGE_KEY = "oquis.fractalParams";

// Function to store params in local storage
const storeParams = (params: FractalParams) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  }
};

// Function to load params from local storage
const loadParams = (): FractalParams | null => {
  if (typeof window !== "undefined") {
    const storedParams = localStorage.getItem(STORAGE_KEY);
    return storedParams ? JSON.parse(storedParams) : null;
  }
  return null;
};

export default function FractalGenerator() {
  const [hue, setHue] = useState(0);
  const [isJulia, setIsJulia] = useState(false);
  const [juliaReal, setJuliaReal] = useState(-0.7);
  const [juliaImag, setJuliaImag] = useState(0.27015);
  const [iterations, setIterations] = useState(100);
  const [scale, setScale] = useState(4);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const saveCurrentParams = () => {
    const params: FractalParams = {
      hue,
      isJulia,
      juliaReal,
      juliaImag,
      iterations,
      scale,
      panX,
      panY,
    };
    storeParams(params);
  };

  const loadSavedParams = () => {
    const savedParams = loadParams();
    if (savedParams) {
      setHue(savedParams.hue);
      setIsJulia(savedParams.isJulia);
      setJuliaReal(savedParams.juliaReal);
      setJuliaImag(savedParams.juliaImag);
      setIterations(savedParams.iterations);
      setScale(savedParams.scale);
      setPanX(savedParams.panX);
      setPanY(savedParams.panY);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:gap-10 min-h-screen bg-gray-100 lg:p-10">
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
      <div className="flex flex-col gap-4 w-full md:max-w-md p-2 md:p-0">
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
        <div className="flex gap-2 bg-white rounded-lg p-4 shadow">
          <Button className="flex-1" size="sm" onClick={saveCurrentParams}>
            Save Params
          </Button>
          <Button
            className="flex-1"
            size="sm"
            onClick={loadSavedParams}
            variant="outline"
          >
            Load Params
          </Button>
        </div>
      </div>
    </div>
  );
}

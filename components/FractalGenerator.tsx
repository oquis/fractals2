"use client";

import { useQueryState } from "nuqs";
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
  const [hue, setHue] = useQueryState("hue", { defaultValue: "0" });
  const [isJulia, setIsJulia] = useQueryState("isJulia", {
    defaultValue: "false",
  });
  const [juliaReal, setJuliaReal] = useQueryState("juliaReal", {
    defaultValue: "-0.7",
  });
  const [juliaImag, setJuliaImag] = useQueryState("juliaImag", {
    defaultValue: "0.27015",
  });
  const [iterations, setIterations] = useQueryState("iterations", {
    defaultValue: "100",
  });
  const [scale, setScale] = useQueryState("scale", { defaultValue: "4" });
  const [panX, setPanX] = useQueryState("panX", { defaultValue: "0" });
  const [panY, setPanY] = useQueryState("panY", { defaultValue: "0" });

  const saveCurrentParams = () => {
    const params: FractalParams = {
      hue: Number(hue),
      isJulia: isJulia === "true",
      juliaReal: Number(juliaReal),
      juliaImag: Number(juliaImag),
      iterations: Number(iterations),
      scale: Number(scale),
      panX: Number(panX),
      panY: Number(panY),
    };
    storeParams(params);
  };

  const loadSavedParams = () => {
    const savedParams = loadParams();
    if (savedParams) {
      setHue(savedParams.hue.toString());
      setIsJulia(savedParams.isJulia.toString());
      setJuliaReal(savedParams.juliaReal.toString());
      setJuliaImag(savedParams.juliaImag.toString());
      setIterations(savedParams.iterations.toString());
      setScale(savedParams.scale.toString());
      setPanX(savedParams.panX.toString());
      setPanY(savedParams.panY.toString());
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:gap-10 min-h-screen bg-gray-100 lg:p-10">
      <FractalCanvas
        hue={Number(hue)}
        isJulia={isJulia === "true"}
        juliaReal={Number(juliaReal)}
        juliaImag={Number(juliaImag)}
        iterations={Number(iterations)}
        scale={Number(scale)}
        panX={Number(panX)}
        panY={Number(panY)}
      />
      <div className="flex flex-col gap-4 w-full md:max-w-md p-2 md:p-0">
        <FractalControls
          isJulia={isJulia === "true"}
          setIsJulia={(value) => setIsJulia(value.toString())}
          iterations={Number(iterations)}
          setIterations={(value) => setIterations(value.toString())}
          scale={Number(scale)}
          setScale={(value) => setScale(value.toString())}
          panX={Number(panX)}
          setPanX={(value) => setPanX(value.toString())}
          panY={Number(panY)}
          setPanY={(value) => setPanY(value.toString())}
          hue={Number(hue)}
          setHue={(value) => setHue(value.toString())}
          juliaReal={Number(juliaReal)}
          setJuliaReal={(value) => setJuliaReal(value.toString())}
          juliaImag={Number(juliaImag)}
          setJuliaImag={(value) => setJuliaImag(value.toString())}
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

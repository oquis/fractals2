interface FractalParams {
  isJulia: boolean;
  juliaReal: number;
  juliaImag: number;
  iterations: number;
  scale: number;
  panX: number;
  panY: number;
}

export function computeFractalSet(
  params: FractalParams,
  width: number,
  height: number,
): { data: number[][]; maxIterations: number } {
  const { isJulia, juliaReal, juliaImag, iterations, scale, panX, panY } =
    params;
  const scaleValue = scale / Math.min(width, height);
  const result: number[][] = [];

  for (let px = 0; px < width; px++) {
    result[px] = [];
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

      result[px][py] = computeIteration(x, y, x0, y0, iterations);
    }
  }

  return { data: result, maxIterations: iterations };
}

function computeIteration(
  x: number,
  y: number,
  x0: number,
  y0: number,
  maxIterations: number,
): number {
  let iteration = 0;
  while (x * x + y * y <= 4 && iteration < maxIterations) {
    const xtemp = x * x - y * y + x0;
    y = 2 * x * y + y0;
    x = xtemp;
    iteration++;
  }
  return iteration;
}

export interface RenderFunction {
  (
    fractalData: number[][],
    hue: number,
    ctx: CanvasRenderingContext2D,
    maxIterations: number,
  ): void;
}

export const canvasRenderer: RenderFunction = (
  fractalData,
  hue,
  ctx,
  maxIterations,
) => {
  const width = fractalData.length;
  const height = fractalData[0].length;
  const imageData = ctx.createImageData(width, height);

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      const iteration = fractalData[px][py];
      const pixelIndex = (py * width + px) * 4;

      if (iteration === maxIterations) {
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
};

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

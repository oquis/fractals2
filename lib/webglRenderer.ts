import { RenderFunction } from "./renderers";

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_scale;
  uniform vec2 u_pan;
  uniform int u_maxIterations;
  uniform float u_hue;

  vec3 hslToRgb(float h, float s, float l) {
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h / 60.0, 2.0) - 1.0));
    float m = l - c / 2.0;
    vec3 rgb;
    if (h < 60.0) rgb = vec3(c, x, 0.0);
    else if (h < 120.0) rgb = vec3(x, c, 0.0);
    else if (h < 180.0) rgb = vec3(0.0, c, x);
    else if (h < 240.0) rgb = vec3(0.0, x, c);
    else if (h < 300.0) rgb = vec3(x, 0.0, c);
    else rgb = vec3(c, 0.0, x);
    return rgb + m;
  }

  void main() {
    vec2 z, c;
    c.x = (gl_FragCoord.x - u_resolution.x / 2.0) * u_scale + u_pan.x;
    c.y = (gl_FragCoord.y - u_resolution.y / 2.0) * u_scale + u_pan.y;
    z = c;
    int i;
    for(i = 0; i < u_maxIterations; i++) {
      float x = (z.x * z.x - z.y * z.y) + c.x;
      float y = (z.y * z.x + z.x * z.y) + c.y;
      if((x * x + y * y) > 4.0) break;
      z.x = x;
      z.y = y;
    }
    if (i == u_maxIterations) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
      float hue = mod(u_hue + float(i) * 10.0, 360.0);
      vec3 color = hslToRgb(hue, 1.0, 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader!, source);
  gl.compileShader(shader!);
  if (!gl.getShaderParameter(shader!, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram();
  gl.attachShader(program!, vertexShader);
  gl.attachShader(program!, fragmentShader);
  gl.linkProgram(program!);
  if (!gl.getProgramParameter(program!, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program),
    );
    return null;
  }
  return program;
}

export const webglRenderer: RenderFunction = (
  fractalData,
  hue,
  ctx,
  maxIterations,
) => {
  const gl = ctx.canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    console.error("WebGL not supported");
    return;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  )!;
  const program = createProgram(gl, vertexShader, fragmentShader)!;

  gl.useProgram(program);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution",
  );
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const scaleUniformLocation = gl.getUniformLocation(program, "u_scale");
  gl.uniform1f(
    scaleUniformLocation,
    4 / Math.min(gl.canvas.width, gl.canvas.height),
  );

  const panUniformLocation = gl.getUniformLocation(program, "u_pan");
  gl.uniform2f(panUniformLocation, 0, 0);

  const maxIterationsUniformLocation = gl.getUniformLocation(
    program,
    "u_maxIterations",
  );
  gl.uniform1i(maxIterationsUniformLocation, maxIterations);

  const hueUniformLocation = gl.getUniformLocation(program, "u_hue");
  gl.uniform1f(hueUniformLocation, hue);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

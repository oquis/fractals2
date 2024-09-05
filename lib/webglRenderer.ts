import { RenderFunction } from "./renderers";

const vertexShaderSource = `#version 300 es
  in vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `#version 300 es
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_scale;
  uniform vec2 u_pan;
  uniform int u_maxIterations;
  uniform float u_hue;
  uniform bool u_isJulia;
  uniform vec2 u_juliaC;

  out vec4 fragColor;

  vec3 hslToRgb(float h, float s, float l) {
    vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
    vec2 c = uv * u_scale + u_pan;
    vec2 z;

    if (u_isJulia) {
      z = c;
      c = u_juliaC;
    } else {
      z = vec2(0.0, 0.0);
    }

    int i = 0;
    for (int j = 0; j < 1000; j++) {
      if (i >= u_maxIterations || dot(z, z) > 4.0) break;
      float x = z.x * z.x - z.y * z.y + c.x;
      float y = 2.0 * z.x * z.y + c.y;
      z = vec2(x, y);
      i++;
    }

    if (i >= u_maxIterations) {
      fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
      float t = float(i) / float(u_maxIterations);
      float hue = mod(u_hue + t * 360.0, 360.0) / 360.0;
      vec3 color = hslToRgb(hue, 1.0, 0.5);
      fragColor = vec4(color, 1.0);
    }
  }
`;

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error("Failed to create shader object");
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}\n\nShader Source:\n${source}`,
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) {
    console.error("Failed to create program");
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program),
    );
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export const webglRenderer: RenderFunction = (
  fractalData,
  hue,
  ctx,
  maxIterations,
  params,
) => {
  const gl = ctx as WebGL2RenderingContext;

  console.log("Creating vertex shader...");
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  if (!vertexShader) {
    console.error("Failed to create vertex shader");
    return;
  }

  console.log("Creating fragment shader...");
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );
  if (!fragmentShader) {
    console.error("Failed to create fragment shader");
    return;
  }

  console.log("Creating shader program...");
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) {
    console.error("Failed to create shader program");
    return;
  }

  gl.useProgram(program);

  // Set up attributes
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Set up uniforms
  const uniforms = {
    u_resolution: gl.getUniformLocation(program, "u_resolution"),
    u_scale: gl.getUniformLocation(program, "u_scale"),
    u_pan: gl.getUniformLocation(program, "u_pan"),
    u_maxIterations: gl.getUniformLocation(program, "u_maxIterations"),
    u_hue: gl.getUniformLocation(program, "u_hue"),
    u_isJulia: gl.getUniformLocation(program, "u_isJulia"),
    u_juliaC: gl.getUniformLocation(program, "u_juliaC"),
  };

  // Set uniform values
  gl.uniform2f(uniforms.u_resolution, gl.canvas.width, gl.canvas.height);
  gl.uniform1f(uniforms.u_scale, params.scale);
  gl.uniform2f(uniforms.u_pan, params.panX, params.panY);
  gl.uniform1i(uniforms.u_maxIterations, maxIterations);
  gl.uniform1f(uniforms.u_hue, hue);
  gl.uniform1i(uniforms.u_isJulia, params.isJulia ? 1 : 0);
  gl.uniform2f(uniforms.u_juliaC, params.juliaReal, params.juliaImag);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

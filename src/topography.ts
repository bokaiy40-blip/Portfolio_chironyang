import { Mesh, Program, Renderer, Triangle } from 'ogl'

type TopographyOptions = {
  lowColor?: string
  midColor?: string
  highColor?: string
  speed?: number
  morphAmount?: number
  morphSpeed?: number
  bands?: number
  thickness?: number
  scale?: number
  glow?: number
  contrast?: number
  brightness?: number
  opacity?: number
  mouseInteraction?: boolean
  mouseRadius?: number
  mouseStrength?: number
}

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uMorphAmount;
uniform float uBands;
uniform float uThickness;
uniform float uScale;
uniform float uGlow;
uniform float uContrast;
uniform float uBrightness;
uniform float uOpacity;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform vec4 uCtrlA;
uniform vec4 uCtrlB;
uniform vec4 uCtrlC;
uniform vec4 uCtrlD;
out vec4 fragColor;

float bez(float t, vec4 c) {
  float w = 6.2831853 * t;
  return 0.5 * (c.x * sin(w) + c.y * cos(w) + c.z * sin(2.0 * w) + c.w * cos(2.0 * w));
}

float field(vec2 uv) {
  vec2 a = vec2(bez(uv.x, uCtrlA), bez(uv.x, uCtrlB));
  vec2 b = vec2(bez(uv.y, uCtrlC), bez(uv.y, uCtrlD));
  return distance(a, b);
}

vec3 elevationColor(float e) {
  vec3 c = mix(uLow, uMid, smoothstep(0.0, 0.5, e));
  return mix(c, uHigh, smoothstep(0.5, 1.0, e));
}

void main() {
  vec2 res = iResolution.xy;
  vec2 uv = gl_FragCoord.xy / res;
  vec2 suv = (uv - 0.5) / max(uScale, 0.001) + 0.5;
  float fv = field(suv);

  if (uMouseEnabled > 0.5) {
    vec2 d = uv - uMouse;
    d.x *= res.x / max(res.y, 1.0);
    float r = max(uMouseRadius, 0.001);
    float bump = exp(-dot(d, d) / (r * r)) * uMouseStrength * uMouseActive;
    fv += bump;
  }

  float f = fv * uBands;
  float fracValue = fract(f);
  float lineDist = min(fracValue, 1.0 - fracValue);
  float aa = fwidth(f) + 0.0001;
  float mask = 1.0 - smoothstep(uThickness - aa, uThickness + aa, lineDist);
  float glowRadius = uThickness + uGlow * 0.5 + aa;
  float glow = (1.0 - smoothstep(uThickness, glowRadius, lineDist)) * step(0.0001, uGlow);
  float elev = clamp(fv / (uMorphAmount * 2.5 + 0.001), 0.0, 1.0);
  vec3 lineColor = elevationColor(elev);
  float coverage = clamp(mask + glow * 0.55, 0.0, 1.0);
  coverage = pow(coverage, max(uContrast, 0.001));
  vec3 outColor = clamp(lineColor * uBrightness, 0.0, 1.0);
  float alpha = clamp(coverage, 0.0, 1.0) * uOpacity;
  fragColor = vec4(outColor * alpha, alpha);
}
`

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0.7, 0.7, 0.7]
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
}

const CTRL_INDICES = [
  [1, -2, 3, -4],
  [9, -8, 7, -6],
  [5, 2, 5, -5],
  [-1, -3, 8, 9],
]

export const createTopography = (container: HTMLElement, options: TopographyOptions = {}) => {
  const config = {
    lowColor: '#7f8791',
    midColor: '#9fa6ae',
    highColor: '#c5cbd1',
    speed: 0.2,
    morphAmount: 1.8,
    morphSpeed: 0.06,
    bands: 1.25,
    thickness: 0.023,
    scale: 1.55,
    glow: 0.2,
    contrast: 2.2,
    brightness: 0.95,
    opacity: 0.68,
    mouseInteraction: true,
    mouseRadius: 0.24,
    mouseStrength: 0.16,
    ...options,
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let renderer: Renderer

  try {
    renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) })
  } catch {
    container.classList.add('topography-fallback')
    return () => {}
  }

  const gl = renderer.gl
  gl.clearColor(0, 0, 0, 0)
  const canvas = gl.canvas as HTMLCanvasElement
  canvas.classList.add('topography-canvas')
  container.appendChild(canvas)

  const geometry = new Triangle(gl)
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uMorphAmount: { value: config.morphAmount },
      uBands: { value: config.bands },
      uThickness: { value: config.thickness },
      uScale: { value: config.scale },
      uGlow: { value: config.glow },
      uContrast: { value: config.contrast },
      uBrightness: { value: config.brightness },
      uOpacity: { value: config.opacity },
      uLow: { value: new Float32Array(hexToRgb(config.lowColor)) },
      uMid: { value: new Float32Array(hexToRgb(config.midColor)) },
      uHigh: { value: new Float32Array(hexToRgb(config.highColor)) },
      uMouse: { value: new Float32Array([0.5, 0.5]) },
      uMouseEnabled: { value: config.mouseInteraction ? 1 : 0 },
      uMouseRadius: { value: config.mouseRadius },
      uMouseStrength: { value: config.mouseStrength },
      uMouseActive: { value: 0 },
      uCtrlA: { value: new Float32Array([0, 0, 0, 0]) },
      uCtrlB: { value: new Float32Array([0, 0, 0, 0]) },
      uCtrlC: { value: new Float32Array([0, 0, 0, 0]) },
      uCtrlD: { value: new Float32Array([0, 0, 0, 0]) },
    },
  })
  const mesh = new Mesh(gl, { geometry, program })
  const resize = () => {
    const rect = container.getBoundingClientRect()
    renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)))
    const resolution = program.uniforms.iResolution.value as Float32Array
    resolution[0] = gl.drawingBufferWidth
    resolution[1] = gl.drawingBufferHeight
    renderer.render({ scene: mesh })
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  const currentMouse = [0.5, 0.5]
  const targetMouse = [0.5, 0.5]
  let mouseActive = 0
  let mouseActiveTarget = 0
  const onPointerMove = (event: PointerEvent) => {
    targetMouse[0] = event.clientX / Math.max(window.innerWidth, 1)
    targetMouse[1] = 1 - event.clientY / Math.max(window.innerHeight, 1)
    mouseActiveTarget = 1
  }
  const onPointerLeave = () => { mouseActiveTarget = 0 }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerout', onPointerLeave, { passive: true })

  const ctrlArrays = [program.uniforms.uCtrlA.value, program.uniforms.uCtrlB.value, program.uniforms.uCtrlC.value, program.uniforms.uCtrlD.value] as Float32Array[]
  let raf = 0
  let visible = true
  let pageVisible = !document.hidden
  let scrollStopTimer: number | undefined
  const t0 = performance.now()
  const loop = (now: number) => {
    const time = (now - t0) * 0.001
    const amplitude = config.morphAmount
    const speed = reducedMotion ? 0 : config.speed
    for (let group = 0; group < 4; group += 1) {
      const array = ctrlArrays[group]
      const indices = CTRL_INDICES[group]
      for (let index = 0; index < 4; index += 1) {
        const value = indices[index]
        array[index] = amplitude * Math.sin(time * speed * Math.sin(value * config.morphSpeed) + value)
      }
    }
    currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0])
    currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1])
    const uniforms = program.uniforms
    ;(uniforms.uMouse.value as Float32Array)[0] = currentMouse[0]
    ;(uniforms.uMouse.value as Float32Array)[1] = currentMouse[1]
    mouseActive += 0.05 * (mouseActiveTarget - mouseActive)
    uniforms.uMouseActive.value = mouseActive
    uniforms.iTime.value = time
    renderer.render({ scene: mesh })
    raf = requestAnimationFrame(loop)
  }
  const start = () => { if (visible && pageVisible && raf === 0) raf = requestAnimationFrame(loop) }
  const stop = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0 } }
  const onScroll = () => {
    stop()
    if (scrollStopTimer !== undefined) window.clearTimeout(scrollStopTimer)
    scrollStopTimer = window.setTimeout(() => {
      scrollStopTimer = undefined
      start()
    }, 120)
  }
  const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop() }, { threshold: 0 })
  intersectionObserver.observe(container)
  const onVisibility = () => { pageVisible = !document.hidden; pageVisible ? start() : stop() }
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('scroll', onScroll, { passive: true })
  start()

  return () => {
    stop()
    if (scrollStopTimer !== undefined) window.clearTimeout(scrollStopTimer)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerout', onPointerLeave)
    try { container.removeChild(canvas) } catch {}
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}


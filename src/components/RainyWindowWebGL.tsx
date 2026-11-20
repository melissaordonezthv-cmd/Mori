import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RainyWindowWebGLProps {
  strength: number;
}

interface HeroDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  stuck: boolean;
  wobblePhase: number;
  trailAcc: number;
  jitterTimer: number;
}

interface TrailBead {
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
}

interface StaticBead {
  x: number;
  y: number;
  z: number;
  radius: number;
  phase: number;
  squish: number;
}

interface FallingStreak {
  x: number;
  y: number;
  z: number;
  speed: number;
  length: number;
  width: number;
  alpha: number;
}

// Colorless crystal-clear water droplet shader (3D spherical normal + Fresnel + dual specular + caustic rim)
const DROPLET_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aOffset;
  attribute vec4 aParams; // x: radius, y: elongation, z: angleRad, w: alpha

  varying vec2 vUv;
  varying float vElongation;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vUv = uv;
    float r = aParams.x;
    vElongation = aParams.y;
    float angle = aParams.z;
    vAlpha = aParams.w;
    vSeed = fract(sin(dot(aOffset.xy, vec2(12.9898, 78.233))) * 43758.5453);

    // Local quad coordinates centered at 0
    vec2 local = position.xy;
    // Scale by radius and elongation along movement axis
    local.x *= r * 2.15;
    local.y *= r * 2.15 * vElongation;

    // Rotate quad to align with velocity/gravity direction
    float c = cos(angle);
    float s = sin(angle);
    vec2 rotated = vec2(
      local.x * c - local.y * s,
      local.x * s + local.y * c
    );

    vec3 worldPos = vec3(aOffset.xy + rotated, aOffset.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
  }
`;

const DROPLET_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uStrength;
  uniform vec2 uLightDir;

  varying vec2 vUv;
  varying float vElongation;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    // Map UV [0,1] -> [-1,1]
    vec2 p = vUv * 2.0 - 1.0;

    // Subtle organic teardrop taper toward the trailing tail (+y)
    float taper = mix(1.0, 1.0 + p.y * 0.16, clamp((vElongation - 1.0) * 1.4, 0.0, 1.0));
    p.x *= taper;

    // Slight natural asymmetry from seed
    p.x += sin(p.y * 3.14159 + vSeed * 6.2831) * 0.035;

    float r2 = dot(p, p);
    if (r2 > 1.0) discard;

    float dist = sqrt(r2);
    // Analytic 3D hemisphere normal for crystal water dome
    float nz = sqrt(max(0.0, 1.0 - r2));
    vec3 N = normalize(vec3(p.x, p.y, nz * 1.15));
    vec3 V = vec3(0.0, 0.0, 1.0);

    // Studio key light from upper-left + soft fill from bottom-right
    vec3 L1 = normalize(vec3(uLightDir.x, uLightDir.y, 0.85));
    vec3 L2 = normalize(vec3(-uLightDir.x * 0.7, -uLightDir.y * 0.8, 0.55));
    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);

    // Crisp Fresnel reflection at grazing edges of the 3D water dome
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

    // Specular glints (sharp primary + crisp internal caustic bounce)
    float spec1 = pow(max(dot(N, H1), 0.0), 72.0);
    float spec2 = pow(max(dot(N, H1), 0.0), 18.0) * 0.25;
    float caustic = pow(max(dot(N, H2), 0.0), 22.0) * 0.52;

    // Neutral dark total-internal-reflection rim so transparent drops read cleanly on light & dark themes
    float contactShadow = smoothstep(0.58, 0.96, dist) * clamp(-p.y * 0.65 - p.x * 0.35 + 0.45, 0.0, 1.0);
    float outerEdge = smoothstep(0.76, 0.98, dist);

    // Pure colorless crystal highlights + neutral glass edge contrast (ZERO blue/celeste tint)
    vec3 highlight = vec3(1.0);
    vec3 darkGlass = vec3(0.06, 0.06, 0.07);

    float brightPart = spec1 * 1.15 + spec2 + caustic + fresnel * 0.46;
    float darkPart = contactShadow * 0.28 + outerEdge * 0.14 * (1.0 - fresnel);

    // Blend dark refraction contour and brilliant white crystal reflections
    float outAlpha = clamp((brightPart * 0.78 + darkPart * 0.85) * vAlpha * uStrength, 0.0, 0.96);
    vec3 outColor = mix(darkGlass, highlight, clamp(brightPart / max(0.001, brightPart + darkPart * 1.15), 0.0, 1.0));

    // Soft anti-aliased edge feathering
    float aa = 1.0 - smoothstep(0.92, 1.0, dist);
    outAlpha *= aa;

    if (outAlpha < 0.004) discard;
    gl_FragColor = vec4(outColor, outAlpha);
  }
`;

// Falling 3D rain streaks shader (multi-depth parallax rain streaks)
const STREAK_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aOffset;
  attribute vec4 aParams; // x: width, y: length, z: angleRad, w: alpha

  varying vec2 vUv;
  varying float vAlpha;

  void main() {
    vUv = uv;
    float w = aParams.x;
    float len = aParams.y;
    float angle = aParams.z;
    vAlpha = aParams.w;

    vec2 local = vec2(position.x * w, position.y * len);
    float c = cos(angle);
    float s = sin(angle);
    vec2 rotated = vec2(
      local.x * c - local.y * s,
      local.x * s + local.y * c
    );

    vec3 worldPos = vec3(aOffset.xy + rotated, aOffset.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
  }
`;

const STREAK_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uStrength;

  varying vec2 vUv;
  varying float vAlpha;

  void main() {
    // Taper horizontally and vertically into a razor-clean colorless raindrop streak
    float dx = abs(vUv.x - 0.5) * 2.0;
    float radialX = pow(max(0.0, 1.0 - dx), 2.2);

    // Brighter leading tip (bottom vUv.y -> 0), softer fading tail (top vUv.y -> 1)
    float tipFade = smoothstep(0.0, 0.14, vUv.y) * pow(1.0 - vUv.y, 0.75);
    float coreSpec = pow(max(0.0, 1.0 - dx * 1.45), 4.0) * smoothstep(0.04, 0.25, vUv.y) * (1.0 - vUv.y * 0.65);

    float intensity = (radialX * tipFade * 0.36 + coreSpec * 0.52) * vAlpha * uStrength;
    if (intensity < 0.004) discard;

    // Colorless crystal-clear streak
    gl_FragColor = vec4(1.0, 1.0, 1.0, clamp(intensity, 0.0, 0.68));
  }
`;

function createInstancedQuadGeometry(): THREE.InstancedBufferGeometry {
  const baseGeo = new THREE.PlaneGeometry(1, 1);
  const instGeo = new THREE.InstancedBufferGeometry();
  instGeo.index = baseGeo.index;
  instGeo.attributes.position = baseGeo.attributes.position;
  instGeo.attributes.uv = baseGeo.attributes.uv;
  return instGeo;
}

export const RainyWindowWebGL: React.FC<RainyWindowWebGLProps> = ({ strength }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const strengthRef = useRef<number>(strength);
  strengthRef.current = strength;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL guard (matches Three.js skill guidelines)
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        premultipliedAlpha: false,
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.25));

    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Perspective camera looking onto the window pane at z = 0
    const FOV_DEG = 46;
    const CAM_Z = 5.2;
    const camera = new THREE.PerspectiveCamera(FOV_DEG, width / Math.max(1, height), 0.1, 30);
    camera.position.set(0, 0, CAM_Z);
    camera.lookAt(0, 0, 0);

    const getViewBoundsAtZ = (z: number) => {
      const dist = CAM_Z - z;
      const halfH = Math.tan(THREE.MathUtils.degToRad(FOV_DEG * 0.5)) * dist;
      const halfW = halfH * (width / Math.max(1, height));
      return { halfW, halfH };
    };

    let paneBounds = getViewBoundsAtZ(0);

    // ---------------------------------------------------------
    // Particle Counts & Pre-allocated GPU Instance Buffers
    // ---------------------------------------------------------
    const STREAK_COUNT = 220;
    const STATIC_BEAD_COUNT = 190;
    const TRAIL_BEAD_COUNT = 340;
    const HERO_DROP_COUNT = 44;

    // 1) 3D Falling Rain Streaks
    const streakGeo = createInstancedQuadGeometry();
    const streakOffsets = new Float32Array(STREAK_COUNT * 3);
    const streakParams = new Float32Array(STREAK_COUNT * 4);
    const streakOffsetAttr = new THREE.InstancedBufferAttribute(streakOffsets, 3);
    const streakParamAttr = new THREE.InstancedBufferAttribute(streakParams, 4);
    streakOffsetAttr.setUsage(THREE.DynamicDrawUsage);
    streakParamAttr.setUsage(THREE.DynamicDrawUsage);
    streakGeo.setAttribute('aOffset', streakOffsetAttr);
    streakGeo.setAttribute('aParams', streakParamAttr);
    streakGeo.instanceCount = STREAK_COUNT;

    const streakMat = new THREE.ShaderMaterial({
      uniforms: {
        uStrength: { value: strengthRef.current },
      },
      vertexShader: STREAK_VERTEX_SHADER,
      fragmentShader: STREAK_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const streakMesh = new THREE.Mesh(streakGeo, streakMat);
    streakMesh.frustumCulled = false;
    streakMesh.renderOrder = 1;
    scene.add(streakMesh);

    const streaks: FallingStreak[] = Array.from({ length: STREAK_COUNT }, (_, i) => {
      const z = -2.4 + ((i * 37) % 100) / 100 * 2.1; // z in [-2.4, -0.3] for real 3D depth
      const b = getViewBoundsAtZ(z);
      const depthScale = 0.55 + (z + 2.4) / 2.1 * 0.75;
      return {
        x: ((((i * 73 + 17) % 1000) / 1000) * 2 - 1) * (b.halfW + 0.5),
        y: ((((i * 41 + 29) % 1000) / 1000) * 2 - 1) * (b.halfH + 0.5),
        z,
        speed: (4.6 + ((i * 19) % 10) * 0.48) * depthScale,
        length: (0.28 + ((i * 23) % 8) * 0.05) * depthScale,
        width: (0.011 + ((i * 13) % 5) * 0.0025) * depthScale,
        alpha: 0.34 + ((i * 11) % 6) * 0.08,
      };
    });

    // 2) Static Condensation Micro-Beads on Window Glass (z = 0)
    const staticGeo = createInstancedQuadGeometry();
    const staticOffsets = new Float32Array(STATIC_BEAD_COUNT * 3);
    const staticParams = new Float32Array(STATIC_BEAD_COUNT * 4);
    const staticOffsetAttr = new THREE.InstancedBufferAttribute(staticOffsets, 3);
    const staticParamAttr = new THREE.InstancedBufferAttribute(staticParams, 4);
    staticOffsetAttr.setUsage(THREE.DynamicDrawUsage);
    staticParamAttr.setUsage(THREE.DynamicDrawUsage);
    staticGeo.setAttribute('aOffset', staticOffsetAttr);
    staticGeo.setAttribute('aParams', staticParamAttr);
    staticGeo.instanceCount = STATIC_BEAD_COUNT;

    const dropletUniforms = {
      uStrength: { value: strengthRef.current },
      uLightDir: { value: new THREE.Vector2(-0.55, 0.65) },
    };

    const dropletMat = new THREE.ShaderMaterial({
      uniforms: dropletUniforms,
      vertexShader: DROPLET_VERTEX_SHADER,
      fragmentShader: DROPLET_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const staticMesh = new THREE.Mesh(staticGeo, dropletMat);
    staticMesh.frustumCulled = false;
    staticMesh.renderOrder = 2;
    scene.add(staticMesh);

    const staticBeads: StaticBead[] = Array.from({ length: STATIC_BEAD_COUNT }, (_, i) => ({
      x: ((((i * 97 + 13) % 1000) / 1000) * 2 - 1) * paneBounds.halfW,
      y: ((((i * 61 + 31) % 1000) / 1000) * 2 - 1) * paneBounds.halfH,
      z: 0,
      radius: 0.014 + Math.pow(((i * 29) % 100) / 100, 2.2) * 0.044,
      phase: i * 1.13,
      squish: 1.02 + (i % 5) * 0.025,
    }));

    // 3) Wet Trail Micro-Beads Left Behind Sliding Raindrops
    const trailGeo = createInstancedQuadGeometry();
    const trailOffsets = new Float32Array(TRAIL_BEAD_COUNT * 3);
    const trailParams = new Float32Array(TRAIL_BEAD_COUNT * 4);
    const trailOffsetAttr = new THREE.InstancedBufferAttribute(trailOffsets, 3);
    const trailParamAttr = new THREE.InstancedBufferAttribute(trailParams, 4);
    trailOffsetAttr.setUsage(THREE.DynamicDrawUsage);
    trailParamAttr.setUsage(THREE.DynamicDrawUsage);
    trailGeo.setAttribute('aOffset', trailOffsetAttr);
    trailGeo.setAttribute('aParams', trailParamAttr);
    trailGeo.instanceCount = TRAIL_BEAD_COUNT;

    const trailMesh = new THREE.Mesh(trailGeo, dropletMat);
    trailMesh.frustumCulled = false;
    trailMesh.renderOrder = 3;
    scene.add(trailMesh);

    const trailBeads: TrailBead[] = Array.from({ length: TRAIL_BEAD_COUNT }, () => ({
      x: 0,
      y: 0,
      radius: 0,
      life: 0,
      maxLife: 1,
    }));
    let trailCursor = 0;

    const spawnTrailBead = (x: number, y: number, radius: number) => {
      const tb = trailBeads[trailCursor];
      trailCursor = (trailCursor + 1) % TRAIL_BEAD_COUNT;
      tb.x = x;
      tb.y = y;
      tb.radius = radius;
      tb.maxLife = 2.4 + Math.random() * 1.8;
      tb.life = tb.maxLife;
    };

    // 4) Hero 3D Sliding Raindrops (Stick-Slip Surface Tension + Merging + Accelerometer Physics)
    const heroGeo = createInstancedQuadGeometry();
    const heroOffsets = new Float32Array(HERO_DROP_COUNT * 3);
    const heroParams = new Float32Array(HERO_DROP_COUNT * 4);
    const heroOffsetAttr = new THREE.InstancedBufferAttribute(heroOffsets, 3);
    const heroParamAttr = new THREE.InstancedBufferAttribute(heroParams, 4);
    heroOffsetAttr.setUsage(THREE.DynamicDrawUsage);
    heroParamAttr.setUsage(THREE.DynamicDrawUsage);
    heroGeo.setAttribute('aOffset', heroOffsetAttr);
    heroGeo.setAttribute('aParams', heroParamAttr);
    heroGeo.instanceCount = HERO_DROP_COUNT;

    const heroMesh = new THREE.Mesh(heroGeo, dropletMat);
    heroMesh.frustumCulled = false;
    heroMesh.renderOrder = 4;
    scene.add(heroMesh);

    const resetHeroDrop = (drop: HeroDrop, randomY: boolean) => {
      const r = 0.045 + Math.random() * 0.068;
      drop.x = (Math.random() * 2 - 1) * (paneBounds.halfW * 0.96);
      drop.y = randomY
        ? (Math.random() * 2 - 1) * paneBounds.halfH
        : paneBounds.halfH + r * 2 + Math.random() * 0.5;
      drop.vx = 0;
      drop.vy = -(0.04 + Math.random() * 0.14);
      drop.radius = r;
      drop.mass = r * r * 140;
      drop.stuck = Math.random() < 0.38;
      drop.wobblePhase = Math.random() * Math.PI * 2;
      drop.trailAcc = 0;
      drop.jitterTimer = Math.random() * 2.5;
    };

    const heroDrops: HeroDrop[] = Array.from({ length: HERO_DROP_COUNT }, () => {
      const d: HeroDrop = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 0.06,
        mass: 0.5,
        stuck: false,
        wobblePhase: 0,
        trailAcc: 0,
        jitterTimer: 0,
      };
      resetHeroDrop(d, true);
      return d;
    });

    // ---------------------------------------------------------
    // Accelerometer + Orientation + Pointer Input Physics State
    // ---------------------------------------------------------
    // Gravity direction projected onto the glass screen plane:
    // Upright portrait phone -> targetGravX = 0, targetGravY = -1
    let targetGravX = 0;
    let targetGravY = -1;
    let gravX = 0;
    let gravY = -1;

    // Linear shake / motion impulses from accelerometer
    let impulseX = 0;
    let impulseY = 0;
    let shakeEnergy = 0;

    let hasGyroData = false;
    let prevAccGX: number | null = null;
    let prevAccGY: number | null = null;
    let prevAccGZ: number | null = null;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (typeof e.gamma !== 'number' || typeof e.beta !== 'number') return;
      hasGyroData = true;
      const gammaRad = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(e.gamma, -85, 85));
      const betaRad = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(e.beta, -170, 170));

      // Project gravity onto screen plane (X = right, Y = up)
      // When flat on table (beta ~ 0), in-plane gravity drops gently; upright (beta ~ 90) -> full -1 Y
      const gx = Math.sin(gammaRad);
      const gy = -Math.sin(betaRad) * Math.cos(gammaRad);

      // Keep a minimum gentle downward pull when nearly flat so rain still trickles softly
      const mag = Math.hypot(gx, gy);
      if (mag < 0.22) {
        targetGravX = gx;
        targetGravY = -0.25;
      } else {
        targetGravX = THREE.MathUtils.clamp(gx, -1.2, 1.2);
        targetGravY = THREE.MathUtils.clamp(gy, -1.2, 1.2);
      }
    };

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      // 1) Pure linear acceleration (shakes / flicks / bumps)
      const lin = e.acceleration;
      if (lin && typeof lin.x === 'number' && typeof lin.y === 'number') {
        const ax = THREE.MathUtils.clamp(lin.x, -18, 18);
        const ay = THREE.MathUtils.clamp(lin.y, -18, 18);
        const mag = Math.hypot(ax, ay);
        if (mag > 0.45) {
          impulseX += ax * 0.085;
          impulseY += ay * 0.085;
          shakeEnergy = Math.min(2.5, shakeEnergy + mag * 0.08);
        }
      }

      // 2) Accelerometer including gravity (high-pass jerk + orientation fallback if DeviceOrientation unavailable)
      const accG = e.accelerationIncludingGravity;
      if (accG && typeof accG.x === 'number' && typeof accG.y === 'number') {
        const curZ = typeof accG.z === 'number' ? accG.z : 0;
        if (prevAccGX !== null && prevAccGY !== null && prevAccGZ !== null) {
          const jx = accG.x - prevAccGX;
          const jy = accG.y - prevAccGY;
          const jz = curZ - prevAccGZ;
          const jerk = Math.hypot(jx, jy, jz);
          if (jerk > 0.75) {
            impulseX += THREE.MathUtils.clamp(-jx, -10, 10) * 0.06;
            impulseY += THREE.MathUtils.clamp(jy, -10, 10) * 0.06;
            shakeEnergy = Math.min(2.5, shakeEnergy + jerk * 0.065);
          }
        }
        prevAccGX = accG.x;
        prevAccGY = accG.y;
        prevAccGZ = curZ;

        if (!hasGyroData) {
          // Normalize approximate lateral tilt from accelerometer X axis
          const gx = THREE.MathUtils.clamp(-accG.x / 9.81, -1, 1);
          const absY = Math.abs(accG.y) / 9.81;
          targetGravX = gx;
          targetGravY = -Math.max(0.28, Math.min(1, absY));
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (hasGyroData) return;
      const nx = (e.clientX / Math.max(1, width) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, height) - 0.5) * 2;
      targetGravX = THREE.MathUtils.clamp(nx * 0.55, -0.8, 0.8);
      targetGravY = THREE.MathUtils.clamp(-0.92 + ny * 0.25, -1.15, -0.35);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleDeviceMotion);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      paneBounds = getViewBoundsAtZ(0);
    };
    window.addEventListener('resize', handleResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // ---------------------------------------------------------
    // Render & Physics Loop (Frame-Rate Independent + Software WebGL Pacing)
    // ---------------------------------------------------------
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      if (document.hidden) return;

      const now = performance.now();
      if (!isSoftwareGl && now - lastTime < 26) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.06, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const elapsed = now * 0.001;

      // Exponential damping on accelerometer gravity & light reflection angle
      gravX = THREE.MathUtils.damp(gravX, targetGravX, 7.5, dt);
      gravY = THREE.MathUtils.damp(gravY, targetGravY, 7.5, dt);

      // Decay linear shake impulses
      const decay = Math.exp(-5.5 * dt);
      impulseX *= decay;
      impulseY *= decay;
      shakeEnergy = Math.max(0, shakeEnergy * Math.exp(-3.2 * dt));

      // Subtle camera parallax tilt reacting to accelerometer so the 3D rain planes shift depth
      camera.position.x = THREE.MathUtils.damp(camera.position.x, -gravX * 0.14, 5.0, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, -(gravY + 1.0) * 0.1, 5.0, dt);
      camera.lookAt(0, 0, 0);

      // Update shared uniforms
      const curStrength = strengthRef.current;
      streakMat.uniforms.uStrength.value = curStrength;
      dropletUniforms.uStrength.value = curStrength;
      dropletUniforms.uLightDir.value.set(-0.52 + gravX * 0.28, 0.68 - gravY * 0.12);

      // -------------------------------------------------------
      // 1) Update 3D Falling Rain Streaks (multi-depth parallax)
      // -------------------------------------------------------
      const rainDirX = gravX * 0.68 + impulseX * 0.25;
      const rainDirY = Math.min(-0.32, gravY); // ambient rain always falls downward/angled
      const rainMag = Math.max(0.2, Math.hypot(rainDirX, rainDirY));
      const rainNx = rainDirX / rainMag;
      const rainNy = rainDirY / rainMag;
      // Plane quad vertical axis (+Y) rotated so -Y points along rain velocity
      const streakAngle = Math.atan2(rainNx, -rainNy);

      for (let i = 0; i < STREAK_COUNT; i++) {
        const st = streaks[i];
        st.x += rainNx * st.speed * dt;
        st.y += rainNy * st.speed * dt;

        const b = getViewBoundsAtZ(st.z);
        const pad = 0.65;
        if (st.y < -b.halfH - pad) {
          st.y = b.halfH + pad * Math.random();
          st.x = (Math.random() * 2 - 1) * (b.halfW + pad);
        } else if (st.y > b.halfH + pad) {
          st.y = -b.halfH - pad;
        }
        if (st.x < -b.halfW - pad) st.x += (b.halfW + pad) * 2;
        if (st.x > b.halfW + pad) st.x -= (b.halfW + pad) * 2;

        const i3 = i * 3;
        const i4 = i * 4;
        streakOffsets[i3] = st.x;
        streakOffsets[i3 + 1] = st.y;
        streakOffsets[i3 + 2] = st.z;

        streakParams[i4] = st.width;
        streakParams[i4 + 1] = st.length * (0.85 + rainMag * 0.22);
        streakParams[i4 + 2] = streakAngle;
        streakParams[i4 + 3] = st.alpha;
      }
      streakOffsetAttr.needsUpdate = true;
      streakParamAttr.needsUpdate = true;

      // -------------------------------------------------------
      // 2) Update Clinging Condensation Micro-Beads
      // -------------------------------------------------------
      const microWobbleX = impulseX * 0.008;
      const microWobbleY = impulseY * 0.008;
      for (let i = 0; i < STATIC_BEAD_COUNT; i++) {
        const sb = staticBeads[i];
        const shimmer = 1.0 + Math.sin(elapsed * 2.1 + sb.phase) * 0.03;
        const i3 = i * 3;
        const i4 = i * 4;
        staticOffsets[i3] = sb.x + microWobbleX * (sb.radius * 18);
        staticOffsets[i3 + 1] = sb.y + microWobbleY * (sb.radius * 18);
        staticOffsets[i3 + 2] = sb.z;

        staticParams[i4] = sb.radius * shimmer;
        staticParams[i4 + 1] = sb.squish;
        staticParams[i4 + 2] = gravX * 0.22;
        staticParams[i4 + 3] = 0.88;
      }
      staticOffsetAttr.needsUpdate = true;
      staticParamAttr.needsUpdate = true;

      // -------------------------------------------------------
      // 3) Update Wet Trail Beads Left Behind Sliding Drops
      // -------------------------------------------------------
      for (let i = 0; i < TRAIL_BEAD_COUNT; i++) {
        const tb = trailBeads[i];
        const i3 = i * 3;
        const i4 = i * 4;
        if (tb.life > 0) {
          tb.life -= dt;
          const lifeFrac = Math.max(0, tb.life / tb.maxLife);
          trailOffsets[i3] = tb.x;
          trailOffsets[i3 + 1] = tb.y;
          trailOffsets[i3 + 2] = 0.01;

          trailParams[i4] = tb.radius * (0.45 + 0.55 * lifeFrac);
          trailParams[i4 + 1] = 1.06;
          trailParams[i4 + 2] = 0;
          trailParams[i4 + 3] = lifeFrac * 0.9;
        } else {
          trailOffsets[i3] = 999;
          trailOffsets[i3 + 1] = 999;
          trailOffsets[i3 + 2] = 0;
          trailParams[i4] = 0;
          trailParams[i4 + 1] = 1;
          trailParams[i4 + 2] = 0;
          trailParams[i4 + 3] = 0;
        }
      }
      trailOffsetAttr.needsUpdate = true;
      trailParamAttr.needsUpdate = true;

      // -------------------------------------------------------
      // 4) Update Physical 3D Sliding Raindrops (Stick-Slip + Merge)
      // -------------------------------------------------------
      const gravMag = Math.hypot(gravX, gravY);
      const accelX = gravX * 2.15 + impulseX * 1.45;
      const accelY = gravY * 2.15 + impulseY * 1.45;

      for (let i = 0; i < HERO_DROP_COUNT; i++) {
        const d = heroDrops[i];
        d.jitterTimer -= dt;

        // Surface tension threshold: heavier drops break free easily; shaking/tilting knocks drops loose
        const breakThreshold = 0.72 / Math.max(0.3, d.mass);
        const drivingForce = gravMag * d.mass * 1.45 + shakeEnergy * 1.15;

        if (d.stuck) {
          if (drivingForce > breakThreshold || d.jitterTimer < -1.8) {
            d.stuck = false;
            d.jitterTimer = 0.8 + Math.random() * 2.2;
          } else {
            // Subtle micro-tremor while clinging to glass
            d.vx *= 0.85;
            d.vy *= 0.85;
          }
        } else {
          // Realistic meandering stick-slip jitter along glass micro-texture
          if (d.jitterTimer <= 0) {
            d.jitterTimer = 0.25 + Math.random() * 0.7;
            if (Math.random() < 0.14 && shakeEnergy < 0.25 && d.radius < 0.085) {
              d.stuck = true;
            }
          }

          const meander = Math.sin(d.y * 6.5 + d.wobblePhase + elapsed * 1.4) * 0.26;
          d.vx += (accelX * d.mass * 0.72 + meander * 0.45) * dt;
          d.vy += accelY * d.mass * 0.72 * dt;

          // Glass viscous drag proportional to inverse radius
          const drag = Math.exp(-(3.4 / Math.max(0.45, d.mass)) * dt);
          d.vx *= drag;
          d.vy *= drag;

          // Clamp terminal velocity for realistic water flow on glass
          const speed = Math.hypot(d.vx, d.vy);
          const maxSpeed = 1.65 + d.mass * 0.65;
          if (speed > maxSpeed) {
            d.vx = (d.vx / speed) * maxSpeed;
            d.vy = (d.vy / speed) * maxSpeed;
          }

          const oldX = d.x;
          const oldY = d.y;
          d.x += d.vx * dt;
          d.y += d.vy * dt;

          const moved = Math.hypot(d.x - oldX, d.y - oldY);
          d.trailAcc += moved;
          if (d.trailAcc > Math.max(0.024, d.radius * 0.42)) {
            d.trailAcc = 0;
            spawnTrailBead(
              oldX + (Math.random() - 0.5) * d.radius * 0.35,
              oldY + (Math.random() - 0.5) * d.radius * 0.35,
              d.radius * (0.18 + Math.random() * 0.16)
            );
          }

          // Merge / absorb smaller drops encountered along the path
          for (let j = 0; j < HERO_DROP_COUNT; j++) {
            if (i === j) continue;
            const other = heroDrops[j];
            if (d.radius < other.radius) continue;
            const dx = d.x - other.x;
            const dy = d.y - other.y;
            const minDist = (d.radius + other.radius) * 0.85;
            if (dx * dx + dy * dy < minDist * minDist) {
              const combinedArea = d.radius * d.radius + other.radius * other.radius * 0.55;
              d.radius = Math.min(0.145, Math.sqrt(combinedArea));
              d.mass = d.radius * d.radius * 140;
              d.stuck = false;
              resetHeroDrop(other, false);
            }
          }
        }

        // Wrap / respawn gracefully at edges based on current gravity direction
        const margin = d.radius * 2.2 + 0.15;
        if (d.y < -paneBounds.halfH - margin) {
          if (gravY <= 0.1) {
            resetHeroDrop(d, false);
          } else {
            d.y = paneBounds.halfH + margin * 0.5;
          }
        } else if (d.y > paneBounds.halfH + margin) {
          if (gravY > 0.1) {
            d.y = -paneBounds.halfH - margin * 0.5;
            d.x = (Math.random() * 2 - 1) * paneBounds.halfW;
          }
        }
        if (d.x < -paneBounds.halfW - margin) d.x = paneBounds.halfW + margin * 0.6;
        if (d.x > paneBounds.halfW + margin) d.x = -paneBounds.halfW - margin * 0.6;

        // Compute teardrop elongation & orientation from velocity + gravity
        const spd = Math.hypot(d.vx, d.vy);
        const dirX = spd > 0.02 ? d.vx : gravX * 0.25;
        const dirY = spd > 0.02 ? d.vy : gravY * 0.25;
        const dropAngle = Math.atan2(dirX, -dirY);
        const elongation = 1.04 + Math.min(0.42, spd * 0.32);

        const i3 = i * 3;
        const i4 = i * 4;
        heroOffsets[i3] = d.x;
        heroOffsets[i3 + 1] = d.y;
        heroOffsets[i3 + 2] = 0.02;

        heroParams[i4] = d.radius;
        heroParams[i4 + 1] = elongation;
        heroParams[i4 + 2] = dropAngle;
        heroParams[i4 + 3] = 1.0;
      }
      heroOffsetAttr.needsUpdate = true;
      heroParamAttr.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && !disposed) {
        lastTime = performance.now();
        cancelAnimationFrame(frameId);
        window.clearTimeout(frameId);
        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('pointermove', handlePointerMove);

      streakGeo.dispose();
      streakMat.dispose();
      staticGeo.dispose();
      trailGeo.dispose();
      heroGeo.dispose();
      dropletMat.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-[75] pointer-events-none select-none"
      aria-hidden="true"
    />
  );
};

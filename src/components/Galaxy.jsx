import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, EffectPass, RenderPass, BloomEffect } from 'postprocessing';

/**
 * Galaxy — Spiral particle galaxy with realistic star rendering.
 *
 * Props:
 *   mouseRepulsion   {boolean} – particles scatter away from cursor
 *   mouseInteraction {boolean} – subtle tilt on mouse move
 *   density          {number}  – particle count multiplier
 *   glowIntensity    {number}  – bloom amount (0–1, ONLY bright core blooms)
 *   saturation       {number}  – color saturation 0–1
 *   hueShift         {number}  – base hue degrees (155 = teal)
 *   arms             {number}  – spiral arm count
 *   speed            {number}  – rotation speed
 */
const Galaxy = ({
  mouseRepulsion   = true,
  mouseInteraction = true,
  density          = 1.0,
  glowIntensity    = 0.5,
  saturation       = 0.75,
  hueShift         = 155,
  arms             = 3,
  speed            = 0.04,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x020509, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // Subtle deep space fog so distant particles fade into darkness
    scene.fog = new THREE.FogExp2(0x020509, 0.012);

    // Camera looks at the galaxy disc from a 45° elevated angle
    const camera = new THREE.PerspectiveCamera(65, W / H, 0.01, 300);
    camera.position.set(0, 22, 18);
    camera.lookAt(0, 0, 0);

    // ── Post-Processing ───────────────────────────────────────────────────────
    // HIGH threshold so only the very bright core blooms — nothing else
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new EffectPass(
        camera,
        new BloomEffect({
          intensity: glowIntensity * 1.4,
          luminanceThreshold: 0.72,   // ← KEY FIX: only truly bright pixels bloom
          luminanceSmoothing: 0.5,
          radius: 0.6,
        })
      )
    );

    // ── Galaxy Particles ───────────────────────────────────────────────────────
    const PARTICLE_COUNT = Math.floor(70000 * density);
    const positions      = new Float32Array(PARTICLE_COUNT * 3);
    const colors         = new Float32Array(PARTICLE_COUNT * 3);
    const sizes          = new Float32Array(PARTICLE_COUNT);
    const origPos        = new Float32Array(PARTICLE_COUNT * 3);

    const col = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Which arm this particle belongs to
      const arm       = i % arms;
      // Distance from centre: bias heavily toward outer arms (more stars there)
      const t         = Math.pow(Math.random(), 0.6);
      const radius    = 0.25 + t * 12.0;

      // Logarithmic spiral: angle = arm base + spin increases with radius
      const armAngle  = (arm / arms) * Math.PI * 2;
      const spinAngle = radius * 0.48;
      // Random scatter gets larger at outer edge
      const scatter   = (Math.random() - 0.5) * 2 * Math.min(radius * 0.22, 2.2);
      const scatter2  = (Math.random() - 0.5) * 2 * Math.min(radius * 0.22, 2.2);
      const angle     = armAngle + spinAngle + scatter * 0.1;

      const x = Math.cos(angle) * radius + scatter;
      const z = Math.sin(angle) * radius + scatter2;
      // Thin disc: a very slight vertical puff, thicker near centre
      const ySpread = (1.0 - t) * 1.2 + 0.06;
      const y = (Math.random() - 0.5) * ySpread;

      positions[i3]     = origPos[i3]     = x;
      positions[i3 + 1] = origPos[i3 + 1] = y;
      positions[i3 + 2] = origPos[i3 + 2] = z;

      // Color ─────────────────────────────────────────────────────────────────
      // Arms slightly different hue so they're distinguishable
      const hue      = ((hueShift + arm * (180 / arms) + radius * 2.5) % 360) / 360;
      const sat      = saturation * (0.3 + t * 0.7);
      // Stars farther out are dimmer; those nearest centre are slightly brighter
      const lum      = 0.28 + (1 - t) * 0.28;
      col.setHSL(hue, sat, lum);
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      // All stars are SMALL — like real pinpoints of light
      sizes[i] = Math.random() < 0.015
        ? 2.8 + Math.random() * 1.6  // rare brighter foreground stars
        : 0.6 + Math.random() * 1.1; // the vast majority are tiny
    }

    // ── Dense, Bright Galactic Core ───────────────────────────────────────────
    // These are the ones that should bloom — warm white/teal near centre
    const CORE_COUNT = Math.floor(3500 * density);
    for (let i = PARTICLE_COUNT - CORE_COUNT; i < PARTICLE_COUNT; i++) {
      const i3    = i * 3;
      const r     = Math.pow(Math.random(), 2.0) * 1.6; // very centre-biased
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;

      const x = Math.sin(phi) * Math.cos(theta) * r;
      const y = Math.cos(phi) * r * 0.25;
      const z = Math.sin(phi) * Math.sin(theta) * r;

      positions[i3]     = origPos[i3]     = x;
      positions[i3 + 1] = origPos[i3 + 1] = y;
      positions[i3 + 2] = origPos[i3 + 2] = z;

      // Very bright nearly-white core — THESE will bloom
      const coreHue = hueShift / 360;
      col.setHSL(coreHue, 0.25, 0.92);
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = 1.2 + Math.random() * 2.5;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
    geom.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

    // ── Custom Shader: Soft circular star disc ─────────────────────────────────
    const mat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        attribute float size;
        varying vec3  vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          // Size attenuates with distance — distant stars are tinier
          gl_PointSize = size * (260.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.4, 6.0);
          // Slightly reduce alpha of tiny far stars
          vAlpha = clamp(gl_PointSize / 2.5, 0.25, 1.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3  vColor;
        varying float vAlpha;

        void main() {
          // Distance from centre of point sprite → circular shape
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;

          // Sharp bright centre fading to transparent edge (like a real star)
          float alpha = pow(1.0 - d * 2.0, 2.2);
          gl_FragColor = vec4(vColor, alpha * vAlpha * 0.9);
        }
      `,
      vertexColors: true,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
      transparent:  true,
    });

    const galaxy = new THREE.Points(geom, mat);
    scene.add(galaxy);

    // ── Mouse ──────────────────────────────────────────────────────────────────
    const mouseNDC  = new THREE.Vector2(0, 0);
    const mouse3D   = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const plane     = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const smoothNDC = new THREE.Vector2();

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseNDC.set(
         ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        -((e.clientY - rect.top)  / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(plane, mouse3D);
    };

    if (mouseRepulsion || mouseInteraction) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // ── Animation ──────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let   frameId;

    const REPEL_R  = 2.2;
    const REPEL_F  = 5.5;
    const RETURN_S = 0.055;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slowly rotate the galaxy disc
      galaxy.rotation.y = t * speed;

      // Subtle camera bob — feels alive
      camera.position.y = 22 + Math.sin(t * 0.14) * 0.8;
      camera.lookAt(0, 0, 0);

      // Mouse tilt
      if (mouseInteraction) {
        smoothNDC.x += (mouseNDC.x - smoothNDC.x) * 0.04;
        smoothNDC.y += (mouseNDC.y - smoothNDC.y) * 0.04;
        galaxy.rotation.x = smoothNDC.y * 0.12;
        galaxy.rotation.z = smoothNDC.x * 0.06;
      }

      // Mouse repulsion
      if (mouseRepulsion) {
        const posAttr = geom.attributes.position;
        const arr = posAttr.array;
        const mx = mouse3D.x;
        const mz = mouse3D.z;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const px = arr[i3];
          const pz = arr[i3 + 2];
          const ox = origPos[i3];
          const oz = origPos[i3 + 2];
          const dx = px - mx;
          const dz = pz - mz;
          const d2 = dx * dx + dz * dz;
          if (d2 < REPEL_R * REPEL_R) {
            const d = Math.sqrt(d2) + 0.01;
            const f = ((REPEL_R - d) / REPEL_R) * REPEL_F;
            arr[i3]     += (dx / d) * f * 0.011;
            arr[i3 + 2] += (dz / d) * f * 0.011;
          }
          arr[i3]     += (ox - arr[i3])     * RETURN_S;
          arr[i3 + 2] += (oz - arr[i3 + 2]) * RETURN_S;
        }
        posAttr.needsUpdate = true;
      }

      composer.render();
    };
    animate();

    // ── Resize ─────────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geom.dispose();
      mat.dispose();
      composer.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mouseRepulsion, mouseInteraction, density, glowIntensity, saturation, hueShift, arms, speed]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}
    />
  );
};

export default Galaxy;

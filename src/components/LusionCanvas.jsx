import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer, EffectPass, RenderPass, BloomEffect, ToneMappingEffect } from 'postprocessing';

gsap.registerPlugin(ScrollTrigger);

const LusionCanvas = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── 1. RENDERER ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setClearColor(0x020204, 1);
    container.appendChild(renderer.domElement);

    // ── 2. SCENE & CAMERA ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020204, 0.015);

    const camera = new THREE.PerspectiveCamera(
      55, container.clientWidth / container.clientHeight, 0.1, 120
    );
    camera.position.set(0, 0, 12);

    // ── 3. LIGHTS (PixelBlast Electric Purple & White Palette) ────────────────
    const hemiLight = new THREE.HemisphereLight(0x0f0b19, 0x020204, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.PointLight(0xb497cf, 14, 55);
    keyLight.position.set(0, 6, 8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xd8c5ed, 8, 35);
    fillLight.position.set(-12, 8, -6);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x3b0764, 1.8);
    backLight.position.set(0, -10, -15);
    scene.add(backLight);

    // ── 4. POST-PROCESSING (Bloom + Tone Mapping) ────────────────────────────
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomEffect = new BloomEffect({
      intensity: 1.6,
      luminanceThreshold: 0.2,
      luminanceSmoothing: 0.6,
    });
    const toneMappingEffect = new ToneMappingEffect();
    const effectPass = new EffectPass(camera, bloomEffect, toneMappingEffect);
    composer.addPass(renderPass);
    composer.addPass(effectPass);

    // ── 5. MASTER GROUP ───────────────────────────────────────────────────────
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ═══════════════════════════════════════════════════════════
    // MULTI-PAGE FLOATING GLASS, METALLIC & LIGHT CUBES (300 Cubes)
    // ═══════════════════════════════════════════════════════════
    const floatingCubesGroup = new THREE.Group();
    masterGroup.add(floatingCubesGroup);

    const cubeList = [];

    // ── 1. Light-Emitting Materials (Pop through Bloom filter) ────────────────
    const whiteEmissiveMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 3.2,
      roughness: 0.0,
      metalness: 0.0,
      toneMapped: false,
    });

    const purpleEmissiveMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8c5ed,
      emissive: 0xa855f7,
      emissiveIntensity: 2.5,
      roughness: 0.05,
      metalness: 0.1,
      toneMapped: false,
    });

    const cyanEmissiveMat = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      emissive: 0x0284c7,
      emissiveIntensity: 2.5,
      roughness: 0.05,
      metalness: 0.1,
      toneMapped: false,
    });

    const emeraldEmissiveMat = new THREE.MeshPhysicalMaterial({
      color: 0x6ee7b7,
      emissive: 0x059669,
      emissiveIntensity: 2.5,
      roughness: 0.05,
      metalness: 0.1,
      toneMapped: false,
    });

    // ── 2. Normal Materials (Glass, Metallic, Obsidian) ───────────────────────
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xb497cf,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      thickness: 0.6,
      transparent: true,
      opacity: 0.75,
    });

    const metallicMat = new THREE.MeshPhysicalMaterial({
      color: 0x4c1d95,
      roughness: 0.2,
      metalness: 0.9,
      clearcoat: 0.6,
      emissive: 0x3b0764,
      emissiveIntensity: 0.35,
    });

    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f0b18,
      roughness: 0.1,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // ── 3. Wireframe Line Materials ──────────────────────────────────────────
    const wireframeLineMat = new THREE.LineBasicMaterial({
      color: 0xd8c5ed,
      transparent: true,
      opacity: 0.8,
    });

    const brightWireMat = new THREE.LineBasicMaterial({
      color: 0xb497cf,
      transparent: true,
      opacity: 0.9,
    });

    const whiteWireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
    });

    const cyanWireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
    });

    // ── Cube Spawner Helper Function ──────────────────────────────────────────
    const INITIAL_CUBES = 300;
    const MAX_CUBES = 900;

    const unitBoxGeom = new THREE.BoxGeometry(1, 1, 1);
    const unitEdgesGeom = new THREE.EdgesGeometry(unitBoxGeom);

    const createCubeData = (index, isSpawnAnim = false) => {
      const type = Math.floor(Math.random() * 8);

      // Uniform, clean, aesthetic cube sizing (equal visual scale)
      const baseScale = 0.45 + (Math.random() - 0.5) * 0.08;
      const targetScaleX = baseScale;
      const targetScaleY = baseScale;
      const targetScaleZ = baseScale;

      let cubeMesh;

      if (type === 0) {
        cubeMesh = new THREE.Mesh(unitBoxGeom, whiteEmissiveMat);
        cubeMesh.add(new THREE.LineSegments(unitEdgesGeom, whiteWireMat));
      } else if (type === 1) {
        cubeMesh = new THREE.Mesh(unitBoxGeom, purpleEmissiveMat);
        cubeMesh.add(new THREE.LineSegments(unitEdgesGeom, brightWireMat));
      } else if (type === 2) {
        cubeMesh = new THREE.Mesh(unitBoxGeom, cyanEmissiveMat);
        cubeMesh.add(new THREE.LineSegments(unitEdgesGeom, cyanWireMat));
      } else if (type === 3) {
        cubeMesh = new THREE.Mesh(unitBoxGeom, emeraldEmissiveMat);
        cubeMesh.add(new THREE.LineSegments(unitEdgesGeom, whiteWireMat));
      } else if (type === 7) {
        const wireMat = Math.random() < 0.5 ? brightWireMat : cyanWireMat;
        cubeMesh = new THREE.LineSegments(unitEdgesGeom, wireMat);
      } else {
        let mat = glassMat;
        if (type === 5) mat = metallicMat;
        if (type === 6) mat = obsidianMat;

        cubeMesh = new THREE.Mesh(unitBoxGeom, mat);
        cubeMesh.add(new THREE.LineSegments(unitEdgesGeom, wireframeLineMat));
      }

      // If newly spawned, start small and scale up
      if (isSpawnAnim) {
        cubeMesh.scale.set(0.001, 0.001, 0.001);
      } else {
        cubeMesh.scale.set(targetScaleX, targetScaleY, targetScaleZ);
      }

      const y = 9 - Math.random() * 82;
      const xSign = Math.random() < 0.5 ? 1 : -1;
      const x = xSign * (1.2 + Math.random() * 7.5);
      const z = -15 + Math.random() * 21;

      cubeMesh.position.set(x, y, z);

      cubeMesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      cubeMesh.userData = { cubeIndex: index };
      if (cubeMesh.children) {
        cubeMesh.children.forEach(child => child.userData = { cubeIndex: index });
      }

      return {
        mesh: cubeMesh,
        baseY: y,
        baseX: x,
        targetScaleX,
        targetScaleY,
        targetScaleZ,
        currentScaleRatio: isSpawnAnim ? 0.01 : 1.0,
        vx: 0,
        vy: 0,
        vz: 0,
        rotSpeedX: (Math.random() - 0.5) * 0.025,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        floatFreq: 0.6 + Math.random() * 1.4,
        floatAmp: 0.12 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        isDragged: false,
      };
    };

    // Spawn 300 initial cubes
    for (let i = 0; i < INITIAL_CUBES; i++) {
      const data = createCubeData(i, false);
      floatingCubesGroup.add(data.mesh);
      cubeList.push(data);
    }

    // Continuous interval spawner: spawns 1 new cube every 600ms
    const spawnerInterval = setInterval(() => {
      if (cubeList.length < MAX_CUBES) {
        const nextIdx = cubeList.length;
        const data = createCubeData(nextIdx, true);
        floatingCubesGroup.add(data.mesh);
        cubeList.push(data);
      } else {
        // Recycle oldest non-dragged cube
        const recycleIdx = cubeList.findIndex(c => !c.isDragged);
        if (recycleIdx !== -1) {
          const oldItem = cubeList[recycleIdx];
          floatingCubesGroup.remove(oldItem.mesh);
          const newItem = createCubeData(recycleIdx, true);
          floatingCubesGroup.add(newItem.mesh);
          cubeList[recycleIdx] = newItem;
        }
      }
    }, 600);

    // ═══════════════════════════════════════════════════════════
    // HERO: Morphing Icosahedron Core
    // ═══════════════════════════════════════════════════════════
    const heroCoreGroup = new THREE.Group();
    masterGroup.add(heroCoreGroup);

    const coreMeshGeom = new THREE.IcosahedronGeometry(1.9, 4);
    const customMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb497cf,
      roughness: 0.0,
      metalness: 0.2,
      transmission: 0.6,
      thickness: 1.5,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const coreMesh = new THREE.Mesh(coreMeshGeom, customMaterial);
    heroCoreGroup.add(coreMesh);

    const coreEdges = new THREE.Mesh(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.92, 1)),
      new THREE.LineBasicMaterial({ color: 0xd8c5ed, transparent: true, opacity: 0.6 })
    );
    heroCoreGroup.add(coreEdges);

    const innerGeom = new THREE.OctahedronGeometry(0.9, 2);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8c5ed,
      roughness: 0.05,
      metalness: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      reflectivity: 1.0,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    heroCoreGroup.add(innerMesh);

    // ═══════════════════════════════════════════════════════════
    // ABOUT: Organic Node Constellation
    // ═══════════════════════════════════════════════════════════
    const aboutGroup = new THREE.Group();
    aboutGroup.position.set(0, -15, -5);
    masterGroup.add(aboutGroup);

    const nodeCount = 40;
    const aboutNodes = [];
    const sphereGeom = new THREE.SphereGeometry(0.22, 24, 24);

    for (let i = 0; i < nodeCount; i++) {
      const isBig = i % 6 === 0;
      const geom = isBig ? new THREE.IcosahedronGeometry(0.38, 1) : sphereGeom;
      const mat = new THREE.MeshPhysicalMaterial({
        color: isBig ? 0xb497cf : 0xd8c5ed,
        roughness: isBig ? 0.05 : 0.3,
        metalness: isBig ? 0.9 : 0.5,
        emissive: isBig ? 0x5b21b6 : 0x2e1065,
        emissiveIntensity: isBig ? 0.55 : 0.25,
      });
      const node = new THREE.Mesh(geom, mat);
      const angle = (i / nodeCount) * Math.PI * 4;
      const radius = 2.5 + (i % 4) * 1.3;
      node.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 7,
        Math.sin(angle) * radius
      );
      aboutGroup.add(node);
      aboutNodes.push({ mesh: node, isBig, seed: Math.random() * 100 });
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0xb497cf, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
    for (let i = 0; i < aboutNodes.length - 1; i += 2) {
      const geom = new THREE.BufferGeometry().setFromPoints([
        aboutNodes[i].mesh.position,
        aboutNodes[i + 1].mesh.position
      ]);
      aboutGroup.add(new THREE.Line(geom, lineMat));
    }

    // ═══════════════════════════════════════════════════════════
    // CONTACT: Signal Beacon with radial grid
    // ═══════════════════════════════════════════════════════════
    const contactGroup = new THREE.Group();
    contactGroup.position.set(0, -50, -5);
    masterGroup.add(contactGroup);

    const beaconBaseGeom = new THREE.ConeGeometry(1.8, 3.5, 6, 1, true);
    const beaconBaseMat = new THREE.MeshPhysicalMaterial({
      color: 0xb497cf, wireframe: true, emissive: 0x5b21b6, emissiveIntensity: 0.6,
      roughness: 0.1, metalness: 0.95,
    });
    const beaconBase = new THREE.Mesh(beaconBaseGeom, beaconBaseMat);
    beaconBase.rotation.x = Math.PI;
    beaconBase.position.y = 1.5;
    contactGroup.add(beaconBase);

    const gridHelper = new THREE.GridHelper(20, 20, 0xb497cf, 0x3b0764);
    gridHelper.position.y = -2;
    contactGroup.add(gridHelper);

    const waveCount = 5;
    const waves = [];
    for (let i = 0; i < waveCount; i++) {
      const wg = new THREE.RingGeometry(0.1, 0.22, 32);
      const wm = new THREE.MeshBasicMaterial({
        color: 0xd8c5ed, side: THREE.DoubleSide, transparent: true, opacity: 0.6
      });
      const wave = new THREE.Mesh(wg, wm);
      wave.rotation.x = Math.PI / 2;
      wave.position.y = 0.5;
      contactGroup.add(wave);
      waves.push({ mesh: wave, offset: (i / waveCount) * Math.PI * 2 });
    }

    // ═══════════════════════════════════════════════════════════
    // GLOBAL CURSOR PARTICLE SWARM
    // ═══════════════════════════════════════════════════════════
    const particleCount = 650;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginals = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 70;
      const z = (Math.random() - 0.5) * 28;
      particlePositions[i * 3] = particleOriginals[i * 3] = x;
      particlePositions[i * 3 + 1] = particleOriginals[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = particleOriginals[i * 3 + 2] = z;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd8c5ed, size: 0.1, transparent: true, opacity: 0.65,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    masterGroup.add(particleSystem);

    // ── 6. INTERACTIVE DRAG & THROW PHYSICS ──────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const intersectionPoint = new THREE.Vector3();
    const prevPos = new THREE.Vector3();

    let draggedItem = null;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const getPointerNDC = (e) => {
      return {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const handlePointerDown = (e) => {
      const p = getPointerNDC(e);
      mouseNDC.set(p.x, p.y);
      raycaster.setFromCamera(mouseNDC, camera);

      // Raycast against all cube meshes
      const intersects = raycaster.intersectObjects(floatingCubesGroup.children, true);

      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        const cubeIdx = hitObj.userData?.cubeIndex;

        if (cubeIdx !== undefined && cubeList[cubeIdx]) {
          draggedItem = cubeList[cubeIdx];
          draggedItem.isDragged = true;
          draggedItem.vx = 0;
          draggedItem.vy = 0;
          draggedItem.vz = 0;

          // Align drag plane to face the camera at the cube's depth
          dragPlane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(new THREE.Vector3()).negate(),
            draggedItem.mesh.position
          );

          prevPos.copy(draggedItem.mesh.position);
          document.body.style.cursor = 'grabbing';
        }
      }
    };

    const handlePointerMove = (e) => {
      const p = getPointerNDC(e);
      mouse.targetX = p.x;
      mouse.targetY = p.y;
      mouseNDC.set(p.x, p.y);

      if (draggedItem && draggedItem.isDragged) {
        raycaster.setFromCamera(mouseNDC, camera);
        if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
          // Compute instantaneous velocity for throw impulse
          const dt = 0.016;
          draggedItem.vx = (intersectionPoint.x - prevPos.x) / dt * 0.08;
          draggedItem.vy = (intersectionPoint.y - prevPos.y) / dt * 0.08;
          draggedItem.vz = (intersectionPoint.z - prevPos.z) / dt * 0.08;

          // Spin item while dragging
          draggedItem.rotSpeedX = (intersectionPoint.y - prevPos.y) * 0.8;
          draggedItem.rotSpeedY = (intersectionPoint.x - prevPos.x) * 0.8;

          // Update position
          draggedItem.mesh.position.copy(intersectionPoint);
          prevPos.copy(intersectionPoint);
        }
      }
    };

    const handlePointerUp = () => {
      if (draggedItem) {
        draggedItem.isDragged = false;
        draggedItem = null;
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    // ── 7. GSAP SCROLL TIMELINE ───────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
      },
    });

    // Hero → About
    tl.to(camera.position, { y: -15, z: 7, ease: 'power2.inOut' }, 0)
      .to(heroCoreGroup.rotation, { y: Math.PI * 2, x: Math.PI, ease: 'none' }, 0)

    // About → Projects & Contact
      .to(camera.position, { y: -50, z: 9, ease: 'power2.inOut' }, 1)
      .to(contactGroup.rotation, { y: Math.PI * 3, ease: 'none' }, 1)
      .to(masterGroup.rotation, { y: Math.PI * 2, ease: 'none' }, 1);

    // ── 8. ANIMATION LOOP ─────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Scene parallax
      masterGroup.rotation.y = mouse.x * 0.28;
      masterGroup.rotation.x = -mouse.y * 0.18;

      // Physics loop for floating & thrown cubes
      cubeList.forEach((item) => {
        const { mesh, baseY, rotSpeedX, rotSpeedY, rotSpeedZ, floatFreq, floatAmp, phase, isDragged } = item;

        // Smooth scale-up animation for newly materialized cubes
        if (item.currentScaleRatio < 1.0) {
          item.currentScaleRatio += (1.0 - item.currentScaleRatio) * 0.08;
          mesh.scale.set(
            item.targetScaleX * item.currentScaleRatio,
            item.targetScaleY * item.currentScaleRatio,
            item.targetScaleZ * item.currentScaleRatio
          );
        }

        if (!isDragged) {
          // Apply velocity from throw impulse
          mesh.position.x += item.vx;
          mesh.position.y += item.vy;
          mesh.position.z += item.vz;

          // Apply rotation
          mesh.rotation.x += item.rotSpeedX;
          mesh.rotation.y += item.rotSpeedY;
          mesh.rotation.z += item.rotSpeedZ;

          // Apply friction / linear damping so thrown cubes smoothly glide and decelerate
          item.vx *= 0.95;
          item.vy *= 0.95;
          item.vz *= 0.95;

          // Rotational damping
          item.rotSpeedX = item.rotSpeedX * 0.96 + rotSpeedX * 0.04;
          item.rotSpeedY = item.rotSpeedY * 0.96 + rotSpeedY * 0.04;
          item.rotSpeedZ = item.rotSpeedZ * 0.96 + rotSpeedZ * 0.04;

          // Base sinusoidal floating oscillation
          mesh.position.y += Math.sin(time * floatFreq + phase) * (floatAmp * 0.015);

          // Soft boundary bounce to keep cubes within scenic view
          if (mesh.position.x > 12)  { mesh.position.x = 12;  item.vx *= -0.6; }
          if (mesh.position.x < -12) { mesh.position.x = -12; item.vx *= -0.6; }
          if (mesh.position.z > 8)   { mesh.position.z = 8;   item.vz *= -0.6; }
          if (mesh.position.z < -22) { mesh.position.z = -22; item.vz *= -0.6; }
        }
      });

      // Hero core morph
      coreMesh.rotation.x = time * 0.18;
      coreMesh.rotation.y = time * 0.25;
      coreEdges.rotation.x = -time * 0.2;
      coreEdges.rotation.y = -time * 0.28;
      innerMesh.rotation.x = -time * 0.45;
      innerMesh.rotation.y = -time * 0.55;

      // About nodes pulse
      aboutNodes.forEach(({ mesh, isBig, seed }) => {
        const s = 1 + Math.sin(time * 1.5 + seed) * 0.08;
        mesh.scale.setScalar(isBig ? s * 1.2 : s);
        mesh.rotation.y = time * 0.2 + seed;
      });

      // Contact signal waves
      waves.forEach(({ mesh, offset }) => {
        const phase = (time * 1.2 + offset) % (Math.PI * 2);
        const s = 1 + Math.sin(phase) * 4;
        mesh.scale.set(s, s, s);
        mesh.material.opacity = Math.max(0, 0.6 - (s - 1) / 8);
      });
      beaconBase.rotation.y = time * 0.7;
      keyLight.intensity = 12 + Math.sin(time * 1.8) * 2;

      // Particle cursor swarm
      const posArr = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const px = particleOriginals[i * 3];
        const py = particleOriginals[i * 3 + 1];
        posArr[i * 3 + 1] = py + Math.sin(time * 1.5 + px * 0.4) * 0.25;
        const dx = px - mouse.x * 12;
        const dy = py - mouse.y * 12;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 5) {
          const force = (5 - dist) * 0.18;
          posArr[i * 3] = px + (dx / (dist + 0.01)) * force;
          posArr[i * 3 + 1] = py + (dy / (dist + 0.01)) * force;
        } else {
          posArr[i * 3] += (px - posArr[i * 3]) * 0.06;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      composer.render();
    };

    animate();

    // ── 9. RESIZE ────────────────────────────────────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // ── 10. CLEANUP ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(spawnerInterval);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'auto',
        zIndex: 0,
      }}
    />
  );
};

export default LusionCanvas;

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NodeGraph = ({ color = '#00F2FE', nodeColorAlt = '#00C6FF', speed = 0.5 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a141a, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(color, 8, 40);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Network Group
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Nodes
    const nodes = [];
    
    // Core Server (Central glowing orb with internal wiring)
    const coreGroup = new THREE.Group();
    
    const coreGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMat = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.15,
      shininess: 100,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreGroup.add(coreMesh);

    // Wireframe structure inside core
    const coreWireGeom = new THREE.IcosahedronGeometry(1.15, 2);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreWire = new THREE.Mesh(coreWireGeom, coreWireMat);
    coreGroup.add(coreWire);

    networkGroup.add(coreGroup);

    nodes.push({
      mesh: coreGroup,
      originalPos: new THREE.Vector3(0, 0, 0),
      seed: 0,
      isCore: true
    });

    // Outer Client Nodes (Spheres with glowing orbits)
    const nodeCount = 28;
    const nodeGeometry = new THREE.SphereGeometry(0.22, 16, 16);
    const clientMaterial = new THREE.MeshPhongMaterial({
      color: nodeColorAlt,
      emissive: nodeColorAlt,
      emissiveIntensity: 1.0,
      shininess: 100,
    });

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeometry, clientMaterial);
      
      // Position nodes in orbits around the core
      const angle = (i / (nodeCount / 3)) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 6;
      const radius = 4 + Math.random() * 4.5;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = height;

      mesh.position.set(x, y, z);
      
      // Add a soft halo to each node
      const haloGeom = new THREE.SphereGeometry(0.35, 8, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeColorAlt,
        transparent: true,
        opacity: 0.2,
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      mesh.add(halo);

      networkGroup.add(mesh);

      nodes.push({
        mesh,
        originalPos: new THREE.Vector3(x, y, z),
        seed: Math.random() * 100,
        isCore: false
      });
    }

    // Connections (Data Streams / Glowing Lines)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    const lines = [];
    nodes.forEach((nodeA, indexA) => {
      if (nodeA.isCore) return;

      // Connect to Core
      const points = [nodeA.mesh.position, coreGroup.position];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeom, lineMaterial);
      networkGroup.add(line);
      lines.push({ line, nodeA, nodeB: nodes[0] });

      // Connect to close neighbors
      nodes.forEach((nodeB, indexB) => {
        if (indexA === indexB || nodeB.isCore) return;
        const dist = nodeA.originalPos.distanceTo(nodeB.originalPos);
        if (dist < 4.5 && Math.random() > 0.4) {
          const pointsN = [nodeA.mesh.position, nodeB.mesh.position];
          const lineGeomN = new THREE.BufferGeometry().setFromPoints(pointsN);
          const lineN = new THREE.Line(lineGeomN, lineMaterial);
          networkGroup.add(lineN);
          lines.push({ line: lineN, nodeA, nodeB });
        }
      });
    });

    // Particle flow data streams
    const flowCount = 180;
    const flowGeometry = new THREE.BufferGeometry();
    const flowPositions = new Float32Array(flowCount * 3);
    const flowSpeeds = [];
    const flowTargets = [];
    const flowCurrents = [];

    for (let i = 0; i < flowCount; i++) {
      const connection = lines[Math.floor(Math.random() * lines.length)];
      flowTargets.push(connection);
      
      const progress = Math.random();
      flowCurrents.push(progress);
      
      const start = connection.nodeA.mesh.position;
      const end = connection.nodeB.mesh.position;
      
      flowPositions[i * 3] = start.x + (end.x - start.x) * progress;
      flowPositions[i * 3 + 1] = start.y + (end.y - start.y) * progress;
      flowPositions[i * 3 + 2] = start.z + (end.z - start.z) * progress;

      flowSpeeds.push(0.003 + Math.random() * 0.008);
    }

    flowGeometry.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
    const flowMaterial = new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.12,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const flowParticles = new THREE.Points(flowGeometry, flowMaterial);
    networkGroup.add(flowParticles);

    // Background Particle Field (Stars/Dust)
    const starCount = 300;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: nodeColorAlt,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    networkGroup.add(starField);

    // Track scroll & mouse coordinates
    let targetScroll = 0;
    let currentScroll = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = totalScroll > 0 ? window.scrollY / totalScroll : 0;
    };

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Raycaster for Hover Interaction
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleInteraction = (e) => {
      // Find canvas bounds
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(networkGroup.children, true);

      if (intersects.length > 0) {
        // Find the mesh that was hit
        const hitObject = intersects[0].object;
        
        // Find matching node
        const node = nodes.find(n => n.mesh === hitObject || n.mesh === hitObject.parent);
        if (node && !node.isCore) {
          // Push it slightly and make it pulse
          node.mesh.scale.set(1.8, 1.8, 1.8);
        }
      }
    };

    window.addEventListener('mousemove', handleInteraction, { passive: true });

    // Animation loop
    let clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime() * speed;

      // Smooth scroll & mouse transition
      currentScroll += (targetScroll - currentScroll) * 0.05;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Base network group animations (Rotate around dynamic angles)
      networkGroup.rotation.y = elapsed * 0.12 + mouseX * 0.4;
      networkGroup.rotation.x = elapsed * 0.05 + mouseY * 0.4;

      // Zoom inside network on scroll
      camera.position.z = 12 - currentScroll * 9;
      
      // Node physics/jiggle simulation
      nodes.forEach((node) => {
        if (node.isCore) {
          coreMesh.rotation.x = -elapsed * 0.3;
          coreMesh.rotation.y = elapsed * 0.2;
          coreWire.rotation.x = elapsed * 0.4;
          coreWire.rotation.y = -elapsed * 0.5;
          
          // Pulse size
          const scale = 1.0 + Math.sin(elapsed * 2) * 0.08;
          node.mesh.scale.set(scale, scale, scale);
        } else {
          // Float mesh slightly using noise/sine math
          const offset = Math.sin(elapsed * 1.5 + node.seed) * 0.18;
          node.mesh.position.copy(node.originalPos).addScaledVector(node.originalPos.clone().normalize(), offset);
          
          // Smooth scale back to normal if scaled by raycaster
          node.mesh.scale.x += (1.0 - node.mesh.scale.x) * 0.1;
          node.mesh.scale.y += (1.0 - node.mesh.scale.y) * 0.1;
          node.mesh.scale.z += (1.0 - node.mesh.scale.z) * 0.1;
        }
      });

      // Update lines position to match floating nodes
      lines.forEach((conn) => {
        const positions = conn.line.geometry.attributes.position.array;
        
        // Handle core group offset structure
        const posA = conn.nodeA.mesh.position;
        const posB = conn.nodeB.mesh.position;

        positions[0] = posA.x;
        positions[1] = posA.y;
        positions[2] = posA.z;

        positions[3] = posB.x;
        positions[4] = posB.y;
        positions[5] = posB.z;

        conn.line.geometry.attributes.position.needsUpdate = true;
      });

      // Update flow particle positions
      const flowPosArr = flowParticles.geometry.attributes.position.array;
      for (let i = 0; i < flowCount; i++) {
        flowCurrents[i] += flowSpeeds[i];
        if (flowCurrents[i] >= 1.0) {
          flowCurrents[i] = 0;
          flowTargets[i] = lines[Math.floor(Math.random() * lines.length)];
        }

        const conn = flowTargets[i];
        const progress = flowCurrents[i];
        const start = conn.nodeA.mesh.position;
        const end = conn.nodeB.mesh.position;

        flowPosArr[i * 3] = start.x + (end.x - start.x) * progress;
        flowPosArr[i * 3 + 1] = start.y + (end.y - start.y) * progress;
        flowPosArr[i * 3 + 2] = start.z + (end.z - start.z) * progress;
      }
      flowParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanups
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleInteraction);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      nodeGeometry.dispose();
      coreGeom.dispose();
      coreWireGeom.dispose();
      coreMat.dispose();
      coreWireMat.dispose();
      clientMaterial.dispose();
      lineMaterial.dispose();
      flowGeometry.dispose();
      flowMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [color, nodeColorAlt, speed]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
      }}
    />
  );
};

export default NodeGraph;

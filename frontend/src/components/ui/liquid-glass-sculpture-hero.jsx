import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Sliders,
  Trophy,
  Network,
  TrendingDown,
  BookOpen,
  Sun,
  Moon,
  MoveDown,
} from "lucide-react";

export default function LiquidGlassSculptureHero({
  onJumpToSection,
}) {
  const mountRef = useRef(null);
  const [studioTheme, setStudioTheme] = useState("platinum"); // "platinum" (reference image) | "obsidian"
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = studioTheme === "platinum" ? 1.35 : 1.5;
    mount.appendChild(renderer.domElement);

    // 2. High-Contrast Studio Environment Map (Procedural Canvas)
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext("2d");
    if (envCtx) {
      // Studio gradient with high-key softbox reflection bands
      const bgGrad = envCtx.createLinearGradient(0, 0, 0, 512);
      if (studioTheme === "platinum") {
        bgGrad.addColorStop(0, "#F5F5F7");
        bgGrad.addColorStop(0.35, "#D8D9DC");
        bgGrad.addColorStop(0.5, "#FFFFFF");
        bgGrad.addColorStop(0.7, "#999BA0");
        bgGrad.addColorStop(1, "#2B2D31");
      } else {
        bgGrad.addColorStop(0, "#00F5D4");
        bgGrad.addColorStop(0.3, "#0A0F1A");
        bgGrad.addColorStop(0.5, "#FFFFFF");
        bgGrad.addColorStop(0.7, "#140A20");
        bgGrad.addColorStop(1, "#FF2A85");
      }
      envCtx.fillStyle = bgGrad;
      envCtx.fillRect(0, 0, 1024, 512);

      // Add specular softbox horizontal lights
      envCtx.fillStyle = "rgba(255, 255, 255, 0.95)";
      envCtx.fillRect(100, 80, 824, 60);
      envCtx.fillRect(200, 280, 624, 45);

      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = envTexture;
    }

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, studioTheme === "platinum" ? 1.4 : 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, studioTheme === "platinum" ? 3.5 : 2.5);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLightLeft = new THREE.DirectionalLight(
      studioTheme === "platinum" ? 0xfff0e6 : 0x00f5d4,
      studioTheme === "platinum" ? 3.0 : 4.0
    );
    rimLightLeft.position.set(-6, -4, 4);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(
      studioTheme === "platinum" ? 0xd0e0ff : 0xff2a85,
      2.5
    );
    rimLightRight.position.set(4, -5, -4);
    scene.add(rimLightRight);

    // 4. Construct 5-Point Inflated Star Cushion Geometry
    const points = 5;
    const outerRadius = 2.45;
    const innerRadius = 1.35;
    const step = Math.PI / points;

    const starShape = new THREE.Shape();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const outerExtrudeSettings = {
      steps: 2,
      depth: 0.45,
      bevelEnabled: true,
      bevelThickness: 0.8,
      bevelSize: 0.65,
      bevelOffset: 0,
      bevelSegments: 24,
    };

    const outerStarGeo = new THREE.ExtrudeGeometry(starShape, outerExtrudeSettings);
    outerStarGeo.center();

    // 5. Outer Refractive Glass Shell Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.92,
      roughness: 0.02,
      metalness: 0.05,
      transmission: 0.95, // Pure optical refraction
      ior: 1.54, // Crown Glass refraction
      thickness: 2.8,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.95,
    });

    const outerGlassMesh = new THREE.Mesh(outerStarGeo, glassMaterial);

    // 6. Internal Liquid Chrome Core (Creates the deep black & metallic contrast from the reference)
    const innerExtrudeSettings = {
      steps: 2,
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.55,
      bevelSize: 0.45,
      bevelOffset: 0,
      bevelSegments: 16,
    };
    const innerStarGeo = new THREE.ExtrudeGeometry(starShape, innerExtrudeSettings);
    innerStarGeo.center();

    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: studioTheme === "platinum" ? 0x0a0c10 : 0x05070b,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
    });

    const innerChromeMesh = new THREE.Mesh(innerStarGeo, chromeMaterial);
    innerChromeMesh.scale.set(0.84, 0.84, 0.84);

    // Group both into a single rotatable 3D sculpture
    const sculptureGroup = new THREE.Group();
    sculptureGroup.add(innerChromeMesh);
    sculptureGroup.add(outerGlassMesh);
    scene.add(sculptureGroup);

    // Responsive scaling based on viewport width
    const updateScale = () => {
      const s = Math.min(1.25, Math.max(0.72, width / 1100));
      sculptureGroup.scale.set(s, s, s);
    };
    updateScale();

    // 7. Event Handlers
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateScale();
    };
    window.addEventListener("resize", handleResize);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      setPointer({ x: normX, y: normY });
      mouseX = (normX - 0.5) * 2;
      mouseY = -(normY - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 8. Animation Loop
    const startTime = performance.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth damped rotation towards cursor
      const targetRotX = -mouseY * 0.45;
      const targetRotY = mouseX * 0.65;

      sculptureGroup.rotation.x += (targetRotX - sculptureGroup.rotation.x) * 0.06;
      sculptureGroup.rotation.y += (targetRotY - sculptureGroup.rotation.y) * 0.06;

      // Gentle organic breathing float oscillation
      sculptureGroup.position.y = Math.sin(elapsed * 1.4) * 0.14;
      sculptureGroup.position.x = Math.cos(elapsed * 0.9) * 0.08;
      sculptureGroup.rotation.z = Math.sin(elapsed * 0.6) * 0.08;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      outerStarGeo.dispose();
      innerStarGeo.dispose();
      glassMaterial.dispose();
      chromeMaterial.dispose();
      renderer.dispose();
    };
  }, [studioTheme]);

  const isPlatinum = studioTheme === "platinum";

  return (
    <div
      className={`relative h-[100svh] w-full overflow-hidden select-none transition-colors duration-700 ${
        isPlatinum ? "bg-[#CECFD2] text-[#141518]" : "bg-[#06080E] text-[#F3F4F6]"
      }`}
    >
      {/* ── TOP EDITORIAL HEADER BAR ──────────────────────────────── */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 font-mono text-xs">
        {/* Brand Mark */}
        <div className="flex items-center gap-3">
          <span className="font-extrabold tracking-tighter text-base sm:text-lg font-sans">
            SPEC<span className={isPlatinum ? "text-neutral-900" : "text-[#00F5D4]"}>//WARP</span>
          </span>
          <span
            className={`hidden sm:inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              isPlatinum ? "bg-black/10 text-neutral-800" : "bg-white/10 text-[#00F5D4]"
            }`}
          >
            ATELIER 2026
          </span>
        </div>

        {/* Minimal Editorial Navigation */}
        <nav
          className={`hidden md:flex items-center gap-6 uppercase tracking-widest text-[11px] font-bold ${
            isPlatinum ? "text-neutral-700" : "text-neutral-400"
          }`}
        >
          <Link to="/predict" className="hover:text-black dark:hover:text-white transition">
            PREDICTOR
          </Link>
          <Link to="/arena" className="hover:text-black dark:hover:text-white transition">
            ARENA
          </Link>
          <Link to="/manifold" className="hover:text-black dark:hover:text-white transition">
            MANIFOLDS
          </Link>
          <Link to="/resale" className="hover:text-black dark:hover:text-white transition">
            VALUATION
          </Link>
          <Link to="/guide" className="hover:text-black dark:hover:text-white transition">
            DEFENSE
          </Link>
        </nav>

        {/* Theme Switcher Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStudioTheme(isPlatinum ? "obsidian" : "platinum")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition text-[11px] font-bold cursor-pointer border ${
              isPlatinum
                ? "border-neutral-400 bg-white/40 text-neutral-900 hover:bg-black hover:text-white"
                : "border-white/20 bg-white/5 text-white hover:border-[#00F5D4]"
            }`}
            title="Toggle between Titanium Atelier (Reference Look) and Obsidian Void"
          >
            {isPlatinum ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">OBSIDIAN MODE</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#00F5D4]" />
                <span className="hidden sm:inline">ATELIER PLATINUM</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── GIANT MONUMENTAL KINETIC TYPOGRAPHY ──────────────────── */}
      {/* Behind the 3D star sculpture (Layer 1) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          className={`text-[17vw] sm:text-[19vw] font-black tracking-tighter uppercase leading-none select-none text-center transition-colors duration-700 ${
            isPlatinum ? "text-[#15161A]" : "text-[#0E131E]"
          }`}
          style={{
            letterSpacing: "-0.07em",
            transform: `translate(${(pointer.x - 0.5) * -25}px, ${(pointer.y - 0.5) * -15}px)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          SPEC//WARP
        </h1>
      </div>

      {/* ── 3D THREE.JS WEBGL CANVAS (Layer 2) ───────────────────── */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* ── FRONT LIGHT-WARPED TYPOGRAPHIC OVERLAY (Layer 3) ──────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <h1
          className={`text-[17vw] sm:text-[19vw] font-black tracking-tighter uppercase leading-none select-none text-center opacity-30 mix-blend-overlay ${
            isPlatinum ? "text-white" : "text-[#00F5D4]"
          }`}
          style={{
            letterSpacing: "-0.07em",
            transform: `translate(${(pointer.x - 0.5) * 15}px, ${(pointer.y - 0.5) * 10}px)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          SPEC//WARP
        </h1>
      </div>

      {/* ── BOTTOM EDITORIAL FOOTER & CTA (Layer 4) ───────────────── */}
      <div className="absolute bottom-0 inset-x-0 z-30 flex flex-col sm:flex-row items-start sm:items-end justify-between p-6 sm:p-12 gap-6 pointer-events-auto">
        {/* Editorial Left Micro-Manifesto */}
        <div className="max-w-md font-mono text-[11px] sm:text-xs leading-relaxed uppercase tracking-wider">
          <p className={isPlatinum ? "text-neutral-900 font-bold" : "text-white font-bold"}>
            CONCEPTUAL MACHINE LEARNING SYSTEM,
          </p>
          <p className={isPlatinum ? "text-neutral-600" : "text-neutral-400"}>
            SYNTHESIZING 20-FEATURE HARDWARE MANIFOLDS & MARKET VALUATION.
          </p>
        </div>

        {/* Minimal Luxury CTA Button (matching reference) */}
        <div className="flex items-center gap-4">
          <Link
            to="/predict"
            className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-none font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-2xl ${
              isPlatinum
                ? "bg-[#141518] text-white hover:bg-black hover:tracking-[0.2em]"
                : "bg-white text-black hover:bg-[#00F5D4] hover:tracking-[0.2em]"
            }`}
          >
            <span>EXPLORE ENGINE</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

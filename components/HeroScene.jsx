'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';
import styles from './HeroScene.module.css';

/* ─── Floating Wireframe Shape ─── */
function FloatingShape({ position, type, size = 1, speed = 0.3 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
  });

  const geometry = useMemo(() => {
    switch (type) {
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(size, 0);
      case 'octahedron':
        return new THREE.OctahedronGeometry(size, 0);
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(size, 0);
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(size, 0);
      case 'box':
        return new THREE.BoxGeometry(size, size, size);
      case 'torus':
        return new THREE.TorusGeometry(size * 0.7, size * 0.2, 8, 16);
      default:
        return new THREE.IcosahedronGeometry(size, 0);
    }
  }, [type, size]);

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} geometry={geometry}>
        <meshStandardMaterial
          color="#B08D57"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

/* ─── Warm Gold Particle Dust ─── */
function ParticleDust({ count = 300 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.04;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#C9A96E"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

/* ─── Gentle Ambient Camera Drift ─── */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.08) * 0.6;
    state.camera.position.y = Math.cos(t * 0.06) * 0.4;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Main 3D Scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} color="#B08D57" intensity={1.5} />
      <pointLight position={[-10, -5, 5]} color="#C4A882" intensity={0.6} />
      <spotLight
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.4}
        color="#FAF7F2"
      />

      <FloatingShape position={[-4, 2, -3]} type="icosahedron" size={1.2} speed={0.4} />
      <FloatingShape position={[4.5, -1.5, -2]} type="octahedron" size={1.0} speed={0.3} />
      <FloatingShape position={[-2, -2.5, -4]} type="dodecahedron" size={0.8} speed={0.5} />
      <FloatingShape position={[2.5, 3, -5]} type="tetrahedron" size={0.6} speed={0.35} />
      <FloatingShape position={[0, -3.5, -2]} type="box" size={1.3} speed={0.2} />
      <FloatingShape position={[-5, 0, -6]} type="icosahedron" size={0.7} speed={0.45} />
      <FloatingShape position={[5.5, 2.5, -4]} type="torus" size={0.9} speed={0.25} />
      <FloatingShape position={[-3, 3.5, -7]} type="octahedron" size={0.5} speed={0.38} />
      <FloatingShape position={[3, -3, -6]} type="dodecahedron" size={0.6} speed={0.42} />

      <ParticleDust count={500} />
      <CameraRig />
    </>
  );
}

/* ─── CountUp Helper ─── */
const STATS = [
  { value: 1500, suffix: '+', label: 'Happy Homeowners' },
  { value: 10, suffix: '+', label: 'Years of Excellence' },
  { value: 500, suffix: '+', label: 'Bespoke Projects' },
  { value: 1, suffix: '', label: 'Flagship Showroom' },
];

function CountUp({ target, suffix, duration = 1600 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Hero Section ─── */
export default function HeroScene() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-20px' });

  return (
    <section className={styles.hero} id="hero">
      {/* Three.js Canvas Background */}
      <div className={styles.canvas}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Text Overlay */}
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>DESIGNED · CRAFTED · CUSTOMIZED</span>
          <h1 className={styles.title}>
            Furniture, Crafted
            <br />
            <em>Around You</em>
          </h1>
          <p className={styles.subtitle}>
            Bespoke luxury furniture & interior styling from Chattogram&apos;s
            finest artisans. Every piece built around your space, your style,
            your life.
          </p>
          <div className={styles.ctas}>
            <a href="#catalog" className="btn btn-primary">
              Explore Collections
            </a>
            <a
              href="https://wa.me/8801960481983?text=Hi%2C%20I'm%20interested%20in%20a%20free%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Integrated Stats Bar directly inside Hero */}
          <div className={styles.heroStatsContainer} ref={statsRef}>
            <div className={styles.heroStatsGrid}>
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className={styles.heroStatItem}
                  initial={{ opacity: 0, y: 16 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={styles.heroStatNum}>
                    {statsInView ? <CountUp target={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
                  </span>
                  <span className={styles.heroStatLabel}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span>SCROLL</span>
      </div>
    </section>
  );
}

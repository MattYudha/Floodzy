/// <reference types="@react-three/fiber" />
'use client';

import * as THREE from 'three';
import React, {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
// PERBAIKAN: Pastikan 'Canvas' diimpor dari '@react-three/fiber'
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  useGLTF,
  useAnimations,
  Environment,
  ContactShadows,
  PresentationControls,
  Float,
  Bounds,
  Html,
  Points,
  PointMaterial,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader as LoaderIcon,
  Cloud,
  Zap,
  Droplets,
  AlertTriangle,
  Wifi,
  WifiOff,
} from 'lucide-react';

const MODEL_URL = '/RobotExpressive.glb';

/* ----------------------------- TYPES & INTERFACES ----------------------------- */
interface LoadingProgress {
  progress: number;
  phase:
    | 'initializing'
    | 'loading-3d'
    | 'loading-data'
    | 'connecting'
    | 'ready';
  message: string;
}

interface SplashScreenProps {
  isFadingOut: boolean;
  onComplete?: () => void;
}

/* ----------------------------- UTILS ----------------------------- */
function easeInOutSine(t: number): number {
  return 0.5 * (1 - Math.cos(Math.PI * t));
}

function generateParticlePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const spread = 25;
  const height = 15;
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread; // X
    positions[i * 3 + 1] = Math.random() * height; // Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread; // Z
  }
  return positions;
}

/* ----------------------------- RAIN PARTICLE SYSTEM ----------------------------- */
function RainParticles({ count = 1500 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateParticlePositions(count), [count]);

  useFrame((state, delta) => {
    if (!points.current) return;

    const positionsArray = points.current.geometry.attributes.position
      .array as Float32Array;
    const speed = 2;

    for (let i = 1; i < positionsArray.length; i += 3) {
      positionsArray[i] -= delta * speed;
      if (positionsArray[i] < -5) {
        positionsArray[i] = 10;
        positionsArray[i - 1] = (Math.random() - 0.5) * 20;
        positionsArray[i + 1] = (Math.random() - 0.5) * 20;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#aaddff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
        blending={THREE.NormalBlending}
      />
    </Points>
  );
}

/* ----------------------------- ENHANCED ROBOT COMPONENT ----------------------------- */
function RobotModel({ 
  idle = 'Wave', 
  onModelError, 
  onModelLoaded 
}: { 
  idle?: string; 
  onModelError: (error: any) => void;
  onModelLoaded: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  
  // Error akan ditangkap oleh ErrorBoundary dan diteruskan ke onModelError
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, mixer } = useAnimations(animations, group);

  // Notify parent when model is loaded and ready
  useEffect(() => {
    if (scene && actions && mixer) {
      // Add a small delay to ensure everything is properly initialized
      const timer = setTimeout(() => {
        onModelLoaded();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scene, actions, mixer, onModelLoaded]);

  const prepared = useMemo(() => {
    if (!scene) return null;

    scene.traverse((object: any) => {
      if (object.isMesh) {
        object.castShadow = object.receiveShadow = true;
        if (object.material) {
          object.material.envMapIntensity = 0.8;
          object.material.roughness = object.material.roughness ?? 0.5;
          object.material.metalness = object.material.metalness ?? 0.3;

          if (object.material.emissive) {
            object.material.emissive.setHex(0x000000);
            object.material.emissiveIntensity = 0;
          }
        }
      }
    });
    return scene;
  }, [scene]);

  useEffect(() => {
    if (!actions?.[idle]) return;

    const action = actions[idle];
    action.reset().fadeIn(0.5).play();
    action.setLoop(THREE.LoopRepeat, Infinity);

    return () => {
      Object.values(actions).forEach((action) => {
        action?.fadeOut(0.3).stop();
      });
    };
  }, [actions, idle]);

  const movementState = useRef({
    time: 0,
    baseY: -0.1,
    amplitude: 0.02,
  });

  useFrame((state, delta) => {
    if (!group.current) return;

    movementState.current.time += delta;
    const t = movementState.current.time;

    const x = 0;
    const z = 1.5;
    const y =
      movementState.current.baseY +
      Math.sin(t * 1.5) * movementState.current.amplitude;

    group.current.position.set(x, y, z);
    group.current.rotation.y = 0;
    group.current.rotation.x = 0;
    group.current.rotation.z = 0;
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!mixer) return;
      mixer.timeScale = document.hidden ? 0 : 1;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [mixer]);

  if (!prepared) return null;

  return (
    <group ref={group} scale={0.8}>
      <Float speed={1.2} floatIntensity={0.12} rotationIntensity={0.08}>
        <primitive object={prepared} />
      </Float>
    </group>
  );
}

// Komponen Error Boundary sederhana untuk menangkap error dari Suspense
class ErrorBoundary extends React.Component<
  {
    fallback: React.ReactNode;
    children: React.ReactNode;
    onError: (error: any, errorInfo: any) => void;
  },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function Robot({ 
  idle = 'Wave', 
  onModelLoaded 
}: { 
  idle?: string;
  onModelLoaded: () => void;
}) {
  const [modelError, setModelError] = useState<string | null>(null);

  const handleModelError = (error: any) => {
    console.error('Failed to load 3D model:', error);
    setModelError('Gagal memuat model 3D');
  };

  const errorFallback = (
    <Html center>
      <div className="rounded-xl bg-red-500/20 border border-red-500/40 px-4 py-3 text-sm text-red-300 backdrop-blur-sm">
        <AlertTriangle className="w-4 h-4 inline mr-2" />
        Gagal memuat model 3D
      </div>
    </Html>
  );

  if (modelError) {
    return errorFallback;
  }

  return (
    <ErrorBoundary fallback={errorFallback} onError={handleModelError}>
      <Suspense fallback={<EmptyHtmlLoader />}>
        <RobotModel 
          idle={idle} 
          onModelError={handleModelError}
          onModelLoaded={onModelLoaded}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

/* ----------------------------- Placeholder for Suspense Fallback ----------------------------- */
function EmptyHtmlLoader() {
  return null;
}

/* ----------------------------- ENHANCED CANVAS ----------------------------- */
function Enhanced3DCanvas({
  loadingProgress,
  setLoadingProgress,
  onModelLoaded,
}: {
  loadingProgress: LoadingProgress;
  setLoadingProgress: (progress: LoadingProgress) => void;
  onModelLoaded: () => void;
}) {
  const [is3DSupported, setIs3DSupported] = useState(true);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const deviceCapabilities = useMemo(() => {
    if (typeof window === 'undefined')
      return { supported: true, quality: 'high' };

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
      setIs3DSupported(false);
      return { supported: false, quality: 'none' };
    }

    const renderer = gl.getParameter(gl.RENDERER);
    const vendor = gl.getParameter(gl.VENDOR);
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;

    let quality = 'medium';
    if (memory >= 8 && cores >= 8) quality = 'high';
    if (memory < 4 || cores < 4) quality = 'low';
    if (renderer.includes('Intel') && !renderer.includes('Iris'))
      quality = 'low';

    return { supported: true, quality, renderer, vendor };
  }, []);

  // Handle canvas ready state
  const handleCanvasCreated = useCallback(() => {
    setIsCanvasReady(true);
  }, []);

  if (!is3DSupported) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto" />
          <div className="text-sm text-white/70">
            Perangkat tidak mendukung rendering 3D
          </div>
          <div className="text-xs text-white/50">
            Menggunakan tampilan minimal
          </div>
        </div>
      </div>
    );
  }

  const dpr = (deviceCapabilities.quality === 'high' ? [1, 2] : [1, 1.5]) as [number, number];
  const shadows = deviceCapabilities.quality !== 'low';

  return (
    <Canvas
      shadows={shadows}
      dpr={dpr}
      camera={{
        position: [0, 1.5, 6],
        fov: deviceCapabilities.quality === 'low' ? 45 : 35,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: deviceCapabilities.quality !== 'low',
        alpha: true,
        powerPreference:
          deviceCapabilities.quality === 'high'
            ? 'high-performance'
            : 'default',
        preserveDrawingBuffer: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      onCreated={({ gl, scene, camera }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        scene.fog = new THREE.Fog(0x04080e, 8, 30);
        if (deviceCapabilities.quality === 'low') {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }
        handleCanvasCreated();
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={<EmptyHtmlLoader />}>
        <Environment preset="city" environmentIntensity={0.3} />

        <directionalLight
          position={[5, 15, 5]}
          intensity={0.8}
          castShadow={shadows}
          shadow-mapSize={
            deviceCapabilities.quality === 'high' ? [2048, 2048] : [1024, 1024]
          }
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          color={0xc0d0e0}
        />

        <ambientLight intensity={0.4} />

        <hemisphereLight
          intensity={0.5}
          groundColor="#0a0a1a"
          color="#2a3040"
        />

        <pointLight
          position={[-3, 4, 2]}
          intensity={0.3}
          color="#0ea5e9"
          distance={15}
        />
        <pointLight
          position={[3, 2, -2]}
          intensity={0.2}
          color="#10b981"
          distance={10}
        />

        <PresentationControls
          global
          enabled={deviceCapabilities.quality !== 'low'}
          polar={[THREE.MathUtils.degToRad(-5), THREE.MathUtils.degToRad(15)]}
          azimuth={[
            THREE.MathUtils.degToRad(-15),
            THREE.MathUtils.degToRad(15),
          ]}
          config={{ mass: 1, tension: 200, friction: 30 }}
          snap={{ mass: 1, tension: 180, friction: 25 }}
        >
          <Bounds fit observe clip margin={1.1}>
            <Robot onModelLoaded={onModelLoaded} />
          </Bounds>

          {shadows && (
            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.4}
              scale={12}
              blur={2.8}
              far={4}
              frames={deviceCapabilities.quality === 'high' ? 60 : 1}
              color="#0f172a"
            />
          )}
        </PresentationControls>

        {deviceCapabilities.quality !== 'low' && (
          <RainParticles
            count={deviceCapabilities.quality === 'high' ? 1500 : 800}
          />
        )}

        <mesh position={[0, 0, -15]} receiveShadow>
          <planeGeometry args={[50, 30]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.3} />
        </mesh>
      </Suspense>
    </Canvas>
  );
}

/* ----------------------------- ENHANCED PROGRESS COMPONENT ----------------------------- */
function LoadingProgress({ progress }: { progress: LoadingProgress }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getPhaseIcon = () => {
    switch (progress.phase) {
      case 'initializing':
        return <LoaderIcon className="w-5 h-5 animate-spin" />;
      case 'loading-data':
        return <Cloud className="w-5 h-5 animate-bounce" />;
      case 'connecting':
        return isOnline ? (
          <Wifi className="w-5 h-5 text-emerald-400" />
        ) : (
          <WifiOff className="w-5 h-5 text-orange-400" />
        );
      case 'ready':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      default:
        return <LoaderIcon className="w-5 h-5 animate-spin" />;
    }
  };

  const getPhaseColor = () => {
    switch (progress.phase) {
      case 'initializing':
      case 'loading-3d':
        return 'from-blue-400 to-cyan-500';
      case 'loading-data':
        return 'from-blue-400 to-cyan-500';
      case 'connecting':
        return isOnline
          ? 'from-emerald-400 to-green-500'
          : 'from-yellow-400 to-orange-500';
      case 'ready':
        return 'from-emerald-400 to-green-500';
      default:
        return 'from-blue-400 to-cyan-500';
    }
  };

  const displayMessage = useMemo(() => {
    if (progress.phase === 'loading-3d') {
      return 'Mempersiapkan elemen visual...';
    }
    return progress.message;
  }, [progress.phase, progress.message]);

  return (
    <motion.div
      className="flex items-center gap-3 px-6 py-3 bg-slate-900/60 backdrop-blur-sm rounded-full border border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="text-blue-400">{getPhaseIcon()}</div>

      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/90 font-medium mb-1">
          {displayMessage}
        </div>
        <div className="w-40 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getPhaseColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress.progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="text-xs text-slate-400 tabular-nums min-w-[3ch]">
        {Math.round(progress.progress)}%
      </div>
    </motion.div>
  );
}

/* ----------------------------- MAIN SPLASH SCREEN COMPONENT ----------------------------- */
export function SplashScreen({ isFadingOut, onComplete }: SplashScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    progress: 0,
    phase: 'initializing',
    message: 'Mempersiapkan aplikasi...',
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [is3DModelLoaded, setIs3DModelLoaded] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [canProceedToApp, setCanProceedToApp] = useState(false);

  // Callback when 3D model is fully loaded
  const handleModelLoaded = useCallback(() => {
    console.log('[SplashScreen] 3D Model loaded successfully');
    setIs3DModelLoaded(true);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Enhanced loading phases with proper 3D model synchronization
    const phases: Array<{
      phase: LoadingProgress['phase'];
      message: string;
      duration: number;
      targetProgress: number;
      waitFor3D?: boolean;
    }> = [
      {
        phase: 'initializing',
        message: 'Mempersiapkan aplikasi...',
        duration: 1200,
        targetProgress: 20,
      },
      {
        phase: 'loading-3d',
        message: 'Memuat elemen visual...',
        duration: 3000,
        targetProgress: 60,
        waitFor3D: true, // This phase waits for 3D model
      },
      {
        phase: 'loading-data',
        message: 'Memuat data cuaca...',
        duration: 1800,
        targetProgress: 80,
      },
      {
        phase: 'connecting',
        message: isOnline
          ? 'Menghubungkan ke server...'
          : 'Mencoba menghubungkan kembali...',
        duration: 1500,
        targetProgress: 95,
      },
      {
        phase: 'ready',
        message: 'Siap digunakan!',
        duration: 800,
        targetProgress: 100,
      },
    ];

    let currentPhaseIndex = 0;
    let phaseTimer: NodeJS.Timeout | null = null;

    const progressPhase = () => {
      if (currentPhaseIndex >= phases.length) return;

      const currentPhase = phases[currentPhaseIndex];
      const startProgress =
        currentPhaseIndex === 0
          ? 0
          : phases[currentPhaseIndex - 1].targetProgress;
      const progressRange = currentPhase.targetProgress - startProgress;
      const startTime = Date.now();

      setLoadingProgress((prev) => ({
        ...prev,
        phase: currentPhase.phase,
        message:
          currentPhase.phase === 'connecting' && !isOnline
            ? 'Mencoba menghubungkan kembali...'
            : currentPhase.message,
      }));

      // Special handling for 3D loading phase
      if (currentPhase.waitFor3D) {
        const check3DProgress = () => {
          const elapsed = Date.now() - startTime;
          const timeProgress = Math.min(elapsed / currentPhase.duration, 1);
          const easedTimeProgress = easeInOutSine(timeProgress);
          
          // Progress based on both time and 3D model loading
          let combinedProgress;
          if (is3DModelLoaded) {
            // If 3D is loaded, allow progress to complete
            combinedProgress = Math.max(easedTimeProgress, 0.9); // At least 90% when model is loaded
          } else {
            // If 3D not loaded yet, cap progress at 70% regardless of time
            combinedProgress = Math.min(easedTimeProgress, 0.7);
          }
          
          const newProgress = startProgress + progressRange * combinedProgress;
          
          setLoadingProgress((prev) => ({
            ...prev,
            progress: Math.round(newProgress),
            message: is3DModelLoaded 
              ? 'Elemen visual siap...' 
              : 'Memuat model 3D...',
          }));
          
          // Continue to next phase only if both time elapsed and 3D model loaded
          if (timeProgress >= 1 && is3DModelLoaded) {
            currentPhaseIndex++;
            setTimeout(progressPhase, 300);
          } else {
            // Continue checking
            requestAnimationFrame(check3DProgress);
          }
        };
        
        requestAnimationFrame(check3DProgress);
        return;
      }

      // Normal progress for non-3D phases
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / currentPhase.duration, 1);
        const easedProgress = easeInOutSine(progressRatio);
        const newProgress = startProgress + progressRange * easedProgress;

        setLoadingProgress((prev) => ({
          ...prev,
          progress: Math.round(newProgress),
        }));

        if (progressRatio < 1) {
          requestAnimationFrame(updateProgress);
        } else {
          currentPhaseIndex++;
          // Call onComplete ONLY after 'ready' phase and when we can proceed
          if (currentPhase.phase === 'ready' && newProgress === 100) {
            setCanProceedToApp(true);
          } else {
            setTimeout(progressPhase, 200);
          }
        }
      };

      requestAnimationFrame(updateProgress);
    };

    phaseTimer = setTimeout(progressPhase, 500);
    
    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [onComplete, isOnline, is3DModelLoaded]);

  // Effect to handle final transition to app
  useEffect(() => {
    if (canProceedToApp && is3DModelLoaded) {
      console.log('[SplashScreen] All conditions met, proceeding to app...');
      const finalTimer = setTimeout(() => {
        onComplete?.();
      }, 500); // Give user time to see 100%
      
      return () => clearTimeout(finalTimer);
    }
  }, [canProceedToApp, is3DModelLoaded, onComplete]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-gray-900 to-blue-950 text-white overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            transition: {
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
        >
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-transparent to-indigo-800/20"
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(26, 46, 76, 0.2) 0%, transparent 50%, rgba(49, 46, 129, 0.2) 100%)',
                  'linear-gradient(225deg, rgba(49, 46, 129, 0.2) 0%, transparent 50%, rgba(26, 46, 76, 0.2) 100%)',
                  'linear-gradient(135deg, rgba(26, 46, 76, 0.2) 0%, transparent 50%, rgba(49, 46, 129, 0.2) 100%)',
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(1400px_800px_at_50%_-10%,rgba(59,130,246,0.06),transparent)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(600px_600px_at_50%_100%,rgba(37,99,235,0.04),transparent)] pointer-events-none" />
          </div>

          <motion.div
            className="absolute inset-0 z-0"
            variants={{
              hidden: { scale: 0.8, opacity: 0, y: 20 },
              visible: { scale: 1, opacity: 1, y: 0 },
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              duration: 0.8,
            }}
          >
            <Enhanced3DCanvas
              loadingProgress={loadingProgress}
              setLoadingProgress={setLoadingProgress}
              onModelLoaded={handleModelLoaded}
            />
          </motion.div>

          <motion.div
            className="relative z-10 flex w-full h-full flex-col items-center justify-between py-12 px-6 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              className="space-y-2 mt-8"
              variants={{
                hidden: { y: 30, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <motion.h1
                className="flex justify-center text-6xl sm-text-7xl lg:text-8xl font-bold tracking-tight"
                aria-label="Floodzie"
              >
                {'Flood'.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    className="inline-block text-white"
                    variants={{
                      hidden: { y: 50, opacity: 0, rotateX: -90 },
                      visible: { y: 0, opacity: 1, rotateX: 0 },
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                      delay: index * 0.05,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  className="inline-block bg-gradient-to-r from-blue-400 via-cyan-500 to-sky-400 bg-clip-text text-transparent"
                  variants={{
                    hidden: { y: 50, opacity: 0, rotateX: -90 },
                    visible: { y: 0, opacity: 1, rotateX: 0 },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    delay: 0.3,
                  }}
                >
                  zie
                </motion.span>
              </motion.h1>

              <motion.div
                className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mx-auto"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </motion.div>

            <motion.div
              className="space-y-3 max-w-2xl flex-grow flex flex-col justify-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xl sm-text-2xl text-white/90 font-medium">
                Sistem Peringatan Dini Banjir
              </p>
              <p className="text-lg text-white/70">
                Berbasis Komunitas untuk Indonesia
              </p>

              <motion.div
                className="flex items-center justify-center gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Terhubung</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400">Mode Offline</span>
                  </>
                )}
              </motion.div>
            </motion.div>

            <motion.div className="flex flex-col items-center gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <LoadingProgress progress={loadingProgress} />
              </motion.div>

              <motion.div
                className="flex justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.2 }}
              >
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      is3DModelLoaded ? 'bg-green-400' : 'bg-blue-400'
                    }`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
              
              {/* Debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-xs text-white/50 text-center mt-4"
                >
                  <div>3D Model: {is3DModelLoaded ? '✅ Loaded' : '⏳ Loading...'}</div>
                  <div>Canvas: {isCanvasReady ? '✅ Ready' : '⏳ Preparing...'}</div>
                  <div>Can Proceed: {canProceedToApp ? '✅ Yes' : '❌ No'}</div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

useGLTF.preload(MODEL_URL);

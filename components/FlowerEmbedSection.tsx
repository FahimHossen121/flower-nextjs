'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Html, OrbitControls } from '@react-three/drei'
import { Model } from './flower'

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t
}

function ModelLoader() {
  return (
    <Html center>
      <div className="rounded-full border border-[#1e1347]/20 bg-white/80 px-4 py-2 text-sm font-medium text-[#1e1347] backdrop-blur-sm">
        Loading model...
      </div>
    </Html>
  )
}

function FlowerScene({ progress, isMobile }: { progress: number; isMobile: boolean }) {
  const clampedProgress = Math.min(1, Math.max(0, progress))
  const easedProgress = 1 - (1 - clampedProgress) * (1 - clampedProgress)

  const modelScale = isMobile
    ? lerp(1.7, 2.25, easedProgress)
    : lerp(2.1, 3.35, easedProgress)
  const modelPosY = isMobile
    ? lerp(-1.3, -0.5, easedProgress)
    : lerp(-1.5, -0.6, easedProgress)
  const modelPosX = isMobile ? lerp(0.08, -0.08, easedProgress) : lerp(0, -0.2, easedProgress)
  const modelRotX = lerp(0.5, 0.3, easedProgress)
  const modelRotY = isMobile
    ? lerp(-0.28, -0.08, easedProgress)
    : lerp(-0.3, -0.1, easedProgress)

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }} // alpha: true for transparency
      camera={{ position: [0, 1.35, isMobile ? 12 : 11], fov: isMobile ? 28 : 24 }}
    >
      {/* Removed background color for transparency */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 4]} intensity={2.5} castShadow />
      <pointLight position={[0, 2, 8]} intensity={1.5} />
      <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
      <Suspense fallback={<ModelLoader />}>
        <Model
          progress={progress}
          position={[modelPosX, modelPosY, 0]}
          rotation={[modelRotX, modelRotY, -0.3]}
          scale={modelScale}
        />
        <Environment preset="studio" resolution={128} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </Canvas>
  )
}

export default function FlowerEmbedSection() {
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)')
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)

    updateIsMobile()
    mediaQuery.addEventListener('change', updateIsMobile)

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile)
    }
  }, [])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // SECURITY: In production, uncomment the following lines and add your Webflow domain
      // if (event.origin !== 'https://your-webflow-domain.com') {
      //   return
      // }

      if (event.data?.type === 'WF_SCROLL') {
        const newProgress = Number(event.data.progress)
        if (!isNaN(newProgress)) {
          setProgress(Math.min(1, Math.max(0, newProgress)))
        }
      }
    }

    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className="h-screen w-full overflow-hidden bg-transparent">
      <FlowerScene progress={progress} isMobile={isMobile} />
    </div>
  )
}

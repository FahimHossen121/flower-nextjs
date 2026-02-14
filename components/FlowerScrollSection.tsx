'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
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
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.35, isMobile ? 12 : 11], fov: isMobile ? 28 : 24 }}
    >
      <color attach="background" args={['#e9e2dc']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
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

export default function FlowerScrollSection() {
  const sectionRef = useRef<HTMLElement>(null)
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
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const scrollStart = sectionTop
      const scrollEnd = sectionTop + sectionHeight - window.innerHeight
      const currentY = window.scrollY
      const scrollProgress =
        scrollEnd > scrollStart ? (currentY - scrollStart) / (scrollEnd - scrollStart) : 0

      setProgress(Math.min(1, Math.max(0, scrollProgress)))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[240vh] bg-[#e9e2dc] sm:min-h-[300vh]">
      <div className="sticky top-0 h-screen w-full">
        <FlowerScene progress={progress} isMobile={isMobile} />
        <div className="pointer-events-none absolute inset-x-0 top-[72%] z-10 -translate-y-1/2 px-4 text-center text-[#1e1347] sm:top-[68%] sm:px-8">
          <h1 className="text-[clamp(2.4rem,14vw,11.5rem)] font-semibold leading-none tracking-tight">
            CPC Empower
          </h1>
        </div>
      </div>
    </section>
  )
}

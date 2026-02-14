'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Model } from './flower'

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t
}

function FlowerScene({ progress }: { progress: number }) {
  const clampedProgress = Math.min(1, Math.max(0, progress))
  const easedProgress = 1 - (1 - clampedProgress) * (1 - clampedProgress)

  const modelScale = lerp(2.1, 3.35, easedProgress)
  const modelPosY = lerp(-2.5, -1.2, easedProgress)
  const modelPosX = lerp(0, 0.2, easedProgress)
  const modelRotX = lerp(0.1, 0.03, easedProgress)
  const modelRotY = lerp(-0.24, -0.08, easedProgress)

  return (
    <Canvas camera={{ position: [0, 1.35, 11], fov: 24 }}>
      <color attach="background" args={['#e9e2dc']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <Suspense fallback={null}>
        <Model
          progress={progress}
          position={[modelPosX, modelPosY, 0]}
          rotation={[modelRotX, modelRotY, 0.06]}
          scale={modelScale}
        />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </Canvas>
  )
}

export default function FlowerScrollSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

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
    <section ref={sectionRef} className="relative min-h-[300vh] bg-[#e9e2dc]">
      <div className="sticky top-0 h-screen w-full">
        <FlowerScene progress={progress} />
        <div className="pointer-events-none absolute inset-x-0 top-[64%] z-10 -translate-y-1/2 px-4 text-center text-[#1e1347] sm:px-8">
          <h1 className="text-[clamp(3.25rem,12.5vw,11.5rem)] font-semibold leading-none tracking-tight">
            CPC Empower
          </h1>
        </div>
      </div>
    </section>
  )
}

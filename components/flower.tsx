import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import {
  AnimationAction,
  AnimationMixer,
  Group,
  Mesh,
  MeshStandardMaterial,
} from 'three'
import { GLTF } from 'three-stdlib'

type FlowerGLTF = GLTF & {
  nodes: {
    Baked_Animation001: Mesh
    Baked_Animation001_1: Mesh
    Baked_Animation001_2: Mesh
    Baked_Animation001_3: Mesh
  }
  materials: {
    'Material_002.006': MeshStandardMaterial
    'Bud.007': MeshStandardMaterial
    'Material_001.006': MeshStandardMaterial
    'PEtal.003': MeshStandardMaterial
  }
}

type ModelProps = {
  progress?: number
} & React.ComponentProps<'group'>

export function Model({ progress = 0, ...props }: ModelProps) {
  const group = useRef<Group>(null)
  const mixerRef = useRef<AnimationMixer | null>(null)
  const actionRef = useRef<AnimationAction | null>(null)
  const { nodes, materials, animations } = useGLTF('/models/flower.glb') as unknown as FlowerGLTF

  useEffect(() => {
    const currentGroup = group.current
    if (!currentGroup || animations.length === 0) return

    const mixer = new AnimationMixer(currentGroup)
    const action = mixer.clipAction(animations[0], currentGroup)
    action.clampWhenFinished = false
    action.play()
    action.paused = true
    mixer.setTime(0)

    mixerRef.current = mixer
    actionRef.current = action

    return () => {
      action.stop()
      mixer.stopAllAction()
      mixer.uncacheRoot(currentGroup)
      actionRef.current = null
      mixerRef.current = null
    }
  }, [animations])

  useEffect(() => {
    const mixer = mixerRef.current
    const action = actionRef.current
    if (!mixer || !action) return

    const clampedProgress = Math.min(1, Math.max(0, progress))
    const duration = action.getClip().duration
    const scrubTime = duration * Math.min(0.9999, clampedProgress)
    action.time = scrubTime
    mixer.update(0)
  }, [progress])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Baked_Animation">
          <mesh
            name="Baked_Animation001"
            castShadow
            receiveShadow
            geometry={nodes.Baked_Animation001.geometry}
            material={materials['Material_002.006']}
            morphTargetDictionary={nodes.Baked_Animation001.morphTargetDictionary}
            morphTargetInfluences={nodes.Baked_Animation001.morphTargetInfluences}
          />
          <mesh
            name="Baked_Animation001_1"
            castShadow
            receiveShadow
            geometry={nodes.Baked_Animation001_1.geometry}
            material={materials['Bud.007']}
            morphTargetDictionary={nodes.Baked_Animation001_1.morphTargetDictionary}
            morphTargetInfluences={nodes.Baked_Animation001_1.morphTargetInfluences}
          />
          <mesh
            name="Baked_Animation001_2"
            castShadow
            receiveShadow
            geometry={nodes.Baked_Animation001_2.geometry}
            material={materials['Material_001.006']}
            morphTargetDictionary={nodes.Baked_Animation001_2.morphTargetDictionary}
            morphTargetInfluences={nodes.Baked_Animation001_2.morphTargetInfluences}
          />
          <mesh
            name="Baked_Animation001_3"
            castShadow
            receiveShadow
            geometry={nodes.Baked_Animation001_3.geometry}
            material={materials['PEtal.003']}
            morphTargetDictionary={nodes.Baked_Animation001_3.morphTargetDictionary}
            morphTargetInfluences={nodes.Baked_Animation001_3.morphTargetInfluences}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/flower.glb')

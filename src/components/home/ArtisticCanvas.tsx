import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

const FloatingCanvas = ({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.position.y += Math.sin(time + position[0]) * 0.001
    meshRef.current.rotation.z += Math.cos(time + position[1]) * 0.0005
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1.4, 0.02]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
    </mesh>
  )
}


export const ArtisticCanvas = ({ showFloatingCanvases = false }: { showFloatingCanvases?: boolean }) => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden h-screen w-full">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9333ea" />
        <pointLight position={[0, 5, 0]} intensity={1} color="#c026d3" />
        
        <group>
          <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1, 100, 100]} scale={1.2}>
              <MeshDistortMaterial
                color="#9333ea"
                distort={0.4}
                speed={2}
                roughness={0.1}
                metalness={0.8}
                envMapIntensity={0.5}
              />
            </Sphere>
          </Float>
          
          {showFloatingCanvases && (
            <>
              {/* Floating canvases mimicking hung art */}
              <FloatingCanvas position={[-3, 1, -2]} rotation={[0, 0.5, 0]} scale={[1.2, 1.2, 1]} />
              <FloatingCanvas position={[3, -1, -3]} rotation={[0, -0.4, 0.1]} scale={[1, 1, 1]} />
              <FloatingCanvas position={[-2, -2, -1]} rotation={[0, 0.2, -0.1]} scale={[0.8, 0.8, 1]} />
            </>
          )}
        </group>
        
        <fog attach="fog" args={['#0a0a0a', 2, 12]} />
      </Canvas>
      
      {/* Texture grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
    </div>
  )
}

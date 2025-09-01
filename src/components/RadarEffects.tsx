import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface RadarEffectsProps {
  signals: any[]
}

function ScanningEffect() {
  const scanRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (scanRef.current) {
      scanRef.current.rotation.y = state.clock.elapsedTime * 1.2
      const material = scanRef.current.material as THREE.Material
      if (material && 'opacity' in material) {
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      }
    }
  })

  return (
    <mesh ref={scanRef} position={[0, 0.01, 0]}>
      <ringGeometry args={[0, 4, 64, 1, 0, Math.PI / 3]} />
      <meshBasicMaterial 
        color="#10B981" 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function ThreatZones({ signals }: RadarEffectsProps) {
  return (
    <>
      {signals.filter(s => s.threat === 'CRITICAL' || s.threat === 'HIGH').map((signal) => {
        const angle = (signal.lng + 180) * (Math.PI / 180)
        const distance = Math.min(Math.abs(signal.lat) / 30 * 3, 3.8)
        const x = Math.cos(angle) * distance
        const z = Math.sin(angle) * distance
        
        return (
          <mesh key={`zone-${signal.id}`} position={[x, 0.005, z]}>
            <ringGeometry args={[0.3, signal.threat === 'CRITICAL' ? 1.2 : 0.8, 32]} />
            <meshBasicMaterial 
              color={signal.threat === 'CRITICAL' ? '#DC2626' : '#EF4444'}
              transparent 
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
    </>
  )
}

function RadarInterface() {
  return (
    <>
      {/* Radar status indicators */}
      <Html position={[4.5, 0.5, 0]} transform={false}>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
          <div className="text-green-400 text-sm font-mono">
            <div>STATUS: ACTIVE</div>
            <div>RANGE: 100km</div>
            <div>MODE: SURVEILLANCE</div>
          </div>
        </div>
      </Html>
      
      <Html position={[-4.5, 0.5, 0]} transform={false}>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
          <div className="text-blue-400 text-sm font-mono">
            <div>FREQ: 2.4-8.2 GHz</div>
            <div>ELINT: ENABLED</div>
            <div>JAMMING: DETECTED</div>
          </div>
        </div>
      </Html>
      
      <Html position={[0, 0.5, 4.5]} transform={false}>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30">
          <div className="text-yellow-400 text-sm font-mono">
            <div>TARGETS: {6}</div>
            <div>THREATS: 3</div>
            <div>UNKNOWN: 1</div>
          </div>
        </div>
      </Html>
    </>
  )
}

export default function RadarEffects({ signals }: RadarEffectsProps) {
  return (
    <group>
      <ScanningEffect />
      <ThreatZones signals={signals} />
      <RadarInterface />
    </group>
  )
}

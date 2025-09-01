import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Ring, Html } from '@react-three/drei'
import * as THREE from 'three'

// India coordinates for major cities and regions
const indiaRegions = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, type: 'capital' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'major' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, type: 'major' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, type: 'major' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, type: 'major' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, type: 'major' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, type: 'city' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, type: 'city' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, type: 'city' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, type: 'city' },
]

// Enhanced India border outline (simplified)
const indiaBorderPoints = [
  // Kashmir region
  [34.5, 74.5], [34.8, 76.0], [35.2, 77.5], [35.0, 78.5],
  // Northeast
  [34.0, 79.0], [32.5, 80.0], [30.0, 81.0], [28.0, 82.0],
  [27.0, 88.0], [26.5, 89.0], [25.0, 90.0], [24.0, 91.5],
  [23.5, 92.5], [22.0, 93.0], [21.0, 92.5],
  // Eastern coast
  [20.0, 90.0], [19.0, 85.0], [18.0, 84.0], [16.0, 82.0],
  [15.0, 80.5], [13.0, 80.0], [11.0, 79.5], [9.0, 78.5],
  [8.0, 77.5],
  // Southern tip
  [8.0, 77.0], [7.5, 76.5], [8.0, 76.0], [8.5, 77.0],
  // Western coast
  [9.0, 76.0], [10.0, 75.5], [12.0, 75.0], [14.0, 74.5],
  [16.0, 73.5], [18.0, 73.0], [20.0, 72.5], [22.0, 70.0],
  [23.5, 68.5], [24.0, 68.0],
  // Western border
  [25.0, 68.5], [26.0, 70.0], [28.0, 70.5], [30.0, 71.0],
  [32.0, 72.0], [33.0, 73.0], [34.0, 74.0], [34.5, 74.5]
]

function convertLatLngTo3D(lat: number, lng: number, radius = 2) {
  // Convert lat/lng to 3D coordinates for India-centric view
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng - 77) * (Math.PI / 180) // Center on India (77°E)
  
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  }
}

function IndiaBorder() {
  const points = useMemo(() => {
    return indiaBorderPoints.map(([lat, lng]) => {
      const pos = convertLatLngTo3D(lat, lng, 2.05)
      return new THREE.Vector3(pos.x, pos.y, pos.z)
    })
  }, [])

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#10B981" />
    </mesh>
  )
}

function IndiaRegionMarker({ region }: { region: any }) {
  const pos = convertLatLngTo3D(region.lat, region.lng, 2.1)
  
  const color = region.type === 'capital' ? '#FFD700' : 
                region.type === 'major' ? '#10B981' : '#60A5FA'
  
  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <Sphere args={[0.02]}>
        <meshBasicMaterial color={color} />
      </Sphere>
      <Html distanceFactor={8}>
        <div className="bg-black/80 text-white px-1 py-0.5 rounded text-xs whitespace-nowrap">
          {region.name}
        </div>
      </Html>
    </group>
  )
}

function SignalEmitter3D({ signal, onSignalClick }: any) {
  const emitterRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (emitterRef.current) {
      emitterRef.current.rotation.y += 0.01
      if (hovered) {
        emitterRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.1)
      } else {
        emitterRef.current.scale.setScalar(1)
      }
    }
  })

  const threatColors = {
    LOW: '#10B981',
    MEDIUM: '#F59E0B', 
    HIGH: '#EF4444',
    CRITICAL: '#DC2626'
  }

  const color = threatColors[signal.threat as keyof typeof threatColors]
  const pos = convertLatLngTo3D(signal.lat, signal.lng, 2.15)
  
  return (
    <group 
      ref={emitterRef}
      position={[pos.x, pos.y, pos.z]}
      onClick={() => onSignalClick(signal)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main emitter sphere */}
      <Sphere args={[0.05]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Pulse rings */}
      <Ring args={[0.08, 0.12, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </Ring>
      <Ring args={[0.15, 0.18, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </Ring>
      
      {/* Signal beam */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.02, 0.4, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      
      {/* Info label */}
      <Html distanceFactor={12}>
        <div className={`bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap border ${
          signal.threat === 'CRITICAL' ? 'border-red-500' :
          signal.threat === 'HIGH' ? 'border-orange-500' :
          signal.threat === 'MEDIUM' ? 'border-yellow-500' : 'border-green-500'
        }`}>
          <div className="font-semibold">{signal.type}</div>
          <div className="text-xs opacity-80">{signal.frequency}</div>
        </div>
      </Html>
    </group>
  )
}

function IndiaGlobe() {
  const globeRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={globeRef}>
      {/* Main sphere representing Earth */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#0f172a"
          transparent 
          opacity={0.7}
          wireframe={false}
        />
      </Sphere>
      
      {/* Grid lines */}
      <Sphere args={[2.02, 32, 16]}>
        <meshBasicMaterial 
          color="#1e293b"
          wireframe
          transparent 
          opacity={0.3}
        />
      </Sphere>
      
      {/* India region highlight */}
      <Sphere args={[2.01, 64, 64]}>
        <meshBasicMaterial 
          color="#10B981"
          transparent 
          opacity={0.05}
        />
      </Sphere>
    </group>
  )
}

interface India3DMapProps {
  signals: any[]
  onSignalClick: (signal: any) => void
}

export default function India3DMap({ signals, onSignalClick }: India3DMapProps) {
  return (
    <group>
      <IndiaGlobe />
      <IndiaBorder />
      
      {/* India regions */}
      {indiaRegions.map((region, index) => (
        <IndiaRegionMarker key={index} region={region} />
      ))}
      
      {/* Signal emitters */}
      {signals.map((signal) => (
        <SignalEmitter3D
          key={signal.id}
          signal={signal}
          onSignalClick={onSignalClick}
        />
      ))}
      
      {/* Ambient effects */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#3B82F6" />
    </group>
  )
}

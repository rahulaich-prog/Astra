import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Sphere, Ring, Html, Cylinder } from '@react-three/drei'
import RadarEffects from './RadarEffects'
import * as THREE from 'three'

interface RadarProps {
  signals: any[]
  onSignalClick: (signal: any) => void
}

function RadarSweep() {
  const sweepRef = useRef<THREE.Group>(null)
  const sweepLineRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.y = state.clock.elapsedTime * 0.8
    }
    
    if (sweepLineRef.current) {
      // Pulsing effect on the sweep line
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1
      sweepLineRef.current.scale.setScalar(scale)
    }
  })

  // Create sweep beam geometry
  const sweepGeometry = useMemo(() => {
    const points = []
    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * Math.PI * 0.3 // 30 degree sweep
      points.push(new THREE.Vector3(Math.cos(angle) * 4, 0, Math.sin(angle) * 4))
    }
    return points
  }, [])

  return (
    <group ref={sweepRef}>
      {/* Main sweep line */}
      <Line 
        points={[[0, 0, 0], [0, 0, 4]]} 
        color="#10B981" 
        lineWidth={4} 
        transparent 
        opacity={0.9} 
      />
      
      {/* Sweep beam area */}
      <Line 
        points={sweepGeometry} 
        color="#10B981" 
        lineWidth={2} 
        transparent 
        opacity={0.3} 
      />
      
      {/* Radar dish */}
      <mesh ref={sweepLineRef} position={[0, 0.1, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial 
          color="#10B981" 
          emissive="#10B981"
          emissiveIntensity={0.3}
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Radar beam */}
      <mesh position={[0, 0.5, 2]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 2, 8]} />
        <meshBasicMaterial 
          color="#10B981" 
          transparent 
          opacity={0.4} 
        />
      </mesh>
    </group>
  )
}

function EnhancedRadarGrid() {
  const rings = [1, 2, 3, 4]
  const spokes = 12
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (gridRef.current) {
      // Subtle pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02
      gridRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={gridRef}>
      {/* Radar rings with enhanced styling */}
      {rings.map((radius) => {
        const points = []
        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * Math.PI * 2
          points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
        }
        
        return (
          <group key={radius}>
            <Line 
              points={points} 
              color="#374151" 
              lineWidth={radius === rings[rings.length - 1] ? 3 : 1} 
              transparent 
              opacity={radius === rings[rings.length - 1] ? 0.6 : 0.3} 
            />
            
            {/* Range labels */}
            <Html position={[0, 0, radius]} transform={false}>
              <div className="bg-black/60 text-green-400 px-1 py-0.5 rounded text-xs font-mono">
                {radius * 25}km
              </div>
            </Html>
          </group>
        )
      })}
      
      {/* Enhanced radar spokes */}
      {Array.from({ length: spokes }, (_, i) => {
        const angle = (i / spokes) * Math.PI * 2
        const points = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.cos(angle) * 4, 0, Math.sin(angle) * 4)
        ]
        
        return (
          <group key={i}>
            <Line 
              points={points} 
              color="#374151" 
              lineWidth={i % 3 === 0 ? 2 : 1} 
              transparent 
              opacity={i % 3 === 0 ? 0.5 : 0.2} 
            />
            
            {/* Direction labels */}
            {i % 3 === 0 && (
              <Html position={[Math.cos(angle) * 4.3, 0.1, Math.sin(angle) * 4.3]} transform={false}>
                <div className="text-gray-400 text-xs font-mono">
                  {(angle * 180 / Math.PI).toFixed(0)}°
                </div>
              </Html>
            )}
          </group>
        )
      })}
      
      {/* Center radar station */}
      <group>
        <Sphere args={[0.08]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#10B981" 
            emissive="#10B981"
            emissiveIntensity={0.5}
          />
        </Sphere>
        
        {/* Central platform */}
        <Cylinder args={[0.15, 0.15, 0.05, 16]} position={[0, -0.025, 0]}>
          <meshStandardMaterial color="#1F2937" />
        </Cylinder>
      </group>
    </group>
  )
}

function EnhancedSignalBlip({ signal, position, onClick }: any) {
  const blipRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (blipRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3
      blipRef.current.children[0].scale.setScalar(scale)
      
      // Rotate the signal
      blipRef.current.rotation.y += 0.02
    }
  })

  const threatColors = {
    LOW: '#10B981',
    MEDIUM: '#F59E0B', 
    HIGH: '#EF4444',
    CRITICAL: '#DC2626'
  }

  const color = threatColors[signal.threat as keyof typeof threatColors] || '#10B981'

  return (
    <group ref={blipRef} position={position} onClick={() => onClick(signal)}>
      {/* Main signal blip */}
      <Sphere args={[0.08]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.6}
          transparent 
          opacity={0.9} 
        />
      </Sphere>
      
      {/* Pulse rings with different speeds */}
      <Ring args={[0.12, 0.15, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </Ring>
      <Ring args={[0.2, 0.25, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </Ring>
      <Ring args={[0.3, 0.35, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </Ring>
      
      {/* Signal beam going upward */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.06, 1, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      
      {/* Enhanced info label */}
      <Html position={[0, 0.8, 0]} transform={false}>
        <div className={`bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg border-2 shadow-lg ${
          signal.threat === 'CRITICAL' ? 'border-red-500 shadow-red-500/50' :
          signal.threat === 'HIGH' ? 'border-orange-500 shadow-orange-500/50' :
          signal.threat === 'MEDIUM' ? 'border-yellow-500 shadow-yellow-500/50' : 
          'border-green-500 shadow-green-500/50'
        }`}>
          <div className="font-bold text-sm">{signal.type}</div>
          <div className="text-xs opacity-80">{signal.frequency}</div>
          <div className={`text-xs font-bold ${
            signal.threat === 'CRITICAL' ? 'text-red-400' :
            signal.threat === 'HIGH' ? 'text-orange-400' :
            signal.threat === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {signal.threat}
          </div>
        </div>
      </Html>
    </group>
  )
}

export default function Radar3D({ signals, onSignalClick }: RadarProps) {
  return (
    <group>
      <EnhancedRadarGrid />
      <RadarSweep />
      <RadarEffects signals={signals} />
      
      {signals.map((signal) => {
        // Enhanced coordinate mapping for better radar display
        const angle = (signal.lng + 180) * (Math.PI / 180)
        const distance = Math.min(Math.abs(signal.lat) / 30 * 3, 3.8) // Limit to radar range
        const x = Math.cos(angle) * distance
        const z = Math.sin(angle) * distance
        
        return (
          <EnhancedSignalBlip
            key={signal.id}
            signal={signal}
            position={[x, 0.1, z]}
            onClick={onSignalClick}
          />
        )
      })}
      
      {/* Enhanced radar base with tech details */}
      <group>
        <Cylinder args={[4.2, 4.2, 0.05, 32]} position={[0, -0.025, 0]}>
          <meshStandardMaterial 
            color="#1F2937" 
            transparent 
            opacity={0.8}
            roughness={0.7}
          />
        </Cylinder>
        
        {/* Radar platform glow */}
        <Cylinder args={[4.5, 4.5, 0.02, 32]} position={[0, 0, 0]}>
          <meshBasicMaterial 
            color="#10B981" 
            transparent 
            opacity={0.1}
          />
        </Cylinder>
      </group>

      {/* Enhanced ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={1.2} color="#10B981" />
      <pointLight position={[3, 2, 3]} intensity={0.6} color="#3B82F6" />
      <spotLight 
        position={[0, 8, 0]} 
        target-position={[0, 0, 0]}
        intensity={0.8}
        color="#10B981"
        angle={Math.PI / 4}
        penumbra={0.3}
      />
    </group>
  )
}

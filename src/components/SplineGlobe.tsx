import Spline from '@splinetool/react-spline'
import { useState, useEffect } from 'react'

interface SplineGlobeProps {
  signals: any[]
  onSignalClick: (signal: any) => void
}

export default function SplineGlobe({ signals, onSignalClick }: SplineGlobeProps) {
  const [globeLoaded, setGlobeLoaded] = useState(false)

  useEffect(() => {
    // Give the Spline scene time to load
    const timer = setTimeout(() => setGlobeLoaded(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* Spline 3D Globe */}
      <Spline 
        scene="https://prod.spline.design/1dom7N8NRCn-ZjsU/scene.splinecode"
        className="w-full h-full"
        onLoad={() => setGlobeLoaded(true)}
      />
      
      {/* Signal indicators list */}
      <div className="absolute top-4 left-4 space-y-2 max-w-xs">
        {signals.slice(0, 4).map((signal, idx) => (
          <div 
            key={idx}
            onClick={() => onSignalClick(signal)}
            className={`bg-black/90 text-white px-3 py-2 rounded-lg border cursor-pointer hover:bg-black/80 transition-all ${
              signal.threat === 'CRITICAL' ? 'border-red-500' :
              signal.threat === 'HIGH' ? 'border-orange-500' :
              signal.threat === 'MEDIUM' ? 'border-yellow-500' : 'border-green-500'
            }`}
          >
            <div className="text-sm font-semibold">{signal.type}</div>
            <div className="text-xs opacity-80">{signal.frequency}</div>
            <div className="text-xs">{signal.location}</div>
          </div>
        ))}
      </div>
      
      {/* Global threat status */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-black/90 text-white p-4 rounded-lg border border-red-500">
          <div className="text-lg font-bold text-red-400">Global Threat Level</div>
          <div className="text-2xl font-bold">HIGH</div>
          <div className="text-sm opacity-80">{signals.length} Active Signals</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/90 text-white p-3 rounded-lg border border-white/20">
          <div className="text-sm font-semibold mb-2">Threat Levels</div>
          <div className="space-y-1">
            {[
              { level: 'CRITICAL', color: '#DC2626' },
              { level: 'HIGH', color: '#EF4444' },
              { level: 'MEDIUM', color: '#F59E0B' },
              { level: 'LOW', color: '#10B981' }
            ].map(({ level, color }) => (
              <div key={level} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs">{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {!globeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4 mx-auto"></div>
            <div>Loading Global Threat Map...</div>
          </div>
        </div>
      )}
    </div>
  )
}

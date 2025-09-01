import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { 
  ShieldExclamationIcon, 
  RadioIcon, 
  MapIcon, 
  ChartBarIcon,
  SignalIcon,
  EyeIcon,
  BoltIcon,
  GlobeAltIcon,
  CpuChipIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline'
import BlurryBlob from '@/components/animata/background/blurry-blob'
import SignalAnalysis from '@/components/SignalAnalysis'
import Radar3D from '@/components/Radar3D'
import India3DMap from '@/components/India3DMap'
import SplineGlobe from '@/components/SplineGlobe'
import { Toaster, toast } from 'react-hot-toast'

// Mock data for demonstration - India-specific coordinates
const mockSignals = [
  { id: 1, type: 'S-400 Radar', lat: 28.6139, lng: 77.2090, threat: 'HIGH', frequency: '5.6 GHz', strength: 85, location: 'Delhi, India' },
  { id: 2, type: 'Friendly Comms', lat: 19.0760, lng: 72.8777, threat: 'LOW', frequency: '2.4 GHz', strength: 60, location: 'Mumbai, India' },
  { id: 3, type: 'Unknown Drone', lat: 12.9716, lng: 77.5946, threat: 'MEDIUM', frequency: '900 MHz', strength: 72, location: 'Bangalore, India' },
  { id: 4, type: 'Electronic Jammer', lat: 22.5726, lng: 88.3639, threat: 'CRITICAL', frequency: '8.2 GHz', strength: 95, location: 'Kolkata, India' },
  { id: 5, type: 'Radar System', lat: 26.9124, lng: 75.7873, threat: 'HIGH', frequency: '3.2 GHz', strength: 78, location: 'Jaipur, India' },
  { id: 6, type: 'Comm Tower', lat: 17.3850, lng: 78.4867, threat: 'LOW', frequency: '1.8 GHz', strength: 45, location: 'Hyderabad, India' },
]

const threatColors = {
  LOW: '#10B981',
  MEDIUM: '#F59E0B', 
  HIGH: '#EF4444',
  CRITICAL: '#DC2626'
}

function App() {
  const [selectedSignal, setSelectedSignal] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  // Simulate scanning animation
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false)
            toast.success('Scan complete! 4 signals detected')
            return 0
          }
          return prev + 2
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isScanning])

  const handleSignalClick = (signal: any) => {
    setSelectedSignal(signal)
    toast(`Selected: ${signal.type}`, {
      icon: '📡',
      style: {
        background: '#1e293b',
        color: '#fff',
      }
    })
  }

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    toast.loading('Initiating SIGINT scan...', { duration: 1000 })
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <BlurryBlob 
          firstBlobColor="bg-blue-500/20" 
          secondBlobColor="bg-purple-500/20"
          className="opacity-30"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 bg-black/30 backdrop-blur-lg border-b border-white/10 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <RadioIcon className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ASTRĀ
              </h1>
              <p className="text-sm text-gray-400">Automated SIGINT Threat Recognition & Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={startScan}
              disabled={isScanning}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BoltIcon className="w-5 h-5" />
              <span>{isScanning ? 'Scanning...' : 'Initiate Scan'}</span>
            </motion.button>
            
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Scanning Progress */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-black/20 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Scanning electromagnetic spectrum...</span>
                <span className="text-sm font-mono">{scanProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-12 h-[calc(100vh-120px)]">
        
        {/* Left Sidebar - Controls */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="col-span-3 bg-black/30 backdrop-blur-lg border-r border-white/20 p-4"
        >
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: EyeIcon },
                { id: 'signals', label: 'Signals', icon: SignalIcon },
                { id: 'map', label: 'Geospatial', icon: MapIcon },
                { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                      : 'hover:bg-black/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Signal List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <ShieldExclamationIcon className="w-5 h-5 mr-2" />
                Active Signals
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mockSignals.map((signal) => (
                  <motion.div
                    key={signal.id}
                    onClick={() => handleSignalClick(signal)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all ${
                      selectedSignal?.id === signal.id
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-black/20 border-white/10 hover:bg-black/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{signal.type}</span>
                      <span 
                        className={`px-2 py-1 rounded text-xs font-bold`}
                        style={{ 
                          backgroundColor: threatColors[signal.threat as keyof typeof threatColors] + '20',
                          color: threatColors[signal.threat as keyof typeof threatColors]
                        }}
                      >
                        {signal.threat}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Freq: {signal.frequency}</div>
                      <div>Strength: {signal.strength}%</div>
                      <div>Location: {signal.lat.toFixed(4)}, {signal.lng.toFixed(4)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center - Dynamic Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-6 relative"
        >
          <div className="absolute inset-4 bg-black/30 backdrop-blur-sm rounded-xl border border-white/20">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="spline-globe"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <SplineGlobe signals={mockSignals} onSignalClick={handleSignalClick} />
                </motion.div>
              )}

              {activeTab === 'signals' && (
                <motion.div
                  key="signal-analysis"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="h-full"
                >
                  {selectedSignal ? (
                    <div className="p-6 overflow-y-auto h-full">
                      <SignalAnalysis signal={selectedSignal} />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <SignalIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg mb-2">No Signal Selected</p>
                        <p className="text-sm">Click on a signal from the sidebar to view detailed analysis</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'map' && (
                <motion.div
                  key="radar-view"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="h-full"
                >
                  <Canvas camera={{ position: [0, 8, 0], fov: 60 }}>
                    <ambientLight intensity={0.4} />
                    <pointLight position={[0, 10, 0]} intensity={0.8} />
                    <Radar3D signals={mockSignals} onSignalClick={handleSignalClick} />
                    <OrbitControls 
                      enableZoom={true} 
                      enablePan={true}
                      maxPolarAngle={Math.PI / 2}
                      minDistance={3}
                      maxDistance={15}
                    />
                  </Canvas>
                  
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <MapIcon className="w-5 h-5 text-green-400" />
                      <span className="font-semibold">Tactical Radar</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Real-time emitter tracking
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics-dashboard"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="h-full p-6 overflow-y-auto"
                >
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6">SIGINT Analytics Dashboard</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                        <CpuChipIcon className="w-8 h-8 text-blue-400 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">ML Processing</h3>
                        <div className="text-3xl font-bold text-blue-400">847</div>
                        <div className="text-sm text-gray-400">Signals processed/min</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                        <CommandLineIcon className="w-8 h-8 text-green-400 mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Detection Rate</h3>
                        <div className="text-3xl font-bold text-green-400">94.7%</div>
                        <div className="text-sm text-gray-400">Accuracy score</div>
                      </div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                      <h3 className="text-lg font-semibold mb-4">Threat Distribution</h3>
                      <div className="space-y-3">
                        {Object.entries(threatColors).map(([level, color]) => {
                          const count = mockSignals.filter(s => s.threat === level).length
                          const percentage = (count / mockSignals.length) * 100
                          
                          return (
                            <div key={level} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: color }}
                                ></div>
                                <span>{level}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${percentage}%`,
                                      backgroundColor: color 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-mono w-12 text-right">{count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Sidebar - Details */}
        <motion.div 
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          className="col-span-3 bg-black/30 backdrop-blur-lg border-l border-white/20 p-4"
        >
          <AnimatePresence mode="wait">
            {selectedSignal ? (
              <motion.div
                key="signal-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">{selectedSignal.type}</h3>
                  <div 
                    className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                    style={{ 
                      backgroundColor: threatColors[selectedSignal.threat as keyof typeof threatColors] + '20',
                      color: threatColors[selectedSignal.threat as keyof typeof threatColors]
                    }}
                  >
                    {selectedSignal.threat} THREAT
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-gray-400 mb-1">Frequency</div>
                    <div className="font-mono text-lg">{selectedSignal.frequency}</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-gray-400 mb-1">Signal Strength</div>
                    <div className="font-mono text-lg">{selectedSignal.strength}%</div>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold mb-3">Geolocation</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div>Lat: {selectedSignal.lat}</div>
                    <div>Lng: {selectedSignal.lng}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      Confidence: 94.7%
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold mb-3">ML Classification</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pattern Match</span>
                      <span className="text-green-400">98.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Anomaly Score</span>
                      <span className="text-yellow-400">12.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Threat Level</span>
                      <span style={{ color: threatColors[selectedSignal.threat as keyof typeof threatColors] }}>
                        {selectedSignal.threat}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 py-3 rounded-lg font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.error('Alert dispatched to command center!')}
                >
                  🚨 Dispatch Alert
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-400 py-12"
              >
                <RadioIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Select a signal emitter to view detailed analysis</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Status Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="relative z-10 bg-black/40 backdrop-blur-lg border-t border-white/20 p-3"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>ML Models: Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>SIGINT Collectors: 8 Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Last Update: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="font-mono text-xs text-gray-400">
            ASTRĀ v2.1.0 | Classification: UNCLASSIFIED
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default App

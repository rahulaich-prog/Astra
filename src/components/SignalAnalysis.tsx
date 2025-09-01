import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const signalData = [
  { time: '00:00', frequency: 5.6, amplitude: 85, threat: 0.8 },
  { time: '00:05', frequency: 5.62, amplitude: 87, threat: 0.85 },
  { time: '00:10', frequency: 5.58, amplitude: 82, threat: 0.75 },
  { time: '00:15', frequency: 5.64, amplitude: 90, threat: 0.92 },
  { time: '00:20', frequency: 5.61, amplitude: 88, threat: 0.88 },
  { time: '00:25', frequency: 5.59, amplitude: 86, threat: 0.82 },
]

const spectrumData = Array.from({ length: 100 }, (_, i) => ({
  frequency: i * 0.1,
  power: Math.random() * 100 + Math.sin(i * 0.1) * 20,
  threshold: 30,
}))

interface SignalAnalysisProps {
  signal: any
}

export default function SignalAnalysis({ signal }: SignalAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">Signal Analysis: {signal?.type}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frequency Analysis */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Frequency Pattern</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={signalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="frequency" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Threat Level Timeline */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Threat Assessment</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={signalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="threat" 
                  stroke="#EF4444" 
                  fill="#EF4444"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Spectrum Analysis */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/20 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Spectrum Waterfall</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={spectrumData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="frequency" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="power" 
                  stroke="#10B981" 
                  fill="url(#spectrumGradient)"
                  fillOpacity={0.6}
                />
                <Line 
                  type="monotone" 
                  dataKey="threshold" 
                  stroke="#F59E0B" 
                  strokeDasharray="5 5"
                />
                <defs>
                  <linearGradient id="spectrumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ML Model Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
            <h4 className="font-semibold mb-2">Classification Model</h4>
            <div className="text-2xl font-bold text-blue-400">98.2%</div>
            <div className="text-sm text-gray-400">Confidence</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
            <h4 className="font-semibold mb-2">Anomaly Detection</h4>
            <div className="text-2xl font-bold text-green-400">12.1%</div>
            <div className="text-sm text-gray-400">Anomaly Score</div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-4 border border-red-500/30">
            <h4 className="font-semibold mb-2">Geolocation</h4>
            <div className="text-2xl font-bold text-red-400">94.7%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

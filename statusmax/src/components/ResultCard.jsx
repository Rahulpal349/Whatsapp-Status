import { useEffect, useState } from 'react'
import { BarChart2, Download } from 'lucide-react'
import { formatBytes } from '../utils/videoUtils'

export default function ResultCard({ file, resultBlob, time, fps }) {
  const [downloadUrl, setDownloadUrl] = useState('')

  useEffect(() => {
    if (resultBlob) {
      const url = URL.createObjectURL(resultBlob)
      setDownloadUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [resultBlob])

  if (!resultBlob || !file) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 opacity-50">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-800">Optimization Results</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 py-4 text-center">Results will appear here when ready.</p>
      </div>
    )
  }

  const originalSize = file.size
  const optimizedSize = resultBlob.size
  const percentage = Math.round(((originalSize - optimizedSize) / originalSize) * 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 border-b border-gray-50 pb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#25D366]" />
          <span className="font-semibold text-gray-800">Optimization Results</span>
        </div>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium rounded-full px-3 py-1 truncate max-w-[120px]">
          {file.name}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
          ⚡ Processed in {time}s
        </span>
        <span className="bg-green-50 text-[#25D366] text-xs px-2 py-1 rounded-full font-medium border border-green-100">
          GPU Accelerated
        </span>
      </div>
    
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50/50 rounded-xl p-4 text-center border border-green-50">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Original</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-800 font-display">{formatBytes(originalSize)}</p>
        </div>
        <div className="bg-green-100/50 rounded-xl p-4 text-center border border-green-100">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Optimized</p>
          <p className="text-2xl lg:text-3xl font-bold text-[#25D366] font-display">{formatBytes(optimizedSize)}</p>
          <p className="text-xs font-bold text-white bg-[#25D366] rounded-full px-2 py-0.5 inline-block mt-2">-{percentage}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-[10px] sm:text-xs text-gray-400">Time</p>
          <p className="font-bold text-gray-800 text-sm sm:text-base">{time}s</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-[10px] sm:text-xs text-gray-400">Speed</p>
          <p className="font-bold text-[#25D366] text-sm sm:text-base">{fps} fps</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-[10px] sm:text-xs text-gray-400">Engine</p>
          <p className="font-bold text-blue-600 text-sm sm:text-base">WebCodecs</p>
        </div>
      </div>
    
      <a 
        href={downloadUrl} 
        download={`statusmax_${file.name.replace(/\.[^/.]+$/, "")}.mp4`} 
        className="bg-[#1a9e4f] text-white rounded-xl py-3.5 px-6 w-full font-semibold flex items-center justify-center gap-2 hover:bg-[#157a3c] transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] outline-none"
      >
        <Download className="w-4 h-4" />
        Download Video
      </a>
    </div>
  )
}
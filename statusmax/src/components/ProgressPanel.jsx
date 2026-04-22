import { Clapperboard, Film, CheckCircle, Loader2 } from 'lucide-react'

export default function ProgressPanel({ file, progress, status, stage, isProcessing, isDone }) {
  const STEPS = [
    { key: 'loading',   icon: '⚡', label: 'Initializing WebCodecs Engine' },
    { key: 'decoding',  icon: '🎬', label: 'Extracting video frames'       },
    { key: 'encoding',  icon: '🖥️', label: 'GPU encoding H.264 + AAC'      },
    { key: 'muxing',    icon: '📦', label: 'Packaging MP4 container'        },
    { key: 'done',      icon: '✅', label: 'Complete!'                      },
  ];

  if (!file) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 opacity-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-800">Processing Status</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 py-4 text-center">Upload a file to start processing.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-800">Processing Status</span>
        </div>
      </div>
    
      {/* Active Processing Step */}
      {isProcessing && !isDone && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#25D366]" />
              <span className="text-sm text-gray-700 font-medium line-clamp-1 truncate max-w-[200px]">{file.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-600">{progress}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 w-full overflow-hidden">
            <div className="bg-[#25D366] h-full rounded-full transition-all duration-300 ease-out" style={{width: `${progress}%`}}/>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-end gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin"/>
            {stage || 'Optimizing frames...'}
          </p>
        </div>
      )}
    
      {/* Completed File */}
      {isDone && (
        <div className="flex items-center justify-between py-2 bg-green-50/50 rounded-lg px-3 -mx-3 border border-green-100/50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#25D366]" />
            <span className="text-sm text-gray-700 font-medium line-clamp-1 truncate max-w-[200px]">{file.name}</span>
          </div>
          <span className="text-sm font-semibold text-[#25D366]">Done</span>
        </div>
      )}
    </div>
  )
}
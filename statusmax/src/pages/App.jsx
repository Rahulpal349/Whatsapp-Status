import { useState } from 'react'
import Navbar from '../components/Navbar'
import VideoUploader from '../components/VideoUploader'
import VideoSettings from '../components/VideoSettings'
import ProgressPanel from '../components/ProgressPanel'
import ResultCard from '../components/ResultCard'
import BrowserWarning from '../components/BrowserWarning'
import { useWebCodecs } from '../hooks/useWebCodecs'
import { useBrowserSupport } from '../hooks/useBrowserSupport'
import { Loader2, Zap } from 'lucide-react'

export default function App() {
  const { process, cancel, reset, progress, status, stage, time, fps } = useWebCodecs()
  const support = useBrowserSupport()
  
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [resultBlob, setResultBlob] = useState(null)
  
  const [settings, setSettings] = useState({
    resolution: '720',
    preset: 'balanced',
    stripMetadata: true
  })

  const handleFileSelect = (selectedFile) => {
    if (support && !support.supported) {
      alert("Browser does not support WebCodecs API");
      return;
    }
    setFile(selectedFile)
    setIsDone(false)
    setResultBlob(null)
    reset()
  }

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true)
    setIsDone(false)
    setResultBlob(null)

    try {
      const optimizedBlob = await process(file, settings)
      if (optimizedBlob) {
        setResultBlob(optimizedBlob)
        setIsDone(true)
      }
    } catch (error) {
      console.error("Error processing video:", error)
      alert("An error occurred during video optimization.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Page Header */}
      <div className="text-center py-6 md:py-10 px-4 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-2 md:mb-3 tracking-tight">Optimize your media.</h1>
        <p className="text-sm md:text-base text-gray-500 text-center max-w-2xl mx-auto mb-4 md:mb-0">
          Compress and enhance video files for faster delivery across platforms.
        </p>

        {/* Engine Status Indicator */}
        <div className="md:absolute static mt-2 md:mt-0 flex items-center justify-center md:justify-start w-fit mx-auto md:top-4 md:right-4 gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold">
           {support === null ? (
             <>
               <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
               <span className="text-gray-600">Checking Support...</span>
             </>
           ) : support.supported ? (
             <>
               <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
               <span className="text-gray-600">WebCodecs Engine Ready</span>
             </>
           ) : (
             <>
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               <span className="text-gray-600">Engine Unsupported</span>
             </>
           )}
        </div>
      </div>

      {/* Browser Warning */}
      {support && !support.supported && (
        <div className="max-w-6xl mx-auto px-4 mb-6 w-full">
          <BrowserWarning />
        </div>
      )}

      {/* Two Column Grid Layout */}
      <main className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full flex-grow">
        
        {/* LEFT COLUMN: Input */}
        <div className="flex flex-col gap-4">
          <VideoUploader onFileSelect={handleFileSelect} />
          {file && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 truncate">File: {file.name}</span>
            </div>
          )}
          <VideoSettings settings={settings} setSettings={setSettings} isProcessing={isProcessing} />
          
          <button
            onClick={handleProcess}
            disabled={!file || status === 'encoding'}
            className="w-full bg-[#25D366] hover:bg-[#1a9e4f] disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-base shadow-lg shadow-green-500/20 active:scale-[0.98] outline-none mt-2"
          >
            {status === 'encoding' || status === 'decoding' || status === 'loading' || status === 'muxing' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing... {progress}%
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                ⚡ Optimize for WhatsApp (GPU)
              </>
            )}
          </button>
          
          {isProcessing && (
            <button onClick={cancel} className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-3 rounded-xl transition-colors text-sm">
              Cancel Process
            </button>
          )}
        </div>

        {/* RIGHT COLUMN: Output Info */}
        <div className="flex flex-col gap-4">
          <ProgressPanel file={file} progress={progress} status={status} stage={stage} isProcessing={isProcessing} isDone={isDone} />
          <ResultCard file={file} resultBlob={resultBlob} time={time} fps={fps} />
        </div>

      </main>
      
      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-100 text-center mt-auto">
         <p className="text-gray-400 text-sm">© 2024 StatusMax. Optimistic Utility.</p>
      </footer>
    </div>
  )
}
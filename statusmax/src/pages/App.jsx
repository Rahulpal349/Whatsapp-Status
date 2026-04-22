import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import VideoUploader from '../components/VideoUploader'
import VideoSettings from '../components/VideoSettings'
import ProgressPanel from '../components/ProgressPanel'
import ResultCard from '../components/ResultCard'
import { useFFmpeg } from '../hooks/useFFmpeg'
import { Loader2 } from 'lucide-react'

export default function App() {
  const { load, process, progress, loaded } = useFFmpeg()
  
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [resultBlob, setResultBlob] = useState(null)
  
  const [settings, setSettings] = useState({
    resolution: '720',
    preset: 'balanced',
    stripMetadata: true
  })

  // Load FFmpeg WASM Core immediately on mount
  useEffect(() => {
    if (!loaded) {
      load().catch(e => console.error("Error launching FFmpeg Engine:", e))
    }
  }, [loaded, load])

  const handleFileSelect = async (selectedFile) => {
    if (!loaded) {
        alert("Please wait for the FFmpeg engine to boot up.")
        return
    }

    setFile(selectedFile)
    setIsProcessing(true)
    setIsDone(false)
    setResultBlob(null)

    try {
      const optimizedBlob = await process(selectedFile, settings)
      setResultBlob(optimizedBlob)
      setIsDone(true)
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
      <div className="text-center py-10 px-4 relative">
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-3 tracking-tight">Optimize your media.</h1>
        <p className="text-gray-500 text-center max-w-2xl mx-auto">
          Compress and enhance video files for faster delivery across platforms.
        </p>

        {/* Engine Status Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold">
           {!loaded ? (
             <>
               <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
               <span className="text-gray-600">Booting Engine...</span>
             </>
           ) : (
             <>
               <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
               <span className="text-gray-600">Engine Ready</span>
             </>
           )}
        </div>
      </div>

      {/* Two Column Grid Layout */}
      <main className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full flex-grow">
        
        {/* LEFT COLUMN: Input */}
        <div className="flex flex-col gap-4">
          <VideoUploader onFileSelect={handleFileSelect} />
          <VideoSettings settings={settings} setSettings={setSettings} isProcessing={isProcessing} />
        </div>

        {/* RIGHT COLUMN: Output Info */}
        <div className="flex flex-col gap-4">
          <ProgressPanel file={file} progress={progress} isProcessing={isProcessing} isDone={isDone} />
          <ResultCard file={file} resultBlob={resultBlob} />
        </div>

      </main>
      
      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-100 text-center mt-auto">
         <p className="text-gray-400 text-sm">© 2024 StatusMax. Optimistic Utility.</p>
      </footer>
    </div>
  )
}
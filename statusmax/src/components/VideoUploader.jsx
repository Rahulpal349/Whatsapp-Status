import { useRef } from 'react'
import { Upload } from 'lucide-react'

export default function VideoUploader({ onFileSelect }) {
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 sm:p-8 md:p-12 text-center hover:border-[#25D366] transition-colors cursor-pointer"
         onClick={() => inputRef.current?.click()} 
         onDragOver={(e) => e.preventDefault()} 
         onDrop={handleDrop}>
      
      <div className="bg-blue-50 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
        <Upload className="text-[#25D366] w-5 h-5 sm:w-7 sm:h-7" />
      </div>
    
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 font-display">
        Drag & Drop Video Files
      </h3>
      <p className="text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6">
        Supports MP4, MOV, WebM up to 2GB.<br className="hidden sm:block"/>
        Or click to browse your files.
      </p>
    
      <button className="border border-gray-300 rounded-lg px-4 sm:px-6 py-2 text-gray-700 hover:bg-gray-50 font-medium text-sm outline-none transition-colors">
        Select Files
      </button>
    
      <input type="file" accept="video/*" className="hidden" ref={inputRef} onChange={handleChange} />
    </div>
  )
}
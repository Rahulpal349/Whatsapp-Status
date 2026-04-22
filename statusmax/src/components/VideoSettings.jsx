import { useState } from 'react'
import { SlidersHorizontal, ChevronUp } from 'lucide-react'

export default function VideoSettings({ settings, setSettings, isProcessing }) {
  const [open, setOpen] = useState(true)

  const handleResChange = (e) => setSettings({...settings, resolution: e.target.value})
  const handlePresetChange = (e) => setSettings({...settings, preset: e.target.value})
  const toggleStrip = () => setSettings({...settings, stripMetadata: !settings.stripMetadata})

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <button className="w-full flex items-center justify-between outline-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#25D366]" />
          <span className="font-semibold text-gray-800">Advanced Settings</span>
        </div>
        <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${open ? '' : 'rotate-180'}`} />
      </button>
    
      {open && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-medium text-sm block mb-1.5">Target Resolution</label>
              <select 
                className="border border-gray-200 rounded-lg p-2.5 text-gray-700 bg-white w-full text-sm outline-none focus:border-[#25D366] disabled:opacity-50"
                value={settings.resolution}
                onChange={handleResChange}
                disabled={isProcessing}
              >
                <option value="original">Maintain Original</option>
                <option value="720">720×1280 (WhatsApp)</option>
                <option value="1080">1080×1920 (Full HD)</option>
              </select>
            </div>
            <div>
              <label className="text-gray-700 font-medium text-sm block mb-1.5">Compression Preset</label>
              <select 
                className="border border-gray-200 rounded-lg p-2.5 text-gray-700 bg-white w-full text-sm outline-none focus:border-[#25D366] disabled:opacity-50"
                value={settings.preset}
                onChange={handlePresetChange}
                disabled={isProcessing}
              >
                <option value="balanced">Balanced (Recommended)</option>
                <option value="quality">Maximum Quality</option>
                <option value="compression">Maximum Compression</option>
              </select>
            </div>
          </div>
    
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-medium text-sm">Strip Metadata</p>
              <p className="text-gray-400 text-xs">Remove EXIF and location data for privacy.</p>
            </div>
            <button 
              onClick={toggleStrip}
              disabled={isProcessing}
              className={`relative w-11 h-6 rounded-full transition-colors outline-none disabled:opacity-50 ${settings.stripMetadata ? 'bg-[#25D366]' : 'bg-gray-200'}`}
            >
              <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.stripMetadata ? 'translate-x-3' : '-translate-x-2'}`}/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
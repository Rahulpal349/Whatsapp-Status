import { AlertTriangle } from 'lucide-react';

export default function BrowserWarning() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="text-yellow-500 w-5 h-5 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold text-yellow-800 text-sm">
          Browser Not Supported
        </p>
        <p className="text-yellow-700 text-xs mt-1">
          WebCodecs API requires Chrome 94+ or Edge 94+. 
          Safari is not yet fully supported for hardware acceleration.
        </p>
        <a href="https://www.google.com/chrome" target="_blank" rel="noreferrer"
           className="text-[#25D366] text-xs font-medium mt-2 inline-block">
          Download Chrome →
        </a>
      </div>
    </div>
  );
}
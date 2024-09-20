// app/offline/page.tsx
import { Button } from "@/components/ui/buttonmsp";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <WifiOff size={64} className="text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold mb-2">You're offline</h1>
      <p className="text-gray-400 mb-4">
        Please check your internet connection and try again.
      </p>
      <Button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Try again
      </Button>
    </div>
  );
}

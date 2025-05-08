import ClientOnlyScene from "@/components/ClientOnlyScene"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        <header className="border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold text-white">3D Scene Generator</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel for controls */}
          <div className="w-64 border-r border-gray-800 p-4 text-white">
            <h2 className="font-medium mb-4">Scene Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Scene Type</label>
                <select className="w-full bg-gray-800 rounded p-2 text-sm">
                  <option>Abstract</option>
                  <option>Nature</option>
                  <option>Sci-Fi</option>
                  <option>Fantasy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Lighting</label>
                <select className="w-full bg-gray-800 rounded p-2 text-sm">
                  <option>Sunset</option>
                  <option>Studio</option>
                  <option>Night</option>
                  <option>Day</option>
                </select>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Generate Scene
              </button>
            </div>
          </div>

          {/* Right panel for 3D canvas */}
          <div className="flex-1 h-full">
            <ClientOnlyScene />
          </div>
        </div>
      </div>
    </div>
  )
}

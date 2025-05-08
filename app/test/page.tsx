export default async function TestPage() {
  // Check if environment variables are available
  const envVars = {
    kv: !!process.env.KV_URL,
    kvRestApi: !!process.env.KV_REST_API_URL,
    redis: !!process.env.REDIS_URL,
    blob: !!process.env.BLOB_READ_WRITE_TOKEN,
    openai: !!process.env.OPENAI_API_KEY,
    huggingface: !!process.env.HUGGINGFACE_API_KEY,
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Test</h1>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Available Environment Variables:</h2>
        <ul className="space-y-2">
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key} className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${value ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="font-mono">
                {key}: {value ? "Available" : "Not Available"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-gray-400">
        If all environment variables show as available, your configuration is correct.
      </p>
    </div>
  )
}

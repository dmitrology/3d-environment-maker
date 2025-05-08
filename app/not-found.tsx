import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="max-w-md w-full bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-6">The page you are looking for does not exist or has been moved.</p>
        <Link href="/">
          <Button className="bg-purple-600 hover:bg-purple-700">Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}

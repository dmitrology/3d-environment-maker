import { BriefGenerator } from "@/components/brief-generator"

export default function BriefGeneratorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        Visual Alchemy - Creative Brief & Scene Generator
      </h1>
      <BriefGenerator />
    </div>
  )
}

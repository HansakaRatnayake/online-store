import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Zap, Percent } from "lucide-react"

export default function DealsHero() {
  return (
    <section className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <Badge className="bg-yellow-400 text-black font-bold px-3 py-1">FLASH DEALS</Badge>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Mega Sale
            <span className="block text-yellow-400">Up to 70% OFF</span>
          </h1>

          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Limited time offers on your favorite products. Don't miss out on these incredible deals!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 bg-black/20 rounded-lg px-4 py-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Ends in: 2d 14h 32m</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 rounded-lg px-4 py-2">
              <Percent className="w-5 h-5" />
              <span className="font-semibold">Save up to $500</span>
            </div>
          </div>

          <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  )
}

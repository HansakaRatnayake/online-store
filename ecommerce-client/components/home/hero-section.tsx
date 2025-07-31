import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm opacity-90">Trusted by 50,000+ customers</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Discover Premium
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Products
                </span>
              </h1>
              <p className="text-xl opacity-90 max-w-lg">
                Shop the latest trends with confidence. Quality guaranteed, fast shipping, and exceptional customer
                service.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              {/*<Button*/}
              {/*  size="lg"*/}
              {/*  variant="outline"*/}
              {/*  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"*/}
              {/*  asChild*/}
              {/*>*/}
              {/*  <Link href="/deals">View Deals</Link>*/}
              {/*</Button>*/}
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm opacity-75">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm opacity-75">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-sm opacity-75">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/heoimage.jpg?height=600&width=500"
                alt="Premium Products"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

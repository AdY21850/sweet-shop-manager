import { Candy, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function AnimatedFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-pink-950 dark:via-purple-950 dark:to-pink-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute left-[10%] top-[20%] h-32 w-32 animate-float rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute right-[15%] top-[40%] h-40 w-40 animate-float-delayed rounded-full bg-purple-300/20 blur-3xl animation-delay-2000" />
        <div className="absolute bottom-[30%] left-[30%] h-36 w-36 animate-float rounded-full bg-pink-400/20 blur-3xl animation-delay-4000" />
      </div>

      {/* Floating candy icons */}
      <div className="absolute inset-0">
        <Candy className="absolute left-[5%] top-[15%] h-8 w-8 animate-bounce-slow text-pink-400/30" />
        <Candy className="absolute right-[10%] top-[25%] h-6 w-6 animate-bounce-slow text-purple-400/30 animation-delay-1000" />
        <Candy className="absolute bottom-[20%] left-[15%] h-10 w-10 animate-bounce-slow text-pink-500/30 animation-delay-2000" />
        <Candy className="absolute bottom-[40%] right-[20%] h-7 w-7 animate-bounce-slow text-purple-500/30 animation-delay-3000" />
      </div>

      <div className="container relative mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Candy className="h-8 w-8 text-pink-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Sweet Shop
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop destination for the finest and sweetest treats from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="transition-colors hover:text-pink-500 cursor-pointer">About Us</li>
              <li className="transition-colors hover:text-pink-500 cursor-pointer">Products</li>
              <li className="transition-colors hover:text-pink-500 cursor-pointer">Contact</li>
              <li className="transition-colors hover:text-pink-500 cursor-pointer">FAQs</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2 transition-colors hover:text-pink-500">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 transition-colors hover:text-pink-500">
                <Mail className="h-4 w-4" />
                <span>hello@sweetshop.com</span>
              </li>
              <li className="flex items-center gap-2 transition-colors hover:text-pink-500">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground">Subscribe to get special offers and updates!</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background/50" />
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-pink-200/50 pt-8 text-center text-sm text-muted-foreground dark:border-pink-800/50">
          <p>&copy; {new Date().getFullYear()} Sweet Shop. All rights reserved. Made with ❤️ for sweet lovers.</p>
        </div>
      </div>
    </footer>
  )
}

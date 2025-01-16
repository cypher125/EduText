import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">YabaTech EduText Hub</h3>
            <p className="text-gray-300 mb-4">Your trusted source for academic materials at Yaba College of Technology.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <Facebook />
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <Twitter />
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors">
                <Instagram />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-yellow-300 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-yellow-300 transition-colors">Browse Textbooks</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-yellow-300 transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-yellow-300 transition-colors">Support</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-yellow-300" />
                <span>Yaba, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-yellow-300" />
                <span>+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-yellow-300" />
                <span>support@yabatech-edutext.edu.ng</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Stay updated with our latest news and offers.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-yellow-300 text-purple-900 rounded-md hover:bg-yellow-400 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} YabaTech EduText Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


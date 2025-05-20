import { Link } from "wouter";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ShieldCheck,
  Factory,
  Truck,
  Store,
  User,
  GanttChart
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/images/indalo-logo.jpg" 
                alt="Indalo Solutions" 
                className="h-12 w-auto rounded-sm"
              />
              <h3 className="font-heading font-bold text-xl text-white">Indalo Solutions</h3>
            </div>
            <p className="mb-4">Blockchain-powered supply chain authentication for South Africa's premium alcohol industry. Founded in 2025 as a school project.</p>
            <p className="mb-4">
              <span className="text-secondary">Track Every Link, Trust Every Step</span>
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="hover:text-white transition">Products</a>
                </Link>
              </li>
              <li>
                <Link href="/verification">
                  <a className="hover:text-white transition">Verification</a>
                </Link>
              </li>
              <li>
                <Link href="/supply-chain">
                  <a className="hover:text-white transition">Supply Chain</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="hover:text-white transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <a className="hover:text-white transition">Sign In</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Dashboards */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-white mb-4">Dashboards</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/manufacturer">
                  <a className="hover:text-white transition flex items-center">
                    <Factory className="h-4 w-4 mr-2" />
                    <span>Manufacturer</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/distributor">
                  <a className="hover:text-white transition flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    <span>Distributor</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/retailer">
                  <a className="hover:text-white transition flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    <span>Retailer</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/consumer">
                  <a className="hover:text-white transition flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Consumer</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/verification">
                  <a className="hover:text-white transition flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    <span>Product Verification</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/supply-chain">
                  <a className="hover:text-white transition flex items-center">
                    <GanttChart className="h-4 w-4 mr-2" />
                    <span>Supply Chain Tracking</span>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span>6 Korea Road, Westdene, Johannesburg, South Africa</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span>+27 11 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span>info@indalosolutions.co.za</span>
              </li>
              <li className="mt-4 pt-4 border-t border-neutral-700">
                <p className="text-sm">
                  <strong className="text-white">Hours:</strong> Monday - Friday: 8:30 AM - 5:00 PM
                </p>
                <p className="text-sm mt-1">
                  <strong className="text-white">Founded:</strong> 2025
                </p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Indalo Solutions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-sm hover:text-white transition">Privacy Policy</a>
            <a href="/terms" className="text-sm hover:text-white transition">Terms of Service</a>
            <a href="/cookies" className="text-sm hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

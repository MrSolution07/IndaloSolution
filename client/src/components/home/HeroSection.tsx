import { Link } from "wouter";
import { dummyImages } from "@/lib/dummy-images";

const HeroSection = () => {
  return (
    <section className="relative bg-neutral-800 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={dummyImages.vineyard1} 
          alt="South African vineyard" 
          className="w-full h-full object-cover opacity-50" 
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl text-white">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight">
            Authentic South African Alcohol <span className="text-secondary">Verified on Blockchain</span>
          </h1>
          
          <p className="text-lg mb-8 text-neutral-100">
            Combating counterfeit alcohol with secure, transparent supply chain verification for suppliers, manufacturers, distributors, retailers, and consumers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/verification">
              <a className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
                Verify Product <i className="fas fa-qrcode ml-2"></i>
              </a>
            </Link>
            
            <Link href="/supply-chain">
              <a className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-md shadow-sm text-base font-medium text-white hover:bg-white hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition">
                How It Works <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

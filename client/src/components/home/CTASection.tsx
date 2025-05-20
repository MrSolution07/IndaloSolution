import { Link } from "wouter";
import { dummyImages } from "@/lib/dummy-images";

const CTASection = () => {
  return (
    <section className="py-16 bg-neutral-800 relative">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={dummyImages.vineyard2} 
          alt="South African wine region" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
            Join the Fight Against Counterfeit Alcohol
          </h2>
          
          <p className="text-neutral-300 text-lg mb-8">
            Our blockchain solution is transforming South Africa's alcohol industry by ensuring authenticity, transparency, and trust throughout the supply chain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <a className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md shadow transition">
                Get Started <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </Link>
            
            <a 
              href="mailto:info@indalosolutions.co.za?subject=Demo Request" 
              className="px-6 py-3 border border-white text-white hover:bg-white hover:text-neutral-800 font-medium rounded-md shadow transition"
            >
              Schedule a Demo <i className="fas fa-calendar-alt ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

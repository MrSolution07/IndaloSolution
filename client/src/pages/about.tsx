import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { dummyImages } from "@/lib/dummy-images";

const About = () => {
  // Update page title and meta description
  useEffect(() => {
    document.title = "About Us | Indalo Solutions";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn about Indalo Solutions and our blockchain technology for combating counterfeit alcohol in South Africa"
      );
    }
  }, []);
  
  return (
    <div className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="font-heading font-bold text-4xl text-neutral-800 mb-4">About Indalo Solutions</h1>
          <p className="text-neutral-600 max-w-3xl mx-auto text-lg">
            We're on a mission to combat counterfeit alcohol in South Africa through innovative blockchain technology.
          </p>
        </div>
        
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Our Story</h2>
            <p className="text-neutral-600 mb-4">
              Founded in 2021, Indalo Solutions was born from a desire to protect South African consumers from the dangers of counterfeit alcohol while supporting legitimate local producers.
            </p>
            <p className="text-neutral-600 mb-4">
              The name "Indalo" comes from Zulu, meaning "creation" or "nature," reflecting our commitment to preserving the authenticity and quality of South Africa's rich alcohol heritage.
            </p>
            <p className="text-neutral-600">
              Our team of blockchain specialists, supply chain experts, and industry veterans has developed a revolutionary platform that ensures transparency and trust from producer to consumer.
            </p>
          </div>
          <div>
            <img 
              src={dummyImages.vineyard3} 
              alt="South African vineyard" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
        
        {/* Our Mission Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-20">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Our Mission</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">
              We're dedicated to creating a transparent, secure supply chain for South Africa's alcohol industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-shield-alt text-primary text-xl"></i>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Protect Consumers</h3>
              <p className="text-neutral-600">
                Ensuring that every bottle of alcohol consumed is authentic, safe, and meets quality standards.
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-secondary-light/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-award text-secondary text-xl"></i>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Support Producers</h3>
              <p className="text-neutral-600">
                Helping legitimate South African alcohol producers protect their brands and increase consumer trust.
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-accent-light/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-balance-scale text-accent text-xl"></i>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Industry Transparency</h3>
              <p className="text-neutral-600">
                Creating a transparent supply chain that enables regulatory compliance and reduces fraud.
              </p>
            </Card>
          </div>
        </div>
        
        {/* Our Technology Section */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Our Technology</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">
              Our blockchain solution provides an immutable, transparent record of each product's journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src={dummyImages.bottle1} 
                alt="Blockchain verified bottle" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="font-heading font-semibold text-2xl mb-4">Blockchain Verification</h3>
              <p className="text-neutral-600 mb-4">
                Our platform uses a permissioned blockchain to create tamper-proof records of each product's origin, production, and distribution.
              </p>
              <p className="text-neutral-600 mb-4">
                Each product is assigned a unique identifier that is recorded on the blockchain, allowing for real-time verification at any point in the supply chain.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                    <i className="fas fa-check text-sm text-primary"></i>
                  </div>
                  <p className="text-neutral-600">Immutable records prevent tampering</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                    <i className="fas fa-check text-sm text-primary"></i>
                  </div>
                  <p className="text-neutral-600">QR codes enable instant verification</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                    <i className="fas fa-check text-sm text-primary"></i>
                  </div>
                  <p className="text-neutral-600">Progressive Web App works offline</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Our Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Our Team</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">
              Meet the experts behind Indalo Solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 overflow-hidden">
                <i className="fas fa-user text-neutral-400 text-4xl flex items-center justify-center h-full"></i>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-1">Thabo Ndlovu</h3>
              <p className="text-primary mb-2">CEO & Founder</p>
              <p className="text-neutral-600 text-sm">
                Former executive with 15 years in the South African wine industry, passionate about protecting local producers.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 overflow-hidden">
                <i className="fas fa-user text-neutral-400 text-4xl flex items-center justify-center h-full"></i>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-1">Lerato Khumalo</h3>
              <p className="text-primary mb-2">CTO</p>
              <p className="text-neutral-600 text-sm">
                Blockchain specialist with experience at leading tech companies, driven to apply distributed ledger technology to real-world problems.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 overflow-hidden">
                <i className="fas fa-user text-neutral-400 text-4xl flex items-center justify-center h-full"></i>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-1">Sarah van der Merwe</h3>
              <p className="text-primary mb-2">Head of Partnerships</p>
              <p className="text-neutral-600 text-sm">
                Supply chain expert building relationships with producers, distributors, and retailers across South Africa.
              </p>
            </Card>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="bg-primary/10 rounded-xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Get in Touch</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">
              Interested in learning more about our solutions? Contact us today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-map-marker-alt text-primary text-xl"></i>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Visit Us</h3>
              <p className="text-neutral-600">
                123 Innovation Drive<br />
                Cape Town, South Africa
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-envelope text-primary text-xl"></i>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-neutral-600">
                info@indalosolutions.co.za<br />
                support@indalosolutions.co.za
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-phone text-primary text-xl"></i>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-neutral-600">
                +27 21 123 4567<br />
                Mon-Fri, 9am-5pm SAST
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

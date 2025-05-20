import { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SupplyChainStep from "@/components/ui/SupplyChainStep";
import { dummyImages } from "@/lib/dummy-images";

const steps = [
  {
    title: "Producer Authentication",
    description: "Each batch is registered by the producer with timestamp, location, and quality data.",
    verifiedBy: "Blockchain Smart Contract",
    icon: "fas fa-wine-bottle",
    image: dummyImages.producer,
    align: "right"
  },
  {
    title: "Manufacturing & Bottling",
    description: "Product is processed, bottled, and each unit receives a unique QR code.",
    verifiedBy: "Manufacturer Blockchain Node",
    icon: "fas fa-industry",
    image: dummyImages.manufacturing,
    align: "left"
  },
  {
    title: "Distribution & Storage",
    description: "Products are tracked through distribution, including temperature and handling conditions.",
    verifiedBy: "IoT Sensors & Blockchain",
    icon: "fas fa-truck",
    image: dummyImages.distribution,
    align: "right"
  },
  {
    title: "Retail Authentication",
    description: "Retailers verify incoming shipments and update the blockchain with inventory data.",
    verifiedBy: "Retail Partner Network",
    icon: "fas fa-store",
    image: dummyImages.retail,
    align: "left"
  },
  {
    title: "Consumer Verification",
    description: "Consumers scan the QR code to verify authenticity and access product information.",
    verifiedBy: "Consumer Mobile App",
    icon: "fas fa-check-circle",
    image: dummyImages.consumer,
    align: "right"
  }
];

const SupplyChain = () => {
  // Update page title and meta description
  useEffect(() => {
    document.title = "Supply Chain | Indalo Solutions";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn how our blockchain technology tracks and verifies South African alcohol products throughout the supply chain"
      );
    }
  }, []);
  
  return (
    <div className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Supply Chain Tracking</h1>
          <p className="text-neutral-600 max-w-3xl">
            Our blockchain technology records every step of the supply chain, ensuring full transparency and authenticity from vineyard to glass.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="p-6 bg-white shadow-md">
            <CardContent className="pt-2">
              <h2 className="font-heading font-semibold text-2xl mb-6 text-center">Blockchain-Powered Transparency</h2>
              <p className="text-neutral-600 mb-8 text-center max-w-3xl mx-auto">
                Indalo Solutions uses distributed ledger technology to create an immutable record of each product's journey through the supply chain. This ensures authenticity and prevents counterfeiting.
              </p>
              
              {/* Supply Chain Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-neutral-300"></div>
                
                {/* Timeline steps */}
                <div className="space-y-12 relative">
                  {steps.map((step, index) => (
                    <SupplyChainStep
                      key={index}
                      title={step.title}
                      description={step.description}
                      verifiedBy={step.verifiedBy}
                      icon={step.icon}
                      image={step.image}
                      align={step.align}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-16">
          <h2 className="font-heading font-semibold text-2xl mb-6 text-center">Our Blockchain Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-lock text-primary text-xl"></i>
              </div>
              <h3 className="font-heading font-medium text-lg mb-2">Immutable Records</h3>
              <p className="text-neutral-600">
                Once data is recorded on the blockchain, it cannot be altered or deleted, ensuring the integrity of the supply chain information.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-secondary-light/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-network-wired text-secondary text-xl"></i>
              </div>
              <h3 className="font-heading font-medium text-lg mb-2">Decentralized Verification</h3>
              <p className="text-neutral-600">
                Multiple nodes verify each transaction, eliminating single points of failure and increasing the security of the system.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-accent-light/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-key text-accent text-xl"></i>
              </div>
              <h3 className="font-heading font-medium text-lg mb-2">Cryptographic Security</h3>
              <p className="text-neutral-600">
                Advanced cryptography ensures that each product has a unique, secure identifier that cannot be counterfeited.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="font-heading font-semibold text-2xl mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-medium text-lg mb-2">How do you ensure data accuracy?</h3>
              <p className="text-neutral-600">
                We use IoT sensors, multi-party verification, and physical-digital connections (like tamper-proof seals) to ensure data entered into the blockchain is accurate.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-medium text-lg mb-2">Can the system work offline?</h3>
              <p className="text-neutral-600">
                Yes, our PWA can verify products offline using cached blockchain data. When connectivity is restored, any new verification data is synchronized with the blockchain.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-medium text-lg mb-2">How do you prevent QR code duplication?</h3>
              <p className="text-neutral-600">
                Each QR code contains a cryptographic signature that cannot be duplicated. Our system also detects if the same code is scanned in multiple locations simultaneously.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-medium text-lg mb-2">Who can participate in the blockchain network?</h3>
              <p className="text-neutral-600">
                Our blockchain network includes verified producers, manufacturers, distributors, retailers, and regulatory bodies, each with appropriate access levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;

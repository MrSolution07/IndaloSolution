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

const SupplyChainSection = () => {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Track the Journey from Vineyard to Glass</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            Our blockchain technology records every step of the supply chain, ensuring full transparency and authenticity.
          </p>
        </div>
        
        {/* Supply Chain Timeline */}
        <div className="relative max-w-4xl mx-auto">
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
      </div>
    </section>
  );
};

export default SupplyChainSection;

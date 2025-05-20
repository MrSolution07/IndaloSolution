import FeatureCard from "@/components/ui/FeatureCard";

const features = [
  {
    icon: "fas fa-wine-bottle",
    title: "Product Origin",
    description: "Every bottle is registered at source with immutable blockchain authentication.",
    iconClass: "bg-primary-light/20 text-primary",
  },
  {
    icon: "fas fa-qrcode",
    title: "QR Verification",
    description: "Scan the unique QR code to instantly verify a product's authenticity.",
    iconClass: "bg-secondary-light/20 text-secondary",
  },
  {
    icon: "fas fa-route",
    title: "Supply Chain Tracking",
    description: "Monitor every touchpoint from production through distribution to retail.",
    iconClass: "bg-accent-light/20 text-accent",
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Offline Access",
    description: "Works anywhere with our progressive web app - even without internet access.",
    iconClass: "bg-primary-light/20 text-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">How Our Blockchain Solution Works</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            Our innovative blockchain technology ensures authenticity at every step of the supply chain, from vineyard to glass.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconClass={feature.iconClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

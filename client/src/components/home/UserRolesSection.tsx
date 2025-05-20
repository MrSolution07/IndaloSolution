import RoleCard from "@/components/ui/RoleCard";

const roles = [
  {
    icon: "fas fa-seedling",
    title: "For Suppliers",
    features: [
      "Register harvest batches with immutable records",
      "Track quality metrics and certifications",
      "Manage delivery to manufacturers"
    ],
    actionText: "Supplier Access",
    iconClass: "bg-primary-light/20 text-primary",
    linkClass: "text-primary hover:text-primary-dark",
    linkHref: "#suppliers"
  },
  {
    icon: "fas fa-industry",
    title: "For Manufacturers",
    features: [
      "Generate unique product identifiers",
      "Record production batches and bottling data",
      "Manage quality control and compliance"
    ],
    actionText: "Manufacturer Access",
    iconClass: "bg-secondary-light/20 text-secondary",
    linkClass: "text-secondary hover:text-secondary-dark",
    linkHref: "#manufacturers"
  },
  {
    icon: "fas fa-truck",
    title: "For Distributors",
    features: [
      "Track shipments and chain of custody",
      "Monitor storage conditions and handling",
      "Verify product authenticity during transfers"
    ],
    actionText: "Distributor Access",
    iconClass: "bg-accent-light/20 text-accent",
    linkClass: "text-accent hover:text-accent-dark",
    linkHref: "#distributors"
  },
  {
    icon: "fas fa-store",
    title: "For Retailers",
    features: [
      "Verify incoming inventory authenticity",
      "Access product stories for marketing",
      "Build customer trust with verification tools"
    ],
    actionText: "Retailer Access",
    iconClass: "bg-primary-light/20 text-primary",
    linkClass: "text-primary hover:text-primary-dark",
    linkHref: "#retailers"
  },
  {
    icon: "fas fa-user",
    title: "For Consumers",
    features: [
      "Verify product authenticity instantly",
      "Explore product origin and journey",
      "Access detailed product information"
    ],
    actionText: "Consumer Features",
    iconClass: "bg-secondary-light/20 text-secondary",
    linkClass: "text-secondary hover:text-secondary-dark",
    linkHref: "#consumers"
  },
  {
    icon: "fas fa-balance-scale",
    title: "For Regulators",
    features: [
      "Audit supply chain for compliance",
      "Track product recalls efficiently",
      "Access tamper-proof production records"
    ],
    actionText: "Regulatory Access",
    iconClass: "bg-accent-light/20 text-accent",
    linkClass: "text-accent hover:text-accent-dark",
    linkHref: "#regulators"
  }
];

const UserRolesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Solutions for Every Stakeholder</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">Our platform provides tailored functionality for each participant in the supply chain.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <RoleCard
              key={index}
              id={role.linkHref.substring(1)}
              icon={role.icon}
              title={role.title}
              features={role.features}
              actionText={role.actionText}
              iconClass={role.iconClass}
              linkClass={role.linkClass}
              linkHref={role.linkHref}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserRolesSection;

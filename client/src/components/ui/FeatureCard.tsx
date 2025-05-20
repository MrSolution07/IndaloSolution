interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  iconClass: string;
}

const FeatureCard = ({ icon, title, description, iconClass }: FeatureCardProps) => {
  return (
    <div className="bg-neutral-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className={`w-12 h-12 ${iconClass} rounded-full flex items-center justify-center mb-4`}>
        <i className={`${icon} text-xl`}></i>
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
};

export default FeatureCard;

interface RoleCardProps {
  id: string;
  icon: string;
  title: string;
  features: string[];
  actionText: string;
  iconClass: string;
  linkClass: string;
  linkHref: string;
}

const RoleCard = ({ 
  id,
  icon, 
  title, 
  features, 
  actionText, 
  iconClass, 
  linkClass, 
  linkHref 
}: RoleCardProps) => {
  return (
    <div id={id} className="bg-neutral-100 rounded-xl p-6 shadow-sm border border-neutral-200">
      <div className={`w-12 h-12 ${iconClass} rounded-full flex items-center justify-center mb-4`}>
        <i className={`${icon} text-xl`}></i>
      </div>
      <h3 className="font-heading font-semibold text-xl mb-2">{title}</h3>
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <i className={`fas fa-check ${iconClass.split(" ")[1]} mt-1 mr-2`}></i>
            <span className="text-neutral-600">{feature}</span>
          </li>
        ))}
      </ul>
      <a href={linkHref} className={`inline-flex items-center ${linkClass} font-medium`}>
        {actionText} <i className="fas fa-arrow-right ml-2"></i>
      </a>
    </div>
  );
};

export default RoleCard;

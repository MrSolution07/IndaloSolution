interface SupplyChainStepProps {
  title: string;
  description: string;
  verifiedBy: string;
  icon: string;
  image: string;
  align: 'left' | 'right';
}

const SupplyChainStep = ({ 
  title, 
  description, 
  verifiedBy, 
  icon, 
  image, 
  align 
}: SupplyChainStepProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center">
      {/* Left content - visible if align is right */}
      <div className={`md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0 ${align === 'left' ? 'md:order-1' : ''}`}>
        {align === 'right' ? (
          <>
            <h3 className="font-heading font-semibold text-xl mb-2">{title}</h3>
            <p className="text-neutral-600">{description}</p>
            <p className="text-sm text-neutral-500 mt-2">Verified by: {verifiedBy}</p>
          </>
        ) : (
          <img 
            src={image} 
            alt={title} 
            className="rounded-lg shadow-md w-full md:w-4/5 ml-auto"
            loading="lazy"
          />
        )}
      </div>
      
      {/* Middle icon */}
      <div className="z-10 flex items-center justify-center w-12 h-12 bg-primary rounded-full border-4 border-white text-white">
        <i className={icon}></i>
      </div>
      
      {/* Right content - visible if align is left */}
      <div className={`md:w-1/2 md:pl-12 ${align === 'left' ? 'md:order-3' : ''}`}>
        {align === 'left' ? (
          <>
            <h3 className="font-heading font-semibold text-xl mb-2">{title}</h3>
            <p className="text-neutral-600">{description}</p>
            <p className="text-sm text-neutral-500 mt-2">Verified by: {verifiedBy}</p>
          </>
        ) : (
          <img 
            src={image} 
            alt={title} 
            className="rounded-lg shadow-md w-full md:w-4/5 mt-6 md:mt-0"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};

export default SupplyChainStep;

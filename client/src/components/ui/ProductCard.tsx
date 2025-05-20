import { Link } from "wouter";

interface Product {
  id: string;
  name: string;
  category: string;
  year?: string;
  region?: string;
  details?: string;
  price: string;
  imageUrl: string;
  isVerified: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-neutral-200">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {product.isVerified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <i className="fas fa-check-circle mr-1"></i> Verified
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-medium text-neutral-800">{product.name}</h3>
          <span className="bg-secondary-light/20 text-secondary-dark text-xs px-2 py-1 rounded">{product.category}</span>
        </div>
        <p className="text-sm text-neutral-500 mb-3">
          {product.year && product.region 
            ? `${product.year} | ${product.region}`
            : product.details
          }
        </p>
        <div className="flex justify-between items-center">
          <span className="font-medium text-neutral-800">{product.price}</span>
          <Link href={`/products/${product.id}`}>
            <a className="text-primary hover:text-primary-dark">
              <i className="fas fa-info-circle"></i> Details
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

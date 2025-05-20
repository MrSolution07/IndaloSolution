import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ui/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
}

const ProductCategoriesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: Infinity,
  });
  
  // Fetch products with category filter
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', selectedCategory, page],
    staleTime: 60000, // 1 minute
  });
  
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };
  
  const loadMoreProducts = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Explore Authentic South African Products</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">Browse our database of over 500 verified South African alcohol products.</p>
        </div>
        
        {/* Category Filter Pills */}
        <div className="mb-10 relative">
          <div className="flex items-center overflow-x-auto scrollbar-hide pb-2 space-x-2">
            <button 
              className={`flex-shrink-0 px-4 py-2 rounded-full ${selectedCategory === null ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'} font-medium text-sm transition`}
              onClick={() => handleCategoryClick(null)}
            >
              All Products
            </button>
            
            {categoriesLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="flex-shrink-0 w-24 h-8 rounded-full" />
              ))
            ) : (
              categories?.map((category: Category) => (
                <button 
                  key={category.id}
                  className={`flex-shrink-0 px-4 py-2 rounded-full ${selectedCategory === category.id ? 'bg-primary text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'} font-medium text-sm transition`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 pointer-events-none fade-gradient"></div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsLoading ? (
            // Skeleton loading state
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            products?.map((product: any) => (
              <ProductCard 
                key={product.id}
                product={product}
              />
            ))
          )}
        </div>
        
        {products && products.length > 0 && (
          <div className="flex justify-center mt-10">
            <button 
              onClick={loadMoreProducts}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md shadow transition"
            >
              Load More Products <i className="fas fa-arrow-down ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCategoriesSection;

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from "@/components/ui/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  
  // Update page title and meta description
  useEffect(() => {
    document.title = "Products | Indalo Solutions";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Browse our database of authentic South African alcohol products verified by blockchain technology"
      );
    }
  }, []);
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Fetch products with filters
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', selectedCategory, searchTerm, page, sortBy],
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset page when searching
    setPage(1);
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  const loadMoreProducts = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-neutral-800 mb-4">Products</h1>
          <p className="text-neutral-600 max-w-3xl">Browse our database of over 500 authentic South African alcohol products, all verified on the blockchain.</p>
        </div>
        
        {/* Filters */}
        <div className="bg-neutral-100 p-6 rounded-lg mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-1">Search Products</label>
              <Input
                id="search"
                type="text"
                placeholder="Search by name, region, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-neutral-700 mb-1">Sort By</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
                  <SelectItem value="priceAsc">Price (Low to High)</SelectItem>
                  <SelectItem value="priceDesc">Price (High to Low)</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-4 flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
                <i className="fas fa-search mr-2"></i> Search
              </Button>
            </div>
          </form>
        </div>
        
        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(12).fill(0).map((_, i) => (
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
            ))}
          </div>
        ) : products?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <Button onClick={loadMoreProducts} className="bg-primary hover:bg-primary-dark text-white">
                Load More Products <i className="fas fa-arrow-down ml-2"></i>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl text-neutral-400 mb-4">
              <i className="fas fa-wine-bottle"></i>
            </div>
            <h3 className="text-xl font-medium text-neutral-700 mb-2">No products found</h3>
            <p className="text-neutral-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import VerificationSection from "@/components/home/VerificationSection";
import ProductCategoriesSection from "@/components/home/ProductCategoriesSection";
import SupplyChainSection from "@/components/home/SupplyChainSection";
import UserRolesSection from "@/components/home/UserRolesSection";
import CTASection from "@/components/home/CTASection";
import { useEffect } from "react";

const Home = () => {
  // Update page title and meta description
  useEffect(() => {
    document.title = "Indalo Solutions | Authentic South African Alcohol";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Indalo Solutions - Blockchain-based supply chain for authentic South African alcohol products"
      );
    }
  }, []);
  
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <VerificationSection />
      <ProductCategoriesSection />
      <SupplyChainSection />
      <UserRolesSection />
      <CTASection />
    </>
  );
};

export default Home;

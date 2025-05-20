import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import Verification from "@/pages/verification";
import SupplyChain from "@/pages/supply-chain";
import About from "@/pages/about";
import ProductDetails from "@/pages/product-details";
import Login from "@/pages/login";
import ManufacturerDashboard from "@/pages/manufacturer-dashboard";
import DistributorDashboard from "@/pages/distributor-dashboard";
import RetailerDashboard from "@/pages/retailer-dashboard";
import ConsumerDashboard from "@/pages/consumer-dashboard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OfflineNotification from "@/components/shared/OfflineNotification";
import { AlertProvider } from "@/hooks/use-alerts";
import { AuthProvider } from "@/hooks/use-auth";
import AlertsPanel from "@/components/shared/AlertsPanel";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/verification" component={Verification} />
      <Route path="/supply-chain" component={SupplyChain} />
      <Route path="/about" component={About} />
      <Route path="/products/:id" component={ProductDetails} />
      <Route path="/login" component={Login} />
      
      {/* Role-based dashboards with protected routes */}
      <ProtectedRoute 
        path="/dashboard/manufacturer" 
        component={ManufacturerDashboard} 
        requiredRoles={["manufacturer", "admin"]} 
      />
      <ProtectedRoute 
        path="/dashboard/distributor" 
        component={DistributorDashboard} 
        requiredRoles={["distributor", "admin"]} 
      />
      <ProtectedRoute 
        path="/dashboard/retailer" 
        component={RetailerDashboard} 
        requiredRoles={["retailer", "admin"]} 
      />
      <ProtectedRoute 
        path="/dashboard/consumer" 
        component={ConsumerDashboard} 
        requiredRoles={["consumer", "admin"]} 
      />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <TooltipProvider>
          <AuthProvider>
            <AlertProvider>
              <div className="flex flex-col min-h-screen bg-neutral-100 font-body text-neutral-700">
                <div className="sticky top-0 z-50">
                  <Header />
                </div>
                <main className="flex-grow">
                  <Router />
                </main>
                <Footer />
                <div className="fixed top-4 right-4 z-50">
                  <AlertsPanel />
                </div>
                <OfflineNotification />
                <Toaster />
              </div>
            </AlertProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

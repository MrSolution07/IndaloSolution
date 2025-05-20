import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVerificationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');
  
  // ===== Authentication =====
  
  // Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, we would set up a session here
      
      res.status(200).json({ 
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Logout
  app.post('/api/auth/logout', async (req: Request, res: Response) => {
    // In a real app, we would invalidate the session here
    res.status(200).json({ message: "Logout successful" });
  });
  
  // Get current user
  app.get('/api/user', async (req: Request, res: Response) => {
    // In a real app, we would check the session and return the user
    // For demo purposes, we'll return a 401 to simulate not being logged in
    res.status(401).json({ message: "Not authenticated" });
  });
  
  // ===== Categories =====
  
  // Get all categories
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Products =====
  
  // Get products with optional filtering
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const searchTerm = req.query.search as string | undefined;
      const sortBy = req.query.sortBy as string || 'name';
      
      const products = await storage.getProducts({
        category,
        page,
        limit,
        searchTerm,
        sortBy
      });
      
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get product by ID
  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Supply Chain =====
  
  // Get supply chain events for a product
  app.get('/api/supply-chain/:productId', async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const supplyChainEvents = await storage.getSupplyChainEvents(productId);
      
      res.status(200).json({
        productId,
        productName: product.name,
        steps: supplyChainEvents
      });
    } catch (error) {
      console.error("Error fetching supply chain events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Verification =====
  
  // Verify a product
  app.post('/api/verification', async (req: Request, res: Response) => {
    try {
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      
      // Clean the product ID (remove any non-alphanumeric characters except dash)
      const cleanId = productId.toString().replace(/[^a-zA-Z0-9-]/g, '');
      
      // Try to parse the ID as a number if it doesn't have INDALO- prefix
      let numericId: number | undefined;
      if (!cleanId.toUpperCase().startsWith('INDALO-')) {
        numericId = parseInt(cleanId);
        if (isNaN(numericId)) {
          return res.status(400).json({ message: "Invalid product ID format" });
        }
      } else {
        // Extract the numeric part after INDALO-
        const idParts = cleanId.split('-');
        if (idParts.length > 1) {
          numericId = parseInt(idParts[1]);
          if (isNaN(numericId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
          }
        }
      }
      
      if (!numericId) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(numericId);
      
      if (!product) {
        // Record failed verification
        await storage.recordVerification({
          productId: numericId,
          isValid: false,
          deviceInfo: req.headers['user-agent'] || undefined,
          ipAddress: req.ip,
        });
        
        return res.status(200).json({ 
          verified: false,
          message: "Product not found in blockchain registry"
        });
      }
      
      // Record successful verification
      await storage.recordVerification({
        productId: numericId,
        isValid: true,
        deviceInfo: req.headers['user-agent'] || undefined,
        ipAddress: req.ip,
      });
      
      // Get supply chain steps for the product
      const supplyChainEvents = await storage.getSupplyChainEvents(numericId);
      
      res.status(200).json({
        verified: true,
        product: {
          id: product.id,
          name: product.name,
          category: (await storage.getCategoryById(product.categoryId))?.name || 'Unknown',
          producer: product.producer,
          origin: product.region,
          verificationDate: new Date().toISOString(),
          supplyChainSteps: supplyChainEvents.map(event => ({
            stage: event.stage,
            date: event.date,
            location: event.location
          }))
        }
      });
    } catch (error) {
      console.error("Error verifying product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

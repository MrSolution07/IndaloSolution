import { 
  users, 
  User, 
  InsertUser, 
  Category, 
  InsertCategory, 
  Product, 
  InsertProduct, 
  SupplyChainEvent, 
  InsertSupplyChainEvent,
  Verification,
  InsertVerification,
} from "@shared/schema";
import { generateCategories } from "./data/categories";
import { generateProducts } from "./data/products";
import { generateSupplyChainEvents } from "./data/product-generators";

export interface ProductFilterOptions {
  category?: string;
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product methods
  getProducts(options?: ProductFilterOptions): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductByBlockchainId(blockchainId: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Supply Chain methods
  getSupplyChainEvents(productId: number): Promise<SupplyChainEvent[]>;
  createSupplyChainEvent(event: InsertSupplyChainEvent): Promise<SupplyChainEvent>;
  
  // Verification methods
  recordVerification(verification: Partial<InsertVerification>): Promise<Verification>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private supplyChainEvents: Map<number, SupplyChainEvent>;
  private verifications: Map<number, Verification>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private eventIdCounter: number;
  private verificationIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.supplyChainEvents = new Map();
    this.verifications = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.eventIdCounter = 1;
    this.verificationIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private async initializeData(): Promise<void> {
    // Create default admin user
    await this.createUser({
      username: "admin",
      password: "password123",
      email: "admin@indalosolutions.co.za",
      role: "admin",
      fullName: "Admin User",
      company: "Indalo Solutions",
    });
    
    // Generate categories
    const categories = generateCategories();
    for (const category of categories) {
      await this.createCategory(category);
    }
    
    // Generate products
    const products = generateProducts();
    for (const product of products) {
      const createdProduct = await this.createProduct(product);
      
      // Generate supply chain events for each product
      const events = generateSupplyChainEvents(createdProduct.id);
      for (const event of events) {
        await this.createSupplyChainEvent(event);
      }
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const now = new Date();
    const category: Category = { 
      ...insertCategory, 
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.categories.set(id, category);
    return category;
  }
  
  // Product methods
  async getProducts(options: ProductFilterOptions = {}): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    // Apply category filter if provided
    if (options.category) {
      // First try to find the category by ID
      let categoryId: number | undefined;
      try {
        categoryId = parseInt(options.category);
      } catch (e) {
        // Not a number, will search by name
      }
      
      if (!isNaN(categoryId!)) {
        products = products.filter(product => product.categoryId === categoryId);
      } else {
        // Try to find category by name
        const category = Array.from(this.categories.values()).find(
          category => category.name.toLowerCase() === options.category?.toLowerCase()
        );
        if (category) {
          products = products.filter(product => product.categoryId === category.id);
        }
      }
    }
    
    // Apply search filter if provided
    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.producer.toLowerCase().includes(term) ||
        product.region.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'nameDesc':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'priceAsc':
          products.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
            const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
            return priceA - priceB;
          });
          break;
        case 'priceDesc':
          products.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
            const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
            return priceB - priceA;
          });
          break;
        case 'newest':
          products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        default:
          products.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
    
    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return products.slice(startIndex, endIndex);
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductByBlockchainId(blockchainId: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.blockchainId === blockchainId
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    
    // Generate a blockchain ID if not provided
    let blockchainId = insertProduct.blockchainId;
    if (!blockchainId) {
      blockchainId = `INDALO-${id.toString().padStart(6, '0')}`;
    }
    
    const product: Product = { 
      ...insertProduct, 
      id,
      blockchainId,
      createdAt: now,
      updatedAt: now,
    };
    
    this.products.set(id, product);
    return product;
  }
  
  // Supply Chain methods
  async getSupplyChainEvents(productId: number): Promise<SupplyChainEvent[]> {
    return Array.from(this.supplyChainEvents.values())
      .filter(event => event.productId === productId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  async createSupplyChainEvent(insertEvent: InsertSupplyChainEvent): Promise<SupplyChainEvent> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const event: SupplyChainEvent = { 
      ...insertEvent, 
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.supplyChainEvents.set(id, event);
    return event;
  }
  
  // Verification methods
  async recordVerification(partialVerification: Partial<InsertVerification>): Promise<Verification> {
    const id = this.verificationIdCounter++;
    const now = new Date();
    
    // Ensure required fields are present
    if (partialVerification.productId === undefined) {
      throw new Error("Product ID is required for verification");
    }
    
    if (partialVerification.isValid === undefined) {
      throw new Error("Verification result (isValid) is required");
    }
    
    const verification: Verification = {
      id,
      productId: partialVerification.productId,
      userId: partialVerification.userId,
      timestamp: now,
      isValid: partialVerification.isValid,
      deviceInfo: partialVerification.deviceInfo,
      location: partialVerification.location,
      ipAddress: partialVerification.ipAddress,
      metadata: partialVerification.metadata,
    };
    
    this.verifications.set(id, verification);
    return verification;
  }
}

export const storage = new MemStorage();

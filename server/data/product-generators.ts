import { InsertSupplyChainEvent } from "@shared/schema";

// Real product images for authentic representation
export const dummyImages = {
  // Wine images
  wine: (isRed: boolean) => {
    // Different images for red and white wines
    if (isRed) {
      return "https://images.unsplash.com/photo-1560148218-1a83060f7b32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400";
    } else {
      return "https://images.unsplash.com/photo-1605989991728-128367b062a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400";
    }
  },
  // Whiskey brand images
  whiskey: (brand?: string) => {
    const whiskeyImages: Record<string, string> = {
      "Bain's": "https://images.unsplash.com/photo-1594553696192-68704fcfbb3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Three Ships": "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "James Sedgwick": "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Andy Watts": "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Jameson": "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "J&B": "https://images.unsplash.com/photo-1527281400683-1aefee6bca6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Johnnie Walker": "https://images.unsplash.com/photo-1647617436199-f1c77fc2f128?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Jack Daniel's": "https://images.unsplash.com/photo-1593701742275-c802c68f498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "default": "https://images.unsplash.com/photo-1516535794938-6063878f08cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
    };
    return whiskeyImages[brand || "default"] || whiskeyImages["default"];
  },
  // Brandy brand images
  brandy: (brand?: string) => {
    const brandyImages: Record<string, string> = {
      "KWV": "https://images.unsplash.com/photo-1609190738220-d1c9d40bfc21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Van Ryn's": "https://images.unsplash.com/photo-1659414377138-bb22b28d9a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Klipdrift": "https://images.unsplash.com/photo-1615478860641-a163abde9046?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Richelieu": "https://images.unsplash.com/photo-1674017387180-72249c216ede?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "default": "https://images.unsplash.com/photo-1557566431-34209d69d4f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
    };
    return brandyImages[brand || "default"] || brandyImages["default"];
  },
  // Cognac brand images
  cognac: (brand?: string) => {
    const cognacImages: Record<string, string> = {
      "Hennessy": "https://images.unsplash.com/photo-1605525982925-7120fab68331?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Rémy Martin": "https://images.unsplash.com/photo-1602166242292-537afc4cde47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Martell": "https://images.unsplash.com/photo-1588686723725-fd9597cb5030?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Courvoisier": "https://images.unsplash.com/photo-1553278549-0538884e4c0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Bisquit Dubouché": "https://images.unsplash.com/photo-1593255136145-f636d9e3b443?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "default": "https://images.unsplash.com/photo-1568644396922-5c3bfae12521?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
    };
    return cognacImages[brand || "default"] || cognacImages["default"];
  },
  // Gin brand images
  gin: (brand?: string) => {
    const ginImages: Record<string, string> = {
      "Inverroche": "https://images.unsplash.com/photo-1613412294342-88616a7bbdd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Clemengold": "https://images.unsplash.com/photo-1605270012917-bf357a2d3b81?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Cape Town Gin": "https://images.unsplash.com/photo-1616335921061-95baf97a5b37?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "A Mari": "https://images.unsplash.com/photo-1575844264771-892081089af0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "default": "https://images.unsplash.com/photo-1603034203013-d532350372c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
    };
    return ginImages[brand || "default"] || ginImages["default"];
  },
  // Vodka brand images
  vodka: (brand?: string) => {
    const vodkaImages: Record<string, string> = {
      "Vusa": "https://images.unsplash.com/photo-1545623703-583dd2364bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Cruz": "https://images.unsplash.com/photo-1608292530158-8bae0be9d4af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Absolut": "https://images.unsplash.com/photo-1599067942562-77bfc4a3620d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "Smirnoff": "https://images.unsplash.com/photo-1614313511387-1449e2ccc162?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
      "default": "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
    };
    return vodkaImages[brand || "default"] || vodkaImages["default"];
  },
  // Other alcoholic beverages
  rum: () => "https://images.unsplash.com/photo-1611694929507-13ca128a03f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
  liqueur: () => "https://images.unsplash.com/photo-1607622826382-95211567a590?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
  craftBeer: () => "https://images.unsplash.com/photo-1558642084-fd07fae5282e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
  cider: () => "https://images.unsplash.com/photo-1571950801737-b98bb0051431?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400",
  // Brand imagery for website sections
  producer: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  manufacturing: "https://images.unsplash.com/photo-1597758160291-15ee842dde3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  distribution: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  retail: "https://images.unsplash.com/photo-1543168256-4ae2229821f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  consumer: "https://images.unsplash.com/photo-1560841202-3add7a9a6514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  vineyard1: "https://images.unsplash.com/photo-1629994562522-8dcd6daff86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  vineyard2: "https://images.unsplash.com/photo-1580045970916-d0066589c28a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  vineyard3: "https://images.unsplash.com/photo-1571212493451-e33948b75718?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  bottle1: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  bottle2: "https://images.unsplash.com/photo-1561057160-ce83b1bd72a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
};

// Supply chain stages
const SUPPLY_CHAIN_STAGES = [
  {
    stage: "Harvesting/Sourcing",
    description: "Raw materials harvested or sourced from local suppliers",
    icon: "fas fa-seedling",
    verifiers: ["Farm Blockchain Node", "Producer Certification Authority", "Origin Verification System"]
  },
  {
    stage: "Production",
    description: "Raw materials processed into base product",
    icon: "fas fa-industry",
    verifiers: ["Production Facility Blockchain Node", "Quality Control System", "Master Distiller"]
  },
  {
    stage: "Aging/Fermentation",
    description: "Product aged or fermented to develop flavor profile",
    icon: "fas fa-hourglass-half",
    verifiers: ["Cellar Master", "Aging Verification System", "Temperature Monitoring Blockchain"]
  },
  {
    stage: "Bottling",
    description: "Product bottled and sealed with unique identifier",
    icon: "fas fa-wine-bottle",
    verifiers: ["Bottling Facility Blockchain Node", "Packaging Verification System", "Quality Assurance Team"]
  },
  {
    stage: "Distribution",
    description: "Product transported to distribution centers",
    icon: "fas fa-truck",
    verifiers: ["Logistics Blockchain Node", "Transport Verification System", "Supply Chain Manager"]
  },
  {
    stage: "Retail",
    description: "Product received and authenticated by retail partner",
    icon: "fas fa-store",
    verifiers: ["Retail Blockchain Node", "Inventory Management System", "Retail Authentication App"]
  }
];

// Locations for each stage
const LOCATIONS = {
  harvesting: ["Stellenbosch", "Franschhoek", "Paarl", "Robertson", "Swartland", "Constantia", "Elgin", "Durbanville"],
  production: ["Cape Town", "Stellenbosch", "Paarl", "Wellington", "Worcester", "Robertson"],
  aging: ["Stellenbosch", "Paarl", "Franschhoek", "Robertson", "Worcester"],
  bottling: ["Cape Town", "Stellenbosch", "Paarl", "Wellington"],
  distribution: ["Cape Town", "Johannesburg", "Durban", "Port Elizabeth", "Bloemfontein"],
  retail: ["Cape Town", "Johannesburg", "Pretoria", "Durban", "Port Elizabeth", "Bloemfontein", "East London", "Nelspruit"]
};

// Function to generate a random date within a range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate supply chain events for a product
export function generateSupplyChainEvents(productId: number): InsertSupplyChainEvent[] {
  const events: InsertSupplyChainEvent[] = [];
  
  // Generate events for each stage
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  
  // Start date for the first event
  let eventDate = randomDate(oneYearAgo, new Date(oneYearAgo.getTime() + 30 * 24 * 60 * 60 * 1000));
  
  // Generate events for each stage with appropriate date progression
  SUPPLY_CHAIN_STAGES.forEach((stage, index) => {
    const locationCategory = Object.keys(LOCATIONS)[index] as keyof typeof LOCATIONS;
    const locations = LOCATIONS[locationCategory];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const verifier = stage.verifiers[Math.floor(Math.random() * stage.verifiers.length)];
    
    // Generate a blockchain reference
    const blockchainRef = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Create the event
    const event: InsertSupplyChainEvent = {
      productId,
      stage: stage.stage,
      description: stage.description,
      date: new Date(eventDate),
      location,
      verifiedBy: verifier,
      blockchainRef,
      icon: stage.icon,
      metadata: {
        temperature: Math.floor(Math.random() * 10) + 15,
        humidity: Math.floor(Math.random() * 30) + 50,
        batchNumber: `BATCH-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
        verified: true
      }
    };
    
    events.push(event);
    
    // Add 15-45 days to the date for the next event
    eventDate = new Date(eventDate.getTime() + (Math.floor(Math.random() * 30) + 15) * 24 * 60 * 60 * 1000);
  });
  
  return events;
}

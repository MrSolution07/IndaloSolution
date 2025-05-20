import { InsertProduct } from "@shared/schema";
import { dummyImages } from "./product-generators";

// Define some constants for generating products
const WINE_REGIONS = [
  "Stellenbosch", "Franschhoek", "Constantia", "Robertson", "Paarl",
  "Hemel-en-Aarde Valley", "Swartland", "Elgin", "Durbanville", "Walker Bay"
];

const GRAPE_VARIETIES = [
  "Cabernet Sauvignon", "Shiraz", "Pinotage", "Merlot", "Chardonnay",
  "Sauvignon Blanc", "Chenin Blanc", "Pinot Noir", "Cinsault", "Viognier"
];

const WINE_PRODUCERS = [
  "Kanonkop", "Meerlust", "Rustenberg", "Vergelegen", "Boschendal",
  "Klein Constantia", "Boekenhoutskloof", "Hamilton Russell", "Warwick", "Delaire Graff"
];

const WHISKEY_PRODUCERS = [
  "Bain's Cape Mountain", "Three Ships", "James Sedgwick Distillery", "Andy Watts", "First Cape",
  "Wellington Distillery", "Drayman's", "Woodstock Gin Co", "Jorgensen's", "Cape Mountain"
];

const GIN_PRODUCERS = [
  "Inverroche", "Clemengold", "Musgrave", "Six Dogs", "Hope on Hopkins",
  "Cruxland", "Geometric", "Woodstock Gin Co", "A Mari", "Cape Town Gin"
];

const BRANDY_PRODUCERS = [
  "KWV", "Van Ryn's", "Oude Meester", "Klipdrift", "Richelieu",
  "Collison's", "Sydney Back", "Backsberg", "Boplaas", "Joseph Barry"
];

const VODKA_PRODUCERS = [
  "Vusa", "Mhoba", "Karafu", "Duma", "Red Heart",
  "Stretton's", "Smirnoff SA", "Cruz", "Red Cane", "Sovereign"
];

// Function to generate wine products
function generateWineProducts(categoryId: number, count: number): InsertProduct[] {
  const wines: InsertProduct[] = [];
  
  for (let i = 0; i < count; i++) {
    const producer = WINE_PRODUCERS[Math.floor(Math.random() * WINE_PRODUCERS.length)];
    const region = WINE_REGIONS[Math.floor(Math.random() * WINE_REGIONS.length)];
    const variety = GRAPE_VARIETIES[Math.floor(Math.random() * GRAPE_VARIETIES.length)];
    const randomYear = Math.floor(Math.random() * (2023 - 2010)) + 2010;
    const randomPrice = Math.floor(Math.random() * (750 - 120)) + 120;
    const alcoholContent = (Math.random() * (15 - 11) + 11).toFixed(1);
    
    const isRed = ["Cabernet Sauvignon", "Shiraz", "Pinotage", "Merlot", "Pinot Noir", "Cinsault"].includes(variety);
    const wineType = isRed ? "Red" : "White";
    
    const wine: InsertProduct = {
      name: `${producer} ${variety} ${randomYear}`,
      description: `A premium ${wineType.toLowerCase()} wine from the ${region} region. This ${variety} showcases the unique terroir of South Africa's premier wine growing area.`,
      categoryId,
      producer,
      region,
      year: randomYear.toString(),
      alcohol: alcoholContent,
      volume: "750ml",
      price: `R${randomPrice.toFixed(2)}`,
      imageUrl: dummyImages.wine(isRed),
      isVerified: true,
      tastingNotes: generateTastingNotes(variety, isRed),
      pairings: generateFoodPairings(variety, isRed),
      producerInfo: `${producer} is one of South Africa's premier wine estates, located in the ${region} region. Established with a commitment to quality and tradition, the estate has earned numerous awards for its exceptional wines.`,
      awards: generateAwards(),
      certifications: ["South African Wine Industry Certified", "Fair Trade Certified"],
      sustainabilityInfo: "Produced using sustainable farming practices with a focus on reducing environmental impact."
    };
    
    wines.push(wine);
  }
  
  return wines;
}

// Function to generate whiskey products
function generateWhiskeyProducts(categoryId: number, count: number): InsertProduct[] {
  const whiskeys: InsertProduct[] = [];
  
  const types = ["Single Malt", "Blended", "Single Grain", "Bourbon-style", "Rye-style"];
  const ages = ["3 Year Old", "5 Year Old", "10 Year Old", "12 Year Old", "15 Year Old", "18 Year Old", ""];
  
  for (let i = 0; i < count; i++) {
    const producer = WHISKEY_PRODUCERS[Math.floor(Math.random() * WHISKEY_PRODUCERS.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const age = ages[Math.floor(Math.random() * ages.length)];
    const region = "South Africa";
    const randomPrice = Math.floor(Math.random() * (1200 - 350)) + 350;
    const alcoholContent = (Math.random() * (46 - 40) + 40).toFixed(1);
    
    const name = age ? `${producer} ${age} ${type}` : `${producer} ${type}`;
    
    const whiskey: InsertProduct = {
      name,
      description: `A premium ${type.toLowerCase()} whiskey from ${producer}. ${age ? `Aged for ${age.split(' ')[0]} years` : 'Carefully crafted'} to bring out the rich flavors and smooth finish that South African whiskeys are becoming known for.`,
      categoryId,
      producer,
      region,
      alcohol: alcoholContent,
      volume: "750ml",
      price: `R${randomPrice.toFixed(2)}`,
      imageUrl: dummyImages.whiskey(),
      isVerified: true,
      tastingNotes: generateWhiskeyTastingNotes(type),
      pairings: "Pairs well with rich chocolates, dried fruits, and strong cheeses. Can be enjoyed neat, on the rocks, or with a splash of water to open up the flavors.",
      producerInfo: `${producer} is at the forefront of South Africa's emerging whiskey industry, combining traditional methods with innovative approaches to whiskey making.`,
      awards: generateAwards(),
      certifications: ["South African Spirits Association Certified", "International Spirits Challenge Award"],
      sustainabilityInfo: "Produced with locally sourced grains and pure South African water. The distillery is committed to reducing its carbon footprint through energy-efficient production methods."
    };
    
    whiskeys.push(whiskey);
  }
  
  return whiskeys;
}

// Function to generate brandy products
function generateBrandyProducts(categoryId: number, count: number): InsertProduct[] {
  const brandies: InsertProduct[] = [];
  
  const types = ["Potstill", "Vintage", "Estate", "XO", "VSOP", "Reserve"];
  const ages = ["3 Year Old", "5 Year Old", "10 Year Old", "15 Year Old", "20 Year Old", ""];
  
  for (let i = 0; i < count; i++) {
    const producer = BRANDY_PRODUCERS[Math.floor(Math.random() * BRANDY_PRODUCERS.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const age = ages[Math.floor(Math.random() * ages.length)];
    const region = "South Africa";
    const randomPrice = Math.floor(Math.random() * (900 - 250)) + 250;
    const alcoholContent = (Math.random() * (40 - 36) + 36).toFixed(1);
    
    const name = age ? `${producer} ${age} ${type} Brandy` : `${producer} ${type} Brandy`;
    
    const brandy: InsertProduct = {
      name,
      description: `A premium ${type.toLowerCase()} brandy from ${producer}. ${age ? `Aged for ${age.split(' ')[0]} years` : 'Carefully crafted'} in oak barrels, this brandy showcases the exceptional quality of South African distillation.`,
      categoryId,
      producer,
      region,
      alcohol: alcoholContent,
      volume: "750ml",
      price: `R${randomPrice.toFixed(2)}`,
      imageUrl: dummyImages.brandy(),
      isVerified: true,
      tastingNotes: generateBrandyTastingNotes(),
      pairings: "Excellent as a digestif after a meal. Pairs well with dark chocolate, dried fruits, and rich desserts. Can be enjoyed neat or as a base for classic cocktails.",
      producerInfo: `${producer} has a long history of producing award-winning brandies, continuing South Africa's proud tradition of brandy production that dates back centuries.`,
      awards: generateAwards(),
      certifications: ["South African Brandy Foundation Certified", "International Wine & Spirit Competition Gold"],
      sustainabilityInfo: "Produced using grapes from sustainable vineyards. The distillery implements water conservation practices and renewable energy sources in its production process."
    };
    
    brandies.push(brandy);
  }
  
  return brandies;
}

// Function to generate gin products
function generateGinProducts(categoryId: number, count: number): InsertProduct[] {
  const gins: InsertProduct[] = [];
  
  const types = ["London Dry", "Fynbos", "Botanical", "Floral", "Citrus", "Navy Strength", "Flavored"];
  const botanicals = ["fynbos", "rooibos", "buchu", "citrus", "juniper", "rose", "cucumber", "baobab", "marula"];
  
  for (let i = 0; i < count; i++) {
    const producer = GIN_PRODUCERS[Math.floor(Math.random() * GIN_PRODUCERS.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const botanical = botanicals[Math.floor(Math.random() * botanicals.length)];
    const region = "South Africa";
    const randomPrice = Math.floor(Math.random() * (550 - 250)) + 250;
    const alcoholContent = (Math.random() * (50 - 40) + 40).toFixed(1);
    
    const name = `${producer} ${botanical.charAt(0).toUpperCase() + botanical.slice(1)} ${type} Gin`;
    
    const gin: InsertProduct = {
      name,
      description: `A premium ${type.toLowerCase()} gin infused with local ${botanical} botanicals. This distinctively South African gin captures the essence of the region's unique flora.`,
      categoryId,
      producer,
      region,
      alcohol: alcoholContent,
      volume: "750ml",
      price: `R${randomPrice.toFixed(2)}`,
      imageUrl: dummyImages.gin(),
      isVerified: true,
      tastingNotes: `Aromatic notes of ${botanical} with classic juniper backbone. ${type === 'Citrus' ? 'Bright citrus undertones' : type === 'Floral' ? 'Delicate floral notes' : 'Complex botanical profile'} with a smooth, lingering finish.`,
      pairings: "Perfect for a classic G&T with premium tonic water and a garnish of local citrus or botanicals. Also excellent in craft cocktails or enjoyed neat by gin connoisseurs.",
      producerInfo: `${producer} is part of South Africa's booming craft gin movement, creating unique spirits that showcase the country's incredible botanical diversity.`,
      awards: generateAwards(),
      certifications: ["Craft Gin Club Selection", "South African Craft Distillers Association"],
      sustainabilityInfo: "Botanicals are sustainably wildcrafted or grown. The distillery practices water recycling and uses recycled packaging materials."
    };
    
    gins.push(gin);
  }
  
  return gins;
}

// Function to generate vodka products
function generateVodkaProducts(categoryId: number, count: number): InsertProduct[] {
  const vodkas: InsertProduct[] = [];
  
  const types = ["Pure", "Premium", "Craft", "Flavored", "Grain", "Potato", "Filtered"];
  const flavors = ["Classic", "Citrus", "Berry", "Vanilla", "Chili", "Rooibos", "Baobab", "Marula"];
  
  for (let i = 0; i < count; i++) {
    const producer = VODKA_PRODUCERS[Math.floor(Math.random() * VODKA_PRODUCERS.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const flavor = flavors[Math.floor(Math.random() * flavors.length)];
    const region = "South Africa";
    const randomPrice = Math.floor(Math.random() * (450 - 180)) + 180;
    const alcoholContent = (Math.random() * (45 - 37.5) + 37.5).toFixed(1);
    
    let name = `${producer} ${type} Vodka`;
    if (type === "Flavored") {
      name = `${producer} ${flavor} Vodka`;
    }
    
    const vodka: InsertProduct = {
      name,
      description: `A premium ${type.toLowerCase()} vodka from ${producer}. ${type === "Flavored" ? `Infused with natural ${flavor.toLowerCase()} flavors` : 'Distilled multiple times'} for exceptional smoothness and purity.`,
      categoryId,
      producer,
      region,
      alcohol: alcoholContent,
      volume: "750ml",
      price: `R${randomPrice.toFixed(2)}`,
      imageUrl: dummyImages.vodka(),
      isVerified: true,
      tastingNotes: generateVodkaTastingNotes(type, flavor),
      pairings: "Perfect for classic vodka cocktails or served ice-cold as a traditional shot. Pairs well with caviar, smoked fish, or fresh seafood.",
      producerInfo: `${producer} produces premium vodka using the purest South African water and locally sourced ingredients, resulting in a distinctively smooth spirit.`,
      awards: generateAwards(),
      certifications: ["International Spirits Award", "South African Distillery Certification"],
      sustainabilityInfo: "Produced with energy-efficient distillation processes and sustainable water usage practices."
    };
    
    vodkas.push(vodka);
  }
  
  return vodkas;
}

// Function to generate cognac products
function generateCognacProducts(categoryId: number, count: number): InsertProduct[] {
  const cognacs: InsertProduct[] = [];
  
  const producers = [
    "Hennessy", "Rémy Martin", "Martell", "Courvoisier", "Bisquit Dubouché", 
    "Camus", "D'USSÉ", "De Luze", "Frapin", "Hine"
  ];
  
  const types = ["VS", "VSOP", "XO", "Napoléon", "Extra", "Hors d'âge", "Vintage"];
  const ages = ["", "Aged 4 Years", "Aged 6 Years", "Aged 10 Years", "Aged 15 Years", "Aged 20 Years"];
  
  for (let i = 0; i < count; i++) {
    const producer = producers[Math.floor(Math.random() * producers.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const age = type === "Vintage" ? `${2000 + Math.floor(Math.random() * 20)}` : ages[Math.floor(Math.random() * ages.length)];
    const region = "Cognac, France";
    
    // Price ranges by type
    let randomPrice = 0;
    if (type === "VS") {
      randomPrice = Math.floor(Math.random() * (500 - 350)) + 350;
    } else if (type === "VSOP") {
      randomPrice = Math.floor(Math.random() * (900 - 500)) + 500;
    } else if (type === "XO") {
      randomPrice = Math.floor(Math.random() * (3000 - 1000)) + 1000;
    } else if (type === "Napoléon" || type === "Extra") {
      randomPrice = Math.floor(Math.random() * (5000 - 1500)) + 1500;
    } else {
      randomPrice = Math.floor(Math.random() * (10000 - 2000)) + 2000;
    }
    
    const alcoholContent = (Math.random() * (43 - 40) + 40).toFixed(1);
    const name = age ? `${producer} ${type} ${age}` : `${producer} ${type}`;
    
    const cognac: InsertProduct = {
      name,
      description: `An authentic ${type} cognac from ${producer}. ${age ? `${age}` : 'Carefully aged'} in oak barrels from the Cognac region of France, offering a rich, complex flavor profile.`,
      categoryId,
      producer,
      region,
      alcohol: alcoholContent,
      volume: "700ml",
      price: `R${randomPrice.toFixed(2)}`,
      imageUrl: dummyImages.cognac(producer),
      isVerified: true,
      tastingNotes: generateCognacTastingNotes(type),
      pairings: "Best enjoyed neat or with a single ice cube. Pairs excellently with dark chocolate, dried fruits, or as a digestif after a meal. Premium cognacs can also be savored with a fine cigar.",
      producerInfo: `${producer} is one of the world's premier cognac houses, with a long history of excellence dating back generations. Their cognacs are crafted using traditional distillation methods in copper pot stills and aged in French oak barrels.`,
      awards: generateAwards(),
      certifications: ["Bureau National Interprofessionnel du Cognac", "Appellation d'Origine Contrôlée"],
      sustainabilityInfo: "Produced using sustainable viticulture practices and with respect for terroir. The distillery has implemented energy conservation measures and responsible water management."
    };
    
    cognacs.push(cognac);
  }
  
  return cognacs;
}

// Function to generate cognac tasting notes
function generateCognacTastingNotes(type: string): string {
  switch (type) {
    case "VS":
      return "Fresh and vibrant with notes of fresh grapes, vanilla, and light oak. A youthful cognac with bright fruit character and a touch of spice.";
    case "VSOP":
      return "Well-balanced with notes of dried fruits, vanilla, caramel, and oak spice. Medium-bodied with a smooth, warming finish.";
    case "XO":
      return "Rich and complex with deep notes of dried fruits, chocolate, coffee, nuts, and baking spices. Long aging provides a velvety texture with a lingering finish.";
    case "Napoléon":
      return "Elegant and refined with rich fruit cake, candied orange peel, cinnamon, and nutmeg. The extended aging brings exceptional smoothness and depth.";
    case "Extra":
      return "Extraordinarily complex with layers of rancio, dried tropical fruits, leather, tobacco, and dark chocolate. The extensive time in oak creates a profound depth and remarkable length on the palate.";
    case "Hors d'âge":
      return "Exceptionally mature with concentrated flavors of walnut, leather, cigar box, dried figs, and exotic spices. The decades-long aging creates an unparalleled richness and complexity.";
    case "Vintage":
      return "A rare expression capturing a specific year's character, with distinctive notes of rancio, candied fruits, honey, leather, and fine oak. Each vintage has its unique personality while maintaining the house style.";
    default:
      return "A harmonious blend of fruit, oak, and spice with a smooth, satisfying finish. Demonstrates the characteristic elegance of fine cognac.";
  }
}

// Helper functions for generating product details
function generateTastingNotes(variety: string, isRed: boolean): string {
  if (isRed) {
    switch (variety) {
      case "Cabernet Sauvignon":
        return "Rich and full-bodied with notes of blackcurrant, cedar, and dark chocolate. Firm tannins with a long, elegant finish.";
      case "Shiraz":
        return "Bold and spicy with black pepper, dark berries, and hints of vanilla from oak aging. Rich mouthfeel with a warming finish.";
      case "Pinotage":
        return "South Africa's signature variety offering smoky and earthy notes with dark fruits, coffee, and chocolate. Distinctive and bold.";
      case "Merlot":
        return "Smooth and approachable with ripe plum, black cherry, and subtle herbal notes. Soft tannins and a velvety mouthfeel.";
      case "Pinot Noir":
        return "Elegant and delicate with red berries, cherry, and subtle earthy undertones. Silky tannins with bright acidity.";
      default:
        return "Complex and well-structured with a balance of fruit, acidity, and tannins. Notes of dark fruits and subtle oak influence.";
    }
  } else {
    switch (variety) {
      case "Chardonnay":
        return "Rich and full-bodied with notes of tropical fruit, citrus, and vanilla. Well-balanced with a creamy texture and a long finish.";
      case "Sauvignon Blanc":
        return "Crisp and vibrant with zesty citrus, green apple, and distinctive grassiness. Refreshing acidity with a clean, mineral finish.";
      case "Chenin Blanc":
        return "South Africa's most planted white grape, offering apple, pear, and honeysuckle notes with a lovely balance of sweetness and acidity.";
      case "Viognier":
        return "Aromatic and full-bodied with peach, apricot, and floral notes. Rich mouthfeel with a lingering spicy finish.";
      default:
        return "Fresh and balanced with stone fruit and citrus notes. Good acidity and a clean finish make this an excellent food wine.";
    }
  }
}

function generateFoodPairings(variety: string, isRed: boolean): string {
  if (isRed) {
    switch (variety) {
      case "Cabernet Sauvignon":
        return "Pairs wonderfully with grilled steak, lamb, and aged hard cheeses. The firm tannins cut through fatty meats perfectly.";
      case "Shiraz":
        return "Excellent with game meats, barbecued dishes, and spicy foods. The bold flavors complement South African boerewors and braai dishes.";
      case "Pinotage":
        return "Perfect with traditional South African dishes like bobotie, game meats, and braai. Also pairs well with dark chocolate desserts.";
      case "Merlot":
        return "Versatile pairing with roasted chicken, pork dishes, and medium-strength cheeses. Works well with mushroom-based dishes.";
      case "Pinot Noir":
        return "Excellent with grilled salmon, duck, and mushroom dishes. The versatility makes it perfect for mixed tapas or charcuterie.";
      default:
        return "Pairs well with red meats, game, and mature cheeses. The structure and body make it perfect for hearty dishes.";
    }
  } else {
    switch (variety) {
      case "Chardonnay":
        return "Pairs beautifully with rich seafood dishes like crayfish, creamy pasta, and roasted chicken. Works well with buttery sauces.";
      case "Sauvignon Blanc":
        return "Perfect with fresh seafood, particularly oysters, as well as goat cheese and fresh salads. The acidity cuts through creamy dishes.";
      case "Chenin Blanc":
        return "Versatile with food, pairing well with spicy cuisine, pork dishes, and seafood. Works wonderfully with Cape Malay curry.";
      case "Viognier":
        return "Excellent with spicy Asian cuisine, rich seafood dishes, and creamy cheeses. The aromatic nature complements complex flavors.";
      default:
        return "Pairs well with seafood, light pasta dishes, and fresh salads. The crisp profile makes it perfect for summer dining.";
    }
  }
}

function generateWhiskeyTastingNotes(type: string): string {
  switch (type) {
    case "Single Malt":
      return "Complex and rich with notes of honey, dried fruit, and subtle smokiness. The long maturation in oak barrels adds depth with vanilla and caramel undertones.";
    case "Blended":
      return "Smooth and balanced with a harmonious blend of grain and malt whiskies. Notes of toffee, vanilla, and gentle spice with a rounded mouthfeel.";
    case "Single Grain":
      return "Light and approachable with sweet cereal notes, butterscotch, and hints of tropical fruit. Gentle oak influence with a clean finish.";
    case "Bourbon-style":
      return "Sweet and robust with strong vanilla, caramel, and charred oak notes. Rich mouthfeel with a warming finish and hints of corn sweetness.";
    case "Rye-style":
      return "Spicy and bold with pepper, cinnamon, and nutmeg notes. Underlying fruitiness with a distinctive dry character and a long, warming finish.";
    default:
      return "Well-balanced with a careful harmony of sweetness, spice, and oak influence. Notes of vanilla, dried fruit, and subtle smoke.";
  }
}

function generateBrandyTastingNotes(): string {
  const notes = [
    "Rich and complex with dried fruit, vanilla, and oak spice. The long aging process creates a smooth mouthfeel with notes of caramel and nuts.",
    "Elegant and refined with floral notes, ripe fruit, and hints of honey. The oak aging adds complexity with vanilla and subtle spice.",
    "Full-bodied and robust with concentrated flavors of dried apricots, orange peel, and toasted oak. A velvety texture with a long, warming finish.",
    "Smooth and mellow with rich toffee, dried fruit, and nutty flavors. Well-balanced with elegant oak influence and a hint of spice on the finish.",
    "Complex aromatics of vanilla, caramel, and dried fruits. The palate shows remarkable depth with notes of toasted almonds, spice, and subtle citrus."
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
}

function generateVodkaTastingNotes(type: string, flavor: string): string {
  if (type === "Flavored") {
    switch (flavor) {
      case "Citrus":
        return "Bright and zesty with natural citrus flavors of lemon, lime, and orange. Clean and crisp with a refreshing finish.";
      case "Berry":
        return "Vibrant berry notes with subtle sweetness and a smooth finish. Natural berry flavors without artificial aftertaste.";
      case "Vanilla":
        return "Rich and creamy with natural vanilla bean flavor. Smooth and subtly sweet without being cloying.";
      case "Chili":
        return "Bold and warming with a spicy kick that builds gradually. The heat is balanced by the smooth vodka base.";
      case "Rooibos":
        return "Unique infusion of South African rooibos tea giving earthy, slightly sweet notes with a smooth finish.";
      default:
        return "Naturally flavored with balanced aromas and taste. The pure vodka base ensures a clean, smooth drinking experience.";
    }
  } else {
    switch (type) {
      case "Pure":
        return "Exceptionally clean and neutral with subtle hints of grain. Ultra-smooth with a clean finish and minimal burn.";
      case "Premium":
        return "Refined and silky with a subtle sweetness from the grain. Multiple distillations result in remarkable purity and smoothness.";
      case "Craft":
        return "Distinctive character with subtle notes from the base ingredients. Small-batch production ensures attention to detail and quality.";
      case "Filtered":
        return "Crystal clear with exceptional purity from multiple filtrations. Incredibly smooth with a clean, neutral profile.";
      default:
        return "Clean and smooth with a balanced profile. High-quality distillation ensures a premium drinking experience with minimal harshness.";
    }
  }
}

function generateAwards(): string {
  const awards = [
    "Gold Medal, International Wine & Spirit Competition",
    "Double Gold, San Francisco World Spirits Competition",
    "Best in Class, Michelangelo International Wine & Spirits Awards",
    "92 Points, Wine Enthusiast",
    "Top 100 Wines of South Africa",
    "Veritas Gold",
    "Decanter World Wine Awards Silver Medal",
    "Old Mutual Trophy Wine Show Gold",
    "Best South African Producer, International Wine Challenge",
    "Top 10 South African Wines"
  ];
  
  const numAwards = Math.floor(Math.random() * 3) + 1;
  const selectedAwards = [];
  
  for (let i = 0; i < numAwards; i++) {
    const award = awards[Math.floor(Math.random() * awards.length)];
    if (!selectedAwards.includes(award)) {
      selectedAwards.push(award);
    }
  }
  
  return selectedAwards.join('; ');
}

// Function to generate all products
export function generateProducts(): InsertProduct[] {
  const products: InsertProduct[] = [];
  
  // Generate products for each category
  // Wine (category ID 1) - generate 150 wines
  products.push(...generateWineProducts(1, 150));
  
  // Whiskey (category ID 2) - generate 75 whiskeys
  products.push(...generateWhiskeyProducts(2, 75));
  
  // Brandy (category ID 3) - generate 70 brandies
  products.push(...generateBrandyProducts(3, 70));
  
  // Cognac (category ID 4) - generate 70 cognacs
  products.push(...generateCognacProducts(4, 70));
  
  // Vodka (category ID 5) - generate 70 vodkas
  products.push(...generateVodkaProducts(5, 70));
  
  // Gin (category ID 6) - generate 70 gins
  products.push(...generateGinProducts(6, 70));
  
  console.log(`Generated ${products.length} total products across all categories`);
  
  return products;
}

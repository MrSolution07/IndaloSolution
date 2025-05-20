import { InsertCategory } from "@shared/schema";

// Function to generate alcohol categories
export function generateCategories(): InsertCategory[] {
  return [
    {
      name: "Wine",
      description: "South African wines from premier wine regions including Stellenbosch, Franschhoek, and Constantia."
    },
    {
      name: "Whiskey",
      description: "Premium South African whiskeys, including single malts, blended, and grain varieties."
    },
    {
      name: "Brandy",
      description: "South African brandies, known for their exceptional quality and international recognition."
    },
    {
      name: "Cognac",
      description: "Imported and locally distributed cognacs, including VSOP, XO, and premium varieties available in South Africa."
    },
    {
      name: "Vodka",
      description: "Locally produced vodkas, crafted with pure South African water and quality ingredients."
    },
    {
      name: "Gin",
      description: "South African craft gins featuring unique indigenous botanicals like fynbos and rooibos."
    },
    {
      name: "Rum",
      description: "Locally distilled rums made from South African sugarcane."
    },
    {
      name: "Liqueur",
      description: "South African cream and fruit liqueurs made with local ingredients."
    },
    {
      name: "Craft Beer",
      description: "Locally brewed craft beers from South African microbreweries."
    },
    {
      name: "Cider",
      description: "South African ciders made from locally grown apples and other fruits."
    },
    {
      name: "Sparkling Wine",
      description: "South African sparkling wines made in the traditional method, often called Cap Classique."
    }
  ];
}

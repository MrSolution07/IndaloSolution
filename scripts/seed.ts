import { db } from "../server/db";
import { 
  users, 
  products, 
  transactions,
  scans,
  alerts,
  analytics, 
} from "../shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    await db.delete(scans);
    await db.delete(alerts);
    await db.delete(transactions);
    await db.delete(products);
    await db.delete(analytics);
    await db.delete(users);

    console.log("✅ Deleted existing data");

    // Create users with different roles
    const [admin] = await db.insert(users).values({
      username: "admin",
      displayName: "Admin User",
      email: "admin@indalosolutions.com",
      password: "password", // In a real app, this would be hashed
      role: "admin",
      company: "Indalo Solutions",
      phoneNumber: "+27123456789"
    }).returning();

    const [supplier] = await db.insert(users).values({
      username: "supplier",
      displayName: "Cape Vineyards",
      email: "supplier@capevineyard.com",
      password: "password",
      role: "supplier",
      company: "Cape Vineyards",
      phoneNumber: "+27111222333"
    }).returning();

    const [manufacturer] = await db.insert(users).values({
      username: "manufacturer",
      displayName: "Premium Spirits",
      email: "ops@premiumspirits.com",
      password: "password",
      role: "manufacturer",
      company: "Premium Spirits",
      phoneNumber: "+27444555666"
    }).returning();

    const [distributor] = await db.insert(users).values({
      username: "distributor",
      displayName: "National Distribution",
      email: "logistics@nationaldist.com",
      password: "password",
      role: "distributor",
      company: "National Distribution",
      phoneNumber: "+27777888999"
    }).returning();

    const [retailer] = await db.insert(users).values({
      username: "retailer",
      displayName: "Cape Town Liquor Store",
      email: "manager@ctliquor.com",
      password: "password",
      role: "retailer",
      company: "Cape Town Liquor Store",
      phoneNumber: "+27222333444"
    }).returning();

    const [consumer] = await db.insert(users).values({
      username: "consumer",
      displayName: "John Smith",
      email: "john@example.com",
      password: "password",
      role: "consumer",
      phoneNumber: "+27555666777"
    }).returning();

    console.log("✅ Created users");

    // Create products
    const [redWine] = await db.insert(products).values({
      name: "Reserve Red Wine 2023",
      batchNumber: "RW2023-001",
      productCode: "RW23001",
      qrCode: "RW23001QR",
      description: "Premium red wine from the Cape region",
      category: "Wine",
      producer: supplier.id,
      manufacturingDate: new Date("2023-05-10"),
      expiryDate: new Date("2028-05-10"),
      status: "produced",
      location: { 
        latitude: -33.9249, 
        longitude: 18.4241,
        name: "Cape Town Winery"
      },
      imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j"
    }).returning();

    const [vodka] = await db.insert(products).values({
      name: "Premium Vodka",
      batchNumber: "PV2023-002",
      productCode: "PV23002",
      qrCode: "PV23002QR",
      description: "Ultra-smooth premium vodka",
      category: "Spirits",
      producer: supplier.id,
      manufacturingDate: new Date("2023-06-15"),
      expiryDate: new Date("2033-06-15"),
      status: "in_transit",
      location: { 
        latitude: -26.2041, 
        longitude: 28.0473,
        name: "Johannesburg Distribution Center"
      },
      imageUrl: "https://images.unsplash.com/photo-1613063070055-55dec0611d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      blockchainHash: "0x2b3c4d5e6f7g8h9i0j1k"
    }).returning();

    const [gin] = await db.insert(products).values({
      name: "Cape Botanical Gin",
      batchNumber: "CBG2023-003",
      productCode: "CBG23003",
      qrCode: "CBG23003QR",
      description: "Artisanal gin with local botanicals",
      category: "Spirits",
      producer: supplier.id,
      manufacturingDate: new Date("2023-07-20"),
      expiryDate: new Date("2033-07-20"),
      status: "delivered",
      location: { 
        latitude: -29.8587, 
        longitude: 31.0218,
        name: "Durban Warehouse"
      },
      imageUrl: "https://images.unsplash.com/photo-1612906515356-89d50d9072e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      blockchainHash: "0x3c4d5e6f7g8h9i0j1k2l"
    }).returning();

    console.log("✅ Created products");

    // Create transactions
    const [transaction1] = await db.insert(transactions).values({
      productId: redWine.id,
      fromUserId: supplier.id,
      toUserId: manufacturer.id,
      type: "production",
      location: {
        latitude: -33.9249,
        longitude: 18.4241,
        name: "Cape Town Winery"
      },
      temperature: 18.5,
      humidity: 65.0,
      details: {
        batchSize: 1000,
        qualityScore: 95
      },
      verificationStatus: true,
      blockchainHash: "0xa1b2c3d4e5f6g7h8i9j0"
    }).returning();

    const [transaction2] = await db.insert(transactions).values({
      productId: vodka.id,
      fromUserId: manufacturer.id,
      toUserId: distributor.id,
      type: "shipping",
      location: {
        latitude: -33.9249,
        longitude: 18.4241,
        name: "Cape Town Manufacturing Plant"
      },
      temperature: 20.0,
      humidity: 60.0,
      details: {
        transportMethod: "Truck",
        estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      verificationStatus: true,
      blockchainHash: "0xb2c3d4e5f6g7h8i9j0k1"
    }).returning();

    const [transaction3] = await db.insert(transactions).values({
      productId: gin.id,
      fromUserId: distributor.id,
      toUserId: retailer.id,
      type: "receiving",
      location: {
        latitude: -29.8587,
        longitude: 31.0218,
        name: "Durban Warehouse"
      },
      temperature: 21.5,
      humidity: 62.5,
      details: {
        condition: "Excellent",
        receivedQuantity: 500
      },
      verificationStatus: true,
      blockchainHash: "0xc3d4e5f6g7h8i9j0k1l2"
    }).returning();

    console.log("✅ Created transactions");

    // Create scans
    await db.insert(scans).values({
      productId: gin.id,
      userId: consumer.id,
      location: {
        latitude: -29.8587,
        longitude: 31.0218,
        name: "Cape Town Liquor Store"
      },
      deviceInfo: {
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
        ip: "196.25.255.123"
      },
      isAuthentic: true,
      notes: "Customer authenticated product at point of sale"
    });

    await db.insert(scans).values({
      productId: vodka.id,
      userId: retailer.id,
      location: {
        latitude: -26.2041,
        longitude: 28.0473,
        name: "Johannesburg Distribution Center"
      },
      deviceInfo: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        ip: "196.25.210.45"
      },
      isAuthentic: true,
      notes: "Inventory verification scan"
    });

    await db.insert(scans).values({
      productId: redWine.id,
      userId: distributor.id,
      location: {
        latitude: -33.9249,
        longitude: 18.4241,
        name: "Cape Town Winery"
      },
      deviceInfo: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
        ip: "196.25.100.78"
      },
      isAuthentic: true,
      notes: "Quality control scan"
    });

    console.log("✅ Created scans");

    // Create alerts
    await db.insert(alerts).values({
      userId: supplier.id,
      productId: vodka.id,
      transactionId: transaction2.id,
      type: "temperature",
      severity: "warning",
      message: "Temperature deviation detected during transit. Product temperature reached 23.5°C (threshold: 22°C).",
      isRead: false,
      details: {
        timestamp: new Date().toISOString(),
        location: {
          latitude: -30.5595,
          longitude: 22.9375,
          name: "N1 Highway"
        },
        readings: {
          temperature: 23.5,
          threshold: 22.0
        }
      }
    });

    await db.insert(alerts).values({
      userId: distributor.id,
      productId: gin.id,
      type: "verification",
      severity: "info",
      message: "Batch CBG2023-003 successfully verified at Durban Warehouse.",
      isRead: true,
      details: {
        timestamp: new Date().toISOString(),
        verifiedBy: "Warehouse Scanner #4",
        status: "authenticated"
      }
    });

    console.log("✅ Created alerts");

    // Create analytics entries
    await db.insert(analytics).values({
      metricName: "products_created",
      metricValue: 3,
      dimension: "all",
      details: {
        categories: {
          "Wine": 1,
          "Spirits": 2
        }
      }
    });

    await db.insert(analytics).values({
      metricName: "product_verifications",
      metricValue: 3,
      dimension: "all",
      details: {
        authenticated: 3,
        flagged: 0
      }
    });

    await db.insert(analytics).values({
      metricName: "temperature_alerts",
      metricValue: 1,
      dimension: "Spirits",
      details: {
        severity: {
          "info": 0,
          "warning": 1,
          "critical": 0
        }
      }
    });

    console.log("✅ Created analytics entries");
    console.log("✅ Database seeding complete!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

seed()
  .catch(e => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    // Successfully exit
    process.exit(0);
  });
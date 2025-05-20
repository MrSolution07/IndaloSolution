import { apiRequest } from "./queryClient";

// Verification API
export async function verifyProduct(productId: string) {
  try {
    const res = await apiRequest("POST", "/api/verification", { productId });
    return await res.json();
  } catch (error) {
    console.error("Error verifying product:", error);
    throw error;
  }
}

// Product API
export async function getProducts(category?: string, page = 1, limit = 12) {
  try {
    const queryParams = new URLSearchParams();
    if (category) queryParams.append("category", category);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const res = await apiRequest(
      "GET",
      `/api/products?${queryParams.toString()}`,
      undefined
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const res = await apiRequest("GET", `/api/products/${id}`, undefined);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
}

// Supply Chain API
export async function getSupplyChainData(productId: string) {
  try {
    const res = await apiRequest(
      "GET",
      `/api/supply-chain/${productId}`,
      undefined
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching supply chain data:", error);
    throw error;
  }
}

// Authentication API
export async function login(username: string, password: string) {
  try {
    const res = await apiRequest("POST", "/api/auth/login", {
      username,
      password,
    });
    return await res.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function logout() {
  try {
    const res = await apiRequest("POST", "/api/auth/logout", undefined);
    return await res.json();
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}

// User API
export async function getCurrentUser() {
  try {
    const res = await apiRequest("GET", "/api/user", undefined);
    return await res.json();
  } catch (error) {
    // This specific error is expected for unauthenticated users
    if (error instanceof Error && error.message.includes("401")) {
      return null;
    }
    console.error("Error fetching current user:", error);
    throw error;
  }
}

// For IndexedDB offline storage
export async function saveVerificationToIndexedDB(verification: any) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("IndaloOfflineDB", 1);
    
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains("offlineVerifications")) {
        db.createObjectStore("offlineVerifications", { keyPath: "id" });
      }
    };
    
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction("offlineVerifications", "readwrite");
      const store = transaction.objectStore("offlineVerifications");
      
      // Add a unique ID and timestamp
      const verificationToStore = {
        ...verification,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
      
      const request = store.add(verificationToStore);
      
      request.onsuccess = () => {
        resolve(verificationToStore);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    };
    
    openRequest.onerror = () => {
      reject(openRequest.error);
    };
  });
}

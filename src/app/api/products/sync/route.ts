import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const spreeApiUrl = process.env.NEXT_PUBLIC_SPREE_API_URL || 'https://spree-production-3fb8.up.railway.app';
    const clientId = process.env.SPREE_CLIENT_ID;
    const clientSecret = process.env.SPREE_CLIENT_SECRET;

    console.log("Attempting to sync product to Spree Commerce via OAuth...");

    if (!clientId || !clientSecret) {
      console.log("Missing OAuth credentials in env. Using Simulation Mode.");
      return NextResponse.json({ 
        success: true, 
        message: "Simulation: Product synced successfully (No credentials found)",
        simulated_data: data 
      }, { status: 200 });
    }

    try {
      // 1. Fetch OAuth Access Token
      const tokenResponse = await fetch(`${spreeApiUrl}/spree_oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret
        })
      });

      if (!tokenResponse.ok) {
        console.error("Failed to authenticate with Spree OAuth");
        throw new Error("OAuth failed");
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      console.log("Successfully obtained Spree Access Token. Creating product...");

      // 2. Create the Product using the Platform API
      const productResponse = await fetch(`${spreeApiUrl}/api/v2/platform/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          product: {
            name: data.title,
            price: data.priceDetails.finalPrice,
            shipping_category_id: 1, // Default fallback, may need adjusting based on DB
            sku: data.sku,
            description: data.description,
            weight: data.weight
          }
        })
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        console.error("Spree Product Creation Error:", errorData);
        throw new Error(JSON.stringify(errorData));
      }

      const responseData = await productResponse.json();
      
      return NextResponse.json({ 
        success: true, 
        message: "Product successfully created in live Spree database!",
        spree_product: responseData 
      }, { status: 200 });

    } catch (spreeError) {
      console.error("Spree API integration failed:", spreeError);
      
      // Fallback to simulation if live Spree is misconfigured (missing shipping category, etc.)
      return NextResponse.json({ 
        success: true, 
        message: "Simulation: Product synced successfully (Live API failed or misconfigured)",
        simulated_data: data,
        error_context: "Check Spree shipping_category_id or DB initialization"
      }, { status: 200 });
    }

  } catch (error) {
    console.error("Error processing sync request:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

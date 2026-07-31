import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const metal = searchParams.get('metal');

    if (!metal) {
      return NextResponse.json({ error: 'Missing metal parameter (XAU or XAG)' }, { status: 400 });
    }

    const apiKey = process.env.GOLD_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOLD_API_KEY environment variable' }, { status: 500 });
    }

    const response = await fetch(`https://www.goldapi.io/api/${metal}/INR`, {
      method: 'GET',
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Failed to fetch from GoldAPI.io', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    const fieldName = metal === 'XAU' ? 'goldPrice' : 'silverPrice';
    const rate = data.price;

    // Use Firebase REST API to avoid Client SDK hanging in Serverless functions
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const fbApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    // Check if the number is an integer or double for Firestore schema
    const valueType = Number.isInteger(rate) ? 'integerValue' : 'doubleValue';

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/market_data/global_rates?updateMask.fieldPaths=${fieldName}&updateMask.fieldPaths=lastUpdated&key=${fbApiKey}`;

    const fbResponse = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `projects/${projectId}/databases/(default)/documents/market_data/global_rates`,
        fields: {
          [fieldName]: { [valueType]: rate },
          lastUpdated: { stringValue: new Date().toISOString() }
        }
      })
    });

    if (!fbResponse.ok) {
      const fbError = await fbResponse.text();
      return NextResponse.json({ error: 'Failed to save to Firestore REST API', details: fbError }, { status: fbResponse.status });
    }

    return NextResponse.json({ 
      success: true, 
      metal, 
      rate, 
      message: `Successfully updated ${metal} price to ${rate} INR in Firestore.` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}

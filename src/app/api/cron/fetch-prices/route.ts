import { NextResponse } from 'next/server';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// This handles the GET request for our cron job
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const metal = searchParams.get('metal'); // 'XAU' or 'XAG'

    if (!metal) {
      return NextResponse.json({ error: 'Missing metal parameter (XAU or XAG)' }, { status: 400 });
    }

    const apiKey = process.env.GOLD_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOLD_API_KEY environment variable' }, { status: 500 });
    }

    // Fetch from GoldAPI.io
    const response = await fetch(`https://www.goldapi.io/api/${metal}/INR`, {
      method: 'GET',
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GoldAPI.io error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from GoldAPI.io', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    
    // The data object from GoldAPI.io looks like: 
    // { price: 14333, currency: "INR", metal: "XAU", ... }
    
    // Determine the field name in Firestore
    const fieldName = metal === 'XAU' ? 'goldPrice' : 'silverPrice';
    const rate = data.price;

    // Save to Firebase (merge to avoid overwriting the other metal's price)
    const docRef = doc(db, 'market_data', 'global_rates');
    await setDoc(docRef, {
      [fieldName]: rate,
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      metal, 
      rate, 
      message: `Successfully updated ${metal} price to ${rate} INR in Firestore.` 
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}

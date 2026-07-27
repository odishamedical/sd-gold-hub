import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

// NOTE: This endpoint allows external ecosystems (like sd-it-hub templates)
// to securely pull a jeweler's profile and active products via API Bridge.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');

    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }

    // 1. Fetch Shop Profile
    const shopRef = doc(db, 'shops', shopId);
    const shopSnap = await getDoc(shopRef);

    if (!shopSnap.exists()) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const shop = shopSnap.data();

    // 2. Fetch Active Shop Products
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('shopId', '==', shopId),
      where('status', '==', 'active')
    );
    const productsSnap = await getDocs(q);
    const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // 3. Return combined payload
    // Enable CORS so sd-it-hub templates can fetch this from the client-side or server-side
    return NextResponse.json({
      success: true,
      data: {
        shop: { id: shopSnap.id, ...shop },
        products
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error: any) {
    console.error("Export Shop API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

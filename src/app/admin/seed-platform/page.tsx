"use client";

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SeedPlatformPage() {
  const [status, setStatus] = useState('Waiting for authentication...');
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setStatus(`Authenticated as ${user.email}. Creating shop...`);
        try {
          // Create Shop
          const shopId = 'gold_dunia_official';
          await setDoc(doc(db, 'shops', shopId), {
            name: 'Gold Dunia Collection',
            description: 'The official platform showcase of premium hallmarked jewelry.',
            address: 'Global',
            city: 'Global',
            state: 'Global',
            country: 'Global',
            phone: '',
            isVerified: true,
            ownerUid: user.uid, // Tie directly to logged-in user
            createdAt: serverTimestamp(),
            searchKeywords: ['gold', 'dunia', 'collection', 'official']
          }, { merge: true });

          setStatus(prev => prev + '\nShop created! Creating pricing engine settings...');

          // Create Settings
          await setDoc(doc(db, 'shop_settings', shopId), {
            metals: [
              { id: '22k_916', name: '22K (91.6%) Hallmarked Gold', value: '22K' },
              { id: '24k_999', name: '24K (99.9%) Pure Gold', value: '24K' },
              { id: '18k_750', name: '18K (75.0%) Diamond Gold', value: '18K' }
            ],
            makingCharges: [
              { id: 'mc_flat_10', name: 'Standard Making (10%)', type: 'percentage', value: 10 },
              { id: 'mc_flat_15', name: 'Premium Design (15%)', type: 'percentage', value: 15 },
              { id: 'mc_flat_20', name: 'Antique/Kundan (20%)', type: 'percentage', value: 20 },
              { id: 'mc_per_gram_800', name: 'Standard (₹800/g)', type: 'per_gram', value: 800 }
            ],
            updatedAt: serverTimestamp()
          }, { merge: true });

          setStatus(prev => prev + '\nSuccessfully seeded Gold Dunia Official shop and Pricing Engine! You can now close this page.');
        } catch (error: any) {
          setStatus(`Error: ${error.message}`);
        }
      } else {
        setStatus('Please log in first.');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-10 font-mono text-white bg-black min-h-screen">
      <h1 className="text-2xl text-yellow-500 mb-6">Seed Platform Shop</h1>
      <pre className="whitespace-pre-wrap">{status}</pre>
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Gold Prices Today | 24K, 22K, 18K Rates in India & Global Markets',
  description: 'Check real-time live gold prices for 24K, 22K, and 18K gold. Get accurate today\'s gold rates across major Indian cities and global markets like Dubai and USA.',
  openGraph: {
    title: 'Live Gold Prices Today | 24K, 22K, 18K Rates | Gold Dunia',
    description: 'Check real-time live gold prices across major Indian cities and global markets. Accurate 24K, 22K, and 18K rates.',
    url: 'https://sd-gold-hub.vercel.app/gold-price-live',
    siteName: 'Gold Dunia',
    images: [
      {
        url: 'https://sd-gold-hub.vercel.app/stock/gold-price-pc.png',
        width: 1200,
        height: 630,
        alt: 'Live Gold Prices',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Global Gold Rates | Gold Dunia",
    description: "Track real-time gold prices across global markets.",
    images: ["https://sd-gold-hub.vercel.app/stock/gold-price-pc.png"],
  },
};

export default function GoldLiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Today Gold Price: Live 24K, 22K, 18K Rates in India | Gold Dunia',
  description: 'Check today gold price live. Get real-time accurate gold rates for 24K, 22K, and 18K gold across major Indian cities and global markets.',
  openGraph: {
    title: 'Today Gold Price: Live 24K, 22K, 18K Rates | Gold Dunia',
    description: 'Check today gold price live across major Indian cities and global markets. Accurate 24K, 22K, and 18K rates.',
    url: 'https://golddunia.com/gold-price-live',
    siteName: 'Gold Dunia',
    images: [
      {
        url: 'https://golddunia.com/stock/gold-price-pc.png',
        width: 1200,
        height: 630,
        alt: 'Today Gold Price Live',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Today Gold Price: Live 24K, 22K Rates | Gold Dunia",
    description: "Track real-time today gold price across global markets.",
    images: ["https://golddunia.com/stock/gold-price-pc.png"],
  },
};

export default function GoldLiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

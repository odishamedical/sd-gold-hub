import React from "react";

export const metadata = {
  title: "Shipping & Delivery Policy | Gold Dunia",
  description: "Gold Dunia's policies regarding shipping, delivery, and in-store pickups.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold mb-8 tracking-wider uppercase border-b border-[#2A344A] pb-6">
          Shipping & Delivery Policy
        </h1>

        <div className="prose prose-invert prose-gold max-w-none space-y-6 text-slate-300 leading-relaxed">
          <p>
            At Gold Dunia, we prioritize the absolute security, authenticity, and satisfaction of our customers when purchasing high-value 22K and 24K gold jewelry.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. In-Store Pickup Model</h2>
          <p>
            Due to the extreme value and delicate nature of fine gold jewelry, <strong>Gold Dunia does not offer direct home delivery or postal shipping for jewelry items.</strong>
          </p>
          <p>
            We operate exclusively on a <strong>"Book Online, Pick Up In-Store"</strong> model. This ensures that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>There is zero risk of theft, loss, or damage during courier transit.</li>
            <li>You can physically inspect the jewelry and verify the HUID (Hallmark Unique Identification) before completing the final purchase.</li>
            <li>You can try on the jewelry to ensure perfect fit and satisfaction.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. The Collection Process</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Once you pay the 30% advance booking fee on Gold Dunia, your chosen item is immediately reserved for you at the specific vendor's showroom.</li>
            <li>You will receive a Booking Confirmation Receipt via email and on your dashboard.</li>
            <li>You must present this receipt (digitally or printed) along with a valid Government ID at the showroom to collect your item.</li>
            <li>The remaining 70% balance is paid directly to the showroom at the time of collection.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Collection Timeframes</h2>
          <p>
            We request that you visit the showroom to complete your purchase and collect your reserved item within <strong>14 days</strong> of your booking date. If you need an extension, please contact the showroom directly or reach out to Gold Dunia support. If the item is not collected within the stipulated time, the booking may be subject to cancellation (and your advance will be refunded as per our Refund Policy).
          </p>

          <p className="text-sm text-slate-500 mt-12 pt-6 border-t border-[#2A344A]">
            Last Updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}

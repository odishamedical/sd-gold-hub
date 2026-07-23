import React from "react";

export const metadata = {
  title: "Terms & Conditions | Gold Dunia",
  description: "Terms and conditions for using the Gold Dunia marketplace platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold mb-8 tracking-wider uppercase border-b border-[#2A344A] pb-6">
          Terms & Conditions
        </h1>

        <div className="prose prose-invert prose-gold max-w-none space-y-6 text-slate-300 leading-relaxed">
          <p>
            Welcome to Gold Dunia, a premium digital discovery and booking platform owned and operated by Shyam Dash Creation. 
            By accessing or using our website, you agree to comply with and be bound by the following Terms & Conditions.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Platform Nature (O2O Model)</h2>
          <p>
            Gold Dunia operates strictly on an Online-to-Offline (O2O) business model. 
            <strong>We do not sell physical jewelry directly to end consumers online.</strong> Our platform serves as a digital catalog and discovery network where users can browse hallmarked gold jewelry listed by verified third-party showrooms.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Booking and Advance Payments</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Users may reserve/book a jewelry item by paying a 30% advance booking fee through our secure payment gateway.</li>
            <li>This booking fee secures the item at the specific local showroom.</li>
            <li>The remaining balance must be paid directly to the showroom during the physical handover of the product.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Vendor Independence & Liability</h2>
          <p>
            The independent jewelry showrooms listed on Gold Dunia are entirely separate entities. Gold Dunia is not responsible for the physical manufacturing, final pricing negotiation, or post-purchase guarantees of the jewelry. All guarantees regarding gold purity, HUID certification, and physical condition are the sole responsibility of the respective showroom where the final transaction takes place.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            All content on Gold Dunia, including logos, designs, text, and graphics, is the intellectual property of Shyam Dash Creation. 
            Unauthorized use, reproduction, or distribution of our platform content is strictly prohibited.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Modifications</h2>
          <p>
            We reserve the right to update or modify these Terms & Conditions at any time without prior notice. 
            Continued use of the platform following any changes constitutes your acceptance of the new terms.
          </p>

          <p className="text-sm text-slate-500 mt-12 pt-6 border-t border-[#2A344A]">
            Last Updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}

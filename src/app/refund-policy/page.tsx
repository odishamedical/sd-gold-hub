import React from "react";

export const metadata = {
  title: "Cancellation & Refund Policy | Gold Dunia",
  description: "Information regarding bookings, cancellations, and our refund process at Gold Dunia.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold mb-8 tracking-wider uppercase border-b border-[#2A344A] pb-6">
          Cancellation & Refund Policy
        </h1>

        <div className="prose prose-invert prose-gold max-w-none space-y-6 text-slate-300 leading-relaxed">
          <p>
            Welcome to Gold Dunia. We value your trust and strive to ensure complete transparency in all our operations. 
            Because we operate a unique Online-to-Offline (O2O) jewelry discovery platform, our refund and cancellation policies are specifically tailored to protect both buyers and our registered showrooms.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Our Booking Model</h2>
          <p>
            Gold Dunia operates as a discovery and booking platform. <strong>We do not sell physical jewelry directly online.</strong> 
            Instead, users browse verified, hallmarked jewelry from certified showrooms and reserve their desired pieces by paying an <strong>advance booking fee (typically 30% of the estimated product price)</strong> through our platform.
          </p>
          <p>
            The final purchase, full payment, and handover of the jewelry always occur physically at the respective vendor's retail showroom.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Cancellation of Bookings</h2>
          <p>
            If you decide not to proceed with the purchase after making an advance booking on Gold Dunia, you are fully entitled to cancel your reservation.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>You may cancel your booking at any time before completing the final purchase at the showroom.</li>
            <li>Cancellations can be requested via your Gold Dunia User Dashboard or by contacting our support team at support@golddunia.com.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Refund Process & Timelines</h2>
          <p>
            Upon successful cancellation of your booking, we will initiate a full refund of your 30% advance payment.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Refund Initiation:</strong> Refunds are processed back to the original payment method (Credit Card, Debit Card, UPI, Netbanking, etc.) used during the booking.</li>
            <li><strong>Processing Time:</strong> Please allow <strong>5 to 7 business days</strong> (within one week) for the refunded amount to reflect in your bank account, depending on your bank's processing timelines.</li>
            <li>No hidden deductions or cancellation penalties are applied to standard catalog items.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Post-Purchase Returns</h2>
          <p>
            Because the final transaction and physical handover occur at the vendor's showroom, <strong>any returns, exchanges, or buybacks after the final physical purchase are subject strictly to the individual showroom's return policies.</strong>
          </p>
          <p>
            Gold Dunia is not liable for post-purchase returns, as the final sale agreement is executed offline directly between the buyer and the registered showroom. We strongly advise buyers to verify the HUID and clarify the showroom's return policy during their in-store visit.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Contact for Refund Queries</h2>
          <p>
            If you have any issues regarding a pending refund, please contact us at:
            <br />
            <strong>Shyam Dash Creation</strong>
            <br />
            R7/A2, Jagannath Colony, Budharaja, Sambalpur, Odisha, PIN: 768004
            <br />
            Phone: +91 7683811120
            <br />
            Email: support@golddunia.com
          </p>

          <p className="text-sm text-slate-500 mt-12 pt-6 border-t border-[#2A344A]">
            Last Updated: July 2026
          </p>
        </div>
      </div>
    </div>
  );
}

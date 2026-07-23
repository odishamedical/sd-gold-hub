import React from "react";

export const metadata = {
  title: "Privacy Policy | Gold Dunia",
  description: "Gold Dunia Privacy Policy regarding user data and analytics.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060A14] text-white pt-24 pb-16">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold mb-8 tracking-wider uppercase border-b border-[#2A344A] pb-6">
          Privacy Policy
        </h1>

        <div className="prose prose-invert prose-gold max-w-none space-y-6 text-slate-300 leading-relaxed">
          <p>
            At Gold Dunia (a platform by Shyam Dash Creation), we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information when you use our website.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and physical address provided during account registration, booking, or contacting us.</li>
            <li><strong>Payment Information:</strong> Transaction details securely processed by our payment gateways (e.g., Razorpay). We do not store complete credit card numbers on our servers.</li>
            <li><strong>Usage Data:</strong> Information on how you interact with our website, including IP address, browser type, and pages visited, to improve our services and for analytics (including Google Analytics and AdSense).</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            Your information is used for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>To process your advanced bookings and facilitate communication between you and the verified jewelry showrooms.</li>
            <li>To provide customer support and respond to inquiries.</li>
            <li>To send important administrative alerts, booking confirmations, and, if opted in, marketing communications.</li>
            <li>To analyze platform usage and display relevant advertisements (e.g., via Google AdSense).</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Third-Party Sharing</h2>
          <p>
            We do not sell your personal data. We may share necessary booking details (Name, Contact Number) with the specific showroom where you have booked a product to facilitate the in-store handover. We also use trusted third-party services (like payment gateways and analytics providers) who are bound by strict confidentiality agreements.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Cookies and Tracking</h2>
          <p>
            Gold Dunia uses cookies to maintain session states, remember user preferences, and for advertising tracking (such as Google AdSense). You can control cookie preferences through your browser settings.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
            <br />
            <strong>Shyam Dash Creation</strong><br />
            R7/A2, Jagannath Colony, Budharaja, Sambalpur, Odisha, PIN: 768004<br />
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

import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-dark/10 blur-[120px] rounded-full" />

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full border border-gold-primary/30 bg-gold-primary/5 text-gold-primary text-sm font-medium tracking-widest uppercase">
              Sovereign Excellence
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-display leading-[1.1]">
              The Gold Hub <br />
              <span className="sd-gold-text">Redefined.</span>
            </h1>
            
            <p className="text-xl text-sd-text-muted max-w-lg leading-relaxed">
              Experience the world's most exclusive multi-vendor marketplace. 
              Certified HUID jewelry, bespoke craftsmanship, and absolute transparency.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <button className="sd-button-luxury">
                Explore Collection
              </button>
              <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all text-sm font-bold tracking-widest uppercase">
                Become a Vendor
              </button>
            </div>
            
            <div className="pt-12 grid grid-cols-3 gap-8 border-t border-white/10">
              <div>
                <p className="text-2xl font-display text-gold-primary">500+</p>
                <p className="text-xs text-sd-text-muted uppercase tracking-wider">Certified Vendors</p>
              </div>
              <div>
                <p className="text-2xl font-display text-gold-primary">12k+</p>
                <p className="text-xs text-sd-text-muted uppercase tracking-wider">Unique Designs</p>
              </div>
              <div>
                <p className="text-2xl font-display text-gold-primary">24k</p>
                <p className="text-xs text-sd-text-muted uppercase tracking-wider">Pure Trust</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-primary to-gold-dark rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative sd-glass-card p-4 overflow-hidden">
              <Image 
                src="/hero-gold.png" 
                alt="Luxury Gold Jewelry" 
                width={800} 
                height={1000} 
                className="rounded-[20px] object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Floating Element */}
              <div className="absolute bottom-10 left-10 p-6 sd-glass-card border-gold-primary/20 max-w-[200px]">
                <p className="text-xs text-gold-primary font-bold mb-1 uppercase tracking-tighter">Featured Masterpiece</p>
                <p className="text-sm font-medium">Celestial Diamond Solitaire</p>
                <p className="text-lg font-display mt-2">₹1,42,000</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Trust Bar */}
      <div className="border-t border-white/5 bg-white/[0.02] py-12">
        <div className="container mx-auto px-6">
          <p className="text-center text-xs text-sd-text-muted uppercase tracking-[0.3em] mb-8">Endorsed by Global Standards</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             {/* We will add real logo SVGs here later */}
             <div className="text-xl font-bold tracking-tighter">BIS HALLMARK</div>
             <div className="text-xl font-bold tracking-tighter">GIA CERTIFIED</div>
             <div className="text-xl font-bold tracking-tighter">HUID SECURE</div>
             <div className="text-xl font-bold tracking-tighter">SD AUTHENTIC</div>
          </div>
        </div>
      </div>

      {/* Spree Commerce Catalog Preview */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-display mb-4">Trending Masterpieces</h2>
            <p className="text-sd-text-muted max-w-xl">A curated selection of our finest HUID certified jewelry from master vendors across the SD Ecosystem.</p>
          </div>
          <button className="hidden lg:block px-6 py-3 rounded-full border border-gold-primary/30 text-gold-primary hover:bg-gold-primary/10 transition-all text-sm font-bold tracking-widest uppercase">
            View Full Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="sd-glass-card p-4 group cursor-pointer">
            <div className="relative h-[300px] w-full overflow-hidden rounded-[16px] mb-6">
              <Image 
                src="/hero-gold.png" 
                alt="Celestial Diamond Solitaire" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gold-primary">
                GIA Certified
              </div>
            </div>
            <p className="text-xs text-sd-text-muted uppercase tracking-wider mb-2">Rings • SD Master Jeweler</p>
            <h3 className="text-xl font-display mb-2 group-hover:text-gold-primary transition-colors">Celestial Diamond Solitaire</h3>
            <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
              <p className="text-2xl font-bold">₹1,42,000</p>
              <button className="p-3 rounded-full bg-white/5 hover:bg-gold-primary hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </button>
            </div>
          </div>

          {/* Product 2 */}
          <div className="sd-glass-card p-4 group cursor-pointer">
            <div className="relative h-[300px] w-full overflow-hidden rounded-[16px] mb-6">
              <Image 
                src="/diamond_necklace_luxury.png" 
                alt="Imperial Diamond Necklace" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
            </div>
            <p className="text-xs text-sd-text-muted uppercase tracking-wider mb-2">Necklaces • Royal Diamonds</p>
            <h3 className="text-xl font-display mb-2 group-hover:text-gold-primary transition-colors">Imperial Diamond Necklace</h3>
            <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
              <p className="text-2xl font-bold">₹8,75,000</p>
              <button className="p-3 rounded-full bg-white/5 hover:bg-gold-primary hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </button>
            </div>
          </div>

          {/* Product 3 */}
          <div className="sd-glass-card p-4 group cursor-pointer">
            <div className="relative h-[300px] w-full overflow-hidden rounded-[16px] mb-6">
              <Image 
                src="/gold_bangle_luxury.png" 
                alt="Heritage 24k Gold Bangle" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gold-primary">
                HUID Secure
              </div>
            </div>
            <p className="text-xs text-sd-text-muted uppercase tracking-wider mb-2">Bracelets • Antique Gold House</p>
            <h3 className="text-xl font-display mb-2 group-hover:text-gold-primary transition-colors">Heritage 24k Gold Bangle</h3>
            <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
              <p className="text-2xl font-bold">₹2,10,000</p>
              <button className="p-3 rounded-full bg-white/5 hover:bg-gold-primary hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

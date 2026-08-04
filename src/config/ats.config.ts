export const atsConfig = {
  // Core Identifiers
  projectName: "Gold Dunia Job Portal",
  industryName: "Jewelry Industry",
  
  // Database Namespace (Empty to match existing 'jobs' collection, prevents breaking changes)
  dbPrefix: "", 

  // Branding & Aesthetics
  theme: {
    primaryBg: "bg-[#0A101C]", // Dark Navy
    primaryBorder: "border-[#E3B061]", // Gold
    primaryText: "text-[#E3B061]", // Gold
    secondaryBg: "bg-white/5",
    cardBg: "bg-[#111625]",
    textLight: "text-white",
    textMuted: "text-white/60",
    buttonPrimary: "bg-[#E3B061] text-[#060A14] hover:bg-[#FDF8F5]",
    buttonSecondary: "bg-white/5 text-white hover:bg-white/10"
  },

  // Dropdown Configurations (Job Posting)
  industries: [
    "Retail Sales",
    "Goldsmith / Artisan",
    "Store Management",
    "Appraisal / Valuation",
    "Wholesale Distribution",
    "Security"
  ],

  // Dropdown Configurations (Job Seekers)
  skills: [
    "Sales Executive",
    "Master Goldsmith",
    "Polishing",
    "Store Manager",
    "Gemology",
    "Security Guard",
    "Customer Service"
  ],

  // Nomenclature Overrides (To change terminology between hubs)
  terminology: {
    vendorTitle: "Jeweler / Shop Owner",
    seekerTitle: "Job Seeker",
    cvName: "Gold Dunia Resume",
    jobCategoryLabel: "Industry Segment"
  }
};

"use client";
import Link from "next/link";
import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items, className = "" }: { items: BreadcrumbItem[], className?: string }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`flex items-center flex-wrap gap-1 text-sm font-[family-name:var(--font-display)] w-full ${className}`}>
      <Link href="/" className="text-[#9CA3AF] hover:text-[#D4AF37] transition-colors flex items-center">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-[#D4AF37]/50 flex-shrink-0 mx-0.5" />
          {item.href ? (
            <Link href={item.href} className="text-[#9CA3AF] hover:text-[#E2E8F0] transition-colors tracking-wide">
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-[#E2E8F0] font-semibold tracking-widest aurous-silver-text break-words" : "text-[#9CA3AF] hover:text-[#E2E8F0] transition-colors cursor-pointer tracking-wide"}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

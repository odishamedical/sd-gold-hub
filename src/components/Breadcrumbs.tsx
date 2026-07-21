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
    <nav className={`flex items-center flex-wrap gap-1 text-sm font-sans text-gray-500 w-full ${className}`}>
      <Link href="/" className="hover:text-gray-900 transition-colors flex items-center">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mx-0.5" />
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-900 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-gray-900 font-semibold truncate max-w-[150px] sm:max-w-[200px]" : "hover:text-gray-900 transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-[200px]"}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

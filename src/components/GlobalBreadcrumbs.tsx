"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

export default function GlobalBreadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const text = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    return { href, text };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://golddunia.com"
      },
      ...breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": crumb.text,
        "item": "https://golddunia.com" + crumb.href
      }))
    ]
  };

  return (
    <div className="w-full bg-[#11050A]/90 backdrop-blur-md border-b border-white/5 py-3 px-4 md:px-8 z-40 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="max-w-[1400px] mx-auto">
        <ol className="flex items-center space-x-2 text-xs md:text-sm">
          <li>
            <Link href="/" className="text-white/50 hover:text-[#E3B061] transition-colors flex items-center">
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center">
                <ChevronRight className="w-3 h-3 text-white/30 mx-1" />
                {isLast ? (
                  <span className="text-[#E3B061] font-semibold" aria-current="page">
                    {crumb.text}
                  </span>
                ) : (
                  <Link href={crumb.href} className="text-white/50 hover:text-white transition-colors">
                    {crumb.text}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

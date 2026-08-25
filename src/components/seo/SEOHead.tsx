import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

const DEFAULT_IMAGE = 'https://jwellery-brand.vercel.app/assets/products/red-emerald-set.jpg';
const SITE_NAME = 'Celestia Luxury Atelier';

/**
 * Universal SEO & Social Metadata Injector component.
 * Dynamically synchronizes document title, meta tags, canonical links,
 * OpenGraph, Twitter Cards, and Schema.org JSON-LD structured data.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = 'Celestia jewellery, fine jewellery Mumbai, anti-tarnish bangles, bespoke hampers, polaroids',
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  schema,
  noIndex = false,
}) => {
  useEffect(() => {
    // 1. Synchronize Document Title
    document.title = title;

    // Helper to safely upsert meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('title', title);
    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Open Graph Tags
    const currUrl = canonical || window.location.href;
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:url', currUrl, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:locale', 'en_IN', true);

    // 4. Twitter Card Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);
    setMeta('twitter:url', currUrl);

    // 5. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currUrl);

    // 6. Schema.org JSON-LD Script Injection
    const schemaId = 'celestia-jsonld-schema';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;

    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = schemaId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(Array.isArray(schema) ? schema : [schema]);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, canonical, ogType, ogImage, schema, noIndex]);

  return null;
};

export default SEOHead;

import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "A sanctuary for deliberate focus, restorative rest, and psychological clarity in an age of noise.",
  image = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  url = window.location.href,
  type = "website"
}) => {
  const fullTitle = title ? `${title} — Mental Tactic` : "Mental Tactic — A Sanctuary for Stillness & Clarity";

  useEffect(() => {
    document.title = fullTitle;

    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', type);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
  }, [fullTitle, description, image, url, type]);

  return null;
};

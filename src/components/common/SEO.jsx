import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO Meta Tags Injector Component using react-helmet-async.
 * Handles Open Graph and Twitter Card dynamic tags.
 * @param {Object} props
 * @param {string} props.title - Dynamic page title
 * @param {string} [props.description] - Page meta description
 * @param {string} [props.image] - URL of social sharing cover image
 * @param {string} [props.type="website"] - Open Graph object type
 */
const SEO = ({ 
  title, 
  description = "Discover premium fashion, new arrivals, top selling products and exclusive collections on SHOP.CO.", 
  image = "https://via.placeholder.com/1200x630.png?text=SHOP.CO+Premium+Fashion", 
  type = "website" 
}) => {
  const defaultTitle = "SHOP.CO | Premium Fashion Store";
  const displayTitle = title ? title : defaultTitle;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{displayTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;

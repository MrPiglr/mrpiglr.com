/**
 * JSON-LD Structured Data Schemas
 * Generates schema.org markup for better SEO and rich snippets
 */

export const generateBlogPostSchema = (post, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.content?.substring(0, 160) || "Blog post by MrPiglr",
    image: post.image_url ? `${baseUrl}${post.image_url}` : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Person",
      name: post.author?.username || "MrPiglr",
      url: post.author?.username ? `${baseUrl}/profile/${post.author.username}` : baseUrl,
      image: post.author?.avatar_url || undefined,
    },
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.tags?.join(", ") || "development, tech, gaming",
    articleBody: post.content,
  };
};

export const generateArticleSchema = (post, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.content?.substring(0, 160) || "Article by MrPiglr",
    image: post.image_url ? `${baseUrl}${post.image_url}` : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Person",
      name: "MrPiglr",
      url: baseUrl,
    },
  };
};

export const generatePortfolioProjectSchema = (project, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.subtitle || "Portfolio project by MrPiglr",
    image: project.cover_image_url ? `${baseUrl}${project.cover_image_url}` : undefined,
    url: `${baseUrl}/portfolio/${project.slug}`,
    creator: {
      "@type": "Person",
      name: "MrPiglr",
      url: baseUrl,
    },
    keywords: project.tags?.join(", ") || "development, design",
  };
};

export const generateOrganizationSchema = (baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MrPiglr",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    description: "Computer Cowboy - Game Developer, Creative Technologist, and Founder of AeThex",
    sameAs: [
      "https://twitter.com/MrPiglr",
      "https://github.com/MrPiglr",
      "https://youtube.com/@MrPiglr",
      "https://linkedin.com/in/MrPiglr",
    ],
    contact: {
      "@type": "ContactPoint",
      contactType: "Contact Form",
      url: `${baseUrl}/contact`,
    },
  };
};

export const generatePersonSchema = (baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "MrPiglr",
    url: baseUrl,
    image: `${baseUrl}/avatar.jpg`,
    description: "Computer Cowboy - Game Developer, Creative Technologist, and Founder of AeThex",
    sameAs: [
      "https://twitter.com/MrPiglr",
      "https://github.com/MrPiglr",
      "https://youtube.com/@MrPiglr",
      "https://linkedin.com/in/MrPiglr",
    ],
    jobTitle: "Founder",
    affiliation: {
      "@type": "Organization",
      name: "AeThex",
    },
  };
};

export const generateProductSchema = (product, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url ? `${baseUrl}${product.image_url}` : undefined,
    url: `${baseUrl}/product/${product.id}`,
    price: product.price,
    priceCurrency: product.currency || "USD",
    brand: {
      "@type": "Brand",
      name: "MrPiglr",
    },
  };
};

export const generateBreadcrumbSchema = (items, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.url}`,
    })),
  };
};

export const generateEventSchema = (event, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.image_url ? `${baseUrl}${event.image_url}` : undefined,
    startDate: event.start_date,
    endDate: event.end_date || event.start_date,
    eventAttendanceMode: "OnlineEventAttendanceMode",
    eventStatus: event.status || "EventScheduled",
    url: `${baseUrl}/events`,
    organizer: {
      "@type": "Organization",
      name: "MrPiglr",
      url: baseUrl,
    },
  };
};

export const generateFAQSchema = (faqs, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const generateServiceSchema = (service, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "MrPiglr",
      url: baseUrl,
    },
    url: `${baseUrl}/services`,
    areaServed: "Worldwide",
    serviceType: service.category || "Consulting",
  };
};

export const generateProfileSchema = (profile, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.username,
    description: profile.bio || "Community member",
    image: profile.avatar_url || undefined,
    url: `${baseUrl}/profile/${profile.username}`,
  };
};

export const generateOfferSchema = (product, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    url: `${baseUrl}/product/${product.id}`,
    priceCurrency: product.currency || "USD",
    price: product.price,
    availability: product.in_stock ? "InStock" : "OutOfStock",
    seller: {
      "@type": "Organization",
      name: "MrPiglr Store",
      url: baseUrl,
    },
  };
};

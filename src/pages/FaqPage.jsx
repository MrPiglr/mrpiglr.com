import React from 'react';
import { Helmet } from 'react-helmet-async';
import AnimatedPage from '@/components/AnimatedPage';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/jsonLdSchemas';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


const faqItems = [
  {
    question: "What kind of games do you develop?",
    answer: "I specialize in developing immersive and interactive experiences, primarily using engines like Unity and Unreal Engine. My work spans across VR, social platforms, and traditional PC/console games with a focus on innovative mechanics and narrative."
  },
  {
    question: "Where can I listen to your music?",
    answer: "You can find my latest music on the 'Music' page of this website, which features a player with my YouTube releases. I'm also on major streaming platforms like Spotify."
  },
  {
    question: "How can I buy your merchandise?",
    answer: "All official merchandise is available through my Fourthwall store. You can see the latest products on the 'Shop' page or visit the store directly at mrpiglr.store."
  },
  {
    question: "What is AeThex?",
    answer: "AeThex is the studio I founded to serve as a hub for my larger creative projects. It's dedicated to developing innovative games and interactive media. You can learn more at aethex.biz."
  },
  {
    question: "Are you available for freelance work or collaborations?",
    answer: "I'm always open to interesting opportunities! The best way to get in touch about collaborations or professional inquiries is through the contact form on this website."
  },
];

const FaqPage = () => {
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/faq`;
  const pageDescription = "Find answers to frequently asked questions about MrPiglr, including his game development work, music, merchandise, and collaboration opportunities.";

  return (
    <AnimatedPage>
      <Helmet>
        <title>FAQ - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="FAQ - MrPiglr" />
        <meta property="og:description" content={pageDescription} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content="FAQ - MrPiglr" />
        <meta name="twitter:description" content={pageDescription} />
        
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema(faqItems, baseUrl))}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { label: "Home", url: "/" },
            { label: "FAQ", url: "/faq" }
          ], baseUrl))}
        </script>
      </Helmet>
      <div className="py-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-glow">Frequently Asked Questions</h1>
          <p style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}} className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Have a question? You might find the answer here. If not, feel free to reach out via the contact page.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-bold">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground" style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FaqPage;
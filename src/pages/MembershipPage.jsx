import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';

const MembershipPage = () => {
  const membershipUrl = 'https://mrpiglr.store/supporters/pricing';
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/membership`;
  const pageDescription = "Redirecting you to the official MrPiglr membership page where you can explore supporter tiers and benefits.";

  useEffect(() => {
    window.location.replace(membershipUrl);
  }, []);

  return (
    <AnimatedPage>
      <Helmet>
        <title>Redirecting to Membership...</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold">Redirecting to Membership...</h1>
        <p className="text-muted-foreground mt-2" style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}}>
          Please wait while we take you to the official membership page.
        </p>
        <p className="text-sm text-muted-foreground mt-6" style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}}>
          If you are not redirected automatically,{' '}
          <a href={membershipUrl} className="underline text-primary">
            click here
          </a>
          .
        </p>
      </div>
    </AnimatedPage>
  );
};

export default MembershipPage;
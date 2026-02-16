import React from 'react';
import { Helmet } from 'react-helmet-async';
import AnimatedPage from '@/components/AnimatedPage';

const TermsPage = () => {
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/terms-of-service`;
  const pageDescription = "Read the Terms of Service for using the MrPiglr website, its content, and associated services.";

  return (
    <AnimatedPage>
      <Helmet>
        <title>Terms of Service - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, follow" />
        
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Terms of Service - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
      </Helmet>
      <div className="py-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-glow">Terms of Service</h1>
          <div className="prose prose-invert max-w-none text-muted-foreground" style={{ fontFamily: 'Inter', textTransform: 'none', fontWeight: 400 }}>
            <p className="text-sm text-center">Last Updated: {new Date('2025-08-29').toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Site's particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this Site will constitute acceptance of this agreement.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">2. Description of Service</h2>
            <p>
              Our Site provides information and showcases creative works by MrPiglr, including music, books, and merchandise links. The services are provided "AS IS" and we assume no responsibility for the timeliness, deletion, or failure to store any user communications or personalization settings.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">3. Intellectual Property</h2>
            <p>
              The Site and its original content, features, and functionality are owned by MrPiglr and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You may not reuse, republish, or reprint such content without our written consent.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">4. User Conduct</h2>
            <p>
              You agree not to use the Site to:
              <ul>
                <li>- Upload, post, email, or otherwise transmit any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy.</li>
                <li>- Impersonate any person or entity.</li>
                <li>- Engage in any activity that interferes with or disrupts the Site.</li>
              </ul>
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">5. Disclaimer of Warranties</h2>
            <p>
              The use of the Site is at your sole risk. The Site is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied, including, but not to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">6. Limitation of Liability</h2>
            <p>
              In no event shall we be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from the use or inability to use the service.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">7. Changes to This Agreement</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify you of any changes by posting the new Terms of Service on this page. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">8. Contact Us</h2>
            <p>
              If you have any questions about this agreement, please feel free to contact us through the contact page.
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default TermsPage;
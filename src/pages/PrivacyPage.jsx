import React from 'react';
import { Helmet } from 'react-helmet-async';
import AnimatedPage from '@/components/AnimatedPage';

const PrivacyPage = () => {
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/privacy-policy`;
  const pageDescription = "Read the Privacy Policy for the MrPiglr website to understand how your data is collected, used, and protected.";

  return (
    <AnimatedPage>
      <Helmet>
        <title>Privacy Policy - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, follow" />
        
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Privacy Policy - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
      </Helmet>
      <div className="py-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-glow">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none text-muted-foreground" style={{ fontFamily: 'Inter', textTransform: 'none', fontWeight: 400 }}>
            <p className="text-sm text-center">Last Updated: {new Date('2025-08-29').toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-bold mt-8 text-foreground">1. Introduction</h2>
            <p>
              This Privacy Policy explains how we collect, use, and disclose information about you when you use our website. We are committed to protecting your privacy.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">2. Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us, such as your name and email address when you use our contact form. We also collect non-personal information automatically as you navigate through the site, such as usage details and IP addresses.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 text-foreground">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
              <ul>
                <li>- Respond to your inquiries and fulfill your requests.</li>
                <li>- Operate, maintain, and improve our Site.</li>
                <li>- Analyze how you use our Site to improve user experience.</li>
              </ul>
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">4. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, so long as those parties agree to keep this information confidential.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">5. Third-Party Services</h2>
            <p>
              Our Site may contain links to third-party websites. Any access to and use of such linked websites is not governed by this Policy, but instead is governed by the privacy policies of those third-party websites. We are not responsible for the information practices of such third-party websites. For example, our contact form is handled by Formspree, and our shop is powered by Fourthwall.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">6. Security</h2>
            <p>
              The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-bold mt-8 text-foreground">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PrivacyPage;
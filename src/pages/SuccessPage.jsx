import React from 'react';
    import { Helmet } from 'react-helmet-async';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { CheckCircle, ArrowLeft } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import GridBackground from '@/components/GridBackground';

    const SuccessPage = () => {
      const baseUrl = "https://www.mrpiglr.com";
      const pageUrl = `${baseUrl}/success`;
      const pageDescription = "Your payment was successful. Thank you for your purchase.";

      return (
        <>
          <Helmet>
            <title>Payment Successful! - MrPiglr</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <GridBackground />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="relative max-w-md w-full text-center glass-card p-8 rounded-2xl shadow-2xl"
            >
              <CheckCircle className="mx-auto h-20 w-20 text-green-400 mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
              <p className="text-lg text-gray-300 mb-8">
                Thank you for your purchase. Your order is being processed and you will receive a confirmation email shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/store">
                  <Button variant="outline" className="w-full border-purple-500 text-white hover:bg-purple-500/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link to="/">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      );
    };
    
    export default SuccessPage;
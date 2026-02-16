import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Sparkles, Zap, Shield, Code2, Rocket, Globe } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSite } from '@/contexts/SiteContext';

const ServiceCard = ({ service, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ 
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(138, 43, 226, 0.2), 0 10px 10px -5px rgba(138, 43, 226, 0.1)" 
    }}
    className="relative group bg-card/80 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col h-full overflow-hidden"
  >
    {/* Gradient Background Effect on Hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    {/* Glow Effect */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-6">
        {service.is_featured && (
          <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Most Popular
          </span>
        )}
        <h3 className="text-2xl font-bold text-foreground mb-2">{service.title}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-extrabold text-foreground tracking-tight">${service.price}</span>
          {service.price_description && (
            <span className="text-muted-foreground text-sm font-medium">/{service.price_description}</span>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
      </div>

      <div className="space-y-4 mb-8 flex-grow">
        {service.features && service.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 bg-primary/20 p-1 rounded-full">
              <Check className="w-3 h-3 text-primary" strokeWidth={3} />
            </div>
            <span className="text-sm text-foreground/90">{feature}</span>
          </div>
        ))}
      </div>

      <Button className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300">
        Get Started
        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </Button>
    </div>
  </motion.div>
);

const PricingPage = () => {
  const { siteId } = useSite();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('consultancy_services')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        
        // Use dummy data if no services found (for visual demonstration if DB is empty)
        if (!data || data.length === 0) {
            setServices([
                { id: 1, title: 'Web Development', price: '2,500', price_description: 'starting', description: 'Custom React websites built for performance and scale.', features: ['Responsive Design', 'SEO Optimization', 'CMS Integration', '30 Days Support'], is_featured: false },
                { id: 2, title: 'Full Stack App', price: '5,000', price_description: 'starting', description: 'Complete SaaS solutions with robust backend architecture.', features: ['Database Design', 'Authentication', 'API Development', 'Payment Integration', 'Admin Dashboard'], is_featured: true },
                { id: 3, title: 'Game Development', price: 'Custom', price_description: 'project', description: 'Immersive interactive experiences for web and desktop.', features: ['Unity / Unreal Engine', 'Multiplayer Networking', '3D Asset Creation', 'Performance Optimization'], is_featured: false },
            ]);
        } else {
            setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback data
        setServices([
            { id: 1, title: 'Web Development', price: '2,500', price_description: 'starting', description: 'Custom React websites built for performance and scale.', features: ['Responsive Design', 'SEO Optimization', 'CMS Integration', '30 Days Support'], is_featured: false },
            { id: 2, title: 'Full Stack App', price: '5,000', price_description: 'starting', description: 'Complete SaaS solutions with robust backend architecture.', features: ['Database Design', 'Authentication', 'API Development', 'Payment Integration', 'Admin Dashboard'], is_featured: true },
            { id: 3, title: 'Game Development', price: 'Custom', price_description: 'project', description: 'Immersive interactive experiences for web and desktop.', features: ['Unity / Unreal Engine', 'Multiplayer Networking', '3D Asset Creation', 'Performance Optimization'], is_featured: false },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Services | MrPiglr</title>
        <meta name="description" content="Professional web development, game design, and software engineering services by MrPiglr." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        
        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Elevate Your <span className="text-primary">Digital Presence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Crafting exceptional digital experiences through code, creativity, and cutting-edge technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-black/20">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <Code2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Clean Code</h3>
                    <p className="text-muted-foreground text-sm">Maintainable, scalable, and efficient codebases built with modern best practices.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">High Performance</h3>
                    <p className="text-muted-foreground text-sm">Optimized for speed and responsiveness to ensure the best user experience.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Global Reach</h3>
                    <p className="text-muted-foreground text-sm">Solutions designed to scale globally with robust infrastructure support.</p>
                </motion.div>
            </div>

            {/* Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your project?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
                    Let's collaborate to bring your vision to life. Contact me today for a custom quote.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 h-auto text-lg rounded-full shadow-xl shadow-primary/30">
                    Get in Touch
                </Button>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
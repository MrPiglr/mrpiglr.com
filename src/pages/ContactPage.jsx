import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import AnimatedPage from '@/components/AnimatedPage';
import { Loader2 } from 'lucide-react';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={
        'flex h-12 w-full rounded-md border border-input bg-transparent px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow focus:shadow-[0_0_15px_hsl(var(--primary)/0.5)] uppercase ' +
        (className || '')
      }
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={
        'flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow focus:shadow-[0_0_15px_hsl(var(--primary)/0.5)] uppercase ' +
        (className || '')
      }
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/contact`;
  const pageImage = `${baseUrl}/og-contact.jpg`; 
  const pageDescription = "Get in touch with MrPiglr for inquiries, collaborations, or just to say hi. Use the form to send a direct message.";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://formspree.io/f/mblagolk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        toast({
          title: "🚀 Message Sent!",
          description: "Thanks for reaching out! I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setStatus('error');
      toast({
        variant: 'destructive',
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your message. Please try again.",
      });
    } finally {
        setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <AnimatedPage>
      <Helmet>
        <title>Contact - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Contact - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="MrPiglr" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content="Contact - MrPiglr" />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      <motion.section 
        id="contact" 
        className="py-24 px-6 min-h-screen flex items-center justify-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid-background opacity-10"></div>
        <div className="max-w-2xl w-full mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-glow">Get In Touch</h1>
          <p style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}} className="text-muted-foreground mb-8">
            Have a question, a project idea, or just want to connect? Drop me a line below.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="name" type="text" placeholder="YOUR NAME" value={formData.name} onChange={handleChange} required disabled={status === 'loading'} />
              <Input name="email" type="email" placeholder="YOUR EMAIL" value={formData.email} onChange={handleChange} required disabled={status === 'loading'} />
            </div>
            <Input name="subject" type="text" placeholder="SUBJECT" value={formData.subject} onChange={handleChange} required disabled={status === 'loading'} />
            <Textarea name="message" placeholder="YOUR MESSAGE" rows={5} value={formData.message} onChange={handleChange} required disabled={status === 'loading'} />
            <Button type="submit" size="lg" className="w-full cyan-glow" disabled={status === 'loading'}>
              {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
            </Button>
          </form>
        </div>
      </motion.section>
    </AnimatedPage>
  );
};

export default ContactPage;
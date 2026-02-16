import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Briefcase } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';
import { supabase } from '@/lib/customSupabaseClient';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+Cg==";

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const displayVariant = useMemo(() => product.variants[0], [product]);
  const hasSale = useMemo(() => displayVariant && displayVariant.sale_price_in_cents !== null, [displayVariant]);
  const displayPrice = useMemo(() => hasSale ? displayVariant.sale_price_formatted : displayVariant.price_formatted, [displayVariant, hasSale]);
  const originalPrice = useMemo(() => hasSale ? displayVariant.price_formatted : null, [displayVariant, hasSale]);

  const isService = product.type?.value === 'digital-service';
  const linkTo = isService ? `/services` : `/product/${product.id}`;

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isService) {
        navigate('/services');
        return;
    }

    if (product.variants.length > 1) {
      navigate(`/product/${product.id}`);
      return;
    }

    const defaultVariant = product.variants[0];

    try {
      await addToCart(product, defaultVariant, 1, defaultVariant.inventory_quantity);
      toast({
        title: "Added to Cart! 🛒",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [product, addToCart, toast, navigate, isService]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={linkTo}>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm glass-card border-0 text-white overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
          <div className="relative">
            {isService ? (
              <div className="w-full h-64 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                <Briefcase className="w-24 h-24 text-purple-300 opacity-50" />
              </div>
            ) : (
              <img
                src={product.image || placeholderImage}
                alt={product.title}
                className="w-full h-64 object-cover transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
            {product.ribbon_text && (
              <div className="absolute top-3 left-3 bg-pink-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {product.ribbon_text}
              </div>
            )}
            <div className="absolute top-3 right-3 bg-purple-500/80 text-white text-xs font-bold px-3 py-1 rounded-full flex items-baseline gap-1.5">
              {hasSale && (
                <span className="line-through opacity-70">{originalPrice}</span>
              )}
              <span>{displayPrice}</span>
            </div>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold truncate">{product.title}</h3>
            <p className="text-sm text-gray-300 h-10 overflow-hidden flex-grow">{product.subtitle || (isService ? 'Professional Service' : 'Check out this amazing product!')}</p>
            
            {isService ? (
                <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold">
                  <Briefcase className="mr-2 h-4 w-4" /> View Service
                </Button>
            ) : (
                <Button onClick={handleAddToCart} className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch ecommerce products
        const productsResponse = await getProducts();
        const productsWithFeatures = productsResponse.products.map(p => {
          const featuresInfo = p.additional_info.find(info => info.title.toLowerCase() === 'features');
          return {
            ...p,
            is_featured: p.collections.some(c => c.collection_id === 'collection_01K8E33J794M212PZ2K3KGRJ1T'),
            features_html: featuresInfo ? featuresInfo.description : ''
          }
        });

        let finalProducts = [];
        if (productsWithFeatures.length > 0) {
          const productIds = productsWithFeatures.map(product => product.id);
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: productIds
          });
          const variantQuantityMap = new Map();
          quantitiesResponse.variants.forEach(variant => {
            variantQuantityMap.set(variant.id, variant.inventory_quantity);
          });
          finalProducts = productsWithFeatures.map(product => ({
            ...product,
            variants: product.variants.map(variant => ({
              ...variant,
              inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
            }))
          }));
        }

        // Fetch consultancy services
        const { data: services, error: servicesError } = await supabase
          .from('consultancy_services')
          .select('*')
          .order('display_order', { ascending: true });

        if (servicesError) throw servicesError;

        const serviceProducts = services.map(service => ({
          id: `service-${service.id}`,
          title: service.title,
          subtitle: service.description,
          ribbon_text: service.is_featured ? 'Featured Service' : null,
          description: service.long_description,
          image: null,
          price_in_cents: service.price * 100,
          currency: 'USD',
          purchasable: true,
          order: service.display_order + 100, // ensure services appear after products
          site_product_selection: 'lowest_price_first',
          images: [],
          options: [],
          variants: [{
            id: `service-variant-${service.id}`,
            title: 'Standard',
            price_in_cents: service.price * 100,
            sale_price_in_cents: null,
            currency: 'USD',
            price_formatted: `$${service.price.toFixed(2)}`,
            sale_price_formatted: null,
            manage_inventory: false,
            inventory_quantity: null,
          }],
          collections: [],
          additional_info: service.features.map((f, i) => ({ id: `feature-${i}`, title: 'Feature', description: f })),
          type: { value: 'digital-service' },
          custom_fields: [],
          related_products: [],
          updated_at: service.created_at,
        }));

        const combinedProducts = [...finalProducts, ...serviceProducts].sort((a, b) => (a.order || 999) - (b.order || 999));
        setProducts(combinedProducts);

      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <p>Error loading products: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-400 p-8">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((item, index) => (
        <ProductCard key={item.id} product={item} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;
import React, { useState, useEffect, useMemo, useRef } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Loader2, Lightbulb, MapPin } from 'lucide-react';
    import AnimatedPage from '@/components/AnimatedPage';
    import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
    import L from 'leaflet';

    const customIcon = new L.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="%239a47ff" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path fill="none" d="M0 0h24v24H0z"/></svg>')}`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
    });
    
    const MapController = ({ center, zoom }) => {
     const map = useMap();
      useEffect(() => {
        if(center) {
          map.flyTo(center, zoom, {
            animate: true,
            duration: 1.5
          });
        }
      }, [center, zoom, map]);
     return null;
    }

    const InspirationsPage = () => {
      const [inspirations, setInspirations] = useState([]);
      const [loading, setLoading] = useState(true);
      const [selected, setSelected] = useState(null);
      const listRefs = useRef({});

      const baseUrl = import.meta.env.VITE_APP_URL || "https://www.mrpiglr.com";
      const pageUrl = `${baseUrl}/inspirations`;
      const pageImage = `${baseUrl}/og-inspirations.jpg`; // Generic image for inspirations page
      const pageDescription = "Explore an interactive map of places and ideas that have inspired MrPiglr's creative journey in game development, music, and more.";

      useEffect(() => {
        const fetchInspirations = async () => {
          setLoading(true);
          const { data, error } = await supabase
            .from('inspirations')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching inspirations:', error);
          } else {
            const validInspirations = data.filter(i => i.latitude && i.longitude);
            setInspirations(validInspirations);
            if (validInspirations.length > 0) {
              setSelected(validInspirations[0]);
            }
          }
          setLoading(false);
        };

        fetchInspirations();
      }, []);

      useEffect(() => {
        if (selected && listRefs.current[selected.id]) {
          listRefs.current[selected.id].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }, [selected]);
      
      const centerPosition = useMemo(() => {
        if (selected) {
            return [selected.latitude, selected.longitude];
        }
        if (inspirations.length > 0) {
            return [inspirations[0].latitude, inspirations[0].longitude];
        }
        return [34.0522, -118.2437]; // Fallback to LA
      }, [selected, inspirations]);
      
      const mapZoom = useMemo(() => selected ? 12 : 4, [selected]);

      if (loading) {
        return (
          <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <AnimatedPage>
          <Helmet>
            <title>Inspirations Map - MrPiglr</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content="Inspirations Map - MrPiglr" />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={pageImage} />
            
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content="Inspirations Map - MrPiglr" />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={pageImage} />
          </Helmet>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center mb-8">
            <Lightbulb className="mx-auto h-12 w-12 text-primary mb-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-glow">Map of Inspirations</h1>
            <p className="text-lg text-muted-foreground mt-2">Explore the places that shape my work.</p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 h-[70vh]">
            <div className="md:w-1/3 h-full overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {inspirations.map(item => (
                <motion.div
                  key={item.id}
                  ref={el => listRefs.current[item.id] = el}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${selected?.id === item.id ? 'bg-primary/20 border-primary' : 'bg-card border-transparent hover:border-primary/50'}`}
                  onClick={() => setSelected(item)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    {item.image_url && (
                        <img className="w-16 h-16 rounded-md object-cover flex-shrink-0" alt={item.title} src={item.image_url} />
                    )}
                    <div className="overflow-hidden">
                      <h3 className="font-bold truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      {item.location_name && <p className="text-xs flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{item.location_name}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="md:w-2/3 h-full rounded-lg overflow-hidden border-2 border-primary/20 shadow-2xl purple-glow">
                <MapContainer center={centerPosition} zoom={mapZoom} className="h-full w-full z-0" scrollWheelZoom={false}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {inspirations.map(item => (
                        <Marker key={item.id} position={[item.latitude, item.longitude]} icon={customIcon} eventHandlers={{ click: () => setSelected(item) }}>
                            <Popup>
                                <div className="p-1 bg-card text-foreground rounded-lg shadow-lg max-w-xs">
                                  <h3 className="font-bold text-lg text-primary">{item.title}</h3>
                                  {item.description && <p className="text-sm text-muted-foreground my-2">{item.description}</p>}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    <MapController center={centerPosition} zoom={mapZoom}/>
                </MapContainer>
            </div>
          </div>
        </AnimatedPage>
      );
    };

    export default InspirationsPage;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Calendar, Clock, Twitch, Youtube, MapPin, Video, Radio } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, isFuture, isPast, formatDistanceToNow } from 'date-fns';
import AnimatedPage from '@/components/AnimatedPage';
import { useCountdown } from '@/hooks/useCountdown';
import { generateBreadcrumbSchema } from '@/lib/jsonLdSchemas';

// Countdown sub-component
const CountdownTimer = ({ targetDate }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) return <span className="text-green-400 font-bold">Live Now!</span>;

  return (
    <div className="flex gap-2 text-xs md:text-sm font-mono text-purple-300 bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
      <span className="font-bold">{days}d</span> :
      <span className="font-bold">{hours}h</span> :
      <span className="font-bold">{minutes}m</span> :
      <span className="font-bold">{seconds}s</span>
    </div>
  );
};

const EventCard = ({ event }) => {
  const isUpcoming = isFuture(new Date(event.start_time));
  const eventDate = new Date(event.start_time);

  const getIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'stream': return <Twitch className="w-4 h-4" />;
      case 'video': return <Youtube className="w-4 h-4" />;
      case 'podcast': return <Radio className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="h-full bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-900/10 overflow-hidden flex flex-col group rounded-xl">
        {/* Card Image Header */}
        <div className="relative h-56 w-full overflow-hidden">
          {event.image_url ? (
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
              <Calendar className="w-16 h-16 text-gray-700" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="outline" className="bg-black/60 backdrop-blur-md text-white border-white/10 uppercase tracking-wider text-[10px] flex items-center gap-1">
              {getIcon(event.event_type)}
              {event.event_type || 'Event'}
            </Badge>
          </div>

          {/* Date Badge */}
          <div className="absolute top-4 right-4 bg-purple-600 text-white rounded-lg p-2 text-center shadow-lg min-w-[60px]">
             <div className="text-xs uppercase font-bold tracking-widest">{format(eventDate, 'MMM')}</div>
             <div className="text-2xl font-black leading-none">{format(eventDate, 'd')}</div>
          </div>
        </div>

        <CardContent className="flex-grow p-6 pt-2">
          {/* Countdown for upcoming */}
          {isUpcoming && (
            <div className="mb-4 flex justify-center">
              <CountdownTimer targetDate={eventDate} />
            </div>
          )}

          <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-purple-400 transition-colors">
            {event.title}
          </h3>
          
          <div className="flex flex-col gap-2 mb-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>{format(eventDate, 'h:mm a')} • {format(eventDate, 'EEEE')}</span>
            </div>
            {event.stream_url && (
               <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-purple-500" />
                 <span className="truncate">Online Event</span>
               </div>
            )}
          </div>

          <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0 mt-auto">
          {event.stream_url ? (
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all" asChild>
              <a href={event.stream_url} target="_blank" rel="noopener noreferrer">
                {isUpcoming ? 'Join Waiting Room' : 'Watch Replay'}
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled className="w-full border-gray-700 text-gray-500">
              Info Unavailable
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/events`;
  const pageDescription = "Stay updated with MrPiglr's upcoming live streams, Q&A sessions, and community events.";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('mrpiglr_events')
          .select('*')
          .order('start_time', { ascending: true }); // Ascending for upcoming feels more natural (soonest first)

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const now = new Date();
    let result = [];

    if (activeTab === 'upcoming') {
      result = events
        .filter(e => new Date(e.start_time) >= now)
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    } else {
      result = events
        .filter(e => new Date(e.start_time) < now)
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time)); // Past events desc
    }
    
    setFilteredEvents(result);
  }, [activeTab, events]);

  return (
    <AnimatedPage>
      <Helmet>
        <title>Events | MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema([
            { label: "Home", url: "/" },
            { label: "Events", url: "/events" }
          ], baseUrl))}
        </script>
        
        {filteredEvents.length > 0 && filteredEvents[0] && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: filteredEvents[0].title,
              description: filteredEvents[0].description,
              image: filteredEvents[0].image_url,
              startDate: filteredEvents[0].start_time,
              endDate: filteredEvents[0].end_time || filteredEvents[0].start_time,
              eventAttendanceMode: "OnlineEventAttendanceMode",
              url: filteredEvents[0].stream_url || pageUrl,
              organizer: {
                "@type": "Organization",
                name: "MrPiglr",
                url: baseUrl
              }
            })}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-black text-white pb-20">
        <div className="relative py-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                <span className="text-white">LIVE_</span>
                <span className="text-purple-500">EVENTS</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join the stream, participate in workshops, and hang out with the community.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <Tabs defaultValue="upcoming" className="w-full mb-12" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-900 border border-gray-800 p-1 rounded-full">
                <TabsTrigger value="upcoming" className="rounded-full px-6 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past" className="rounded-full px-6 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Past Events
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="mt-0">
               {loading ? (
                 <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-purple-500" /></div>
               ) : filteredEvents.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
                 </div>
               ) : (
                 <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
                   <p className="text-gray-500">No upcoming events scheduled. Check back soon!</p>
                 </div>
               )}
            </TabsContent>

            <TabsContent value="past" className="mt-0">
               {loading ? (
                 <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-purple-500" /></div>
               ) : filteredEvents.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
                 </div>
               ) : (
                 <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
                   <p className="text-gray-500">No past events found.</p>
                 </div>
               )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default EventsPage;
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Users, FileText, Music, Brush, Book, ShoppingBag, Mail, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, loading }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

const WaitlistTable = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const ROWS_PER_PAGE = 10;

  const fetchWaitlist = useCallback(async () => {
    setLoading(true);
    try {
      const from = page * ROWS_PER_PAGE;
      const to = from + ROWS_PER_PAGE - 1;

      let query = supabase
        .from('mrpiglr_waitlist')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (searchTerm) {
        query = query.ilike('email', `%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) {
          if (error.code === '42501') {
            throw new Error('Permission denied. Please ensure you have admin rights to view this data.');
          }
          throw error;
      }

      setWaitlist(data);
      setTotalCount(count ?? 0);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error fetching waitlist data',
        description: error.message,
      });
      setWaitlist([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [toast, searchTerm, page]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
        fetchWaitlist();
    }, 300);
    
    const channel = supabase
      .channel('realtime:mrpiglr_waitlist')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mrpiglr_waitlist' }, (payload) => {
        fetchWaitlist();
      })
      .subscribe();

    return () => {
      clearTimeout(debounceFetch);
      supabase.removeChannel(channel);
    };
  }, [fetchWaitlist]);

  const pageCount = totalCount > 0 ? Math.ceil(totalCount / ROWS_PER_PAGE) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waitlist Signups</CardTitle>
        <CardDescription>
          A complete list of everyone who has signed up for the waitlist.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : waitlist.length === 0 ? (
          <p className="text-muted-foreground text-center p-8">
            {searchTerm ? 'No results found.' : 'No one has signed up for the waitlist yet.'}
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Signed Up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.email}</TableCell>
                    <TableCell className="text-right">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const tables = ['profiles', 'blog_posts', 'music', 'creations', 'books', 'products'];
        const promises = tables.map(table => 
          supabase.from(table).select('*', { count: 'exact', head: true })
        );
        
        const waitlistPromise = supabase.from('mrpiglr_waitlist').select('*', { count: 'exact', head: true });
        
        const results = await Promise.all([...promises, waitlistPromise]);

        const newStats = results.reduce((acc, result, index) => {
          const tableName = index < tables.length ? tables[index] : 'mrpiglr_waitlist';
          if (result.error) {
            console.warn(`Could not fetch count for ${tableName}: ${result.error.message}`);
            acc[tableName] = 0;
          } else {
            acc[tableName] = result.count;
          }
          return acc;
        }, {});

        setStats(newStats);

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error fetching dashboard data',
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    const channel = supabase
      .channel('realtime-admin-dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mrpiglr_waitlist' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .subscribe();
      
    return () => {
        supabase.removeChannel(channel);
    };

  }, [toast]);

  const statCards = [
    { title: "Total Users", key: "profiles", icon: Users },
    { title: "Waitlist Signups", key: "mrpiglr_waitlist", icon: Mail },
    { title: "Blog Posts", key: "blog_posts", icon: FileText },
    { title: "Music Tracks", key: "music", icon: Music },
    { title: "Creations", key: "creations", icon: Brush },
    { title: "Books", key: "books", icon: Book },
    { title: "Products", key: "products", icon: ShoppingBag },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(card => (
          <StatCard key={card.key} title={card.title} value={stats[card.key] ?? '0'} icon={card.icon} loading={loading} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        <WaitlistTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
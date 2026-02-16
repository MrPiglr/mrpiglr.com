import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, MessageSquare, RefreshCw, Mail, User, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

const statusConfig = {
  pending: { color: 'bg-yellow-500', icon: Mail },
  accepted: { color: 'bg-green-500', icon: CheckCircle },
  countered: { color: 'bg-blue-500', icon: MessageSquare },
  declined: { color: 'bg-red-500', icon: XCircle },
};

const InquiryCard = ({ inquiry, onUpdate }) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCountering, setIsCountering] = useState(false);
  const [counterMessage, setCounterMessage] = useState('');

  const handleUpdateStatus = async (status) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from('service_inquiries')
      .update({ status: status })
      .eq('id', inquiry.id);
    
    if (error) {
      toast({ variant: 'destructive', title: 'Error updating inquiry', description: error.message });
    } else {
      toast({ title: `Inquiry ${status}.` });
      onUpdate();
    }
    setIsUpdating(false);
  };
  
  const handleCounter = () => {
    // This is a placeholder for a more complex counter-offer flow.
    // In a real app, this would likely involve creating a new offer record
    // and sending an email to the user.
    toast({
      title: "Counter-offer sent (simulated)",
      description: "A notification has been sent to the user with your counter-offer.",
    });
    handleUpdateStatus('countered');
    setIsCountering(false);
    setCounterMessage('');
  };

  const StatusIcon = statusConfig[inquiry.status]?.icon || Mail;
  const statusColor = statusConfig[inquiry.status]?.color || 'bg-gray-500';

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{inquiry.service_title}</CardTitle>
            <CardDescription>
              Received {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge className={`${statusColor} text-white`}>
            <StatusIcon className="mr-2 h-4 w-4" />
            {inquiry.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground"/>
            <span className="font-semibold">{inquiry.name}</span>
        </div>
        <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground"/>
            <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">{inquiry.email}</a>
        </div>
        {inquiry.message && (
          <div className="text-sm p-3 bg-muted/50 rounded-md border">
            <p className="font-mono">{inquiry.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end">
        {isUpdating ? (
          <Loader2 className="h-6 w-6 animate-spin"/>
        ) : (
          <>
            {inquiry.status === 'pending' && (
              <>
                <Button size="sm" onClick={() => handleUpdateStatus('accepted')} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" /> Accept
                </Button>
                <Dialog open={isCountering} onOpenChange={setIsCountering}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-500/10 hover:text-blue-400">
                      <MessageSquare className="mr-2 h-4 w-4" /> Counter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Counter Offer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Send a message to {inquiry.name} with your counter-offer details. This will update the inquiry status and simulate sending them an email.</p>
                      <Textarea 
                        placeholder="e.g., I can do this for $X under these conditions..."
                        value={counterMessage}
                        onChange={(e) => setCounterMessage(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsCountering(false)}>Cancel</Button>
                      <Button onClick={handleCounter} disabled={!counterMessage}>Send Counter</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus('declined')}>
                  <XCircle className="mr-2 h-4 w-4" /> Decline
                </Button>
              </>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

const InquiriesManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const { toast } = useToast();

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('service_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }
    
    const { data, error } = await query;

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching inquiries', description: error.message });
    } else {
      setInquiries(data);
    }
    setLoading(false);
  }, [toast, filter]);

  useEffect(() => {
    fetchInquiries();
    
    const channel = supabase.channel('service_inquiries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_inquiries' }, payload => {
        fetchInquiries();
      }).subscribe();
      
    return () => {
        supabase.removeChannel(channel);
    }

  }, [fetchInquiries]);
  
  const filterButtons = ['pending', 'accepted', 'countered', 'declined', 'all'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Service Inquiries</CardTitle>
        <CardDescription>Review and respond to inquiries about your consultancy services.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          {filterButtons.map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f} ({f === filter ? inquiries.length : ''})
            </Button>
          ))}
          <Button variant="ghost" size="icon" onClick={fetchInquiries} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">No {filter} inquiries</h3>
            <p className="mt-1 text-sm text-muted-foreground">When new inquiries are submitted, they'll appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {inquiries.map(inquiry => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} onUpdate={fetchInquiries} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InquiriesManager;
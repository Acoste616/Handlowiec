import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface RealtimeStatus {
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export function useRealtimeDashboard(clientId?: string) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RealtimeStatus>({
    isConnected: false,
    lastUpdate: null,
    error: null,
  });

  useEffect(() => {
    if (!clientId) {
      setStatus(prev => ({ ...prev, error: 'No client ID provided' }));
      return;
    }

    let channel: any;

    const setupRealtimeConnection = async () => {
      try {
        // Create channel for this client
        channel = supabase
          .channel(`dashboard-updates-${clientId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'leads',
              filter: `client_id=eq.${clientId}`,
            },
            (payload: any) => {
              console.log('Leads change detected:', payload);
              
              // Invalidate dashboard stats to trigger refetch
              queryClient.invalidateQueries({ queryKey: ['dashboard-stats', clientId] });
              
              // Update specific lead in cache if it exists
              if (payload.eventType === 'UPDATE' && payload.new) {
                queryClient.setQueryData(['lead', payload.new.id], payload.new);
              }
              
              // Remove lead from cache if deleted
              if (payload.eventType === 'DELETE' && payload.old) {
                queryClient.removeQueries({ queryKey: ['lead', payload.old.id] });
              }
              
              setStatus(prev => ({ ...prev, lastUpdate: new Date() }));
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'activities',
              filter: `lead_id=in.(${await getClientLeadIds(clientId)})`,
            },
            (payload: any) => {
              console.log('Activity change detected:', payload);
              
              // Invalidate dashboard stats and activities
              queryClient.invalidateQueries({ queryKey: ['dashboard-stats', clientId] });
              queryClient.invalidateQueries({ queryKey: ['recent-activities', clientId] });
              
              setStatus(prev => ({ ...prev, lastUpdate: new Date() }));
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'team_rotations',
              filter: `client_id=eq.${clientId}`,
            },
            (payload: any) => {
              console.log('Team rotation change detected:', payload);
              
              // Invalidate team-related queries
              queryClient.invalidateQueries({ queryKey: ['team-rotations', clientId] });
              queryClient.invalidateQueries({ queryKey: ['dashboard-stats', clientId] });
              
              setStatus(prev => ({ ...prev, lastUpdate: new Date() }));
            }
          )
          .subscribe((status: any) => {
            console.log('Realtime subscription status:', status);
            
            setStatus(prev => ({
              ...prev,
              isConnected: status === 'SUBSCRIBED',
              error: status === 'CHANNEL_ERROR' ? 'Connection error' : null,
            }));
          });

      } catch (error) {
        console.error('Failed to setup realtime connection:', error);
        setStatus(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    setupRealtimeConnection();

    // Cleanup function
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [clientId, queryClient]);

  return status;
}

// Helper function to get lead IDs for activity filtering
async function getClientLeadIds(clientId: string): Promise<string> {
  try {
    const { data: leads } = await supabase
      .from('leads')
      .select('id')
      .eq('client_id', clientId)
      .limit(1000); // Reasonable limit for filter

    return leads?.map((lead: any) => lead.id).join(',') || '';
  } catch (error) {
    console.error('Failed to get client lead IDs:', error);
    return '';
  }
}

// Hook for real-time lead updates
export function useRealtimeLeads(clientId?: string) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RealtimeStatus>({
    isConnected: false,
    lastUpdate: null,
    error: null,
  });

  useEffect(() => {
    if (!clientId) return;

    const channel = supabase
      .channel(`leads-updates-${clientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `client_id=eq.${clientId}`,
        },
        (payload: any) => {
          // Invalidate leads list
          queryClient.invalidateQueries({ queryKey: ['leads', clientId] });
          
          // Update or remove specific lead
          if (payload.eventType === 'UPDATE' && payload.new) {
            queryClient.setQueryData(['lead', payload.new.id], payload.new);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            queryClient.removeQueries({ queryKey: ['lead', payload.old.id] });
          }
          
          setStatus(prev => ({ ...prev, lastUpdate: new Date() }));
        }
      )
      .subscribe((status: any) => {
        setStatus(prev => ({
          ...prev,
          isConnected: status === 'SUBSCRIBED',
          error: status === 'CHANNEL_ERROR' ? 'Connection error' : null,
        }));
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, queryClient]);

  return status;
}

// Hook for real-time activities
export function useRealtimeActivities(leadId?: string) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RealtimeStatus>({
    isConnected: false,
    lastUpdate: null,
    error: null,
  });

  useEffect(() => {
    if (!leadId) return;

    const channel = supabase
      .channel(`activities-${leadId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
          filter: `lead_id=eq.${leadId}`,
        },
        (payload: any) => {
          // Invalidate activities for this lead
          queryClient.invalidateQueries({ queryKey: ['activities', leadId] });
          
          setStatus(prev => ({ ...prev, lastUpdate: new Date() }));
        }
      )
      .subscribe((status: any) => {
        setStatus(prev => ({
          ...prev,
          isConnected: status === 'SUBSCRIBED',
          error: status === 'CHANNEL_ERROR' ? 'Connection error' : null,
        }));
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leadId, queryClient]);

  return status;
}

// Hook for connection status indicator
export function useRealtimeStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSeen, setLastSeen] = useState<Date>(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSeen(new Date());
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update last seen every minute when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        setLastSeen(new Date());
      }
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, lastSeen };
} 
import { useState, useEffect } from 'react';
import api from '../api/client';

interface Subscription {
  id: number;
  status: string;
  plan_type: string;
  expires_at: string;
}

export function useSubscription() {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[useSubscription] No token found, skipping subscription check');
      setLoading(false);
      return;
    }

    try {
      console.log('[useSubscription] Checking subscription status...');
      const response = await api.get('/subscription/status');
      console.log('[useSubscription] Subscription status:', response.data);
      setHasSubscription(response.data.hasSubscription);
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('[useSubscription] Failed to check subscription:', error);
      setHasSubscription(false);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return { hasSubscription, subscription, loading, refetch: checkSubscription };
}

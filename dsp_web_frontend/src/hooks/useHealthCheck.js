import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { checkHealth } from '../api/health';

// PUBLIC_INTERFACE
export function useHealthCheck(intervalMs = 60000) {
  /** Hook that tracks backend health state.
   * State:
   *  - status: 'idle' | 'checking' | 'online' | 'offline'
   *  - lastCheckedAt: Date | null
   *  - error: string | null
   * API:
   *  - refresh(): triggers a new health check
   * Behavior:
   *  - Runs on mount
   *  - Repeats every intervalMs (default: 60s)
   */
  const [status, setStatus] = useState('idle');
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const intervalRef = useRef(null);

  const doCheck = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('checking');
    setError(null);

    const resp = await checkHealth({ signal: controller.signal });
    setLastCheckedAt(new Date());
    if (resp.ok) {
      setStatus('online');
      setError(null);
    } else {
      setStatus('offline');
      setError(resp.error || `Status ${resp.status}`);
    }
  }, []);

  useEffect(() => {
    // initial check
    doCheck();
    // schedule interval
    intervalRef.current = setInterval(doCheck, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [doCheck, intervalMs]);

  const refresh = useCallback(() => {
    doCheck();
  }, [doCheck]);

  return useMemo(() => ({
    status,
    lastCheckedAt,
    error,
    refresh
  }), [status, lastCheckedAt, error, refresh]);
}

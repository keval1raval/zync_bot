import { useEffect, useRef } from 'react';
import { useTradingStore } from '../store/useTradingStore';

export function useMarketFeed(url: string) {
  const ws = useRef<WebSocket | null>(null);

  // Zustand માંથી ફંક્શન લઈએ છીએ
  const updateLiveStream = useTradingStore((state) => state.updateLiveStream);

  useEffect(() => {
    // localhost ની જગ્યાએ 127.0.0.1 વાપરો જેથી નેટવર્ક કનેક્શન 100% ક્લિયર રહે
    const safeUrl = url.replace('localhost', '127.0.0.1');

    let isMounted = true;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      // જો પહેલેથી કનેક્ટેડ હોય તો ફરીથી નહિ જોડે
      if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

      ws.current = new WebSocket(safeUrl);

      ws.current.onopen = () => {
        console.log("🚀 ZYNC CORE: Live institutional channels activated");
      };

      ws.current.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'ULTRA_STREAM' && isMounted) {
              updateLiveStream(data);
            }
        } catch (e) {
            console.error("Data Parse Error:", e);
        }
      };

      ws.current.onerror = () => {
        // બિનજરૂરી લાલ એરર બતાવવાને બદલે માત્ર વોર્નિંગ આપશે
        console.warn("⚠️ WebSocket Connection Interrupted.");
      };

      ws.current.onclose = () => {
        console.log("🛑 ZYNC CORE: Connection lost. Reconnecting in 2 seconds...");
        // જો કનેક્શન તૂટે તો દર 2 સેકન્ડે જાતે જ રી-ટ્રાય કરશે!
        if (isMounted) {
            reconnectTimer = setTimeout(connect, 2000);
        }
      };
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer);
      if (ws.current) ws.current.close();
    };
  }, [url]); // updateLiveStream ને ડીપેન્ડન્સી માંથી કાઢ્યું જેથી વારંવાર રીસ્ટાર્ટ ન થાય

  return ws.current;
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "../services/analytics";

export default function AnalyticsPageView() {
  const { pathname } = useLocation();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      trackPageView(pathname);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

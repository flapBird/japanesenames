"use client";

import { useEffect } from "react";

const adsenseScriptUrl =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4183802444188513";

export function GoogleAdsense() {
  useEffect(() => {
    if (
      document.querySelector(
        'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
      )
    ) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = adsenseScriptUrl;
    document.head.appendChild(script);
  }, []);

  return null;
}

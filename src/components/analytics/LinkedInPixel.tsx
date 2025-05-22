'use client';

import Script from 'next/script';

interface LinkedInPixelProps {
  pixelId: string;
}

export function LinkedInPixel({ pixelId }: LinkedInPixelProps) {
  return (
    <Script id="linkedin-pixel" strategy="afterInteractive">
      {`
        _linkedin_partner_id = "${pixelId}";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        (function(l) {
          if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
          window.lintrk.q=[]}
          var s = document.getElementsByTagName("script")[0];
          var b = document.createElement("script");
          b.type = "text/javascript";b.async = true;
          b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b, s);
        })(window.lintrk);
      `}
    </Script>
  );
} 
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Desafio Mental',
  description: 'Equipe Ativamente',
  generator: 'Desafio Mental',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            if (!window.fbq) {
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;n=f.fbq=function(){
                  n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)
                };
                if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '1309033924008612');
            }

            // Gera um eventID único para deduplicação com CAPI
            const eventId = 'pageview-' + Date.now() + '-' + Math.random().toString(36).substring(2,9);

            // Dispara o PageView com eventID
            fbq('track', 'PageView', {}, { eventID: eventId });

            // Exponha o eventId no window para enviar via API também
            window.__fb_event_id__ = eventId;
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1309033924008612&ev=PageView&noscript=1"
          />
        </noscript>

        {/* UTMify Pixel */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`
            if (!window.utmifyPixelLoaded) {
              window.pixelId = "68b8894aa4090deaa37d27b0";
              var a = document.createElement("script");
              a.setAttribute("async", "");
              a.setAttribute("defer", "");
              a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
              document.head.appendChild(a);
              window.utmifyPixelLoaded = true;
            }
          `}
        </Script>

        {/* UTMify Script */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
          strategy="afterInteractive"
          async
          defer
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

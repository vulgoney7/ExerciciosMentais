// app/layout.tsx
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel + CAPI Integration */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            if (!window.fbq) {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '1309033924008612');

              // ---------- PageView ----------
              const pageViewId = 'pageview-' + Date.now();
              fbq('track', 'PageView', {}, { eventID: pageViewId });
              fetch('/api/meta-capi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_name: 'PageView', event_id: pageViewId })
              });

              // ---------- ViewContent ----------
              const viewContentId = 'viewcontent-' + Date.now();
              fbq('track', 'ViewContent', { content_name: document.title }, { eventID: viewContentId });
              fetch('/api/meta-capi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_name: 'ViewContent', event_id: viewContentId })
              });

              // Função helper para disparar eventos customizados
              window.trackMetaEvent = function(eventName, customData = {}) {
                const eid = eventName.toLowerCase() + '-' + Date.now();
                fbq('track', eventName, customData, { eventID: eid });
                fetch('/api/meta-capi', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ event_name: eventName, event_id: eid })
                });
                return eid;
              }
            }
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
      </head>

      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />

        {/* Botões de exemplo para AddToCart e InitiateCheckout */}
        <Script id="custom-event-binds" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', () => {
              const cta = document.querySelector('.cta-button');
              const checkout = document.querySelector('.checkout-button');

              if (cta) {
                cta.addEventListener('click', () => {
                  window.trackMetaEvent('AddToCart', { content_name: 'Oferta Principal' });
                });
              }

              if (checkout) {
                checkout.addEventListener('click', () => {
                  window.trackMetaEvent('InitiateCheckout', { value: 97.00, currency: 'BRL' });
                });
              }
            });
          `}
        </Script>
      </body>
    </html>
  )
}

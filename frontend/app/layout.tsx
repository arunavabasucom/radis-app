import React from "react";
import "./globals.css";
import Head from "next/head";
import { GA_TRACKING_ID } from "../utils/gtag";

export const metadata = {
  title: "RADIS App",
  description:
    "Web app for RADIS: fast molecular spectra. https://radis.github.io/",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
          `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="./radis.png" />
        <link rel="apple-touch-icon" href="./radis.png" />
      </Head>
      <html lang="en">
        <body>{children}</body>
      </html>
    </>
  );
}

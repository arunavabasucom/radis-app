"use client";
import React, { useEffect } from "react";
import { useRouter } from "next-router-mock";
import * as gtag from "../utils/gtag";
import App from "./App";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <App />
    </>
  );
}

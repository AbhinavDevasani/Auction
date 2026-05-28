"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function AppToaster() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Initial check
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Observe changes to the html class attribute
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains("dark");
      setTheme(isDarkNow ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return <Toaster theme={theme} richColors closeButton position="top-right" />;
}

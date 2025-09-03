// src/components/LazyLoader.tsx
import { Suspense, useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, speed: 400 });

export default function LazyLoader({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return <Suspense fallback={null}>{children}</Suspense>;
}

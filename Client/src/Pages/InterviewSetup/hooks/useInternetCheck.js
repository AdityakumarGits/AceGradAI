import { useEffect, useState } from "react";

export function useInternetCheck() {
  const [internetOk, setInternetOk] = useState(null);

  useEffect(() => {
    const checkInternet = async () => {
      const start = performance.now();
      try {
        await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
        const duration = performance.now() - start;
        setInternetOk(duration < 3000);
      } catch {
        setInternetOk(false);
      }
    };
    checkInternet();
  }, []);

  return internetOk;
}
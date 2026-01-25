function extractCorsError(handler) {
    const corsFetchErrors = new Set();
    window.addEventListener("unhandledrejection", e => {
      const err = e.reason;
      if (err instanceof TypeError) {
        corsFetchErrors.add(Date.now());
      }
    });
    const po = new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        if (e.transferSize === 0 && e.decodedBodySize > 0) {
          console.log("確定CORS", e.name);
          handler();
        }
      }
    });
    po.observe({ entryTypes: ["resource"] });
}
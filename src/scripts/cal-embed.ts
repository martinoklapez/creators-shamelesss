declare global {
  interface Window {
    Cal?: CalApi;
  }
}

interface CalApi {
  loaded?: boolean;
  ns: Record<string, CalNamespace>;
  q: unknown[];
  (command: "init", namespace: string, options: { origin: string }): void;
  (command: string, ...args: unknown[]): void;
}

type CalNamespace = ((command: string, options?: unknown) => void) & {
  q?: unknown[];
};

function fixCalEmbedSizing(): void {
  const container = document.getElementById("my-cal-inline-shamelesss");
  if (!container) return;

  const patchIframe = (iframe: HTMLIFrameElement) => {
    container.style.overflow = "visible";
    container.style.maxHeight = "none";
    container.style.height = "auto";
    iframe.setAttribute("scrolling", "no");
    iframe.style.overflow = "hidden";
    iframe.style.maxHeight = "none";
    iframe.style.border = "none";
  };

  const existing = container.querySelector("iframe");
  if (existing) {
    patchIframe(existing);
    return;
  }

  const observer = new MutationObserver(() => {
    const iframe = container.querySelector("iframe");
    if (!iframe) return;
    patchIframe(iframe);
    observer.disconnect();
  });

  observer.observe(container, { childList: true, subtree: true });
}

export function initCalBooking(): void {
  if (!document.getElementById("my-cal-inline-shamelesss")) return;

  (function (C: Window, A: string, L: string) {
    const p = function (a: CalApi | CalNamespace, ar: unknown) {
      (a as CalApi).q.push(ar);
    };
    const d = C.document;
    C.Cal =
      C.Cal ||
      function (this: CalApi) {
        const cal = C.Cal as CalApi;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments);
          } as CalNamespace;
          const namespace = ar[1] as string;
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      } as CalApi;
  })(window, "https://app.cal.com/embed/embed.js", "init");

  const Cal = window.Cal;
  if (!Cal) return;

  Cal("init", "shamelesss", { origin: "https://app.cal.com" });
  (Cal as CalApi & { config?: { forwardQueryParams?: boolean } }).config = (
    Cal as CalApi & { config?: { forwardQueryParams?: boolean } }
  ).config || {};
  (Cal as CalApi & { config?: { forwardQueryParams?: boolean } }).config!.forwardQueryParams = true;

  Cal.ns.shamelesss("inline", {
    elementOrSelector: "#my-cal-inline-shamelesss",
    config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
    calLink: "martino-klapez-fchuta/shamelesss",
  });

  Cal.ns.shamelesss("ui", {
    cssVarsPerTheme: {
      light: { "cal-brand": "#ff5352" },
      dark: { "cal-brand": "#ff5352" },
    },
    hideEventTypeDetails: false,
    layout: "month_view",
  });

  fixCalEmbedSizing();
}

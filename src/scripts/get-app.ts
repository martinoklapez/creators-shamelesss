function getPlatform(): "android" | "ios" | "desktop" {
  const ua = navigator.userAgent || navigator.vendor || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  return "desktop";
}

export function initGetApp(storeUrl: string): void {
  const cta = document.getElementById("get-app");
  if (!cta || !storeUrl) return;

  cta.addEventListener("click", (e) => {
    e.preventDefault();
    const platform = getPlatform();

    if (platform === "desktop" || platform === "ios" || platform === "android") {
      window.location.href = storeUrl;
    }
  });
}

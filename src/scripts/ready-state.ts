export function initReadyState(): void {
  const home = document.getElementById("brand-home");
  if (!home) return;

  const markReady = () => home.classList.add("brand-home--ready");

  markReady();

  if (document.fonts?.ready) {
    document.fonts.ready.then(markReady);
  }
}

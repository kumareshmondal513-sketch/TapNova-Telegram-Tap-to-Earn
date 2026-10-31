/* =====================================================
   TAPNOVA - PWA INSTALLATION
   FILE 08: pwa.js
   Path: TapNova/frontend/pwa.js
===================================================== */

let installPromptEvent = null;

/* REGISTER SERVICE WORKER */

async function registerTapNovaServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker is not supported.");
    return false;
  }

  try {
    const registration =
      await navigator.serviceWorker.register(
        "./service-worker.js"
      );

    console.log(
      "TapNova Service Worker registered:",
      registration.scope
    );

    return true;

  } catch (error) {
    console.error(
      "Service Worker registration failed:",
      error
    );

    return false;
  }
}

/* INSTALL PROMPT */

window.addEventListener(
  "beforeinstallprompt",
  (event) => {
    event.preventDefault();

    installPromptEvent = event;

    console.log("TapNova installation is available.");

    window.dispatchEvent(
      new CustomEvent("tapnova-install-ready")
    );
  }
);

/* INSTALL APPLICATION */

async function installTapNova() {
  if (!installPromptEvent) {
    return false;
  }

  installPromptEvent.prompt();

  const result =
    await installPromptEvent.userChoice;

  installPromptEvent = null;

  return result.outcome === "accepted";
}

/* INSTALLED EVENT */

window.addEventListener("appinstalled", () => {
  installPromptEvent = null;

  console.log("TapNova installed successfully.");

  window.dispatchEvent(
    new CustomEvent("tapnova-installed")
  );
});

/* PUBLIC FUNCTIONS */

window.TapNovaPWA = {
  register: registerTapNovaServiceWorker,
  install: installTapNova,

  isInstallAvailable() {
    return installPromptEvent !== null;
  }
};

/* START */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    registerTapNovaServiceWorker
  );
} else {
  registerTapNovaServiceWorker();
}
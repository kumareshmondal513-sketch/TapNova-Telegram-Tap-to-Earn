/* =====================================================
   TAPNOVA - FRONTEND APPLICATION
   FILE 03: app.js
   Path: TapNova/frontend/app.js
===================================================== */

const CONFIG = {
  API_BASE_URL:
    window.TAPNOVA_API_URL ||
    window.TAPBOT_API_URL ||
    window.location.origin,

  APP_NAME: "TapNova",
  DEFAULT_LANGUAGE: "bn"
};

const state = {
  telegramUser: null,
  telegramId: null,
  language: CONFIG.DEFAULT_LANGUAGE,
  currentPage: "home",
  apiConnected: false,
  user: null,
  isLoading: false
};

/* -----------------------------
   DOM HELPERS
----------------------------- */

const $ = (id) => document.getElementById(id);

function showToast(message) {
  const toast = $("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

function setLoading(show) {
  const screen = $("loadingScreen");

  if (!screen) return;

  screen.classList.toggle("hidden", !show);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

/* -----------------------------
   TELEGRAM MINI APP
----------------------------- */

function initializeTelegram() {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    console.warn("Telegram WebApp is not available.");
    showToast("Telegram Mini App-এর বাইরে চালু হয়েছে।");
    return;
  }

  tg.ready();
  tg.expand();

  try {
    tg.setHeaderColor("#101027");
    tg.setBackgroundColor("#101027");
  } catch (error) {
    console.warn("Telegram theme setup failed:", error);
  }

  state.telegramUser = tg.initDataUnsafe?.user || null;

  if (state.telegramUser) {
    state.telegramId = String(state.telegramUser.id);

    const firstName =
      state.telegramUser.first_name || "Player";

    const lastName =
      state.telegramUser.last_name || "";

    const fullName = `${firstName} ${lastName}`.trim();

    setText("userName", fullName);
    setText("profileName", fullName);
    setText("userId", `ID: ${state.telegramId}`);
    setText("profileTelegramId", state.telegramId);

    const photo = state.telegramUser.photo_url;

    if (photo && $("userAvatar")) {
      $("userAvatar").src = photo;
    }

    const startParam =
      tg.initDataUnsafe?.start_param || "";

    if (startParam) {
      console.log("Telegram start parameter:", startParam);
    }
  } else {
    setText("userName", "Guest Player");
    setText("profileName", "Guest Player");
  }

  console.log("Telegram Mini App initialized.");
}

/* -----------------------------
   API REQUEST
----------------------------- */

async function apiRequest(path, options = {}) {
  const url =
    CONFIG.API_BASE_URL.replace(/\/+$/, "") +
    path;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const tg = window.Telegram?.WebApp;

  if (tg?.initData) {
    headers["X-Telegram-Init-Data"] = tg.initData;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || `API Error: ${response.status}`
    );
  }

  return data;
}

/* -----------------------------
   SERVER CONNECTION CHECK
----------------------------- */

async function checkServerConnection() {
  try {
    const result = await apiRequest("/health");

    state.apiConnected = result.success === true;

    console.log("TapNova server status:", result);
  } catch (error) {
    state.apiConnected = false;

    console.warn(
      "TapNova server connection failed:",
      error.message
    );
  }

  setText(
    "balanceStatus",
    state.apiConnected
      ? "Server connected"
      : "Server connection unavailable"
  );
}

/* -----------------------------
   USER DATA
----------------------------- */

async function loadUserData() {
  if (!state.telegramId) {
    console.warn("Telegram user ID not found.");
    return;
  }

  try {
    const result = await apiRequest(
      `/api/users/${encodeURIComponent(state.telegramId)}`
    );

    if (result.success && result.user) {
      state.user = result.user;
      updateUserInterface(result.user);
    }
  } catch (error) {
    console.warn("User data could not be loaded:", error.message);
  }
}

function updateUserInterface(user) {
  if (!user) return;

  const balance =
    user.balance ??
    user.coins ??
    user.coinBalance ??
    0;

  const energy =
    user.energy ??
    user.currentEnergy ??
    0;

  const maxEnergy =
    user.maxEnergy ??
    1000;

  setText("coinBalance", formatNumber(balance));
  setText("walletBalance", formatNumber(balance));
  setText("currentEnergy", formatNumber(energy));
  setText("maxEnergy", formatNumber(maxEnergy));

  setText(
    "userLevel",
    user.level ? `Level ${user.level}` : "Level 1"
  );

  updateEnergyProgress(energy, maxEnergy);
}

function updateEnergyProgress(current, maximum) {
  const progress = $("energyProgress");

  if (!progress) return;

  const percentage =
    maximum > 0
      ? Math.max(0, Math.min(100, (current / maximum) * 100))
      : 0;

  progress.style.width = `${percentage}%`;
}

/* -----------------------------
   PAGE NAVIGATION
----------------------------- */

function navigateTo(page) {
  const allowedPages = [
    "home",
    "tasks",
    "ads",
    "referrals",
    "wallet",
    "profile",
    "leaderboard"
  ];

  if (!allowedPages.includes(page)) {
    return;
  }

  state.currentPage = page;

  allowedPages.forEach((name) => {
    const section = $(`${name}Page`);

    if (section) {
      section.classList.toggle(
        "active",
        name === page
      );
    }
  });

  document
    .querySelectorAll("[data-page]")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.page === page
      );
    });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  loadPageData(page);
}

function initializeNavigation() {
  document
    .querySelectorAll("[data-page]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        navigateTo(button.dataset.page);
      });
    });

  document
    .querySelectorAll("[data-action]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "withdraw") {
          navigateTo("wallet");
        }

        if (action === "tasks") {
          navigateTo("tasks");
        }

        if (action === "referrals") {
          navigateTo("referrals");
        }

        if (action === "profile") {
          navigateTo("profile");
        }
      });
    });
}

/* -----------------------------
   PAGE DATA
----------------------------- */

async function loadPageData(page) {
  switch (page) {
    case "home":
      await loadUserData();
      break;

    case "tasks":
      showComingSoon("Tasks");
      break;

    case "ads":
      showComingSoon("Ads");
      break;

    case "referrals":
      updateReferralInformation();
      break;

    case "wallet":
      await loadUserData();
      break;

    case "profile":
      updateProfileInformation();
      break;

    case "leaderboard":
      showComingSoon("Leaderboard");
      break;
  }
}

function showComingSoon(feature) {
  console.log(`${feature} API integration is pending.`);
}

/* -----------------------------
   TAP BUTTON
----------------------------- */

function initializeTapButton() {
  const tapButton = $("tapButton");

  if (!tapButton) return;

  tapButton.addEventListener("click", () => {
    if (!state.telegramId) {
      showToast("Telegram অ্যাকাউন্ট দিয়ে খুলুন।");
      return;
    }

    showToast(
      "Tap Reward চালু করতে Backend API সংযোগ প্রয়োজন।"
    );
  });
}

/* -----------------------------
   DAILY REWARD
----------------------------- */

function initializeDailyReward() {
  const button = $("dailyRewardBtn");

  if (!button) return;

  button.addEventListener("click", () => {
    if (!state.telegramId) {
      showToast("Telegram অ্যাকাউন্ট দিয়ে খুলুন।");
      return;
    }

    showToast(
      "Daily Reward API সংযোগ এখনো প্রস্তুত নয়।"
    );
  });
}

/* -----------------------------
   REFERRAL SYSTEM
----------------------------- */

function updateReferralInformation() {
  const code =
    state.user?.referralCode ||
    state.telegramId ||
    "";

  setText("referralCode", code);

  setText(
    "referralCount",
    formatNumber(state.user?.referralCount || 0)
  );
}

function initializeReferralButton() {
  const button = $("copyReferralBtn");

  if (!button) return;

  button.addEventListener("click", async () => {
    const code = $("referralCode")?.textContent || "";

    if (!code) {
      showToast("Referral Code পাওয়া যায়নি।");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      showToast("Referral Code কপি হয়েছে।");
    } catch (error) {
      showToast("কপি করা যায়নি।");
    }
  });
}

/* -----------------------------
   PROFILE
----------------------------- */

function updateProfileInformation() {
  if (!state.telegramUser) return;

  const fullName = [
    state.telegramUser.first_name,
    state.telegramUser.last_name
  ]
    .filter(Boolean)
    .join(" ");

  setText("profileName", fullName || "Player");
  setText("profileTelegramId", state.telegramId || "");
}

/* -----------------------------
   LANGUAGE
----------------------------- */

const translations = {
  bn: {
    home: "হোম",
    tasks: "টাস্ক",
    ads: "অ্যাড",
    referrals: "রেফারেল",
    wallet: "ওয়ালেট",
    profile: "প্রোফাইল",
    leaderboard: "লিডারবোর্ড"
  },

  en: {
    home: "Home",
    tasks: "Tasks",
    ads: "Ads",
    referrals: "Referrals",
    wallet: "Wallet",
    profile: "Profile",
    leaderboard: "Leaderboard"
  }
};

function setLanguage(language) {
  if (!translations[language]) return;

  state.language = language;

  document
    .querySelectorAll("[data-translate]")
    .forEach((element) => {
      const key = element.dataset.translate;

      if (translations[language][key]) {
        element.textContent =
          translations[language][key];
      }
    });

  setText(
    "languageBtn",
    language === "bn" ? "EN" : "বাংলা"
  );
}

function initializeLanguageButton() {
  const button = $("languageBtn");

  if (!button) return;

  button.addEventListener("click", () => {
    const nextLanguage =
      state.language === "bn" ? "en" : "bn";

    setLanguage(nextLanguage);
  });

  setLanguage(state.language);
}

/* -----------------------------
   NOTIFICATION BUTTON
----------------------------- */

function initializeNotificationButton() {
  const button = $("notificationBtn");

  if (!button) return;

  button.addEventListener("click", () => {
    showToast("এখন কোনো নতুন নোটিফিকেশন নেই।");
  });
}

/* -----------------------------
   ENERGY UPGRADE
----------------------------- */

function initializeEnergyUpgrade() {
  const button = $("energyUpgradeBtn");

  if (!button) return;

  button.addEventListener("click", () => {
    showToast(
      "Energy Upgrade API সংযোগ এখনো প্রস্তুত নয়।"
    );
  });
}

/* -----------------------------
   WITHDRAWAL
----------------------------- */

function initializeWithdrawal() {
  const button = $("withdrawBtn");

  if (!button) return;

  button.addEventListener("click", () => {
    showToast(
      "Withdrawal API সংযোগের পর এই সুবিধা চালু হবে।"
    );
  });
}

/* -----------------------------
   UTILITY
----------------------------- */

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent = value ?? "";
  }
}

/* -----------------------------
   APPLICATION START
----------------------------- */

async function initializeApp() {
  setLoading(true);

  initializeTelegram();

  initializeNavigation();
  initializeTapButton();
  initializeDailyReward();
  initializeReferralButton();
  initializeLanguageButton();
  initializeNotificationButton();
  initializeEnergyUpgrade();
  initializeWithdrawal();

  await checkServerConnection();
  await loadUserData();

  navigateTo("home");

  setLoading(false);

  console.log(`${CONFIG.APP_NAME} Frontend initialized.`);
}

document.addEventListener(
  "DOMContentLoaded",
  initializeApp
);
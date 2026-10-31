/* =====================================================
   TAPNOVA - ADMIN PANEL
   FILE 11: admin.js
   Path: TapNova/frontend/admin.js
===================================================== */

const ADMIN_CONFIG = {
  apiBaseUrl:
    window.TAPNOVA_API_URL ||
    window.TAPBOT_API_URL ||
    window.location.origin,

  // Backend route যাচাই করার পর এখানে সঠিক URL বসবে।
  verificationEndpoint: null,
  dashboardEndpoint: null
};

const adminState = {
  authorized: false,
  role: null,
  dashboard: null
};

/* -----------------------------
   HELPERS
----------------------------- */

function adminElement(id) {
  return document.getElementById(id);
}

function adminMessage(message) {
  const element = adminElement("adminStatus");

  if (element) {
    element.textContent = message;
  }
}

function adminNumber(value) {
  return Number(value || 0).toLocaleString();
}

/* -----------------------------
   API REQUEST
----------------------------- */

async function adminRequest(endpoint) {
  const tg = window.Telegram?.WebApp;

  if (!tg?.initData) {
    throw new Error(
      "Telegram-এর মাধ্যমে লগইন করা হয়নি।"
    );
  }

  if (!endpoint) {
    throw new Error(
      "Backend Admin API এখনো সংযুক্ত করা হয়নি।"
    );
  }

  const baseUrl =
    ADMIN_CONFIG.apiBaseUrl.replace(/\/+$/, "");

  const response = await fetch(
    baseUrl + endpoint,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-Init-Data": tg.initData
      }
    }
  );

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || "অনুমতি যাচাই করা যায়নি।"
    );
  }

  return data;
}

/* -----------------------------
   ADMIN VERIFICATION
----------------------------- */

async function verifyAdmin() {
  adminState.authorized = false;
  adminState.role = null;

  try {
    const result = await adminRequest(
      ADMIN_CONFIG.verificationEndpoint
    );

    if (
      result.authorized !== true ||
      !result.role
    ) {
      throw new Error(
        "আপনার অ্যাডমিন অনুমতি নেই।"
      );
    }

    const allowedRoles = [
      "main_admin",
      "sub_admin",
      "chairman"
    ];

    if (!allowedRoles.includes(result.role)) {
      throw new Error(
        "অনুমোদিত অ্যাডমিন রোল পাওয়া যায়নি।"
      );
    }

    adminState.authorized = true;
    adminState.role = result.role;

    return true;

  } catch (error) {
    adminMessage(error.message);
    return false;
  }
}

/* -----------------------------
   DASHBOARD
----------------------------- */

async function loadAdminDashboard() {
  if (!adminState.authorized) {
    return;
  }

  try {
    const result = await adminRequest(
      ADMIN_CONFIG.dashboardEndpoint
    );

    if (!result.dashboard) {
      throw new Error(
        "Dashboard তথ্য পাওয়া যায়নি।"
      );
    }

    adminState.dashboard = result.dashboard;

    updateAdminDashboard(result.dashboard);

  } catch (error) {
    adminMessage(
      "Dashboard লোড করা যায়নি: " +
      error.message
    );
  }
}

function updateAdminDashboard(data) {
  const values = {
    totalUsers: data.totalUsers,
    activeUsers: data.activeUsers,
    totalCoins: data.totalCoins,
    pendingWithdrawals: data.pendingWithdrawals
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = adminElement(id);

    if (element && value !== undefined) {
      element.textContent = adminNumber(value);
    }
  });

  adminMessage(
    `অ্যাডমিন যাচাই সফল। আপনার রোল: ${adminState.role}`
  );
}

/* -----------------------------
   ADMIN MENU
----------------------------- */

function initializeAdminMenu() {
  document
    .querySelectorAll("[data-admin-page]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (!adminState.authorized) {
          adminMessage(
            "অ্যাডমিন অনুমতি ছাড়া এই কাজ করা যাবে না।"
          );

          return;
        }

        const page = button.dataset.adminPage;

        adminMessage(
          `${page} পেজের Backend সংযোগ এখনো প্রস্তুত নয়।`
        );
      });
    });
}

/* -----------------------------
   START ADMIN PANEL
----------------------------- */

async function initializeAdminPanel() {
  adminMessage("অ্যাডমিন অনুমতি যাচাই করা হচ্ছে...");

  initializeAdminMenu();

  const authorized = await verifyAdmin();

  if (!authorized) {
    adminMessage(
      "অ্যাক্সেস বন্ধ: সার্ভার থেকে বৈধ অ্যাডমিন অনুমতি পাওয়া যায়নি।"
    );

    return;
  }

  await loadAdminDashboard();
}

document.addEventListener(
  "DOMContentLoaded",
  initializeAdminPanel
);
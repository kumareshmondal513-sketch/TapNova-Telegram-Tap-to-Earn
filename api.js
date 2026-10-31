/* =====================================================
   TAPNOVA - API CLIENT
   FILE 05: api.js
   Path: TapNova/frontend/api.js
===================================================== */

const API_CONFIG = {
  baseUrl:
    window.TAPNOVA_API_URL ||
    window.TAPBOT_API_URL ||
    window.location.origin,

  timeout: 15000
};

function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || "";
}

async function request(endpoint, options = {}) {
  const controller = new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(),
    API_CONFIG.timeout
  );

  try {
    const baseUrl = API_CONFIG.baseUrl.replace(/\/+$/, "");

    const path = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      "X-Telegram-Init-Data": getTelegramInitData(),
      ...options.headers
    };

    const response = await fetch(baseUrl + path, {
      ...options,
      headers,
      signal: controller.signal
    });

    let result = {};

    try {
      result = await response.json();
    } catch {
      throw new Error("সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি।");
    }

    if (!response.ok || result.success === false) {
      throw new Error(
        result.message || `Request failed: ${response.status}`
      );
    }

    return result;

  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("সার্ভারের উত্তর পেতে বেশি সময় লাগছে।");
    }

    throw error;

  } finally {
    clearTimeout(timeoutId);
  }
}

/* -----------------------------
   HEALTH CHECK
----------------------------- */

export async function checkHealth() {
  return request("/health");
}

/* -----------------------------
   USER
----------------------------- */

export async function getUser(telegramId) {
  if (!telegramId) {
    throw new Error("Telegram ID পাওয়া যায়নি।");
  }

  return request(
    `/api/users/${encodeURIComponent(telegramId)}`
  );
}

export async function registerUser(userData) {
  if (!userData?.telegramId) {
    throw new Error("Telegram ID আবশ্যক।");
  }

  return request("/api/users/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });
}

/* -----------------------------
   TAP
----------------------------- */

export async function submitTap(telegramId) {
  if (!telegramId) {
    throw new Error("Telegram ID পাওয়া যায়নি।");
  }

  return request("/api/taps", {
    method: "POST",
    body: JSON.stringify({ telegramId })
  });
}

/* -----------------------------
   GENERAL API
----------------------------- */

export async function postData(endpoint, data) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function getData(endpoint) {
  return request(endpoint);
}

export async function putData(endpoint, data) {
  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export async function deleteData(endpoint) {
  return request(endpoint, {
    method: "DELETE"
  });
}

export default {
  checkHealth,
  getUser,
  registerUser,
  submitTap,
  getData,
  postData,
  putData,
  deleteData
};
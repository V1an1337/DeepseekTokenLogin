chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  const url = currentTab.url;

  if (!url.includes("chat.deepseek.com")) {
    chrome.tabs.create({ url: "https://chat.deepseek.com" });
    return;
  }
});
document.getElementById("loginBtn").addEventListener("click", () => {
  const token = document.getElementById("tokenInput").value.trim();

  if (!token) {
    alert("Token cannot be empty!");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const url = currentTab.url;

    if (!url.includes("chat.deepseek.com")) {
      if (confirm("The current tab is not chat.deepseek.com, shall we jump?")) {
        chrome.tabs.create({ url: "https://chat.deepseek.com" });
      }
      return;
    }

    chrome.storage.local.set({ userToken: token }, () => {
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: injectToken,
        args: [token]
      });
    });
  });
});


document.getElementById("getBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: getUserToken
    }, (results) => {
      if (results && results[0] && results[0].result) {
        document.getElementById("tokenInput").value = results[0].result;
        alert("Successfully get the token!");
      } else {
        alert("Failed to get the token, please make sure you have login and visit chat.deepseek.com");
      }
    });
  });
});

function injectToken(token) {
  localStorage.setItem("userToken", JSON.stringify({
    value: token,
    __version: "0"
  }));
  location.reload();
}

function getUserToken() {
  try {
    const stored = localStorage.getItem("userToken");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.value || null;
  } catch (e) {
    return null;
  }
}

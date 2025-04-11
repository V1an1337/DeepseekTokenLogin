document.getElementById("loginBtn").addEventListener("click", () => {
    const token = document.getElementById("tokenInput").value.trim();
  
    if (!token) {
      alert("Token 不能为空！");
      return;
    }
  
    chrome.storage.local.set({ userToken: token }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
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
  
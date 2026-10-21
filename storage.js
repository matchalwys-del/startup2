// Storage Utility - Dual Engine (chrome.storage.sync & localStorage)
export const getStorageData = async (key, defaultValue) => {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key], (result) => {
        resolve(result[key] !== undefined ? result[key] : defaultValue);
      });
    });
  }
  const localVal = localStorage.getItem(key);
  return localVal ? JSON.parse(localVal) : defaultValue;
};

export const setStorageData = async (key, value) => {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => resolve(true));
    });
  }
  localStorage.setItem(key, JSON.stringify(value));
  return true;
};
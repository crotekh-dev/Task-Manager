/**
 * Safe localStorage utility with error handling
 */

const STORAGE_KEYS = {
  TASKS: "tasks",
  THEME: "theme",
};

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn("localStorage not available:", e.message);
    return false;
  }
};

/**
 * Get tasks from localStorage
 */
export const getTasks = () => {
  try {
    if (!isStorageAvailable()) {
      console.warn("localStorage unavailable, returning empty array");
      return [];
    }
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error reading tasks from localStorage:", error);
    return [];
  }
};

/**
 * Save tasks to localStorage
 */
export const saveTasks = (tasks) => {
  try {
    if (!isStorageAvailable()) {
      console.warn("localStorage unavailable, tasks not saved");
      return false;
    }
    if (!Array.isArray(tasks)) {
      throw new Error("Tasks must be an array");
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
    return false;
  }
};

/**
 * Clear all tasks from localStorage
 */
export const clearTasks = () => {
  try {
    if (!isStorageAvailable()) {
      console.warn("localStorage unavailable, cannot clear tasks");
      return false;
    }
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    return true;
  } catch (error) {
    console.error("Error clearing tasks from localStorage:", error);
    return false;
  }
};

/**
 * Get theme preference from localStorage
 */
export const getTheme = () => {
  try {
    if (!isStorageAvailable()) {
      return "light";
    }
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  } catch (error) {
    console.error("Error reading theme from localStorage:", error);
    return "light";
  }
};

/**
 * Save theme preference to localStorage
 */
export const saveTheme = (theme) => {
  try {
    if (!isStorageAvailable()) {
      console.warn("localStorage unavailable, theme not saved");
      return false;
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    return true;
  } catch (error) {
    console.error("Error saving theme to localStorage:", error);
    return false;
  }
};

/**
 * Get available storage space (rough estimate)
 */
export const getStorageInfo = () => {
  try {
    if (!isStorageAvailable()) {
      return { available: false, estimate: 0 };
    }

    let testSize = 0;
    const test = () => {
      const testStr = "x";
      const testObj = {};
      try {
        for (let i = 0; i < 1024; i++) {
          testObj[i] = testStr;
        }
        localStorage.setItem("__test__", JSON.stringify(testObj));
        testSize += JSON.stringify(testObj).length;
        localStorage.removeItem("__test__");
      } catch (e) {
        return testSize;
      }
    };

    test();
    return { available: true, estimate: testSize };
  } catch (error) {
    console.error("Error getting storage info:", error);
    return { available: false, estimate: 0 };
  }
};

export default {
  STORAGE_KEYS,
  isStorageAvailable,
  getTasks,
  saveTasks,
  clearTasks,
  getTheme,
  saveTheme,
  getStorageInfo,
};

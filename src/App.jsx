import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa6";
import "./App.css";
import Todolist from "./components/TodoList";
import { getTheme, saveTheme } from "./utils/storage";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [darkMode, setDarkMode] = useState(getTheme() === "dark");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      saveTheme("dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      saveTheme("light");
    }
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode((prevMode) => !prevMode);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <button onClick={toggleDarkMode} className="theme-btn">
        {darkMode ? (
          <FaSun className="sun-icon" />
        ) : (
          <FaMoon className="moon-icon" />
        )}
      </button>
      <Todolist />
    </>
  );
}

export default App;

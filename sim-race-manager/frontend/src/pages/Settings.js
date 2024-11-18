/**
 * Web Page for editing the system settings of the website
 */

import "./styles/Settings.css"
import useLocalStorage from "use-local-storage";
import { useState } from "react";

function Settings() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );
  const [buttonPopup, setButtonPopup] = useState(false);

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setButtonPopup(true);
  };

  return (
    <div className="user-view">
        <div className="main-container" data-theme={theme}>
            <div className="label">Select a color scheme</div>
            <div className="color-selector">
                <div className="switch-label">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </div>
                <label className="toggle-switch">
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={switchTheme}
                />
                <span className="slider"></span>
                </label>
            </div>
        </div>
    </div>
    
  );
}

export default <Settings/>;

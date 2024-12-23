/**
 * Page handles the home between settings, and create race 
 */
import "./styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
	return (
        <div className="main-menu">
            <div className="main-menu-label">Main Menu</div>

            <Link to="/AssingSittings" className="link">
                <div className="menu-item">
                <span className="menu-icon logs"></span>
                <div className="menu-text">Assign Sittings</div>
                </div>
            </Link>

            <Link to="/Settings" className="link">
                <div className="menu-item">
                <span className="menu-icon color"></span>
                <div className="menu-text">Settings</div>
                </div>
            </Link>
        </div>
	);
}

export default <Home/>;

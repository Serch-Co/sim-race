/**
 * Page handles the home between settings, and create race 
 */
import "./styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
	const handleColorChangeClick = () => {
		console.log("Change Website Color button clicked");
	};

	return (
        <div className="main-menu">
            <div className="main-menu-label">Main Menu</div>

            <Link to="/CreateRace" className="link">
            {/* TODO Send to assing sitting to customers in each
                available simulator to keep stats
                instead of creating a race*/}
                <div className="menu-item">
                <span className="menu-icon logs"></span>
                <div className="menu-text">Create Race</div>
                </div>
            </Link>

            <Link to="/Settings" className="link">
                <div className="menu-item" onClick={handleColorChangeClick}>
                <span className="menu-icon color"></span>
                <div className="menu-text">Settings</div>
                </div>
            </Link>
        </div>
	);
}

export default <Home/>;

/**
 * Page handles the home between settings, create customer, and create race 
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

            <Link to="/CreateCustomer">
                <div className="menu-item">
                <span className="menu-icon manage"></span>
                <div className="menu-text">Create Customer</div>
                </div>
            </Link>

            <Link to="/CreateRace" className="link">
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

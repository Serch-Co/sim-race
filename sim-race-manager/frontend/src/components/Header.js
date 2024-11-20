import './styles/header.css'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <div className="header" >
            <div>
                <Link to="/Home">
                    <button className='nav-button'>Home</button>
                </Link>
                <Link to="/ManageCustomers">
                    <button className="nav-button">Manage Customers</button>
                </Link>
                <Link to = "/ManageRaces">
                    <button className="nav-button">Manage Races</button>
                </Link>
            </div>
            <div>
                { process.env.REACT_APP_NAME }
            </div>
        </div>
    );
}

export default Header;
import './styles/header.css'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <div className="header" >
            <div>
                
                {/*  */}
                <Link to="/Home">
                    <button className='nav-button'>Home</button>
                </Link>
                {/* <Link to = "/Users">
                    <button className="nav-button">Manage Users</button>
                </Link>
                <Link to = "/ManageAddOns">
                    <button className="nav-button">Manage Add Ons</button>
                </Link> */}
            </div>
            <div>
                { process.env.REACT_APP_NAME }
            </div>
        </div>
    );
}

export default Header;
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import Logout from "./Logout";
import { Isauth } from "../App";
import { useContext } from "react";



const Navbar = () => {

  const auth = useContext(Isauth);
  return (
    <div className="navbar">
      <div className="nav-logo">
        <p>SHOPPER</p>
      </div>
      <ul className="nav-menu">
        {
          auth ? (
            <>
              
              <li>
              <Link to="/profilepage" className="nav-link">profilepage</Link>
              </li>
              <li>
              <Link to="/searchitems" className="nav-link">Search Items</Link>
              </li>
              <li>
              <Link to="/deliveritems" className="nav-link">Deliver Items</Link>
              </li>
              <li>
              <Link to="/orderhistory" className="nav-link">Order History</Link>
              </li>
              <li>
              <Link to="/cart" className="nav-link">Cart</Link>
              </li>
              <li>
              <Link to="/support" className="nav-link">Support</Link>
              </li>
              <li>
                <Logout />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link"><button>Login</button></Link>
              </li>
              <li>
                <Link to="/register" className="nav-link"><button>Register</button></Link>
              </li>
            </>
          )
        }



      </ul>
    </div>
  );
};

export default Navbar;

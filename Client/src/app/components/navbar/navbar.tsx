import {
  faHome,
  faChartLine,
  faTachometerAlt,
  faBullhorn,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { to: "/home", icon: faHome, label: " Home" },
    { to: "/add", icon: faChartLine, label: " Adicionar Empresa" },
    { to: "/registro-empresas", icon: faChartLine, label: " Registro de empresas" },
    { to: "/listnegative", icon: faTachometerAlt, label: " " },
    { to: "/marketing", icon: faBullhorn, label: " Dashboards" },
    { to: "/lembretes", icon: faMoneyBillWave, label: " Lembretes" },
  ];

  return (
    <nav className="sidebar open">
      <div className="sidebar-sticky">
        <div className="sidebar-logo">
          <h2 className="mt-5 text-center">FlexPay</h2>
        </div>
        <ul className="nav options mt-5">
          {menuItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                className="nav-link icon-tooltip"
                to={item.to}
                data-tooltip={item.label}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="logout-container">
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

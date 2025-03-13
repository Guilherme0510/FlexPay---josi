import {
  faHome,
  faChartLine,
  faTachometerAlt,
  faBullhorn,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { to: "/home", icon: faHome, label: " Home" },
    { to: "/add", icon: faChartLine, label: " Adicionar Empresa" },
    { to: "/registro-empresas", icon: faChartLine, label: " Registro de empresas" },
    { to: "/addirpf", icon: faChartLine, label: " Adicionar Pessoa Fisica" },
    { to: "/registro-irpf", icon: faChartLine, label: " Registro de Pessoa Fisica" },
    { to: "/lembretes", icon: faMoneyBillWave, label: " Lembretes" },
  ];

  return (
    <nav className="sidebar open">
      <div className="sidebar-sticky">
        <div className="sidebar-logo">
          {/* <h2 className="mt-5 text-center">FlexPay</h2> */}
          <img src={require("../../assets/logo-josi.jpg")} alt=""/>
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
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>


      <div className="copy">
        <p>© 2025 Grupo Maps</p>
      </div>
    </nav>
  );
};

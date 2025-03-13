import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivatesRoute";
import { Login, Home, Add, ListEmpresa, } from "../pages";
import { Navbar } from "../components/navbar/navbar";
import { Lembretes } from "../pages/lembretes/Lembretes";
import { AddIrpf } from "../pages/AddIrpf/AddIrpf";
import { ListIrpf } from "../pages/listIrpf/listEmpresa";

export const LocalRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <NavbarWrapper />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="/registro-empresas" element={<ListEmpresa />} />
          <Route path="/addirpf" element={<AddIrpf />} />
          <Route path="/registro-irpf" element={<ListIrpf />} />
          <Route path="/lembretes" element={<Lembretes/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const NavbarWrapper: React.FC = () => {
  const location = useLocation();
  const showNavbarRoutes = ["/home", '/lembretes', '/registro-empresas', "/registro-irpf"];

  return showNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
};
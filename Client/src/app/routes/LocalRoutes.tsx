import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivatesRoute";
import { Login, Home, Add, ListEmpresa, } from "../pages";
import { Navbar } from "../components/navbar/navbar";
import { Lembretes } from "../pages/lembretes/Lembretes";
import { AddIrpf } from "../pages/AddIrpf/AddIrpf";
import { ListIrpf } from "../pages/listIrpf/listEmpresa";
import ListEmpresaQuery from "../pages/listEmpresaQuery/ListEmpresaQuery";

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
          <Route path="/registro-empresas/:categoria" element={<ListEmpresaQuery/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const NavbarWrapper: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const showNavbar =
    path.startsWith("/home") ||
    path.startsWith("/lembretes") ||
    path.startsWith("/registro-empresas") ||
    path.startsWith("/registro-irpf");

  return showNavbar ? <Navbar /> : null;
};
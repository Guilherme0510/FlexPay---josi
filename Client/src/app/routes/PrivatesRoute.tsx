import React, { useEffect, useState } from "react"; 
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { ModalRoutes } from "./components/ModalRoutes";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { user, loading } = useAuth();
  const adminId = "";
  const [modalOpen, setModalOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!loading && user && !(user.uid === adminId)) {
      setModalOpen(true); 
    }
  }, [loading, user, adminId]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setRedirect(true);
  };

  if (loading) {
    return (
      <div className="circle-loading">
        <CircularProgress color="inherit" className="circle" />
      </div>
    );
  }

  if (redirect) {
    return <Navigate to="/" />; 
  }

  if (user && (user.uid === adminId)) {
    return element; 
  }

  return (
    <>
      <ModalRoutes
        isOpen={modalOpen}
        onClose={handleCloseModal}
        message="Verifique suas credenciais! Redirecionando para a página inicial."
      />
    </>
  );
};

export default PrivateRoute;

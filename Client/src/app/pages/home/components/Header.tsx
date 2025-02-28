import { useAuth } from "../../../context/AuthContext";

export const Header = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("pt-BR");
    const { nome } = useAuth();

    return (
        <div className="header-content">
            <div className="header-title">
                <h4>Olá, {nome}</h4>
            </div>
            <div className="header-time">
                <span>{formattedDate}</span>
            </div>
        </div>
    );
};

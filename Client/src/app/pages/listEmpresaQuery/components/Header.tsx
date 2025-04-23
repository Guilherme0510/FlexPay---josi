import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  categoria?: string;
  filterByMesAtual: boolean | null;
  setFilterByMesAtual: React.Dispatch<React.SetStateAction<boolean | null>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({
  categoria,
  filterByMesAtual,
  setFilterByMesAtual,
  searchTerm,
  setSearchTerm,
}) => {
  const renderCategoria = () => {
    if (!categoria) return "Categoria não definida";
    if (categoria.includes("naoHaMovimento")) return "Não há movimento";
    if (categoria.includes("folhaPagamento")) return "Folha de Pagamento";
    if (categoria.includes("parcelamento")) return "Parcelamento";
    if (categoria.includes("movimento")) return "Há movimento";
    return categoria;
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 p-5">
      <h2 className="mb-0 text-white">Lista de Empresas: {renderCategoria()}</h2>
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-primary btn-filtro-query"
          onClick={() =>
            setFilterByMesAtual((prev) =>
              prev === null ? true : prev === true ? false : null
            )
          }
        >
          <FontAwesomeIcon icon={faFilter} className="me-2" />
          {filterByMesAtual === null
            ? "Todos"
            : filterByMesAtual
            ? "Concluídos"
            : "Não Concluídos"}
        </button>
        <input
          type="text"
          className="form-control input-query"
          placeholder="Pesquisar empresa"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Header;

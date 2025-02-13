import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "../ListNegative.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

interface Saida {
  valor: number;
  data: Date; 
  categoria: string;
}

export const Main = () => {
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [filteredSaidas, setFilteredSaidas] = useState<Saida[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false); 
  const [valor, setValor] = useState<number | undefined>(undefined);
  const [data, setData] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");

  const fetchNegativoData = async () => {
    try {
      const q = query(collection(db, "registros"), where("tipo", "==", "negativo"));
      const querySnapshot = await getDocs(q);
      const registros: Saida[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataDate = new Date(data.data.seconds * 1000); 
        console.log('Data do Firebase:', dataDate); 
        registros.push({
          valor: data.valor,
          data: dataDate,
          categoria: data.categoria,
        });
      });
      setSaidas(registros); 
      setFilteredSaidas(registros); 
    } catch (error) {
      console.error("Erro ao buscar dados negativos:", error);
    }
  };

  const applyFilters = () => {
    console.log('Aplicando filtros...');
    console.log('Valor do filtro de data:', data);
    let filtered = saidas;
  
    if (valor !== undefined) {
      filtered = filtered.filter((saida) => saida.valor <= valor);
    }
  
    if (data) {
      const [year, month, day] = data.split("-"); 
      const dateFilter = new Date(Number(year), Number(month) - 1, Number(day));
      console.log('Data convertida para filtro:', dateFilter);
      filtered = filtered.filter((saida) => {
        const saidaDate = saida.data;
        console.log('Data da saída:', saidaDate);
        return (
          saidaDate.getFullYear() === dateFilter.getFullYear() &&
          saidaDate.getMonth() === dateFilter.getMonth() &&
          saidaDate.getDate() === dateFilter.getDate()
        );
      });
    }
  
    if (categoria) {
      filtered = filtered.filter((saida) => saida.categoria.toLowerCase().includes(categoria.toLowerCase()));
    }
  
    console.log('Saídas filtradas:', filtered);
    setFilteredSaidas(filtered);
    setCurrentPage(0); 
    setShowModal(false);
  };
  

  const clearFilters = () => {
    setValor(undefined);
    setData("");
    setCategoria("");
    setFilteredSaidas(saidas);
    setCurrentPage(0);
    setShowModal(false); 
  };

  const paginatedSaidas = filteredSaidas.slice(currentPage * 8, (currentPage + 1) * 8);

  const handleNextPage = () => {
    if ((currentPage + 1) * 8 < filteredSaidas.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchNegativoData();
  }, []);

  return (
    <div className="list">
      <div className="list-box mt-5">
        <div className="content-list">
          <div className="header-list">
            <h4 className="text-start">Lista de Despesas</h4>
            <button className="btn btn-warning" onClick={() => setShowModal(true)}>
              Filtros
            </button>
          </div>
          <div className="box-list">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="table-header">Ícone</th>
                  <th className="table-header">Valor</th>
                  <th className="table-header">Data</th>
                  <th className="table-header">Atividade</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSaidas.map((saida, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">📉</td>
                    <td className="table-cell">{saida.valor}</td>
                    <td className="table-cell">{saida.data.toLocaleDateString("pt-BR")}</td>
                    <td className="table-cell">{saida.categoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`pagination-btn ${currentPage === 0 ? "disabled" : ""}`}
        >
          <FontAwesomeIcon icon={faLeftLong} />
        </button>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * 8 >= filteredSaidas.length}
          className={`pagination-btn ${ (currentPage + 1) * 8 >= filteredSaidas.length ? "disabled" : "" }`}
        >
          <FontAwesomeIcon icon={faRightLong} />
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Filtros</h2>
            <div>
              <label>Valor máximo:</label>
              <input
                type="number"
                value={valor || ""}
                onChange={(e) => setValor(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Data:</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div>
              <label>Categoria:</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={applyFilters} className="btn btn-primary">Aplicar</button>
              <button onClick={clearFilters} className="btn btn-secondary">Limpar</button>
              <button onClick={() => setShowModal(false)} className="btn btn-danger">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

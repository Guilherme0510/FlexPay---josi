import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import '../ListPositive.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig"; // Certifique-se de que o caminho esteja correto

export const Main = () => {
  const [saidas, setSaidas] = useState<any[]>([]); // Tipo qualquer para dados
  const [data, setData] = useState<string>(''); // Filtro de data
  const [showModal, setShowModal] = useState(false); // Controle para mostrar/ocultar modal
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(0);

  // Buscar dados positivos do Firebase
  const fetchPositivoData = async () => {
    try {
      const q = query(collection(db, "registros"), where("tipo", "==", "positivo"));
      const querySnapshot = await getDocs(q);
      const registros: any[] = [];
      querySnapshot.forEach((doc) => {
        registros.push(doc.data());
      });
      setSaidas(registros); // Atualiza o estado com os dados encontrados
    } catch (error) {
      console.error("Erro ao buscar dados positivos:", error);
    }
  };

  useEffect(() => {
    fetchPositivoData(); // Carregar os dados quando o componente for montado
  }, []);

  // Função para aplicar filtros
  const applyFilters = () => {
    let filtered = saidas;

    // Filtro de data
    if (data) {
      const [year, month, day] = data.split("-"); // Separa o valor 'YYYY-MM-DD'
      const dateFilter = new Date(Number(year), Number(month) - 1, Number(day)); // Cria um novo objeto Date com ano, mês e dia
      filtered = filtered.filter((saida) => {
        const saidaDate = saida.data.toDate(); // Assumindo que a data do Firebase é do tipo Timestamp
        return (
          saidaDate.getFullYear() === dateFilter.getFullYear() &&
          saidaDate.getMonth() === dateFilter.getMonth() &&
          saidaDate.getDate() === dateFilter.getDate()
        );
      });
    }

    setSaidas(filtered); // Atualiza a lista filtrada
    setCurrentPage(0); // Reseta a página para a primeira quando aplicar filtros
    setShowModal(false); // Fecha o modal após aplicar os filtros
  };

  const paginatedSaidas = saidas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < saidas.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="list">
      <div className="list-box mt-5">
        <div className="content-list">
          <div className="header-list">
            <h4 className="text-start">Lista de Receitas</h4>
            <button className="btn btn-warning" onClick={() => setShowModal(true)}>Filtros</button>
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
                    <td className="table-cell">{new Date(saida.data.toDate()).toLocaleDateString('pt-BR')}</td>
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
          disabled={(currentPage + 1) * itemsPerPage >= saidas.length}
          className={`pagination-btn ${ (currentPage + 1) * itemsPerPage >= saidas.length ? "disabled" : "" }`}
        >
          <FontAwesomeIcon icon={faRightLong} />
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Filtros</h2>
            <div className="filter">
              <label htmlFor="data">Data</label>
              <input
                type="date"
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={applyFilters}>Aplicar Filtros</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

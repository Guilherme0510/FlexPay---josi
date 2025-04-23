import React, { useEffect, useState } from "react";
import "./listEmpresa.css";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faTrash,
  faArrowLeft,
  faArrowRight,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Button, Modal } from "react-bootstrap";
import { EditEmpresaModal } from "./EditEmpresaModal";
import { ServicosModal } from "./ServicosModal";

interface Empresa {
  id: string;
  nomeEmpresa: string;
  dataAbertura: string;
  regimeAP: string;
  ie: string;
  ccm: string;
  cnpj: string;
  cnae: string;
  email: string;
  telefone: string;
  codigoSN: string;
  cpf: string;
  logradouro: string;
  nomeFantasia: string;
  usernameSefaz: string;
  senhaSefaz: string;
  senhaPrefeitura: string;
  janeiro: boolean;
  fevereiro: boolean;
  marco: boolean;
  abril: boolean;
  maio: boolean;
  junho: boolean;
  julho: boolean;
  agosto: boolean;
  setembro: boolean;
  outubro: boolean;
  novembro: boolean;
  dezembro: boolean;
  categoriaEmpresa: string[];
  links: string[];
  [key: string]: any; // Adicionando uma assinatura de índice
}

export const ListEmpresa = () => {
  const [listEmpresa, setListEmpresa] = useState<Empresa[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showServicoModal, setShowServicoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [selectedServico, setSelectedServico] = useState<Empresa | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const meses = [
    "janeiro",
    "fevereiro",
    "marco",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const mesAtual = meses[new Date().getMonth()];

  useEffect(() => {
    const fetchInfoEmpresa = async () => {
      try {
        const empresaCollection = collection(db, "empresas");
        const empresaSnapshot = await getDocs(empresaCollection);
        const empresaList = empresaSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Empresa)
        );
        setListEmpresa(empresaList);
      } catch (error) {
        console.error("Erro ao buscar empresas", error);
      }
    };
    fetchInfoEmpresa();
  }, []);

  const handleSave = async (empresa: Empresa) => {
    try {
      const empresaRef = doc(db, "empresas", empresa.id);
      const empresaData = { ...empresa };
      await updateDoc(empresaRef, empresaData);
      setListEmpresa((prevList) =>
        prevList.map((emp) => (emp.id === empresa.id ? empresa : emp))
      );
      setShowEditModal(false);
      setShowServicoModal(false);
    } catch (error) {
      console.error("Erro ao atualizar a empresa", error);
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowEditModal(true);
  };
  const handleServico = (empresa: Empresa) => {
    setSelectedServico(empresa);
    setShowServicoModal(true);
  };

  const handleDelete = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setSelectedServico(empresa);
    setShowDeleteModal(true);
  };

  const handleView = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setSelectedServico(empresa);
    setShowViewModal(true);
  };

  const deleteEmpresa = async () => {
    if (selectedEmpresa) {
      try {
        await deleteDoc(doc(db, "empresas", selectedEmpresa.id));
        setListEmpresa((prevList) =>
          prevList.filter((empresa) => empresa.id !== selectedEmpresa.id)
        );
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Erro ao excluir a empresa", error);
      }
    }
  };
  const [filterByMesAtual, setFilterByMesAtual] = useState<boolean | null>(
    null
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredEmpresas = listEmpresa.filter((empresa) => {
    const matchesSearch = empresa.nomeEmpresa
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isMesAtual = empresa[mesAtual] === true; // Verifica se a empresa está concluída

    if (filterByMesAtual === null) {
      return matchesSearch; // Sem filtro, mostra todas
    }
    if (filterByMesAtual) {
      return matchesSearch && isMesAtual; // Apenas concluídas
    }
    return matchesSearch && !isMesAtual; // Apenas não concluídas
  });

  const currentItems = filteredEmpresas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderCategoria = (empresa: Empresa) => {
    const categoria = empresa.categoriaEmpresa;
    if (!categoria || categoria.length === 0) return "Categoria não definida";
    if (categoria.includes("naoHaMovimento")) return "Não há movimento";
    if (categoria.includes("folhaPagamento")) return "Folha de Pagamento";
    if (categoria.includes("parcelamento")) return "Parcelamento";
    if (categoria.includes("movimento")) return "Há movimento";
    return categoria.join(", ");
  };

  return (
    <section className="list-container">
      <div className="header-list">
        <h1>Lista de Empresas</h1>
        <button
          className="btn btn-primary"
          onClick={() =>
            setFilterByMesAtual((prev) =>
              prev === null ? true : prev === true ? false : null
            )
          }
        >
          <FontAwesomeIcon icon={faFilter} />
          {filterByMesAtual === null
            ? " Todos"
            : filterByMesAtual
            ? " Concluídos"
            : " Não Concluídos"}
        </button>
        <input
          type="text"
          className="input-pesquisa"
          placeholder="Pesquisar empresa"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="empresa-table">
        <thead>
          <tr>
            <th>Nome Fantasia</th>
            <th>CNPJ</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((empresa) => {
            const isMesAtual = empresa[mesAtual];
            return (
              <tr
                key={empresa.id}
                className={isMesAtual ? "empresa-destaque" : ""}
              >
                <td>{empresa.nomeEmpresa}</td>
                <td>{empresa.cnpj}</td>
                <td>{empresa.email}</td>
                <td>{empresa.telefone}</td>
                <td>{renderCategoria(empresa)}</td>
                <td className="">
                  <FontAwesomeIcon
                    icon={faEye}
                    className="me-2 text-warning acoes-list"
                    data-tooltip-id="action-view"
                    data-tooltip-content="Visualizar dados"
                    onClick={() => handleView(empresa)}
                  />
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="me-2 text-primary acoes-list"
                    data-tooltip-id="action-edit"
                    data-tooltip-content="Editar dados"
                    onClick={() => handleEdit(empresa)}
                  />
                  <FontAwesomeIcon
                    icon={faEye}
                    className="me-2 text-success acoes-list"
                    data-tooltip-id="action-servico"
                    data-tooltip-content="Gerenciar serviços"
                    onClick={() => handleServico(empresa)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="mx-1 text-danger acoes-list"
                    data-tooltip-id="action-delete"
                    data-tooltip-content="Excluir empresa"
                    onClick={() => handleDelete(empresa)}
                  />
                  <Tooltip id="action-servico" />
                  <Tooltip id="action-view" />
                  <Tooltip id="action-edit" />
                  <Tooltip id="action-delete" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={prevPage}
          className="btn btn-dark"
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="text-light text-pagination">
          {currentPage} - {totalPages}
        </span>
        <button
          onClick={nextPage}
          className="btn btn-dark"
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header>
          <Modal.Title>Editar Empresa</Modal.Title>
        </Modal.Header>
        <EditEmpresaModal
          selectedEmpresa={selectedEmpresa}
          setSelectedEmpresa={setSelectedEmpresa}
        />
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave(selectedEmpresa!)}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showServicoModal}
        onHide={() => setShowServicoModal(false)}
        centered
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>Serviços Prestados</Modal.Title>
        </Modal.Header>
        <ServicosModal
          selectedServico={selectedServico}
          setSelectedServico={setSelectedServico}
        />
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowServicoModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave(selectedServico!)}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir a empresa{" "}
          {selectedEmpresa?.nomeEmpresa}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteEmpresa}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
      >
        <Modal.Header>
          <Modal.Title>Detalhes da Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmpresa && (
            <div className="empresa-details-grid">
              <div className="empresa-details-column">
                <p>
                  <strong>Nome Fantasia:</strong> {selectedEmpresa.nomeFantasia}
                </p>
                <p>
                  <strong>Nome Empresa:</strong> {selectedEmpresa.nomeEmpresa}
                </p>
                <p>
                  <strong>CNPJ:</strong> {selectedEmpresa.cnpj}
                </p>
                <p>
                  <strong>Email:</strong> {selectedEmpresa.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {selectedEmpresa.telefone}
                </p>
                <p>
                  <strong>Data de Abertura:</strong>{" "}
                  {selectedEmpresa.dataAbertura}
                </p>
                <p>
                  <strong>Regime AP:</strong> {selectedEmpresa.regimeAP}
                </p>
                <p>
                  <strong>IE:</strong> {selectedEmpresa.ie}
                </p>
                <p>
                  <strong>Categoria da Empresa:</strong>{" "}
                  <span className="text-capitalize">
                    {selectedEmpresa.categoriaEmpresa.includes("naoHaMovimento")
                      ? "Não há movimento"
                      : selectedEmpresa.categoriaEmpresa.includes(
                          "folhaPagamento"
                        )
                      ? "Folha de Pagamento"
                      : selectedEmpresa.categoriaEmpresa}
                  </span>
                </p>
              </div>
              <div className="empresa-details-column">
                <p>
                  <strong>CCM:</strong> {selectedEmpresa.ccm}
                </p>
                <p>
                  <strong>CNAE:</strong> {selectedEmpresa.cnae}
                </p>
                <p>
                  <strong>Código SN:</strong> {selectedEmpresa.codigoSN}
                </p>
                <p>
                  <strong>CPF:</strong> {selectedEmpresa.cpf}
                </p>
                <p>
                  <strong>Logradouro:</strong> {selectedEmpresa.logradouro}
                </p>
                <p>
                  <strong>Username Sefaz:</strong>{" "}
                  {selectedEmpresa.usernameSefaz}
                </p>

                <p>
                  <strong>Senha Sefaz:</strong> {selectedEmpresa.senhaSefaz}
                </p>
                <p>
                  <strong>Senha Prefeitura:</strong>{" "}
                  {selectedEmpresa.senhaPrefeitura}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowViewModal(false)}>
            E-mail
          </Button>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

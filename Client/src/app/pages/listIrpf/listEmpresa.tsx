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
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Button, Modal, Form } from "react-bootstrap";

interface Empresa {
  nome: string;
  entregue: string;
}

interface EmpresaComId extends Empresa {
  firebaseId: string;
}

export const ListIrpf = () => {
  const [listEmpresa, setListEmpresa] = useState<EmpresaComId[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaComId | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterEntregue, setFilterEntregue] = useState(false);


  useEffect(() => {
    const fetchInfoEmpresa = async () => {
      try {
        const empresaCollection = collection(db, "pessoasFisicas");
        const empresaSnapshot = await getDocs(empresaCollection);
        const empresaList = empresaSnapshot.docs.map((doc) => ({
          firebaseId: doc.id,
          ...doc.data(),
        })) as EmpresaComId[];
        setListEmpresa(empresaList);
      } catch (error) {
        console.error("Erro ao buscar empresas", error);
      }
    };
    fetchInfoEmpresa();
  }, []);

  const handleEdit = (empresa: EmpresaComId) => {
    setSelectedEmpresa(empresa);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!selectedEmpresa || !selectedEmpresa.firebaseId) return;
    try {
      const empresaRef = doc(db, "pessoasFisicas", selectedEmpresa.firebaseId);
      const { firebaseId, ...empresaData } = selectedEmpresa;
      await updateDoc(empresaRef, empresaData);

      setListEmpresa((prevList) =>
        prevList.map((empresa) =>
          empresa.firebaseId === firebaseId ? selectedEmpresa : empresa
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Erro ao atualizar a empresa", error);
    }
  };

  const handleDelete = (empresa: EmpresaComId) => {
    setSelectedEmpresa(empresa);
    setShowDeleteModal(true);
  };

  const deleteEmpresa = async () => {
    if (selectedEmpresa && selectedEmpresa.firebaseId) {
      try {
        await deleteDoc(doc(db, "pessoasFisicas", selectedEmpresa.firebaseId));
        setListEmpresa((prevList) =>
          prevList.filter(
            (empresa) => empresa.firebaseId !== selectedEmpresa.firebaseId
          )
        );
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Erro ao excluir a empresa", error);
      }
    }
  };
  const handleToggleFilter = () => {
    setFilterEntregue(!filterEntregue);
  };
  const filteredEmpresas = listEmpresa.filter(
    (empresa) =>
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterEntregue || empresa.entregue === "Não Informado")
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmpresas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

  return (
    <section className="list-container">
      <div className="header-list">
        <h1>Lista de Empresas</h1>

        <input
          type="text"
          className="input-pesquisa"
          placeholder="Pesquisar empresa"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="warning" onClick={handleToggleFilter}>
          {filterEntregue ? "Mostrar Todas" : "Não Informado"}
        </Button>
      </div>
      <table className="empresa-table">
        <thead>
          <tr>
            <th>Nome Fantasia</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((empresa) => (
            <tr key={empresa.firebaseId} className="empresa-destaque">
              <td>{empresa.nome}</td>
              <td>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="me-2 text-primary acoes-list"
                  data-tooltip-id="action-edit"
                  data-tooltip-content="Editar dados"
                  onClick={() => handleEdit(empresa)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="mx-1 text-danger acoes-list"
                  data-tooltip-id="action-delete"
                  data-tooltip-content="Excluir empresa"
                  onClick={() => handleDelete(empresa)}
                />
                <Tooltip id="action-edit" />
                <Tooltip id="action-delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <Button
          variant="dark"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span className="text-light text-pagination">
          {currentPage} - {totalPages}
        </span>
        <Button
          variant="dark"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedEmpresa?.nome || ""}
                onChange={(e) =>
                  setSelectedEmpresa(
                    (prev) => prev && { ...prev, nome: e.target.value }
                  )
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Entregue</Form.Label>
              <Form.Control
                type="text"
                value={selectedEmpresa?.entregue || ""}
                onChange={(e) =>
                  setSelectedEmpresa(
                    (prev) => prev && { ...prev, entregue: e.target.value }
                  )
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir a empresa {selectedEmpresa?.nome}?
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
    </section>
  );
};
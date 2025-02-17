import React, { useEffect, useState } from "react";
import "./listEmpresa.css";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Button, Modal } from "react-bootstrap";
import {EditEmpresaModal} from "./EditEmpresaModal";

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
}

export const ListEmpresa = () => {
  const [listEmpresa, setListEmpresa] = useState<Empresa[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const handleEdit = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowEditModal(true);
  };

  const handleDelete = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowDeleteModal(true);
  };

  const editInfoEmpresa = async () => {
    if (selectedEmpresa) {
      try {
        if (selectedEmpresa.id) {
          const empresaRef = doc(db, "empresas", selectedEmpresa.id);
          await updateDoc(empresaRef, {
            ...selectedEmpresa, // Atualiza com os dados modificados
          });
        }
        setShowEditModal(false);
        setListEmpresa((prevList) =>
          prevList.map((empresa) =>
            empresa.id === selectedEmpresa?.id
              ? { ...empresa, ...selectedEmpresa } // Atualiza a lista localmente
              : empresa
          )
        );
      } catch (error) {
        console.error("Erro ao editar a empresa", error);
      }
    }
  };
  

  useEffect(() => {
    const fetchInfoEmpresa = async () => {
      try {
        const empresaCollection = collection(db, "empresas");
        const empresaSnapshot = await getDocs(empresaCollection);
        const empresaList = empresaSnapshot.docs.map((doc) => {
          const data = doc.data() as Empresa;
          const { id, ...rest } = data;
          return { id: doc.id, ...rest };
        });
        setListEmpresa(empresaList);
      } catch (error) {
        console.error("Erro em buscar empresa", error);
      }
    };
    fetchInfoEmpresa();
  }, []);

  return (
    <section className="list-container">
      <div className="header-list">
        <h1>Lista de Empresas</h1>
        <input
          type="text"
          className="input-pesquisa"
          placeholder="Pesquisa a empresa"
        />
      </div>
      <table className="empresa-table">
        <thead>
          <tr>
            <th>Nome Fantasia</th>
            <th>CNPJ</th>
            <th>Email</th>
            <th>Telefone</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listEmpresa.map((data) => (
            <tr className="lista-empresas" key={data.id}>
              <td>{data.nomeEmpresa}</td>
              <td>{data.cnpj}</td>
              <td>{data.email}</td>
              <td>{data.telefone}</td>
              <td className="text-center g-2">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="me-2 text-primary acoes-list"
                  data-tooltip-id="action-edit"
                  data-tooltip-content="Editar dados"
                  onClick={() => handleEdit(data)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="mx-1 text-danger acoes-list"
                  data-tooltip-id="action-delete"
                  data-tooltip-content="Excluir empresa"
                  onClick={() => handleDelete(data)}
                />
                <Tooltip id="action-edit" />
                <Tooltip id="action-delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        dialogClassName="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Editar Empresa</Modal.Title>
        </Modal.Header>
        <EditEmpresaModal
          selectedEmpresa={selectedEmpresa}
          setSelectedEmpresa={setSelectedEmpresa}
        />

        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={editInfoEmpresa}>Salvar</Button>
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
          <Button variant="danger">Excluir</Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./listEmpresaQuery.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Header from "./components/Header";
import EmpresaTable from "./components/EmpresaTable";
import EmpresaDetalhesModal from "./components/EmpresaDetalhesModal";
import EditEmpresaModal from "./components/EditEmpresaModalQuery";
import { ServicosModal } from "./components/ServicosModalQuery";
import { Button, Modal } from "react-bootstrap";

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
  categoriaEmpresa: Array<string>;
  links: string[];
  [key: string]: any;
}

const ListEmpresaQuery = () => {
  const { categoria } = useParams<{ categoria: string }>();
  const [listEmpresa, setListEmpresa] = useState<Empresa[]>([]);
  const [filterByMesAtual, setFilterByMesAtual] = useState<boolean | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showServicoModal, setShowServicoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mesAtual = new Date()
    .toLocaleString("pt-BR", { month: "long" })
    .toLowerCase();

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

  const isConcluidoNoMesAtual = (empresa: Empresa) => {
    return empresa[mesAtual] === true;
  };

  const empresasFiltradas = listEmpresa
    .filter(
      (empresa) => categoria && empresa.categoriaEmpresa.includes(categoria)
    )
    .filter((empresa) => {
      if (filterByMesAtual === true) return isConcluidoNoMesAtual(empresa);
      if (filterByMesAtual === false) return !isConcluidoNoMesAtual(empresa);
      return true;
    })
    .filter((empresa) =>
      (empresa?.nomeFantasia || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = empresasFiltradas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(empresasFiltradas.length / itemsPerPage);

  const handleView = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowViewModal(true);
  };

  const handleEdit = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (empresaAtualizada: Partial<Empresa>) => {
    if (!empresaAtualizada.id) return;

    try {
      const empresaRef = doc(db, "empresas", empresaAtualizada.id);
      await updateDoc(empresaRef, { ...empresaAtualizada });

      setListEmpresa((prev) =>
        prev.map((emp) =>
          emp.id === empresaAtualizada.id
            ? { ...emp, ...empresaAtualizada }
            : emp
        )
      );
      setShowEditModal(false);
      setShowServicoModal(false);
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
    }
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

  const handleServico = (empresa: Empresa) => {
    console.log("Gerenciar serviços:", empresa);
    setShowServicoModal(true);
  };

  const handleDelete = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowDeleteModal(true);
  };

  return (
    <section className="list-empresa-query">
      <Header
        categoria={categoria}
        filterByMesAtual={filterByMesAtual}
        setFilterByMesAtual={setFilterByMesAtual}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div>
        <EmpresaTable
          currentItems={currentItems}
          mesAtual={mesAtual}
          handleView={handleView}
          handleEdit={handleEdit}
          handleServico={handleServico}
          handleDelete={handleDelete}
        />
        <div className="pagination mt-3 d-flex justify-content-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            ←
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((num) => {
              return (
                num === 1 ||
                num === totalPages ||
                (num >= currentPage - 1 && num <= currentPage + 1)
              );
            })
            .reduce((acc: (number | "...")[], num, i, arr) => {
              if (i > 0 && num - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(num);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === currentPage ? "primary" : "outline-primary"}
                  onClick={() => paginate(item as number)}
                  size="sm"
                >
                  {item}
                </Button>
              )
            )}

          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            →
          </Button>
        </div>
      </div>
      <EmpresaDetalhesModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        empresa={selectedEmpresa}
      />
      <EditEmpresaModal
        show={showEditModal}
        selectedEmpresa={selectedEmpresa}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
      />
      <ServicosModal
        show={showServicoModal}
        selectedServico={selectedEmpresa}
        onClose={() => setShowServicoModal(false)}
        onSave={handleSaveEdit}
      />
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
    </section>
  );
};

export default ListEmpresaQuery;

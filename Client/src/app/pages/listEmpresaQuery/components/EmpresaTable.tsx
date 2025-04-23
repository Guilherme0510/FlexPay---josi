import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";

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


interface Props {
  currentItems: Empresa[];
  mesAtual: string;
  handleView: (empresa: Empresa) => void;
  handleEdit: (empresa: Empresa) => void;
  handleServico: (empresa: Empresa) => void;
  handleDelete: (empresa: Empresa) => void;
}

const EmpresaTable: React.FC<Props> = ({
  currentItems,
  mesAtual,
  handleView,
  handleEdit,
  handleServico,
  handleDelete,
}) => {
  return (
    <table className="empresa-table">
      <thead>
        <tr>
          <th>Nome Fantasia</th>
          <th>CNPJ</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
      {currentItems.length === 0 ? (
  <tr>
    <td colSpan={5} className="text-center">
      Nenhuma empresa encontrada
    </td>
  </tr>
) : (
  currentItems.map((empresa) => {
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
              <td>
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
        }))}
      </tbody>
    </table>
  );
};

export default EmpresaTable;

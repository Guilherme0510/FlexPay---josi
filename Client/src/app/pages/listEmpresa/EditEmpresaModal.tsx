import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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

interface EditEmpresaModalProps {
  selectedEmpresa: Empresa | null;
  setSelectedEmpresa: React.Dispatch<React.SetStateAction<Empresa | null>>;
}

export const EditEmpresaModal: React.FC<EditEmpresaModalProps> = ({
  selectedEmpresa,
  setSelectedEmpresa,
}) => {
  const [showSenhaSefaz, setShowSenhaSefaz] = useState(false);
  const [showSenhaPrefeitura, setShowSenhaPrefeitura] = useState(false);

  const toggleSenhaSefaz = () => setShowSenhaSefaz(!showSenhaSefaz);
  const toggleSenhaPrefeitura = () =>
    setShowSenhaPrefeitura(!showSenhaPrefeitura);

  if (!selectedEmpresa) return null; // Se não houver empresa selecionada, não renderiza o modal

  const handleChange = (field: keyof Empresa, value: string) => {
    setSelectedEmpresa({
      ...selectedEmpresa,
      [field]: value,
    });
  };

  return (
    <Modal.Body>
      <p className="mb-3">
        <strong>Empresa:</strong> {selectedEmpresa?.nomeEmpresa}
      </p>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nome Empresa</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nome Empresa"
            value={selectedEmpresa?.nomeEmpresa || ""}
            onChange={(e) => handleChange("nomeEmpresa", e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Nome Fantasia</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nome Fantasia"
            value={selectedEmpresa?.nomeFantasia || ""}
            onChange={(e) => handleChange("nomeFantasia", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Data de Abertura</label>
          <input
            type="date"
            className="form-control"
            value={
              selectedEmpresa?.dataAbertura
                ? selectedEmpresa.dataAbertura.split("/").reverse().join("-")
                : ""
            }
            onChange={(e) =>
              handleChange(
                "dataAbertura",
                e.target.value.split("-").reverse().join("/")
              )
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Regime</label>
          <input
            type="text"
            className="form-control"
            placeholder="Regime"
            value={selectedEmpresa?.regimeAP || ""}
            onChange={(e) => handleChange("regimeAP", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Inscrição Estadual (IE)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Inscrição Estadual"
            value={selectedEmpresa?.ie || ""}
            onChange={(e) => handleChange("ie", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">CCM</label>
          <input
            type="text"
            className="form-control"
            placeholder="CCM"
            value={selectedEmpresa?.ccm || ""}
            onChange={(e) => handleChange("ccm", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">CNPJ</label>
          <input
            type="text"
            className="form-control"
            value={selectedEmpresa?.cnpj || ""}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">CNAE</label>
          <input
            type="text"
            className="form-control"
            placeholder="CNAE"
            value={selectedEmpresa?.cnae || ""}
            onChange={(e) => handleChange("cnae", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className="form-control"
            placeholder="E-mail"
            value={selectedEmpresa?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Telefone</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Telefone"
            value={selectedEmpresa?.telefone || ""}
            onChange={(e) => handleChange("telefone", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Logradouro</label>
          <input
            type="text"
            className="form-control"
            placeholder="Endereço"
            value={selectedEmpresa?.logradouro || ""}
            onChange={(e) => handleChange("logradouro", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Usuário SEFAZ</label>
          <input
            type="text"
            className="form-control"
            placeholder="Usuário SEFAZ"
            value={selectedEmpresa?.usernameSefaz || ""}
            onChange={(e) => handleChange("usernameSefaz", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Senha SEFAZ</label>
          <div className="input-group">
            <input
              type={showSenhaSefaz ? "text" : "password"}
              className="form-control"
              placeholder="Senha SEFAZ"
              value={selectedEmpresa?.senhaSefaz || ""}
              onChange={(e) => handleChange("senhaSefaz", e.target.value)}
            />
            <span className="input-group-text" onClick={toggleSenhaSefaz}>
              <FontAwesomeIcon icon={showSenhaSefaz ? faEyeSlash : faEye} />
            </span>
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Senha Prefeitura</label>
          <div className="input-group">
            <input
              type={showSenhaPrefeitura ? "text" : "password"}
              className="form-control"
              placeholder="Senha Prefeitura"
              value={selectedEmpresa?.senhaPrefeitura || ""}
              onChange={(e) => handleChange("senhaPrefeitura", e.target.value)}
            />
            <span className="input-group-text" onClick={toggleSenhaPrefeitura}>
              <FontAwesomeIcon
                icon={showSenhaPrefeitura ? faEyeSlash : faEye}
              />
            </span>
          </div>
        </div>
      </div>
    </Modal.Body>
  );
};

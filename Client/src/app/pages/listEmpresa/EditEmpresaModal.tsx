import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faPlus } from "@fortawesome/free-solid-svg-icons";

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
  links: string[];
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

  if (!selectedEmpresa) return null;

  const handleChange = (field: keyof Empresa, value: string | boolean) => {
    setSelectedEmpresa((prev) => ({
      ...prev!,
      [field]: value,
      links: prev?.links || [], // Garante que `links` nunca seja `undefined`
    }));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...selectedEmpresa.links];
    newLinks[index] = value;
    setSelectedEmpresa({
      ...selectedEmpresa,
      links: newLinks,
    });
  };

  const addLink = () => {
    setSelectedEmpresa((prev) => ({
      ...prev!,
      links: prev?.links ? [...prev.links, ""] : [""],
    }));
  };

  const meses = [
    { label: "Janeiro", field: "janeiro" },
    { label: "Fevereiro", field: "fevereiro" },
    { label: "Março", field: "marco" },
    { label: "Abril", field: "abril" },
    { label: "Maio", field: "maio" },
    { label: "Junho", field: "junho" },
    { label: "Julho", field: "julho" },
    { label: "Agosto", field: "agosto" },
    { label: "Setembro", field: "setembro" },
    { label: "Outubro", field: "outubro" },
    { label: "Novembro", field: "novembro" },
    { label: "Dezembro", field: "dezembro" },
  ];

  return (
    <Modal.Body>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Empresa</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nome Empresa"
              value={selectedEmpresa?.nomeEmpresa || ""}
              onChange={(e) => handleChange("nomeEmpresa", e.target.value)}
            />
          </div>

          <div className="mb-3">
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

          <div className="mb-3">
            <label className="form-label">Inscrição Estadual (IE)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Inscrição Estadual"
              value={selectedEmpresa?.ie || ""}
              onChange={(e) => handleChange("ie", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CNPJ</label>
            <input
              type="text"
              className="form-control"
              value={selectedEmpresa?.cnpj || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              placeholder="E-mail"
              value={selectedEmpresa?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Usuário SEFAZ</label>
            <input
              type="text"
              className="form-control"
              placeholder="Usuário SEFAZ"
              value={selectedEmpresa?.usernameSefaz || ""}
              onChange={(e) => handleChange("usernameSefaz", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Código SN</label>
            <input
              type="text"
              className="form-control"
              placeholder="CNAE"
              value={selectedEmpresa?.codigoSN || ""}
              onChange={(e) => handleChange("codigoSN", e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Fantasia</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nome Fantasia"
              value={selectedEmpresa?.nomeFantasia || ""}
              onChange={(e) => handleChange("nomeFantasia", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Regime</label>
            <input
              type="text"
              className="form-control"
              placeholder="Regime"
              value={selectedEmpresa?.regimeAP || ""}
              onChange={(e) => handleChange("regimeAP", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CCM</label>
            <input
              type="text"
              className="form-control"
              placeholder="CCM"
              value={selectedEmpresa?.ccm || ""}
              onChange={(e) => handleChange("ccm", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CNAE</label>
            <input
              type="text"
              className="form-control"
              placeholder="CNAE"
              value={selectedEmpresa?.cnae || ""}
              onChange={(e) => handleChange("cnae", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CPF</label>
            <input
              type="text"
              className="form-control"
              placeholder="CNAE"
              value={selectedEmpresa?.cpf || ""}
              onChange={(e) => handleChange("cpf", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Telefone</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Telefone"
              value={selectedEmpresa?.telefone || ""}
              onChange={(e) => handleChange("telefone", e.target.value)}
            />
          </div>

          <div className="mb-3">
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
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <div className="mb-3">
              <label className="form-label">Logradouro</label>
              <input
                type="text"
                className="form-control"
                placeholder="Endereço"
                value={selectedEmpresa?.logradouro || ""}
                onChange={(e) => handleChange("logradouro", e.target.value)}
              />
            </div>
            <label className="form-label">Senha Prefeitura</label>
            <div className="input-group">
              <input
                type={showSenhaPrefeitura ? "text" : "password"}
                className="form-control"
                placeholder="Senha Prefeitura"
                value={selectedEmpresa?.senhaPrefeitura || ""}
                onChange={(e) =>
                  handleChange("senhaPrefeitura", e.target.value)
                }
              />
              <span
                className="input-group-text"
                onClick={toggleSenhaPrefeitura}
              >
                <FontAwesomeIcon
                  icon={showSenhaPrefeitura ? faEyeSlash : faEye}
                />
              </span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Meses Concluidos</label>
            {meses.map((mes) => (
              <div key={mes.field} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={mes.field}
                  checked={Boolean(selectedEmpresa[mes.field as keyof Empresa])}
                  onChange={(e) =>
                    handleChange(mes.field as keyof Empresa, e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor={mes.field}>
                  {mes.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Links</label>
            {selectedEmpresa.links &&
              selectedEmpresa.links.map((link, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Link ${index + 1}`}
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                  />
                </div>
              ))}
            <button className="btn btn-primary" onClick={addLink}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
      </div>
    </Modal.Body>
  );
};

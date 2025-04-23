import React from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

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

interface EditServicoModalProps {
  selectedServico: Empresa | null;
  setSelectedServico: React.Dispatch<React.SetStateAction<Empresa | null>>;
}

export const ServicosModal: React.FC<EditServicoModalProps> = ({
  selectedServico,
  setSelectedServico,
}) => {
  if (!selectedServico) return null;

  const handleChange = (field: string, value: string | boolean) => {
    setSelectedServico((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const campos = [
    "servicosConcluidos",
    "simplesNacional",
    "declaracoes",
    "folha",
    "observacoes",
    "parcelamento"
  ];

  return (
    <Modal.Body>
      <div className="container container-modal">
        <div className="row mt-5">
          {meses.map((mes) => (
            <div className="col-md-4 mb-4" key={mes}>
              <div className="month-card">
                <h5><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />{mes}</h5>
                {campos.map((campo) => (
                  <div className="mb-3" key={`${mes}-${campo}`}>
                    <label className="form-label">
                      <FontAwesomeIcon icon={faTasks} className="me-2" />
                      {campo.charAt(0).toUpperCase() + campo.slice(1)}
                    </label>
                    <textarea
                      className="form-control textarea-field"
                      placeholder={`Digite ${campo}`}
                      value={selectedServico[`${campo}${mes}`] || ""}
                      onChange={(e) => handleChange(`${campo}${mes}`, e.target.value)}
                    />
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`${campo}${mes}-check`}
                        checked={selectedServico[`${campo}${mes}Check`] || false}
                        onChange={(e) => handleChange(`${campo}${mes}Check`, e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`${campo}${mes}-check`}>
                        Serviço concluído
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal.Body>
  );
};

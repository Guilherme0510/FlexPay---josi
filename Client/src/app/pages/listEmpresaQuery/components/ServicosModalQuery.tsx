import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
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
  show: boolean;
  selectedServico: Empresa | null;
  onClose: () => void;
  onSave: (empresaAtualizada: Empresa) => void;
}

export const ServicosModal: React.FC<EditServicoModalProps> = ({
  show,
  selectedServico,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Empresa | null>(null);

  useEffect(() => {
    if (selectedServico) {
      setFormData({ ...selectedServico });
    }
  }, [selectedServico]);

  if (!formData) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const campos = [
    "servicosConcluidos",
    "simplesNacional",
    "declaracoes",
    "folha",
    "observacoes",
    "parcelamento",
  ];

  return (
    <Modal show={show} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Serviços Prestados</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container container-modal">
          <div className="row mt-5">
            {meses.map((mes) => (
              <div className="col-md-4 mb-4" key={mes}>
                <div className="month-card">
                  <h5>
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    {mes}
                  </h5>
                  {campos.map((campo) => (
                    <div className="mb-3" key={`${mes}-${campo}`}>
                      <label className="form-label">
                        <FontAwesomeIcon icon={faTasks} className="me-2" />
                        {campo.charAt(0).toUpperCase() + campo.slice(1)}
                      </label>
                      <textarea
                        className="form-control textarea-field"
                        placeholder={`Digite ${campo}`}
                        value={formData[`${campo}${mes}`] || ""}
                        onChange={(e) =>
                          handleChange(`${campo}${mes}`, e.target.value)
                        }
                      />
                      <div className="form-check mt-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`${campo}${mes}-check`}
                          checked={formData[`${campo}${mes}Check`] || false}
                          onChange={(e) =>
                            handleChange(`${campo}${mes}Check`, e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`${campo}${mes}-check`}
                        >
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
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (formData) onSave(formData);
          }}
        >
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

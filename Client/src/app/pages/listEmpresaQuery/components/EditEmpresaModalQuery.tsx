import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

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

interface EditEmpresaModalProps {
  show: boolean;
  selectedEmpresa: Empresa | null;
  onClose: () => void;
  onSave: (empresaAtualizada: Empresa) => void;
}

const EditEmpresaModal: React.FC<EditEmpresaModalProps> = ({
  show,
  selectedEmpresa,
  onClose,
  onSave,
}) => {
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
  const [formData, setFormData] = useState<Empresa | null>(null);

  useEffect(() => {
    if (selectedEmpresa) {
      setFormData(selectedEmpresa);
    }
  }, [selectedEmpresa]);

  const convertToDateInputFormat = (date: string) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const convertToDisplayFormat = (date: string): string => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      if (formData) {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else if (name === "dataAbertura") {
      const convertedDate = convertToDisplayFormat(value);
      setFormData((prevData) =>
        prevData
          ? {
              ...prevData,
              [name]: convertedDate,
            }
          : null
      );
    } else {
      setFormData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          [name]: value,
        };
      });
    }
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        categoriaEmpresa: options ?? [],
      };
    });
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
    }
  };

  if (!formData) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Nome Fantasia</Form.Label>
                <Form.Control
                  type="text"
                  name="nomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Nome Empresa</Form.Label>
                <Form.Control
                  type="text"
                  name="nomeEmpresa"
                  value={formData.nomeEmpresa}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Data de Abertura</Form.Label>
                <Form.Control
                  type="date"
                  name="dataAbertura"
                  value={convertToDateInputFormat(formData.dataAbertura)}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>CNPJ</Form.Label>
                <Form.Control
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Inscrição Estadual</Form.Label>
                <Form.Control
                  type="text"
                  name="ie"
                  value={formData.ie}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Regime AP</Form.Label>
                <Form.Control
                  type="text"
                  name="regimeAP"
                  value={formData.regimeAP}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>CCM</Form.Label>
                <Form.Control
                  type="text"
                  name="ccm"
                  value={formData.ccm}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Código SN</Form.Label>
                <Form.Control
                  type="text"
                  name="codigoSN"
                  value={formData.codigoSN}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>CPF</Form.Label>
                <Form.Control
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>CNAE</Form.Label>
                <Form.Control
                  type="text"
                  name="cnae"
                  value={formData.cnae}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Usuário SEFAZ</Form.Label>
                <Form.Control
                  type="text"
                  name="usernameSefaz"
                  value={formData.usernameSefaz}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Senha SEFAZ</Form.Label>
                <Form.Control
                  type="password"
                  name="senhaSefaz"
                  value={formData.senhaSefaz}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Senha Prefeitura</Form.Label>
                <Form.Control
                  type="password"
                  name="senhaPrefeitura"
                  value={formData.senhaPrefeitura}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="mb-3">
                <label className="form-label">Categoria da Empresa</label>
                <div className="d-flex flex-column gap-2">
                  {[
                    { label: "Com Movimento", value: "movimento" },
                    { label: "Sem Movimento", value: "naoHaMovimento" },
                    { label: "Parcelamento", value: "parcelamento" },
                    { label: "Folha de Pagamento", value: "folhaPagamento" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="form-check-label d-flex align-items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={option.value}
                        checked={
                          formData.categoriaEmpresa?.includes(option.value) ||
                          false
                        }
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const current = formData.categoriaEmpresa || [];
                          const updatedCategorias = isChecked
                            ? [...current, option.value]
                            : current.filter((v) => v !== option.value);

                          setFormData({
                            ...formData,
                            categoriaEmpresa: updatedCategorias,
                          });
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <strong>Meses ativos:</strong>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {meses.map((mes, index) => {
                const id = `mes-${index}`;
                return (
                  <div key={mes} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={id}
                      name={mes}
                      checked={formData[mes]}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor={id}>
                     <span className="text-capitalize">{mes}</span> 
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          Salvar
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEmpresaModal;

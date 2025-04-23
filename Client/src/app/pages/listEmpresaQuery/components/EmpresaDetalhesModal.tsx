import React from "react";
import { Modal, Button } from "react-bootstrap";

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
  [key: string]: any;
}

interface EmpresaDetalhesModalProps {
  show: boolean;
  onClose: () => void;
  empresa: Empresa | null;
}

const EmpresaDetalhesModal: React.FC<EmpresaDetalhesModalProps> = ({
  show,
  onClose,
  empresa,
}) => {
  
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>Detalhes da Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {empresa && (
          <div className="empresa-details-grid">
            <div className="empresa-details-column">
              <p>
                <strong>Nome Fantasia:</strong> {empresa.nomeFantasia}
              </p>
              <p>
                <strong>Nome Empresa:</strong> {empresa.nomeEmpresa}
              </p>
              <p>
                <strong>CNPJ:</strong> {empresa.cnpj}
              </p>
              <p>
                <strong>Email:</strong> {empresa.email}
              </p>
              <p>
                <strong>Telefone:</strong> {empresa.telefone}
              </p>
              <p>
                <strong>Data de Abertura:</strong> {empresa.dataAbertura}
              </p>
              <p>
                <strong>Regime AP:</strong> {empresa.regimeAP}
              </p>
              <p>
                <strong>IE:</strong> {empresa.ie}
              </p>
              <p>
                <strong>Categoria da Empresa:</strong>{" "}
                <span className="text-capitalize">
                  {empresa.categoriaEmpresa
                    .map((categoria) => {
                      if (categoria === "naoHaMovimento")
                        return "Sem movimento";
                      if (categoria === "movimento")
                        return "Com movimento";
                      if (categoria === "folhaPagamento")
                        return "Folha de Pagamento";
                      return categoria; 
                    })
                    .join(", ")}{" "}
                
                </span>
              </p>
            </div>
            <div className="empresa-details-column">
              <p>
                <strong>CCM:</strong> {empresa.ccm}
              </p>
              <p>
                <strong>CNAE:</strong> {empresa.cnae}
              </p>
              <p>
                <strong>Código SN:</strong> {empresa.codigoSN}
              </p>
              <p>
                <strong>CPF:</strong> {empresa.cpf}
              </p>
              <p>
                <strong>Logradouro:</strong> {empresa.logradouro}
              </p>
              <p>
                <strong>Username Sefaz:</strong> {empresa.usernameSefaz}
              </p>
              <p>
                <strong>Senha Sefaz:</strong> {empresa.senhaSefaz}
              </p>
              <p>
                <strong>Senha Prefeitura:</strong> {empresa.senhaPrefeitura}
              </p>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          E-mail
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmpresaDetalhesModal;

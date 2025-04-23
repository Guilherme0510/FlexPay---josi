import { useState } from "react";
import "./Add.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
interface FormData {
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
  categoriaEmpresa: Array<string>;
}

export const Add: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeEmpresa: "",
    dataAbertura: "",
    regimeAP: "",
    ie: "",
    ccm: "",
    cnpj: "",
    cnae: "",
    email: "",
    telefone: "",
    codigoSN: "",
    cpf: "",
    logradouro: "",
    nomeFantasia: "",
    usernameSefaz: "",
    senhaSefaz: "",
    senhaPrefeitura: "",
    categoriaEmpresa: [],
  });

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSave = async () => {
    try {
      const registro = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          if (
            !value ||
            (key === "dataAbertura" &&
              value instanceof Date &&
              isNaN(value.getTime()))
          ) {
            return [key, "Não Informado"];
          }
          return [key, value];
        })
      );

      await addDoc(collection(db, "empresas"), registro);
      toast.success(`Empresa ${formData.nomeEmpresa} cadastrada com sucesso!`);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
      setFormData({
        nomeEmpresa: "",
        dataAbertura: "",
        regimeAP: "",
        ie: "",
        ccm: "",
        cnpj: "",
        cnae: "",
        email: "",
        telefone: "",
        codigoSN: "",
        cpf: "",
        logradouro: "",
        nomeFantasia: "",
        usernameSefaz: "",
        senhaSefaz: "",
        senhaPrefeitura: "",
        categoriaEmpresa: [],
      });
    } catch (error) {
      console.error("Erro ao salvar registro: ", error);
      alert("Ocorreu um erro ao salvar o registro.");
    }
  };

  return (
    <div className="container-add">
      <button
        onClick={() => navigate(-1)}
        className="btn-floating btn-danger btn"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h2 className="text-light text-center">Adicionar Empresa</h2>
      <div className="formulario">
        <form className="form-content">
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="nomeEmpresa" className="text-light">
                Nome da Empresa
              </label>
              <input
                type="text"
                id="nomeEmpresa"
                name="nomeEmpresa"
                value={formData.nomeEmpresa}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o nome da empresa"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="dataAbertura" className="text-light">
                Data de Abertura
              </label>
              <input
                type="date"
                id="dataAbertura"
                name="dataAbertura"
                value={
                  formData.dataAbertura
                    ? formData.dataAbertura.split("/").reverse().join("-")
                    : ""
                }
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  const dataFormatada = `${day}/${month}/${year}`;
                  setFormData({
                    ...formData,
                    dataAbertura: dataFormatada, // Salva como string dd/mm/yyyy
                  });
                }}
                className="form-control"
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="regimeAP" className="text-light">
                Regime de Apuração
              </label>
              <input
                type="text"
                id="regimeAP"
                name="regimeAP"
                value={formData.regimeAP}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o regime de apuração"
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="ie" className="text-light">
                Inscrição Estadual (IE)
              </label>
              <input
                type="text"
                id="ie"
                name="ie"
                value={formData.ie}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite a Inscrição Estadual"
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="ccm" className="text-light">
                CCM
              </label>
              <input
                type="text"
                id="ccm"
                name="ccm"
                value={formData.ccm}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o CCM"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="cnpj" className="text-light">
                CNPJ
              </label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o CNPJ"
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="cnae" className="text-light">
                CNAE
              </label>
              <input
                type="text"
                id="cnae"
                name="cnae"
                value={formData.cnae}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o CNAE"
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="email" className="text-light">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o email"
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="telefone" className="text-light">
                Telefone
              </label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o telefone"
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="codigoSN" className="text-light">
                Código SN
              </label>
              <input
                type="text"
                id="codigoSN"
                name="codigoSN"
                value={formData.codigoSN}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o código SN"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="cpf" className="text-light">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o CPF"
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="logradouro" className="text-light">
                Logradouro
              </label>
              <input
                type="text"
                id="logradouro"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o logradouro"
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="nomeFantasia" className="text-light">
                Nome Fantasia
              </label>
              <input
                type="text"
                id="nomeFantasia"
                name="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o Nome Fantasia"
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="senhaSefaz" className="text-light">
                Senha Sefaz
              </label>
              <input
                type="text"
                id="senhaSefaz"
                name="senhaSefaz"
                value={formData.senhaSefaz}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite a Senha Sefaz"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="usernameSefaz" className="text-light">
                Username Sefaz
              </label>
              <input
                type="text"
                id="usernameSefaz"
                name="usernameSefaz"
                value={formData.usernameSefaz}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o Username Sefaz"
              />
            </div>
            <div className="form-group col-md-4 mt-3">
              <label htmlFor="senhaPrefeitura" className="text-light">
                Senha Prefeitura
              </label>
              <input
                type="text"
                id="senhaPrefeitura"
                name="senhaPrefeitura"
                value={formData.senhaPrefeitura}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite a Senha Prefeitura"
              />
            </div>
            <div className="form-group col-md-4 mt-3">
              <label htmlFor="senhaPrefeitura" className="text-light">
                Categoria Empresa
              </label>
              <div className="d-flex flex-column gap-2">
                {[
                  { label: "Há Movimento", value: "movimento" },
                  { label: "Não há movimento", value: "naoHaMovimento" },
                  { label: "Parcelamento", value: "parcelamento" },
                  { label: "Folha de Pagamento", value: "folhaPagamento" },
                ].map((option) => (
                  <div className="form-check" key={option.value}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={option.value}
                      id={option.value}
                      checked={formData.categoriaEmpresa.includes(option.value)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          categoriaEmpresa: isChecked
                            ? [...prev.categoriaEmpresa, option.value]
                            : prev.categoriaEmpresa.filter(
                                (v) => v !== option.value
                              ),
                        }));
                      }}
                    />
                    <label className="form-check-label" htmlFor={option.value}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-5">
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
            >
              Salvar Registro
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

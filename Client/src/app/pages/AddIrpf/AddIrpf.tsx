import { useState } from "react";
import "./AddIrpf.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface FormData {
  nome: string;
  entregue: string;
}

export const AddIrpf: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    entregue: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const registro = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          if (!value) {
            return [key, "Não Informado"];
          }
          return [key, value];
        })
      );

      await addDoc(collection(db, "pessoasFisicas"), registro);
      alert("Registro salvo com sucesso!");
      setFormData({
        nome: "",
        entregue: "",
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
      <h2 className="text-light text-center">Adicionar Pessoa Fisica</h2>
      <div className="formulario">
        <form className="form-content">
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="nome" className="text-light">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Digite o nome"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="entregue" className="text-light">
                Entregue
              </label>
              <select
                id="entregue"
                name="entregue"
                value={formData.entregue}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
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
    </div>
  );
};

import React, { useState } from "react";
import { Modal } from "react-bootstrap";

interface Empresa {
  nome: string;
  entregue: string;
}

interface EditEmpresaModalProps {
  selectedEmpresa: Empresa | null;
  setSelectedEmpresa: React.Dispatch<React.SetStateAction<Empresa | null>>;
}

export const EditListIrpfModal: React.FC<EditEmpresaModalProps> = ({
  selectedEmpresa,
  setSelectedEmpresa,
}) => {
  if (!selectedEmpresa) return null;

  const handleChange = (field: keyof Empresa, value: string) => {
    setSelectedEmpresa((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  return (
    <Modal.Body>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Pessoa Física</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nome"
              value={selectedEmpresa?.nome || ""}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="entregue" className="form-label">
              Entregue
            </label>
            <select
              id="entregue"
              name="entregue"
              value={selectedEmpresa?.entregue || ""}
              onChange={(e) => handleChange("entregue", e.target.value)}
              className="form-select" // Melhor que "form-control" para selects no Bootstrap
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
        </div>
      </div>
    </Modal.Body>
  );
};

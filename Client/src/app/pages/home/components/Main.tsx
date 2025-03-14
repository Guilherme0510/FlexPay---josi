import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement
);

export const Main = () => {
  const [empresa, setEmpresa] = useState<any[]>([]);
  const [totalEmpresas, setTotalEmpresas] = useState<number>(0);
  const [empresasAtivasPorMes, setEmpresasAtivasPorMes] = useState<number[]>(Array(12).fill(0));
  const [empresasMesAtual, setEmpresasMesAtual] = useState<number>(0);
  const [empresasInativas, setEmpresasInativas] = useState<number>(0);

  const fetchEmpresas = async () => {
    try {
      const q = query(collection(db, "empresas"), orderBy("dataAbertura", "desc"), limit(3));
      const querySnapshot = await getDocs(q);
      const empresasLista: any[] = querySnapshot.docs.map((doc) => doc.data());
      setEmpresa(empresasLista);

      const totalQuery = query(collection(db, "empresas"));
      const totalSnapshot = await getDocs(totalQuery);
      setTotalEmpresas(totalSnapshot.size);

      const contadorMeses = Array(12).fill(0);
      let countMesAtual = 0;
      const meses = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
      const mesAtualIndex = new Date().getMonth();

      totalSnapshot.docs.forEach((doc) => {
        const emp = doc.data();
        meses.forEach((mes, index) => {
          if (emp[mes]) {
            contadorMeses[index] += 1;
            if (index === mesAtualIndex) {
              countMesAtual += 1;
            }
          }
        });
      });

      setEmpresasAtivasPorMes(contadorMeses);
      setEmpresasMesAtual(countMesAtual);
      setEmpresasInativas(totalSnapshot.size - countMesAtual);
    } catch (error) {
      console.error("Erro ao buscar empresas registradas:", error);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const data = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    datasets: [
      {
        label: "Empresas Concluídas",
        data: empresasAtivasPorMes,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(255, 255, 255, 255)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Empresas Ativas por Mês",
      },
    },
  };

  return (
    <div className="main">
      <div className="main-boxes row">
        <div className="content-box col-md-3 col-10">
          <h4 className="text-start">Empresas Registradas</h4>
          <table className="mini-table">
            <tbody>
              {empresa.map((emp, index) => (
                <tr key={index}>
                  <td>🏢 {emp.nomeFantasia}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/registro-empresas" className="btn btn-dark mt-2">
            Ver Todas
          </Link>
        </div>
        <div className="content-box col-md-3 col-10">
          <h4 className="text-start">Total</h4>
          <div className="box">
            <p className="text-light m-2">{totalEmpresas}</p>
          </div>
        </div>
        <div className="content-box col-md-3 col-10">
          <h4 className="text-start">Empresas Concluidas</h4>
          <div className="box">
            <p className="text-light m-2">{empresasMesAtual}</p>
          </div>
          <h4 className="text-start mt-2">Empresas Não concluidas</h4>
          <div className="box">
            <p className="text-light m-2">{empresasInativas}</p>
          </div>
        </div>
        <div className="content-box-grafico col-md-3 col-10">
          <h4 className="text-start">Atividade das Empresas</h4>
          <Line data={data} options={options} />
        </div>
      </div>
      <div className="icons-sites flex gap-5">
        <Link to="https://www.legisweb.com.br/" target="_blank">
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo-legs.webp")}
            alt=""
          />
        </Link>
        <Link to="https://login.esocial.gov.br/login.aspx" target="_blank">
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo-esocial.png")}
            alt=""
          />
        </Link>
        <Link
          to="https://www8.receita.fazenda.gov.br/simplesnacional/"
          target="_blank"
        >
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo_simples.png")}
            alt=""
          />
        </Link>
        <Link to="https://nfe.prefeitura.sp.gov.br/login.aspx" target="_blank">
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo_milhao.png")}
            alt=""
          />
        </Link>
        <Link
          to="https://cav.receita.fazenda.gov.br/autenticacao/login"
          target="_blank"
        >
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo-federal.png")}
            alt=""
          />
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

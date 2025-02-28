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
import { Line } from "react-chartjs-2"; // Importando o gráfico de linha
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../../firebase/firebaseConfig";
import { Lembretes } from "../../lembretes/Lembretes";
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
  const [saida, setSaida] = useState<any[]>([]);
  const [totalEmpresas, setTotalEmpresas] = useState<number>(0);
  const [empresasAtivasPorMes, setEmpresasAtivasPorMes] = useState<number[]>(
    Array(12).fill(0)
  ); // Array para contar empresas ativas por mês

  const fetchEmpresas = async () => {
    try {
      // Consulta as 3 últimas empresas registradas
      const q = query(
        collection(db, "empresas"),
        orderBy("dataAbertura", "desc"),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      const empresasLista: any[] = querySnapshot.docs.map((doc) => doc.data());
      setEmpresa(empresasLista);

      // Consulta o total de empresas registradas
      const totalQuery = query(collection(db, "empresas"));
      const totalSnapshot = await getDocs(totalQuery);
      setTotalEmpresas(totalSnapshot.size); // Atualiza o total de empresas

      // Contar empresas ativas por mês
      const contadorMeses = Array(12).fill(0); // Inicializa um array com 12 posições (uma para cada mês)
      totalSnapshot.docs.forEach((doc) => {
        const emp = doc.data();
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
        meses.forEach((mes, index) => {
          if (emp[mes]) {
            contadorMeses[index] += 1; // Incrementa o contador se a empresa estiver ativa no mês
          }
        });
      });
      setEmpresasAtivasPorMes(contadorMeses); // Atualiza o estado com os dados
    } catch (error) {
      console.error("Erro ao buscar empresas registradas:", error);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleVerTodas = () => {
    toast.info(
      "Funcionalidade de ver todas as empresas ainda não implementada."
    );
  };

  // Dados para o gráfico de linha
  const data = {
    labels: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    datasets: [
      {
        label: "Empresas Concluidas",
        data: empresasAtivasPorMes, // Dados das empresas ativas por mês
        borderColor: "rgba(75, 192, 192, 1)", // Cor da linha
        backgroundColor: "rgba(255, 255, 255, 255)", // Cor de fundo
        fill: true,
        tension: 0.4, // Suaviza a linha
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
                <tr key={index} className="">
                  <td className="">🏢 {emp.nomeFantasia}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to={"/registro-empresas"} className="btn btn-dark mt-2">
            Ver Todas
          </Link>
        </div>
        <div className="content-box col-md-3 col-10">
          <h4 className="text-start">Total</h4>
          <div className="box">
            <p className="text-light m-2">{totalEmpresas}</p>
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
        <Link to="https://cav.receita.fazenda.gov.br/autenticacao/login" target="_blank">
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

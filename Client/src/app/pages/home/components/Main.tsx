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
import {
  faBan,
  faChartLine,
  faFileInvoiceDollar,
  faMoneyCheckAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
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
  const [empresasAtivasPorMes, setEmpresasAtivasPorMes] = useState<number[]>(
    Array(12).fill(0)
  );
  const [empresasMesAtual, setEmpresasMesAtual] = useState<number>(0);
  const [empresasInativas, setEmpresasInativas] = useState<number>(0);
  const [inaptasPorCategoria, setInaptasPorCategoria] = useState<
    Record<string, number>
  >({});

  const fetchEmpresas = async () => {
    try {
      // Últimas 3 empresas
      const q = query(
        collection(db, "empresas"),
        orderBy("dataAbertura", "desc"),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      const empresasLista: any[] = querySnapshot.docs.map((doc) => doc.data());
      setEmpresa(empresasLista);
  
      // Todas as empresas
      const totalQuery = query(collection(db, "empresas"));
      const totalSnapshot = await getDocs(totalQuery);
      setTotalEmpresas(totalSnapshot.size);
  
      const contadorMeses = Array(12).fill(0);
      let countMesAtual = 0;
      const meses = [
        "janeiro", "fevereiro", "marco", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
      ];
      const mesAtualIndex = new Date().getMonth();
      const mesAtualNome = meses[mesAtualIndex];
  
      const inaptas: Record<string, number> = {};
  
      totalSnapshot.docs.forEach((doc) => {
        const emp = doc.data();
        const categorias: string[] = Array.isArray(emp.categoriaEmpresa)
          ? emp.categoriaEmpresa
          : emp.categoriaEmpresa
          ? [emp.categoriaEmpresa]
          : ["Sem Categoria"];
  
        // Conta empresa ativa por mês
        meses.forEach((mes, index) => {
          if (emp[mes]) {
            contadorMeses[index] += 1;
            if (index === mesAtualIndex) {
              countMesAtual += 1;
            }
          }
        });
  
        // Conta como inapta em cada categoria se não estiver ativa no mês atual
        if (!emp[mesAtualNome]) {
          categorias.forEach((categoria) => {
            inaptas[categoria] = (inaptas[categoria] || 0) + 1;
          });
        }
      });
  
      setEmpresasAtivasPorMes(contadorMeses);
      setEmpresasMesAtual(countMesAtual);
      setEmpresasInativas(totalSnapshot.size - countMesAtual);
      setInaptasPorCategoria(inaptas);
    } catch (error) {
      console.error("Erro ao buscar empresas registradas:", error);
    }
  };
  

  useEffect(() => {
    fetchEmpresas();
  }, []);

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
      <div className="row main-boxes">
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
        
        <div className="container-box-query col-md-3 col-10">
            <Link
              to="/registro-empresas/movimento"
              className="content-box-query col-md-12 col-10 position-relative"
            >
              <span className="badge-count">
                {inaptasPorCategoria["movimento"] || 0}
              </span>
              <h4 className="text-start">
                <FontAwesomeIcon icon={faChartLine} className="me-2" />
                Com Movimento
              </h4>
            </Link>

            <Link
              to="/registro-empresas/naoHaMovimento"
              className="content-box-query col-md-12 col-10 position-relative"
            >
              <span className="badge-count">
                {inaptasPorCategoria["naoHaMovimento"] || 0}
              </span>
              <h4 className="text-start">
                <FontAwesomeIcon icon={faBan} className="me-2" />
                Sem Movimento
              </h4>
            </Link>
        </div>

        <div className="container-box-query col-md-3 col-10">
            <Link
              to="/registro-empresas/folhaPagamento"
              className="content-box-query col-md-12 col-10 position-relative"
            >
              <span className="badge-count">
                {inaptasPorCategoria["folhaPagamento"] || 0}
              </span>
              <h4 className="text-start">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-2" />
                Folha de Pagamento
              </h4>
            </Link>

            <Link
              to="/registro-empresas/parcelamento"
              className="content-box-query col-md-12 col-10 position-relative"
            >
              <span className="badge-count">
                {inaptasPorCategoria["parcelamento"] || 0}
              </span>
              <h4 className="text-start">
                <FontAwesomeIcon icon={faMoneyCheckAlt} className="me-2" />
                Parcelamento
              </h4>
            </Link>
        </div>
      </div>
      <div className="icons-sites flex gap-5">
        <Link
          to="https://www.legisweb.com.br/"
          target="_blank"
          className="hover-scale"
        >
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo-legs.webp")}
            alt=""
          />
        </Link>
        <Link
          to="https://login.esocial.gov.br/login.aspx"
          target="_blank"
          className="hover-scale"
        >
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo-esocial.png")}
            alt=""
          />
        </Link>
        <Link
          to="https://www8.receita.fazenda.gov.br/simplesnacional/"
          target="_blank"
          className="hover-scale"
        >
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo_simples.png")}
            alt=""
          />
        </Link>
        <Link
          to="https://nfe.prefeitura.sp.gov.br/login.aspx"
          target="_blank"
          className="hover-scale"
        >
          <img
            className="w-24 h-24 object-contain"
            src={require("../../../assets/logo_milhao.png")}
            alt=""
          />
        </Link>
        <Link
          to="https://cav.receita.fazenda.gov.br/autenticacao/login"
          target="_blank"
          className="hover-scale"
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

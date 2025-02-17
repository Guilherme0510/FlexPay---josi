import { useState, FormEvent, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import "../login/components/login.css";
import "./Login.css";
import { PasswordInput } from "./components/passwordInput";
import { EmailInput } from "./components/emailinput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [recuperar, setRecuperar] = useState<boolean>(false);
  const [recuperarEmail, setRecuperarEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<string>("");
  const [showCircles, setShowCircles] = useState<boolean>(true);
  const circlesRef = useRef<HTMLDivElement[]>([]);
  const navigate = useNavigate();

  const recuperador_senha = () => {
    setRecuperar(!recuperar);
    setError("");
  };

  const handleLogin = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      console.log("Login bem-sucedido");
      navigate("/home");
    } catch (erro) {
      console.log(erro);
      setError("Ocorreu um erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = () => {
    setError("");
  };

  useEffect(() => {
    const circles = circlesRef.current;

    const handleMouseEnter = (circle: HTMLDivElement) => {
      circle.classList.remove("surging");
    };

    const handleMouseLeave = (circle: HTMLDivElement) => {
      circle.classList.add("surging");
    };

    circles.forEach((circle) => {
      circle.addEventListener("mouseenter", () => handleMouseEnter(circle));
      circle.addEventListener("mouseleave", () => handleMouseLeave(circle));
    });

    return () => {
      circles.forEach((circle) => {
        circle.removeEventListener("mouseenter", () =>
          handleMouseEnter(circle)
        );
        circle.removeEventListener("mouseleave", () =>
          handleMouseLeave(circle)
        );
      });
    };
  }, []);

  useEffect(() => {
    if (recuperar) {
      setShowCircles(true);
    }
  }, [recuperar]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin(e as unknown as FormEvent<HTMLButtonElement>);
    }
  };
  return (
    <section>
      <div className="Home">
        {showCircles &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`circle ${showCircles ? "surging" : ""}`}
              ref={(el) => el && (circlesRef.current[index] = el)}
            ></div>
          ))}
        <div className="container">
          <div className={`box-login ${recuperar ? "hidden" : ""}`}>
            <div className="title-box">
              <h1 className="text-center mt-2">Login</h1>
            </div>
            <div className="text-center inputs-login">
              <EmailInput
                id="emailField"
                className="form-control"
                placeholder="Digite o seu email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
                onKeyDown={handleKeyDown}
              />
              <PasswordInput
                id="passwordField"
                className="form-control"
                placeholder="Insira sua senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  handleInputChange();
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleLogin}
                className="btn btn-login mt-4"
                disabled={loading}
              >
                {loading ? "Carregando..." : "Login"}
              </button>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

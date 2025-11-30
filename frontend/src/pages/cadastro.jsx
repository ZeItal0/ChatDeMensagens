import React, { useState } from "react";
import "../assets/cadastro.css";
import backgroundImg from "../background/background.png";
import logob from "../background/logob.png";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: senha,
          username: usuario,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao cadastrar usuário");
        return;
      }

      setSuccess("Usuário cadastrado com sucesso!");
      setError("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="backgroundimg" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="login-container">
        <div className="card">
          <div className="card-content">
            <div className="logo-column">
              <img src={logob} alt="Connect Bubbles Logo" />
            </div>

            <div className="form-column">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="senha">Senha</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    placeholder="Crie sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="usuario">Usuário</label>
                  <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    placeholder="Escolha um nome de usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                  />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}

                <div className="register-button-container">
                  <button type="submit" className="register-button">
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

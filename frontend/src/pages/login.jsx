import React, { useState } from "react";
import "../assets/login.css";
import backgroundImg from "../background/background.png";
import logob from "../background/logob.png";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: usuario, password: senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "erro no login");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/chat");
        } catch (err) {
            setError("erro ao conectar com o servidor");
            console.error(err);
        }
    };

    return (
        <div className="backgroundimg" style={{ backgroundImage: `url(${backgroundImg})` }}>
            <div className="login-container">
                <div className="card-login">
                    <div className="logo-area">
                        <img src={logob} className="logo-icon" alt="Logo" />
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="usuario">E-mail</label>
                            <input type="text" id="usuario" name="usuario" placeholder="Digite seu usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senha">senha</label>
                            <input type="password" id="senha"  name="senha" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="login-button"> Entrar </button>
                    </form>

                    <div className="separator"></div>

                    <div className="register-link"> Não tem conta? <Link to="/cadastro">Cadastre-se</Link> </div>
                </div>
            </div>
        </div>
    );
}

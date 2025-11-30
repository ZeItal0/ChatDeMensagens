import React from "react";
import "../assets/login.css";
import backgroundImg from "../background/background.png";
import logob from "../background/logob.png";
import { Link } from "react-router-dom";


export default function Login() {
    return (
        <div className="backgroundimg" style={{ backgroundImage: `url(${backgroundImg})` }}>
            <div className="login-container">
                <div className="card">
                    <div className="logo-area">
                        <img src={logob} className="logo-icon" />
                    </div>

                    <form>
                        <div className="form-group">
                            <label htmlFor="usuario">usuário</label>
                            <input type="text" id="usuario" name="usuario" placeholder="Digite seu usuário" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senha">senha</label>
                            <input type="password" id="senha" name="senha" placeholder="Digite sua senha" />
                        </div>

                        <Link to="/chat" className="login-button">
                            Entrar
                        </Link>
                    </form>

                    <div className="separator"></div>

                    <div className="register-link">
                        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
                    </div>


                </div>
            </div>
        </div>
    );
}

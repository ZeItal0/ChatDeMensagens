import React from "react";
import "../assets/cadastro.css";
import backgroundImg from "../background/background.png";
import logob from "../background/logob.png";
import { Link } from "react-router-dom";


export default function Cadastro() {
    return (
        <div className="backgroundimg" style={{ backgroundImage: `url(${backgroundImg})` }}>
            <div className="login-container">
                <div className="card">
                    <div className="card-content">
                        <div className="logo-column">
                            <img src={logob} alt="Connect Bubbles Logo" />
                        </div>

                        <div className="form-column">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" placeholder="Digite seu email" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="senha">senha</label>
                                    <input type="password" id="senha" name="senha" placeholder="Crie sua senha" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="usuario">usuario</label>
                                    <input type="text" id="usuario" name="usuario" placeholder="Escolha um nome de usuário" />
                                </div>

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

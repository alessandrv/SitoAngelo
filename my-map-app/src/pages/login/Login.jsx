import React, { useState } from "react";
import "./login.css";
import {Button, ButtonGroup} from "@heroui/button";

function Login() {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const validateEmails = () => {
    if (email !== confirmEmail) {
      setEmailError("Le email non coincidono!");
    } else {
      setEmailError("");
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Debole ❌");
    } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
      setPasswordStrength("Forte ✅");
    } else {
      setPasswordStrength("Media ⚠️");
    }
  };

  return (
    <div className="mainContainerLogin">
      {showLogin ? (
        <div className="containerLogin">
          <div className="login">
            <h2 className="titleLogin">Accedi</h2>
            <form className="formLogin">
              <label htmlFor="username">Username o Email</label>
              <input type="text" className="userLogin" placeholder="Username o Email" />
              <label htmlFor="password">Password</label>
              <input type="password" className="userLogin" placeholder="Password" />
              <ButtonGroup>
                <Button>Accedi</Button>
                <Button>Registrati</Button>
              </ButtonGroup>
            </form>
          </div>
          <div className="containerCreateAccount">
            <p>Hai dimenticato la password?</p>
            <button>Recupera Password</button>
            <button onClick={() => setShowLogin(false)}>Crea Account</button>
          </div>
        </div>
      ) : (
        <div className="containerRegister">
          <div className="register">
            <h2 className="titleRegister">Registrati</h2>
            <form className="formRegister">
              <label htmlFor="username">Username</label>
              <input type="text" className="userLogin" placeholder="Username" />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="userLogin"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="confirmEmail">Conferma Email</label>
              <input
                type="email"
                className="userLogin"
                placeholder="Conferma Email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                onBlur={validateEmails}
              />
              {emailError && <p className="error">{emailError}</p>}
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="userLogin"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
              />
              {password && <p className="passwordStrength">{passwordStrength}</p>}
              <label htmlFor="repeatPassword">Ripeti Password</label>
              <input type="password" className="userLogin" placeholder="Ripeti Password" />
              <label htmlFor="tel">Telefono</label>
              <input type="number" className="userLogin" placeholder="Telefono" />
              <button className="buttonLogin">Registrati</button>
            </form>
          </div>
          <div>
            <p>Hai già un account?</p>
            <button onClick={() => setShowLogin(true)}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

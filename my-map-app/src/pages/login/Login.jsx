import React, { useState } from "react";
import "./login.css";
import {Button, ButtonGroup,Form, Input} from "@heroui/react";

function Login() {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [action, setAction] = React.useState(null);

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
            <Form
      className="w-full max-w-xs flex flex-col gap-4"
      onReset={() => setAction("reset")}
      onSubmit={(e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));

        setAction(`submit ${JSON.stringify(data)}`);
      }}
    >
      <Input
        isRequired
        errorMessage="Please enter a valid username"
        label="Username"
        labelPlacement="outside"
        name="username"
        placeholder="Enter your username"
        type="text"
      />

      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
      />
      <div className="flex gap-2">
        <Button color="primary" type="submit">
          Submit
        </Button>
        <Button type="reset" variant="flat">
          Reset
        </Button>
      </div>
      {action && (
        <div className="text-small text-default-500">
          Action: <code>{action}</code>
        </div>
      )}
    </Form>
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

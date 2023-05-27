import React, { useState } from "react";
import { useDialog } from "react-st-modal";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import { Form } from "./UI/Form";
import { UI } from "./UI/UI";
import cogoToast from "cogo-toast";

const Wrapper = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

export default function RegisterDialog({ setUser }) {
  const dialog = useDialog();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState({});

  const register = async () => {
    try {
      const body = {
        email,
        password,
        passwordAgain,
      };

      const { data } = await HttpClient().post("/api/auth/register", body);
      localStorage.setItem("token", data.token);
      dialog.close();
      cogoToast.success("Du har nu registreret dig");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  return (
    <Wrapper>
      <h2>Register</h2>
      <Form.TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label={"Email"}
        error={error.email}
      />
      <UI.Spacer bottom={1} />
      <Form.TextField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        label={"Password"}
        error={error.password}
      />
      <UI.Spacer bottom={1} />
      <Form.TextField
        value={passwordAgain}
        onChange={(e) => setPasswordAgain(e.target.value)}
        type="password"
        label={"Password Again"}
        error={error.passwordAgain}
      />
      <UI.Spacer bottom={1} />

      <UI.Button success onClick={register}>
        Register
      </UI.Button>
    </Wrapper>
  );
}

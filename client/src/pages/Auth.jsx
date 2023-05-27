import React, { useState } from "react";
import FloatingTextField from "../components/FloatingTextField";
import Page from "../components/Page";
import api from "../api";
import Button from "../components/Button";

export default function Auth({ mode }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/" + mode, user);
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.errors);
      } else if (err.response?.status === 401) {
        setError({ general: err.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <h1 className="text-5xl">
          {mode === "register" ? "Register" : "Login"}
        </h1>
        {error?.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error.general}
          </div>
        )}
        {mode === "register" && (
          <FloatingTextField
            label="Name"
            name="name"
            error={error?.name}
            onChange={handleChange}
          />
        )}
        <FloatingTextField
          label="Email"
          name="email"
          error={error?.email}
          onChange={handleChange}
        />
        <FloatingTextField
          label="Password"
          name="password"
          error={error?.password}
          onChange={handleChange}
          type={"password"}
        />
        {mode === "register" && (
          <FloatingTextField
            label="Password Confirmation"
            name="passwordConfirmation"
            error={error?.passwordConfirmation}
            onChange={handleChange}
            type={"password"}
          />
        )}
        <Button variant="primary" type="submit" disabled={loading}>
          {mode === "register" ? "Register" : "Login"}
        </Button>
      </form>
    </Page>
  );
}

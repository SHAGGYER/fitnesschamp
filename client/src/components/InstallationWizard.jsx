import React, { useState } from "react";
import styled from "styled-components";
import { Stepper, Step } from "react-form-stepper";
import PrimaryButton from "./UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import Page from "./Page";
import Alert from "./UI/Alert";
import { Form } from "./UI/Form";
import { UI } from "./UI/UI";
import Switch from "./Switch";

const SwitchContainer = styled.label`
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  gap: 1rem;
`;

const Wrapper = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
    text-align: center;
  }
`;

export default function InstallationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [appName, setAppName] = useState("");
  const [english, setEnglish] = useState(false);

  const saveAppName = async () => {
    try {
      setLoading(true);
      await HttpClient().post("/api/installation/app-name", { appName });
      setCurrentStep(1);
      setLoading(false);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
        setLoading(false);
      }
    }
  };

  const installFoods = async () => {
    try {
      setLoading(true);
      await HttpClient().post("/api/installation/foods", { english });
      setCurrentStep(currentStep + 1);
    } catch (e) {
      if (e.response && e.response.status === 500) {
        setError({ foodInstallationError: e.response.data.error });
        setLoading(false);
      }
    }
  };

  return (
    <Page>
      <Wrapper>
        <h2>Installation</h2>

        <Stepper activeStep={currentStep}>
          <Step label="Appnavn" />
          <Step label="Foods" />
          <Step label="Færdig" />
        </Stepper>

        {currentStep === 0 && (
          <div>
            <Form.TextField
              label="Appnavn"
              value={appName}
              error={error.appName}
              onChange={(e) => setAppName(e.target.value)}
            />
            <UI.Spacer bottom={1} />
            <PrimaryButton onClick={saveAppName} $loading={loading}>
              {loading && <i className="fas fa-spinner fa-spin" />}
              Fortsæt
            </PrimaryButton>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <p style={{ marginBottom: "1rem" }}>
              Du skal udfylde Mad Databasen før appen er klar til brug
            </p>
            <fieldset style={{ padding: "1rem", marginBottom: "1rem" }}>
              <legend>Sprog</legend>
      {/*        <SwitchContainer>
                <span>Dansk</span>
                <Switch checked={true} disabled={true} />
              </SwitchContainer>
              <br />*/}
              <SwitchContainer>
                <span>English</span>
                <Switch
                  disabled={true}
                  checked={true}
                />
              </SwitchContainer>
            </fieldset>
            {!!error.foodInstallationError && <Alert error>{error}</Alert>}
            <PrimaryButton
              disabled={loading}
              onClick={installFoods}
              $loading={loading}
            >
              {loading && <i className="fas fa-spinner fa-spin" />}
              Fortsæt
            </PrimaryButton>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <p style={{ marginBottom: "1rem" }}>
              Du er nu færdig. Klik på følgende knap for at fortsætte.
            </p>
            <PrimaryButton onClick={() => window.location.reload()}>
              Fortsæt
            </PrimaryButton>
          </div>
        )}
      </Wrapper>
    </Page>
  );
}

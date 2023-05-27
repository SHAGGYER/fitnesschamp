import React, { useContext } from "react";
import Page from "../components/Page";
import styled from "styled-components";
import FitnessImg from "../images/fitness.svg";
import ProgressImg from "../images/progress.svg";
import QuestionImg from "../images/question.svg";
import AppContext from "../AppContext";
import { CustomDialog } from "react-st-modal";
import LoginDialog from "../components/LoginDialog";
import RegisterDialog from "../components/RegisterDialog";
import SetupDialog from "../components/SetupDialog";
import { useHistory } from "react-router-dom";
import LazyLoad from 'react-lazy-load';

const PricingTableContainer = styled.article`
  display: flex;
  margin-top: 5rem;
  justify-content: center;
  align-items: center;
  padding-bottom: 3rem;
`;

const PricingTable = styled.div`
  width: 350px;
  border: 1px solid rgba(0, 0, 0, 0.075);
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2);
  height: min-content;

  .header {
    border-bottom: 5px solid #e5e7eb;
    padding: 2rem;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .features {
    ul {
      list-style: none;

      li {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        text-align: center;
      }
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 3rem;

    h3 {
      font-size: 40px;
      font-family: "Anton", sans-serif;
      margin-bottom: 1rem;
    }

    h4 {
      font-size: 25px;
    }

    button {
      padding: 1rem;
      border-radius: 20px;
      background-color: var(--primary);
      border: none;
      cursor: pointer;
    }
  }

  &.big {
    width: 400px;
    position: relative;
    right: 10px;
    z-index: 99;
    background-color: white;

    .header {
      padding: 3rem;
    }
  }
`;

const Wrapper = styled.div`
  h1 {
    font-family: "Anton", sans-serif;
    letter-spacing: 3px;
    font-size: 45px;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 25px;
    margin-bottom: 1rem;

    &.big {
      font-size: 40px;
    }
  }

  .margin-bottom {
    margin-bottom: 1rem;
  }

  .cta-btn {
    background-color: var(--primary);
    border: none;
    font-size: 30px;
    padding: 0.5rem 1.5rem;
    cursor: pointer;

    &.small {
      font-size: 20px;
    }
  }

  @media screen and (max-width: 1100px) {
    h1,
    h2,
    .cta-btn {
      text-align: center;
      margin: 0 auto;
      display: block;
    }

    h2 {
      margin-bottom: 1rem;
    }

    .paragraph {
      max-width: 400px;
      margin: 0 auto;
      text-align: center;
    }
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 2rem;

  img {
    height: 300px;
    flex: 1;
    width: auto;
  }

  ${Wrapper} {
    flex: 1;
  }

  @media screen and (max-width: 1100px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;

    &.mobile-reverse {
      flex-direction: column-reverse;
    }

    img {
      width: 400px;
    }
  }

  @media screen and (max-width: 600px) {
    img {
      width: 100%;
    }
  }
`;

export default function Dashboard() {
  const { user, setUser } = useContext(AppContext);
  const history = useHistory();

  const openLoginDialog = async () => {
    const result = await CustomDialog(<LoginDialog setUser={setUser} />);
  };

  const openRegisterDialog = async () => {
    const result = await CustomDialog(<RegisterDialog setUser={setUser} />);
  };

  const openSetupDialog = async () => {
    const result = await CustomDialog(
      <SetupDialog setUser={setUser} user={user} />
    );

    if (result) {
      history.push("/journal");
    }
  };

  return (
    <Page>
      <Container style={{ marginTop: "3rem" }}>
        <Wrapper>
          <h1>Velkommen til dit nye liv</h1>
          <h2>...hvor du når dine fitness-mål, garanteret!</h2>
          {user ? (
            <button className="cta-btn small" onClick={openSetupDialog}>
              Start
            </button>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="cta-btn small" onClick={openLoginDialog}>
                Log ind
              </button>
              <button className="cta-btn small" onClick={openRegisterDialog}>
                Opret Konto
              </button>
            </div>
          )}
        </Wrapper>
        <img src={FitnessImg} alt="Fitness" loading="lazy" />
      </Container>

      <Container className="mobile-reverse">
        <img src={ProgressImg} alt="Progress" />
        <Wrapper>
          <h2 className="big">Spor Dine Fremskridt</h2>
          <div className="paragraph">
            Du kan nemt spore dine fremskridt i Journalen. Bare tilføj mad, og
            lad os tage sig af resten. Vi laver hele matematikken for dig!
          </div>
        </Wrapper>
      </Container>
      <Container>
        <Wrapper>
          <h2 className="big">Har du spørgsmål?</h2>
          <div className="margin-bottom paragraph">
            <h3>Er det sikkert at bruge?</h3>
            <span>
              Ja, det er sikkert at bruge hjemmesiden. Den ligger på en sikker
              server i Tyskland, og alt er sikkert.
            </span>
          </div>
          <div className="paragraph">
            <h3>Koster det noget?</h3>
            <span>
              Nej, hjemmesiden er helt gratis lige nu! Dog i fremtiden vil vi
              introducere nogle features, som man skal betale for, hvis man vil
              bruge dem.
            </span>
          </div>
        </Wrapper>
        <img src={QuestionImg} alt="Question" />
      </Container>

      <PricingTableContainer>
        <PricingTable>
          <div className="header">
            <h2>Gratis</h2>
          </div>

          <div className="features">
            <ul>
              <li>Journal</li>
              <li>Mål</li>
              <li>Tips & Tricks</li>
            </ul>
          </div>

          <div className="footer">
            <h3>0 kr.</h3>
            <button>Få det</button>
          </div>
        </PricingTable>
        <PricingTable className="big">
          <div className="header">
            <h2>Premium Årlig</h2>
          </div>

          <div className="features">
            <ul>
              <li>Journal</li>
              <li>Mål</li>
              <li>Tips & Tricks</li>
              <li>Personlig Rådgivning</li>
            </ul>
          </div>

          <div className="footer">
            <h4>
              kun <strike>149 kr</strike>
            </h4>
            <h3>99 kr. / måned</h3>
            <button>Bestil</button>
          </div>
        </PricingTable>
        <PricingTable style={{position: "relative", right: 20 }}>
          <div className="header">
            <h2>Premium Månedlig</h2>
          </div>

          <div className="features">
            <ul>
              <li>Journal</li>
              <li>Mål</li>
              <li>Tips & Tricks</li>
              <li>Personlig Rådgivning</li>
            </ul>
          </div>

          <div className="footer">
            <h4>
              kun <strike>199 kr</strike>
            </h4>
            <h3>129 kr. / måned</h3>
            <button>Bestil</button>
          </div>
        </PricingTable>
      </PricingTableContainer>
    </Page>
  );
}

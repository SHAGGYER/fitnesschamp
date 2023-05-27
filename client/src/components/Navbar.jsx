import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import AppContext from "../AppContext";
import NavbarSubmenu from "./NavbarSubmenu";
import {CustomDialog} from "react-st-modal";
import LoginDialog from "./LoginDialog";
import FoodSearch from "./FoodSearch";
import SetupDialog from "./SetupDialog";
import IconHome from "../images/icon_home.svg";
import IconJournal from "../images/icon_journal.svg";
import IconSetup from "../images/icon_setup.svg";
import IconAccount from "../images/icon_account.svg";
import PaymentDialog from "./PaymentDialog";
import BillingDialog from "./BillingDialog";
import PersonalAdviceDialog from "./PersonalAdviceDialog";

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background-color: var(--primary);
`;

const Wrapper = styled.nav`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    font-family: "Anton", sans-serif;
    font-size: 45px;
    cursor: pointer;
  }

  .nav {
    list-style: none;
    display: flex;
    gap: 0.5rem;
    margin-left: 0;
    padding: 0;
    align-items: center;

    .navlink {
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;

      img {
        width: 20px;
      }

      :hover {
        background-color: var(--primary-light);
      }
    }

    .submenu-link {
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;

      img {
        width: 20px;
      }

      :hover {
        background-color: var(--primary);
      }
    }
  }
`;

export default function Navbar() {
  const history = useHistory();
  const {user, logout, setUser} = useContext(AppContext);

  const openLoginDialog = async () => {
    const result = await CustomDialog(<LoginDialog setUser={setUser}/>);
  };

  const openRegisterDialog = async () => {
    const result = await CustomDialog(
      <SetupDialog user={user} withRegister={true} setUser={setUser}/>
    );
  };

  const openSetupDialog = async () => {
    const result = await CustomDialog(
      <SetupDialog setUser={setUser} user={user}/>
    );
  };

  const openPaymentDialog = async () => {
    const result = await CustomDialog(user.stripeSubscriptionStatus !== "active" && user.stripeSubscriptionStatus !== "trialing" ? (
      <PaymentDialog setUser={setUser} user={user}/>
    ) : (
      <BillingDialog user={user} setUser={setUser}/>
    ));
  };

  const openPersonalAdviceDialog = async () => {
    const result = await CustomDialog(<PersonalAdviceDialog/>);
  };

  return (
    <Container>
      <Wrapper>
        <article className="logo" onClick={() => history.push("/")}>
          Swaies
        </article>
        <FoodSearch/>
        <ul className="nav">
          <li className="navlink" onClick={() => history.push("/")}>
            <img src={IconHome} alt="Home"/>
            Home
          </li>
          {!!user && (
            <>
              <li className="navlink" onClick={() => history.push("/journal")}>
                <img src={IconJournal} alt="Journal"/>
                Journal
              </li>
              <li className="navlink" onClick={openSetupDialog}>
                <img src={IconSetup} alt="Setup"/>
                Setup
              </li>
            </>
          )}
          <NavbarSubmenu
            title="Account"
            icon={IconAccount}
            content={() => (
              <div style={{width: 200, padding: "1rem"}}>
                {!user ? (
                  <ul
                    className="nav"
                    style={{flexDirection: "column", alignItems: "stretch"}}
                  >
                    <li onClick={openLoginDialog} className="submenu-link">
                      Login
                    </li>
                    <li onClick={openRegisterDialog} className="submenu-link">
                      Register
                    </li>
                  </ul>
                ) : (
                  <ul
                    className="nav"
                    style={{flexDirection: "column", alignItems: "stretch"}}
                  >
                    <li onClick={openPaymentDialog} className="submenu-link">
                      Betalinger
                    </li>
                    <li onClick={openPersonalAdviceDialog} className="submenu-link">
                      Bestil Rådgivning
                    </li>
                    <li onClick={logout} className="submenu-link">
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            )}
          />
        </ul>
      </Wrapper>
    </Container>
  );
}

import React, {useEffect, useState} from "react";
import { injectStripe } from "react-stripe-elements";
import StripePurple from "../../images/stripe_purple.svg";
import Dankort from "../../images/dankort.svg";
import Mastercard from "../../images/mastercard.svg";
import Maestro from "../../images/maestro.svg";
import Visa from "../../images/visa.svg";
import CardSection from "./CardSection";
import HttpClient from "../../services/HttpClient";
import Alert from "../UI/Alert";
import { Form } from "../UI/Form";
import Checkmark from "../Checkmark";
import PrimaryButton from "../UI/PrimaryButton";
import {ClipLoader} from "react-spinners"

const SubscriptionForm = ({ stripe, plan, onSuccessfulPayment }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState("");
  const [chosenPlan, setChosenPlan] = useState(plan || "yearly");

  const [paymentSuccess, setPaymentSuccessfull] = useState(false);

  useEffect(() => {
    console.log(paymentSuccess)
  }, [paymentSuccess])

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError(null);

    setSubmitting(true);

    try {
      const sourceResponse = await stripe.createSource({ type: "card" });
      const { source, error } = sourceResponse;
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }

      const { data } = await HttpClient().post(
        "/api/billing/create-subscription",
        {
          source,
          name,
          plan: chosenPlan,
        }
      );
      onSuccessfulPayment(data.user);
      setPaymentSuccessfull(true);
    } catch (error) {
      console.log(error)
      setSubmitting(false);
      if (error.response) {
        setError(error.response?.data?.error);
      }
    }
  };

  return (
    <React.Fragment>
      <Form width="600px" padding="1.3rem 2rem" onSubmit={handleSubmit}>
        {!paymentSuccess ? (
          <>
            <div style={{display: "flex", gap: "1rem"}}>
              <div onClick={() => setChosenPlan("yearly")}>
                <Alert primary={chosenPlan === "monthly"} success={chosenPlan == "yearly"}>
                  <h2>Årlig</h2>
                  <h3 style={{ fontFamily: "Anton, sans-serif" }}>1188 kr.</h3>
                </Alert>
              </div>
           <div onClick={() => setChosenPlan("monthly")}>
             <Alert primary={chosenPlan === "yearly"} success={chosenPlan == "monthly"}>
               <h2>Månedlig</h2>
               <h3 style={{ fontFamily: "Anton, sans-serif" }}>149 kr.</h3>
             </Alert>
           </div>

            </div>

            {!!error && <Alert error>{error}</Alert>}
            <input
              className="card__element mb-1"
              style={{ padding: "0.8rem", width: "100%" }}
              placeholder="Navn på kort"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CardSection />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", gap: "0.25rem", marginTop: "0.5rem" }}
              >
                <img src={Dankort} style={{ height: 25 }} />
                <img src={Visa} style={{ height: 25 }} />
                <img src={Maestro} style={{ height: 25 }} />
                <img src={Mastercard} style={{ height: 25 }} />
              </div>
              <img src={StripePurple} style={{ height: 25 }} />
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <PrimaryButton
                disabled={submitting}
                $loading={submitting}
              >
                <ClipLoader loading={submitting} size={20} />
                Betal
              </PrimaryButton>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <h2>Betalingen blev gennemført</h2>
            <div>
              <Checkmark />
            </div>
          </div>
        )}
      </Form>
    </React.Fragment>
  );
};

export default injectStripe(SubscriptionForm);

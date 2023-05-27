import React, { useContext, useEffect, useRef, useState } from "react";
import Page from "../components/Page";
import styled from "styled-components";
import { UI } from "../components/UI/UI";
import { Form } from "../components/UI/Form";
import Popover from "../components/Popover";
import FoodSearch from "../components/FoodSearch";
import AppContext from "../AppContext";
import HttpClient from "../services/HttpClient";
import moment from "moment";
import PrimaryButton from "../components/UI/PrimaryButton";
import StarRewardDialog from "../components/StarRewardDialog";
import Alert from "../components/UI/Alert";
import { CustomDialog } from "react-st-modal";
import HelpDialog from "../components/HelpDialog";
import IconPlus from "../images/icon_plus.svg";
import IconDelete from "../images/icon_delete.svg";
import IconLeft from "../images/icon_left.svg";
import IconRight from "../images/icon_right.svg";
import IconHelp from "../images/icon_help.svg";
import IconKcal from "../images/icon_kcal.svg";
import IconProtein from "../images/icon_protein.svg";
import IconCarbs from "../images/icon_carbs.svg";
import IconFats from "../images/icon_fats.svg";

const CopyFoodDialog = ({meals}) => {
  const [meal, setMeal] = useState()

  return (
    <div style={{padding: "1rem"}}>
      <Form.Select label={"Vælg måltid"} onChange={e => setMeal(e.target.value)} value={meal}>
        {meals.map((x, index) => (
          <option key={index} value={x._id}>{x.name}</option>
        ))}
      </Form.Select>
    </div>
  )
}

const MacronutrientsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 100px) 30px;
  gap: 0.5rem;
  justify-content: end;
  align-items: center;
  height: min-content;

  div {
    background-color: var(--primary);
    padding: 0.35rem;
    display: flex;
    gap: 0.25rem;
    align-items: flex-start;
    font-size: 14px;

    span {
      line-height: 1.3;
    }

    img {
      width: 15px;
    }
  }
`;

const NavigationWrapper = styled.section`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    background-color: var(--primary);
    padding: 0.85rem;
    font-size: 15px;
  }

  button {
    padding: 0.6rem;
    border: none;
    background-color: var(--primary);
    line-height: 0.8;

    img {
      width: 25px;
    }
  }
`;

const Wrapper = styled.section`
  display: grid;
`;

const FoodWrapper = styled.article``;

const Meal = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--light);
  margin-bottom: 1rem;

  h4 {
    margin-bottom: 0.5rem;
  }

  .chosen-food {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export default function Journal() {
  const { meals, setMeals, user, setUser } = useContext(AppContext);
  const [selectedFood, setSelectedFood] = useState(null);
  const [chosenFoods, setChosenFoods] = useState([]);
  const [grams, setGrams] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [firstFetch, setFirstFetch] = useState(true);
  const [day, setDay] = useState(null);
  const [countDaysUntilGoalMet, setCountDaysUntilGoalMet] = useState(undefined);
  const [showReward, setShowReward] = useState(false);
  const [mealIndexEditting, setMealIndexEditting] = useState(false);
  const [mealNameEdit, setMealNameEdit] = useState("");

  const mealInputRef = useRef();

  useEffect(() => {
    getDay();
  }, [date]);

  useEffect(() => {
    if (!firstFetch) {
      saveDay({ finished: false });
    }
  }, [chosenFoods, firstFetch]);

  useEffect(() => {
    if (day) {
      calculateDaysUntilGoalFinished();
    }
  }, [day]);

  useEffect(() => {
    if (user) {
      calculateDaysUntilGoalFinished();
    }
  }, [user, setUser]);

  useEffect(() => {
    if (mealInputRef.current) {
      mealInputRef.current.focus();
    }
  }, [mealInputRef.current, mealIndexEditting]);

  const handleMealNameEditting = (mealIndex) => {
    setMealIndexEditting(mealIndex);
  };

  const getDay = async () => {
    const { data } = await HttpClient().get("/api/foods/get-day/" + date);
    setChosenFoods(data.journal_entries);
    setDay(data.day);
  };

  const onFoodSelected = (food, setSearch) => {
    setSelectedFood(food);
    setSearch("");
  };

  const addSelectedFood = (mealId) => {
    setGrams("");
    setSelectedFood(null);
    setFirstFetch(false);
    setChosenFoods((prevState) => {
      return [
        ...prevState,
        {
          mealId,
          grams,
          food: selectedFood,
        },
      ];
    });
  };

  const getMacroTotal = (grams, macro) => {
    return parseInt((grams / 100) * macro);
  };

  const getTotalCalories = () => {
    let total = 0;

    chosenFoods.forEach((food) => {
      total += getMacroTotal(food.grams, food.food.kcal);
    });

    return total;
  };

  const saveDay = async ({ finished }) => {
    const body = {
      chosenFoods,
      date,
      finished,
    };

    const { data } = await HttpClient().post("/api/foods/save-day", body);
    setFirstFetch(true);

    getDay();
    calculateDaysUntilGoalFinished();
    setDay(data.day);
  };

  const finishDay = async () => {
    if (!day || (day && !day.finished)) {
      setShowReward(true);
    }
    await saveDay({ finished: true });
  };

  const nextDate = async () => {
    setFirstFetch(true);
    setDate(moment(date).add(1, "day").format("YYYY-MM-DD"));
  };

  const prevDate = async () => {
    setFirstFetch(true);
    setDate(moment(date).subtract(1, "day").format("YYYY-MM-DD"));
  };

  const calculateDaysUntilGoalFinished = () => {
    const totalCalories = getTotalCalories();
    const maintenanceCalories = user.maintenanceCalories;
    const differenceCalories = maintenanceCalories - totalCalories;
    const caloriesPerKilogram = 7700;
    const currentKilograms = user.weight;
    const totalCaloriesToBurn =
      (currentKilograms - user.targetWeight) * caloriesPerKilogram;

    const result = parseInt(totalCaloriesToBurn / differenceCalories);

    setCountDaysUntilGoalMet(result > 0 ? result : undefined);
  };

  const deleteFood = async (index, food, mealId) => {
    setChosenFoods((prevState) => {
      const mealFoods = prevState.filter((x) => x.mealId === mealId);
      const newMealFoods = mealFoods.filter((x, i) => i !== index);
      return [...prevState.filter((x) => x.mealId !== mealId), ...newMealFoods];
    });

    if (food._id) {
      await HttpClient().delete("/api/foods/journal-entry/" + food._id);
    }

    calculateDaysUntilGoalFinished();
  };

  const shouldShowDaysUntilGoalMet = () => {
    return countDaysUntilGoalMet !== undefined && !!day && day.finished;
  };

  const changeMealName = async (event) => {
    event.preventDefault();
    const body = {
      name: mealNameEdit,
    };

    await HttpClient().put(
      "/api/foods/change-meal-name/" + meals[mealIndexEditting]._id,
      body
    );

    const _meals = [...meals];
    _meals[mealIndexEditting].name = mealNameEdit;
    setMeals(_meals);
    setMealIndexEditting(undefined);
    setMealNameEdit("");
  };

  const openHelpDialog = async () => {
    await CustomDialog(<HelpDialog />);
  };

  const onClickCopyMealDialog = async () => {
    const result = await CustomDialog(<CopyFoodDialog meals={meals} />)
  }

  return (
    <Page>
      {showReward && <StarRewardDialog onClosed={() => setShowReward(false)} />}
      <NavigationWrapper>
        <button onClick={prevDate}>
          <img src={IconLeft} alt="left" />
        </button>
        <span>{moment(date).format("DD-MM-YYYY")}</span>
        <button onClick={nextDate}>
          <img src={IconRight} alt="right" />
        </button>
        <button onClick={openHelpDialog}>
          <img src={IconHelp} alt="help" />
        </button>
      </NavigationWrapper>

      <Wrapper>
        <FoodWrapper>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <div></div>
            <MacronutrientsContainer style={{ position: "relative" }}>
              <div>
                <img src={IconKcal} alt="kcal" />
                <span>Kcal</span>
              </div>
              <div>
                <img src={IconProtein} alt="protein" />
                <span>Protein</span>
              </div>
              <div>
                <img src={IconCarbs} alt="carbs" />
                <span>Kulhydrat</span>
              </div>
              <div>
                <img src={IconFats} alt="fat" />
                <span>Fedt</span>
              </div>
            </MacronutrientsContainer>
          </div>
          {meals.map((meal, index) => (
            <Meal key={index}>
              {mealIndexEditting === index ? (
                <form onSubmit={changeMealName}>
                  <input
                    ref={mealInputRef}
                    value={mealNameEdit}
                    onChange={(e) => setMealNameEdit(e.target.value)}
                    style={{ padding: "0.5rem 1rem" }}
                    placeholder={meal.name}
                    onBlur={() => {
                      setMealIndexEditting(undefined);
                      setMealNameEdit("");
                    }}
                  />
                </form>
              ) : (
                <h4 onClick={() => handleMealNameEditting(index)}>
                  {meal.name}
                </h4>
              )}
              {chosenFoods
                .filter((x) => x.mealId === meal._id)
                .map((food, index) => (
                  <div key={index} className="chosen-food">
                    <span>
                      {food.food.name}, ({food.grams}g)
                    </span>
                    <MacronutrientsContainer key={index}>
                      <div>{getMacroTotal(food.grams, food.food.kcal)}</div>
                      <div>{getMacroTotal(food.grams, food.food.protein)}</div>
                      <div>{getMacroTotal(food.grams, food.food.carbs)}</div>
                      <div>{getMacroTotal(food.grams, food.food.fats)}</div>
                      <div
                        onClick={() => deleteFood(index, food, food.mealId)}
                        style={{
                          textAlign: "center",
                          lineHeight: 0.7,
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={IconDelete}
                          alt="delete"
                          style={{ width: 17 }}
                        />
                      </div>
                    </MacronutrientsContainer>
                  </div>
                ))}
              <div>
                <div style={{display: "flex", gap: "0.25rem"}}>
                  <Popover
                    position="right"
                    content={({ setOpen }) => (
                      <div style={{ width: 350, padding: "1rem" }}>
                        <FoodSearch fullWidth onFoodSelected={onFoodSelected} />
                        {!!selectedFood && (
                          <div>
                            <UI.Spacer bottom={1} />
                            <h5>{selectedFood.name}</h5>
                            <UI.Spacer bottom={1} />
                            <Form.TextField
                              label="Hvor mange gram?"
                              value={grams}
                              onChange={(e) => setGrams(e.target.value)}
                            />
                            <UI.Spacer bottom={1} />
                            <UI.Button
                              primary
                              onClick={() => {
                                addSelectedFood(meal._id);
                                setOpen(false);
                              }}
                            >
                              Tilføj
                            </UI.Button>
                          </div>
                        )}
                      </div>
                    )}
                    trigger={({ triggerRef, onClick }) => (
                      <div
                        style={{ display: "inline-block" }}
                        ref={triggerRef}
                        onClick={(e) => onClick(e)}
                      >
                        <PrimaryButton>
                          <img src={IconPlus} alt="plus" />
                          Tilføj mad
                        </PrimaryButton>
                      </div>
                    )}
                  ></Popover>
                  <PrimaryButton onClick={onClickCopyMealDialog}>
                    Kopiér
                  </PrimaryButton>
                </div>
              </div>
            </Meal>
          ))}
        </FoodWrapper>
        <UI.Spacer bottom={1} />

        {(!day || (day && !day?.finished)) && (
          <div>
            <p>
              Tryk på følgende knap, når du er færdig med indtastninger for
              denne dag.
            </p>
            <UI.Spacer bottom={0.5} />
            <PrimaryButton onClick={finishDay}>Afslut Dag</PrimaryButton>
          </div>
        )}
        <UI.Spacer bottom={1} />

        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Total kalorier idag:{" "}
          <span style={{ fontSize: 30 }}>{getTotalCalories()}</span>
        </h2>
        {shouldShowDaysUntilGoalMet() && (
          <Alert primary>
            <h3 style={{ textAlign: "center" }}>
              Antal dage til du når dit mål:{" "}
              <span style={{ fontSize: 25 }}>{countDaysUntilGoalMet}</span>
            </h3>
          </Alert>
        )}
      </Wrapper>
    </Page>
  );
}

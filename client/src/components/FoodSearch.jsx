import React, {useEffect, useRef, useState} from "react";
import {useClickOutside} from "../hooks/ClickOutside";
import HttpClient from "../services/HttpClient";
import styled from "styled-components";
import {useInfiniteScroll} from "../hooks/InfiniteScroller";

const Wrapper = styled.div`
  .search-container {
    position: relative;

    input {
      padding: 1rem;
      width: ${(props) => (props.fullWidth ? "100%" : "300px;")};
    }

    .search-results {
      position: absolute;
      background-color: var(--light);
      top: 55px;
      width: 500px;
      height: 500px;
      overflow-y: auto;
      padding: 0.5rem;
      z-index: 99;

      .search-results__list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          border: 1px solid black;
          padding: 0.5rem;
          border-bottom: none;

          .search-result__bottom {
            display: flex;
            gap: 5px;
            align-items: center;
            justify-content: space-between;

            div {
              display: flex;
              gap: 2px;
            }
          }

          h3 {
            font-size: 18px;
            font-weight: normal;
            margin: 0;
          }

          .badge {
            background-color: var(--primary);
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
          }

          :last-child {
            border-bottom: 1px solid black;
          }
        }
      }
    }
  }
`;

export default function FoodSearch({onFoodSelected, fullWidth}) {
  const [searchResultsOpen, setSearchResultsOpen] = useState("");
  //const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const searchRef = useRef();


  useClickOutside(searchRef, () => setSearchResultsOpen(false));


  const doSearch = async (searching = false) => {
    const body = {
      name: search,
    };

    let skipUrl = ""

    if (!searching) {
      skipUrl = "?skip=" + searchResults.length
    } else {
      setHasMore(true)
    }

    const {data} = await HttpClient().post("/api/foods/search" + skipUrl, body);
    if (!data.foods.length) {
      setHasMore(false);
    }
    setSearchResults([
      ...searchResults,
      ...data.foods,

    ]);
    onLoad()
  };

  const [searchResults, setSearchResults, {onLoad}] = useInfiniteScroll("search-container", doSearch, hasMore, 150, "bottom", 10);

  useEffect(() => {
    if (!search) {
      setSearchResultsOpen(false);
      setSearchResults([]);
    } else {

      const timeoutId = setTimeout(() => {
        setSearchResultsOpen(true);
        setSearchResults([]);
        doSearch(true);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [search]);


  const handleOnFoodSelected = (food) => {
    onFoodSelected(food, setSearch);
    setSearchResultsOpen(false);
    setSearchResults([]);
  };


  return (
    <Wrapper fullWidth={fullWidth}>
      <article className="search-container">
        <input
          value={search}
          placeholder="Søg her"
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearchResultsOpen(true)}
        />
        {searchResultsOpen && (
          <div ref={searchRef} className="search-results" id="search-container">
            <ul className="search-results__list">
              {searchResults.map((result, index) => (
                <li key={index} onClick={() => handleOnFoodSelected(result)}>
                  <h3>{result.name}</h3>
                  <div className="search-result__bottom">
                    <span>{result.group}</span>
                    <div>
                      <span className="badge">Kcal {result.kcal}</span>
                      <span className="badge">Protein {result.protein}</span>
                      <span className="badge">Kulh. {result.carbs}</span>
                      <span className="badge">Fedt {result.fats}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </Wrapper>
  );
}

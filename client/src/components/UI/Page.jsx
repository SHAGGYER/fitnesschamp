import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  overflow-y: auto;
  position: relative;
  background-color: ${(props) => (props.color ? props.color : "white")};
  height: calc(100% - 4rem);
  padding: 1rem 1rem 0 1rem;
  max-width: ${props => props.maxWidth ? props.maxWidth : "100%"};
`;

export const Page = ({children, padding, color, maxWidth}) => {
  return (
    <Wrapper padding={padding} maxWidth={maxWidth} color={color}>
      {children}
    </Wrapper>
  );
};

import styled from "styled-components";

const PrimaryButton = styled.button`
  background-color: var(--primary);
  border: none;
  padding: 0.5rem 1rem;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 20px;
  }

  cursor: ${(props) => (!!props.$loading ? "not-allowed" : "pointer")};
`;

export default PrimaryButton;

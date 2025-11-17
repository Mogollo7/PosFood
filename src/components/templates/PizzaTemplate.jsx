import PizzaLista from "../organismos/PizzaLista.jsx";
import styled from "styled-components";
import { v } from "../../styles/variables";

export default function PizzaTemplate() {
  return (
    <PizzaListaWrapper>
      <PizzaLista />
    </PizzaListaWrapper>
  );
}

const PizzaListaWrapper = styled.div`
  min-height: 100vh;
  padding: ${v.xlSpacing};
  background: ${(props) => props.theme.bg};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;


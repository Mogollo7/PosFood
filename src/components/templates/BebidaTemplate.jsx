import BebidaLista from "../organismos/BebidaLista.jsx";
import styled from "styled-components";
import { v } from "../../styles/variables";

export default function BebidaTemplate() {
  return (
    <BebidaListaWrapper>
      <BebidaLista />
    </BebidaListaWrapper>
  );
}

const BebidaListaWrapper = styled.div`
  min-height: 100vh;
  padding: ${v.xlSpacing};
  background: ${(props) => props.theme.bg};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;
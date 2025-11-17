import CocinaLista from "../organismos/CocinaLista.jsx";
import styled from "styled-components";
import { v } from "../../styles/variables";

export default function CocinaTemplate() {
  return (
    <CocinaWrapper>
      <CocinaLista />
    </CocinaWrapper>
  );
}

const CocinaWrapper = styled.div`
  min-height: 100vh;
  padding: ${v.xlSpacing};
  background: ${(props) => props.theme.bg};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;


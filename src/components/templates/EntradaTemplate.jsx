import EntradaBebidas from "../organismos/EntradaLista.jsx";
import styled from "styled-components";
import { v } from "../../styles/variables";

export default function EntradaTemplate() {
  return (
    <EntradaBebidasWrapper>
      <EntradaBebidas />
    </EntradaBebidasWrapper>
  );
}

const EntradaBebidasWrapper = styled.div`
  min-height: 100vh;
  padding: ${v.xlSpacing};
  background: ${(props) => props.theme.bg};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

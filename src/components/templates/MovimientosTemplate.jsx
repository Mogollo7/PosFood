import styled from "styled-components";
import { Movimiento } from "../organismos/Movimiento";
import { v } from "../../styles/variables";

export default function MovimientosTemplate() {
  return (
    <Container>
      <Movimiento />
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: ${v.xlSpacing};
  background: ${(props) => props.theme.bg};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

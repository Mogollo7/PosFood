import styled from "styled-components";
import { PerfilForm } from "../organismos/PerfilForm";
import { v } from "../../styles/variables";

export function HomeTemplate({ userEmail, userMetadata }) {
  return (
    <Container>
      <PerfilForm userEmail={userEmail} userMetadata={userMetadata} />
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

// templates/LoginTemplate.jsx
import styled from "styled-components";
import { ContentCard } from "../organismos/ContentCard";
import { v, useAuthStore } from "../../index";
import { CardLogin } from "../moleculas/CardLogin";

export function LoginTemplate() {
  const { signInWithGoogle } = useAuthStore();

  return (
    <Container>
      <ContentCard imgSrc={v.imagenfondo}>
        {/* Usamos CardLogin directamente */}
        <CardLogin funcion={signInWithGoogle} />
      </ContentCard>
    </Container>
  );
}

const Container = styled.div`
  background-color: ${(props) => props.theme.bg};
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

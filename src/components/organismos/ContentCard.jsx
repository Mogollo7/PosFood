// organismos/ContentCard.jsx
import styled from "styled-components";
import { CardLogin } from "../moleculas/CardLogin";
import { CardImg } from "../moleculas/CardImg";

const Content = styled.div`
  background-color: ${(props) => props.theme.bg3};
  border-radius: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 80%;
  max-width: 1250px;
  height: 80vh;
  max-height: 850px;
  box-shadow: 8px 5px 18px 3px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  padding: 15px 30px;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

export function ContentCard({ children, imgSrc }) {
  return (
    <Content>
      <CardLogin>{children}</CardLogin>
      <CardImg src={imgSrc} alt="Fondo" />
    </Content>
  );
}

// moleculas/CardImg.jsx
import styled from "styled-components";
import { ImgFondo } from "../atomos/ImgFondo";

const ImgCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export function CardImg({ src, alt }) {
  return (
    <ImgCard>
      <ImgFondo
        src={src}
        alt={alt}
        radiusTopLeft="45px"
        radiusBottomRight="45px"
      />
    </ImgCard>
  );
}

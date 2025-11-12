// atomos/ImgFondo.jsx
import styled from "styled-components";

const ImgContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
  border-top-left-radius: ${(props) => props.radiusTopLeft || "0"};
  border-bottom-right-radius: ${(props) => props.radiusBottomRight || "0"};

  img {
    width:100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #00000069);
  }
`;

export function ImgFondo({ src, alt, radiusTopLeft, radiusBottomRight }) {
  return (
    <ImgContainer radiusTopLeft={radiusTopLeft} radiusBottomRight={radiusBottomRight}>
      <img src={src} alt={alt} />
    </ImgContainer>
  );
}

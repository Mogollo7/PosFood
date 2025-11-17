import PostreLista from "../organismos/PostreLista.jsx";
import styled from "styled-components";
import { v } from "../../styles/variables";

export default function PostreTemplate() {
  return (
    <PostreListaWrapper>
      <PostreLista />
    </PostreListaWrapper>
  );
}

const PostreListaWrapper = styled.div`
  min-height: 100vh;
  padding: ${v.xlSpacing};
  background: ${(props) => props.theme.bg};
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;
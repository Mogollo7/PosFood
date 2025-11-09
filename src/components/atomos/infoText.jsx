import styled from "styled-components";
import { v } from "../../styles/variables";

export const InfoText = styled.p`
  color: ${(props) => props.theme.colorSubtitle};
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 4px;
  text-align: left;
  opacity: 0.9;
`;
import styled from "styled-components";
import { v } from "../../styles/variables";

export const LoadingText = styled.p`
 color: ${(props) => props.theme.colorSubtitle};  
 text-align: center;
  font-weight: 500;
  font-size: 1rem;
  margin: ${v.mdSpacing} 0;
`;
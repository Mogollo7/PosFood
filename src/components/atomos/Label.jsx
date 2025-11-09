import styled from "styled-components";

export const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: ${(props) => props.theme.spacing?.sm || "8px"};
  color: ${(props) => props.theme.text};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;


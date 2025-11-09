import styled from "styled-components";
import { v } from "../../styles/variables";


export const Input = styled.input`
  width: 100%;
  padding: ${(props) => props.theme.spacing?.md || "12px"};
  border: 2px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.borderRadius || "6px"};
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: ${(props) => props.theme.inputBg};
  color: ${(props) => props.theme.placeholder || v.textColor}; /* 👈 Aquí */

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }

  &:disabled {
    background-color: ${(props) => props.theme.disabledBg};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${(props) => props.theme.placeholder};
  }
`;


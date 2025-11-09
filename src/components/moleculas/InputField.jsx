import styled from "styled-components";
import { Input } from "../atomos/Input";
import { Label } from "../atomos/Label";

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spacing?.md || "16px"};
  width: 100%;
`;

export function InputField({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder, 
  disabled = false,
  required = false 
  
}) {
  return (
    <FieldContainer>
      <Label htmlFor={name}>
        {label}
        {required && <span style={{ color: "#F54E41", marginLeft: "4px" }}>*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
    </FieldContainer>
  );
}


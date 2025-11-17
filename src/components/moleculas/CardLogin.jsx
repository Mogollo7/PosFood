// moleculas/CardLogin.jsx
import styled from "styled-components";
import { v } from "../../index";
import { FcGoogle } from "react-icons/fc"; // Icono de Google
import { FaApple } from "react-icons/fa";
import { useAuthStore } from "../../store/AuthStore";

const LoginCard = styled.div`
  background-color: ${(props) => props.theme.bg};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;   /* 🔹 todo a la izquierda */
    justify-content: flex-start;

    gap: 25px;
    width: 100%;
    max-width: 400px;
;        /* 🔹 controla márgenes internos */
    gap: 25px;    
    .containerButtons {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .header {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  .header img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  .header .text {
    text-align: left;
  }

  .header h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }

  .header p {
    font-size: 1rem;
    margin: 0;
    color: ${(props) => props.theme.colorScroll};
  }

  .title {
    font-size: 2.2rem;
    font-weight: 800;
    text-align: left;
    width: 100%;
    color: #000;
    margin-top: 50px;
  }

  .buttonLogin {
    background-color: #000;
    color: #fff;
    border: none;
    padding: 12px 20px;
    font-size: 1rem;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    width: 388px;
    height: 70px
  }



  .separator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: ${(props) => props.theme.text2};
    font-size: 0.9rem;
    margin: 10px 0;
  }

  .separator::before,
  .separator::after {
    content: "";
    flex: 1;
    height: 1.2px;
    background: #3e3e3e;
    margin: 0 10px;
  }

  .containerButtons {
  display: flex;
  flex-direction: row; 
  justify-content: space-between; 
  align-items: center;     
  gap: 40px;               
  width: 100%;
  max-width: 320px;
  margin: 0 auto;    
}


  .buttonOption {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: ${(props) => props.theme.bg3};
    border: 1px solid ${(props) => props.theme.bgAlpha};
    border-radius: 10px;
    padding: 5px 20px;
    cursor: pointer;
  }



  .buttonOption svg {
    font-size: 40px;
    margin-right: 15px;
  }

  .buttonOption .Text p {
    margin: 0;
    line-height: 1;
    align-items: baseline;


  }

  .buttonOption h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => props.theme.text2};
  }
  .Text {
    display: flex;
    flex-direction: column;
    text-align: left;

  }


`;

export function CardLogin() {
  // Importamos directamente la función de autenticación desde el store
  const { signInWithGoogle } = useAuthStore();

  return (
    <LoginCard>
      <div className="container">
        {/* Header */}
        <div className="header">
          <img src={v.logo} alt="Logo" />
          <div className="text">
            <h1>PosFood</h1>
            <p>System POS</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="title">Welcome Back</h1>

        {/* Main Login Button */}
        <button className="buttonLogin" onClick={signInWithGoogle}>
          Continue with Gmail
        </button>

        {/* Separator */}
        <div className="separator">OR</div>

        {/* Extra Login Options */}
        <div className="containerButtons">
          <div className="buttonOption" onClick={signInWithGoogle}>
            <FcGoogle />
            <div className="Text">
              <p>Continue with</p>
              <h2>Google</h2>
            </div>
          </div>

          <div className="buttonOption">
            <FaApple />
            <div className="Text">
              <p>Continue with</p>
              <h2>Apple</h2>
            </div>
          </div>
        </div>
      </div>
    </LoginCard>
  );
}
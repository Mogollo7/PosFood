import styled from "styled-components";
import {Btnsave, v, useAuthStore } from "../../index";
export function LoginTemplate() {
    const { signInWithGoogle } = useAuthStore();
    return (
        <Container imgfondo={v.imagenfondo}>
        <div className="contentCard">
            <span className="version">Sistema POsFood</span>
            <div className="contentImg">
                <img src={v.logo}/>
            </div>
            <Titulo>POsFood</Titulo>
            <p className="frase">Sistema para la administración de Puntos de Venta en Restaurantes y Establecimientos de Comida Rapida </p>
            <ContainerBtn>
                <Btnsave titulo="Iniciar con Google" icono={<v.iconogoogle/>}bgcolor={v.colorSecundario} funcion={signInWithGoogle}/>
            </ContainerBtn>
        </div>
        </Container>);
}
const Container = styled.div`
  background-image: url(${(props) => props.imgfondo});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.87);
  overflow: hidden;
  position: fixed; /* <-- Fija el fondo y evita desbordes */
  top: 0;
  left: 0;
  z-index: 999; /* Evita que Sidebar o Menu se superpongan */

  .contentCard {
    background-color: rgba(19, 19, 19, 0.9);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 40px 30px;
    margin: 20px;
    max-width: 500px;
    width: 90%;
    box-shadow: 8px 5px 18px 3px rgba(0, 0, 0, 0.35);
    .version {
      color: #727272;
      text-align: start;
    }
    .contentImg {
      display: flex;
      justify-content: center;
      img {
        max-width: 60%;
      }
    }
    .frase {
      color: #909090;
      font-size: 1.2rem;
      line-height: 1.5;
      max-width: 400px;
      margin: 0 auto;
      white-space: normal;
    }
  }


    .contentCard{
        background-color: #131313;
        border-radius: 20px;
        gap: 30px;
        display: flex;
        flex-direction: column;
        padding: 20px;
        margin: 20px;
        box-shadow: 8px 5px 18px 3px rgba(0, 0, 0, 0.35);
        .version{
            color: #727272;
            text-align: start;
        }
        .contenetImg{
            img{
                max-width: 60%;
        }
    }
        .frase{
            color: #909090;
            font-size: 1.2rem;
            max-width: 400px; 
            margin: 0 auto;   
            white-space: normal; 
            line-height: 1.5; 
        }
    }
    `;

const Titulo = styled.span`
    font-size: 5rem;
    font-weight: 700;
    `;

const ContainerBtn = styled.div`
  display: flex;
  justify-content: center;
`;

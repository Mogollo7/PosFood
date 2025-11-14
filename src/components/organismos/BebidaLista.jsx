import styled from "styled-components";
import { v } from "../../styles/variables";
import { useState } from "react";
import ModalOverlay from "../moleculas/ModalOverlay";

export default function EntradaBebidas() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
    };

    // Datos de ejemplo para los productos
    const productos = [
        {
            id: 1,
            nombre: "Estrombolis",
            descripcion: "Masa de pan con azucar glass",
            imagen: v.home
        },
        {
            id: 2,
            nombre: "Estrombolis",
            descripcion: "Masa de pan con azucar glass",
            imagen: v.home
        },
        {
            id: 3,
            nombre: "Estrombolis",
            descripcion: "Masa de pan con azucar glass",
            imagen: v.home
        },
        {
            id: 4,
            nombre: "Estrombolis",
            descripcion: "Masa de pan con azucar glass",
            imagen: v.home
        },
        {
            id: 5,
            nombre: "Estrombolis",
            descripcion: "Masa de pan con azucar glass",
            imagen: v.home
        },
        {
            id: 6,
            nombre: "Estrombolis",
            descripcion: "Masa de pan con azucar glass",
            imagen: v.home
        },
    ];

  return (
    <Container>
      {/* Modal utilizando la molécula ModalOverlay */}
      <ModalOverlay isOpen={openModal} onClose={handleCloseModal}>
        {selectedItem && (
          <ModalDetails>
          </ModalDetails>
        )}
      </ModalOverlay>

      <div className="FooterPedido">
        <div className="left">
          <Icono>🛒</Icono>
          <p>
            Total: <span>$124000</span>
          </p>
        </div>
        <button className="confirmar">Confirmar</button>
      </div>
      
      <ImgContainer>
        <img src={v.home} />
      </ImgContainer>
      <div className="pedidos">
        <div className="header-pedidos">
          <h2>Entrada</h2>
          <span></span>
        </div>
        <div className="cardpedidos">
          {productos.map((producto) => (
            <div 
              key={producto.id} 
              className="cadDetails" 
              onClick={() => handleOpenModal(producto)}
            >
              <img src={producto.imagen} alt={producto.nombre} />
              <h2>{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  overflow-y: auto;
  background-color: #ffffff;
  height: 100vh;
  width: 100%;
  margin-bottom: 100px;

  &::-webkit-scrollbar {
    width: 0px;
  }
  .FooterPedido {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;               /* ocupa todo el ancho */
  height: 80px;
  padding: 15px 25px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
  z-index: 9999;     
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.496),
  0 0 15px rgba(255, 255, 255, 0.1);          /* siempre arriba */
}

/* estéticos */
.FooterPedido .left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.FooterPedido p {
  font-size: 20px;
  font-weight: 700;
}

.FooterPedido span {
  font-size: 22px;
  font-weight: 300;
}

.FooterPedido .confirmar {
  background: #000;
  color: #fff;
  padding: 12px 28px;
  font-size: 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.cardpedidos {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    justify-content: space-between;
  }

  .cardpedidos .cadDetails {
    flex: 1 1 calc(20% - 10px);
    max-width: calc(20% - 10px);
    background-color: #ffffff;
    height: 350px;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

  .cardpedidos .cadDetails:hover {
    transform: translateY(-5px);
  }

  /* No usar width fijo aquí porque rompe el layout */

  .cadDetails {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;              /* margen interno */
  display: flex;
  flex-direction: column;  gap: 10px;  
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.219),
  0 0 15px rgba(255, 255, 255, 0.1);     
               /* separación entre elementos */

}


/* ===== Imagen cortada y centrada ===== */
.cadDetails img {
  width: 100%;
  height: 220px;
  object-fit: cover;          /* Corta la imagen */
  border-radius: 12px;
  margin-bottom: 10px;
}

/* ===== Título debajo de la imagen ===== */
.cadDetails h2 {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}
.cadDetails p {
    color: gray;
}

.header-pedidos {
  display: flex;
  flex-direction: column;
  padding-top: 75px;
  margin-bottom: 15px;
  padding-bottom: 10px;
}

.header-pedidos h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.header-pedidos span {
  width: 100%;
  height: 2px;
  background-color: #c9c9c9;   /* gris */
  margin-top: 8px;
  border-radius: 2px;}
`;

const ImgContainer = styled.div`
  img {
    width: 1350px;
    padding: 0;
    height: 200px;
    border-radius: 12px;
    object-fit: cover;
  }
`;

const Icono = styled.div`
  font-size: 26px;
`;

// Estilos para los detalles del modal
const ModalDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 12px;
  }

  h2 {
    font-size: 28px;
    margin: 10px 0;
  }

  p {
    font-size: 18px;
    color: #666;
    text-align: center;
  }
`;
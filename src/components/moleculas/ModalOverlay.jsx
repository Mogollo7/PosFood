import React from "react";
import styled from "styled-components";
import { v } from "../../styles/variables";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";


const ModalOverlay = ({ isOpen, onClose, selectedItem }) => {
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);
  const [notas, setNotas] = useState("");

  // Actualizar precio cuando cambie el item seleccionado
  useEffect(() => {
    if (selectedItem) {
      setPrecio(selectedItem.precio || 0);
      setCantidad(1);
      setNotas("");
    }
  }, [selectedItem]);

  const handleMinus = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const handlePlus = () => {
    setCantidad(cantidad + 1);
  };

  const handlePrecioChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPrecio(value);
  };

  const handleSubmit = () => {
    if (selectedItem && cantidad > 0 && precio > 0) {
      const productoCarrito = {
        ...selectedItem,
        cantidad: cantidad,
        precio: precio,
        notas: notas,
        subtotal: cantidad * precio,
        idUnico: `${selectedItem.id}-${Date.now()}-${Math.random()}`, // ID único para cada item del carrito
      };
      addToCart(productoCarrito);
      // Resetear el formulario
      setCantidad(1);
      setPrecio(selectedItem?.precio || 0);
      setNotas("");
      // Cerrar el modal
      onClose();
    } else {
      alert("Por favor ingresa una cantidad y precio válidos");
    }
  };

  const handleClose = () => {
    // Resetear el formulario al cerrar
    setCantidad(1);
    setPrecio(selectedItem?.precio || 0);
    setNotas("");
    onClose();
  };

  if (!isOpen || !selectedItem) return null;

  return (
    <StyledModalOverlay>
      <ModalContent>
        <CloseButton onClick={handleClose}>
          <span>X</span>
        </CloseButton>
        <div className="content">
          <div className="card1">
            <div className="imgCard">
              <img src={selectedItem.imagen} alt={selectedItem.nombre} />
            </div>
            <div className="content-buttons">
              <div className="contentplusminus">
                <button className="minus" onClick={handleMinus}>−</button>
                <div className="number">{cantidad}</div>
                <button className="plus" onClick={handlePlus}>+</button>
              </div>
              <div className="buttom-submit" onClick={handleSubmit}>Enviar</div>
            </div>
          </div>
          <div className="card2">
            <div className="text">{selectedItem.nombre}</div>
            <div className="descripcion-producto">
              <p>{selectedItem.descripcion}</p>
            </div>
            <div className="costo">
              <div className="namecosto">Costo: </div>
              <input
                type="number"
                className="valor-input"
                value={precio}
                onChange={handlePrecioChange}
                min="0"
                step="100"
              />
            </div>
            <div className="subtotal">
              <div className="namecosto">Subtotal: </div>
              <div className="valor">${(cantidad * precio).toLocaleString()}</div>
            </div>
            <div className="descripcion">
              <textarea
                placeholder="Escribe notas adicionales aquí..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </ModalContent>
    </StyledModalOverlay>
  );
};

// Estilos para el modal
const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  ::-webkit-scrollbar {
  width: 0px;        
}

`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  width: 1200px;
  height: 600px;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  .text {
    font-size: 3.5rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing:0 ;
  }.costo {
  display: flex;            /* ← necesario */
  flex-direction: row;
  align-items: center;
  gap: 10px;                /* separación entre “Costo” y el valor */
  margin-top: 50px;
  padding: 10px;
  border-radius: 8px;
}

.namecosto {
  font-size: 2.375rem;
  font-weight: 500;
}

.valor {
  font-size: 2.375rem;
  font-weight: 500;
}

.valor-input {
  font-size: 2.375rem;
  font-weight: 500;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 5px 10px;
  width: 200px;
  text-align: center;
}

.valor-input:focus {
  outline: none;
  border-color: #000;
}

.subtotal {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.descripcion-producto {
  margin-top: 15px;
  font-size: 1.2rem;
  color: #666;
}
.descripcion textarea {   
  width: 700px;
  height: 240px;
  padding: 12px;              /* espacio interno */
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;               /* evita que el usuario cambie el tamaño */
  text-align: left; 
  margin-top: 50px;          /* asegura alineación izquierda */
}


  .content-buttons {
  display: flex;
  flex-direction: column;  /* o column si los quieres uno debajo del otro */
  gap: 30px;            /* ← separación entre los dos elementos */
}
  .content img {
    width: 300px;
  height: 300px;
  object-fit: cover;          /* Corta la imagen */
  border-radius: 12px;
  margin-bottom: 10px;
  }
  .content {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 20px;
}

.card1 {
  height: 500px;
  width: 300px;

}

.card2 {
  padding-left: 30px;
  height: 500px;
  width: 70%;
}

.contentplusminus {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 60px;
  padding: 10px;
  border-radius: 12px;
  justify-content: space-between;
  margin-top: 15px;
}
.buttom-submit {  
  background-color: black;
  height: 75px;
  border-radius: 15px;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

}

.minus, .plus {
  width: 70px;
  height: 70px;
  border-radius: 50px;
  border: 3px solid #9a9a9a;  
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.number {
  font-size: 24px;
  font-weight: bold;
  width: 50px;
  text-align: center;
}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  padding-bottom: 20px;
  border-radius: 50%;
  transition: background-color 0.3s;
  



  span {
    font-size: 26px;
  }
`;

export default ModalOverlay;
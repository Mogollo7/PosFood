import { useState, useEffect } from "react";
import { v } from "../../styles/variables";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useOrders } from "../../context/OrdersContext";

const Icono = styled.div`
  font-size: 1.6rem;
`;

export function PerfilForm() {
  // Usar el contexto de pedidos en lugar de estado local
  const { orders, deleteOrder } = useOrders();
  const [pedidos, setPedidos] = useState([]);

  // Estado para controlar el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);

  // Actualizar pedidos cuando cambie el contexto
  useEffect(() => {
    setPedidos(orders);
  }, [orders]);

  // Función para abrir el modal de edición
  const handleEdit = (pedido) => {
    setPedidoEditando(pedido);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setPedidoEditando(null);
  };

  // Función para eliminar un pedido
  const handleDelete = (id) => {
    deleteOrder(id);
  };

  const items = [
    { title: "Producto", img: "https://via.placeholder.com/120" },
    { title: "Bebida", img: "https://via.placeholder.com/120" },
    { title: "Entrada", img: "https://via.placeholder.com/120" },
  ];

  return (
    <Container>
      {/* Modal de edición */}
      {modalVisible && (
        <Modal>
          <div className="modal-content">
            <div className="modal-header">
              <button className="close-btn" onClick={handleCloseModal}>X</button>
              <h2>Editar Pedido #{pedidoEditando?.numero}</h2>
            </div>
            <div className="modal-body">
              {pedidoEditando && (
                <>
                  <div className="card2">
                    <div className="textcard">Pedido #{pedidoEditando.numero}</div>
                    <div className="costo">
                      <div className="namecosto">Total: </div>
                      <div className="valor">${pedidoEditando.total.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="lista-productos-modal">
                    <h4>Productos:</h4>
                    {pedidoEditando.items?.map((item, index) => (
                      <div key={index} className="item-modal">
                        <span className="item-modal-nombre">{item.nombre}</span>
                        <span className="item-modal-details">
                          {item.cantidad}x ${item.precio.toLocaleString()} = ${(item.cantidad * item.precio).toLocaleString()}
                        </span>
                        {item.notas && (
                          <span className="item-modal-notas">Notas: {item.notas}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="descripcion">
                    <textarea 
                      defaultValue={`Fecha: ${new Date(pedidoEditando.date).toLocaleString()}\nEstado: ${pedidoEditando.estado || 'Pendiente'}`}
                      readOnly
                    ></textarea>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      <div className="FooterPedido">
        <div className="left">
          <Icono>🛒</Icono>
          <p>
            Total: <span>$0</span>
          </p>
        </div>

        <button className="confirmar">Confirmar</button>
      </div>
      
      <ImgContainer>
        <img src={v.home} />
      </ImgContainer>
      <div className="cardP">
        <Link to="/entrada" className="card">
          <div className="text"><h2>Entrada</h2></div>
          <div className="imgCard"><img src="https://sgyzflydqslwjersmisz.supabase.co/storage/v1/object/public/productos/ImgLarge/Entrada.webp" /></div>
        </Link>

        <Link to="/bebida" className="card">
          <div className="text"><h2>Bebida</h2></div>
          <div className="imgCard"><img src="https://sgyzflydqslwjersmisz.supabase.co/storage/v1/object/public/productos/ImgLarge/Bebidas.webp" /></div>
        </Link>

        <Link to="/pizza" className="card">
          <div className="text"><h2>Pizzas</h2></div>
          <div className="imgCard"><img src="https://sgyzflydqslwjersmisz.supabase.co/storage/v1/object/public/productos/ImgLarge/pizza.jpg" /></div>
        </Link>

        <Link to="/postre" className="card">
          <div className="text"><h2>Postres</h2></div>
          <div className="imgCard"><img src="https://sgyzflydqslwjersmisz.supabase.co/storage/v1/object/public/productos/ImgLarge/postresverano.jpg" /></div>
        </Link>
      </div>
      <div className="pedidos">
        <div className="header-pedidos">
          <h2>Pedidos</h2>
          <span></span>
        </div>
        <div className="cardpedidos">
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <div className="cadDetails" key={pedido.id}>
                <img src={pedido.imagen || v.home} alt={`Pedido #${pedido.numero}`} />
                <h2># {pedido.numero}</h2>
                <div className="pedido-info">
                  <p className="pedido-total">Total: ${pedido.total.toLocaleString()}</p>
                  <p className="pedido-items">{pedido.items?.length || 0} productos</p>
                  <p className="pedido-estado">Estado: {pedido.estado || 'Pendiente'}</p>
                </div>
                <div className="butons">
                  <div className="edit" onClick={() => handleEdit(pedido)}>
                    {<v.edit />}
                  </div>
                  <div className="delete" onClick={() => handleDelete(pedido.id)}>
                    {<v.delete />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-pedidos">
              <p>No hay pedidos aún</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

// ==== Styled Components ====
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

  /* ==== Cards principales (4 por fila) ==== */
  .cardP {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 20px;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .cardP .card {
    flex: 1 1 calc(25% - 10px);
    max-width: calc(25% - 10px);
    min-width: 200px;
  }

  /* ==== CARD principal corregida ==== */
  .card {
    text-decoration: none;
    color: inherit;
    background-color: #ffffff;
    height: 250px;
    border-radius: 12px;
    display: flex;             /* H2 izquierda - img derecha */
    flex-direction: row;
    overflow: hidden;     
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.219),
  0 0 15px rgba(255, 255, 255, 0.1);       /* Para cortar la imagen */
  }

  .text {
    flex: 1;                   /* Mitad izquierda */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .imgCard {
    flex: 1;                   /* Mitad derecha */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;          /* Evita que la imagen se desborde */
  }

  .imgCard img {
    width: 100%;
    height: 100%;
    object-fit: cover;         /* Imagen cortada perfecta */
    border-radius: 0 12px 12px 0;
  }

  /* ==== Cards de Pedidos (3 por fila) ==== */
  .cardpedidos {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }

  .cardpedidos .cadDetails {
    flex: 1 1 calc(20% - 10px);
    max-width: calc(20% - 10px);
    background-color: #ffffff;
    height: 400px;
    border-radius: 12px;
  }

  /* No usar width fijo aquí porque rompe el layout */

  .cadDetails {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 20px;              /* margen interno */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;  
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.219),
    0 0 15px rgba(255, 255, 255, 0.1);     
                /* separación entre elementos */
  }


  /* ===== Imagen cortada y centrada ===== */


  /* ===== Imagen de pedido con dimensión fija ===== */
  .cadDetails img[alt*="Pedido"] {
    width: 100%;
    height:150px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 10px;
  }

  /* ===== Título debajo de la imagen ===== */
  .cadDetails h2 {
    margin: 0;
    padding-bottom: 10px;
    font-size: 22px;
    font-weight: bold;
  }

  .pedido-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
    font-size: 14px;
    width: 100%;
  }

  .pedido-total {
    font-weight: 600;
    color: #333;
  }

  .pedido-items {
    color: #666;
  }

  .pedido-estado {
    color: #007bff;
    font-weight: 500;
  }

  .no-pedidos {
    width: 100%;
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 18px;
  }

  .lista-productos-modal {
    margin-top: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .lista-productos-modal h4 {
    margin: 0 0 15px 0;
    font-size: 18px;
  }

  .item-modal {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
    margin-bottom: 10px;
    background: white;
    border-radius: 6px;
    border-left: 3px solid #007bff;
  }

  .item-modal-nombre {
    font-weight: 600;
    color: #333;
  }

  .item-modal-details {
    font-size: 14px;
    color: #666;
  }

  .item-modal-notas {
    font-size: 12px;
    color: #999;
    font-style: italic;
  }

  /* ===== Botones en fila ===== */
  .cadDetails .butons {
    display: flex;
    flex-direction: row;
    gap: 15px;                  /* separación entre botones */
    margin-top: 10px;
  }

  /* ===== Estilo base para los botones ===== */
  .cadDetails .butons div {
    width: 45px;
    height: 45px;
    border-radius: 50%;         /* redondo */
    display: flex;
    align-items: center;
    justify-content: center;    /* Icono centrado */
    cursor: pointer;
  }

  /* Edit = azul */
  .cadDetails .edit {
    background-color: #007bff;
  }

  /* Delete = rojo */
  .cadDetails .delete {
    background-color: #e63946;
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
    border-radius: 2px;
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
`;

// Componente Modal para la ventana flotante
const Modal = styled.div`
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

  .modal-content {
    background-color: white;
    border-radius: 12px;
    width: 80%;
    max-width: 600px;
    padding: 25px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
  }

  .close-btn {
    position: absolute;
    left: 0;
    top: 0;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
  }

  .modal-header h2 {
    width: 100%;
    text-align: center;
  }

  .modal-body {
    padding: 10px 0;
  }
  
.card2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;   /* ← izquierda / derecha */
  height: 50px;
  width: 100%;
}
.card2 .textcard {
    font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
}


.costo {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.namecosto,
.valor {
  font-size: 1.375rem;
  font-weight: 500;
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
.descripcion textarea {   
  
  width: 100%;
  padding: 12px;             
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;              
  text-align: left; 
  margin-top: 50px;   
  margin-bottom: 20px;       
}
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
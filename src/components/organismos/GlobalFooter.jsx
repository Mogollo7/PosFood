import styled from "styled-components";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function GlobalFooter() {
    const navigate = useNavigate();
    const [mostrarListaPedido, setMostrarListaPedido] = useState(false);
    const { calculateTotal, confirmOrder, cartItems, removeFromCart } = useCart();
    const total = calculateTotal();

    const handleConfirmOrder = () => {
        const orderData = confirmOrder();
        if (orderData) {
            navigate("/");
        }
    };

    return (
        <Container>
            <div className="footer-row">
                <div className="left">
                    <Icono onClick={() => setMostrarListaPedido(!mostrarListaPedido)} style={{ cursor: 'pointer' }}>
                        🛒 {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
                    </Icono>
                    <p>
                        Total: <span>${total.toLocaleString()}</span>
                    </p>
                </div>
                <button className="confirmar" onClick={handleConfirmOrder}>Confirmar</button>
            </div>
            {mostrarListaPedido && cartItems.length > 0 && (
                <div className="lista-pedido">
                    <div className="lista-header">
                        <h3>Productos en el pedido</h3>
                        <button className="cerrar-lista" onClick={() => setMostrarListaPedido(false)}>×</button>
                    </div>
                    <div className="lista-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="item-pedido">
                                <div className="item-info">
                                    <span className="item-nombre">{item.nombre}</span>
                                    <span className="item-details">
                                        {item.cantidad}x ${item.precio.toLocaleString()} = ${(item.cantidad * item.precio).toLocaleString()}
                                    </span>
                                    {item.notas && (
                                        <span className="item-notas">Notas: {item.notas}</span>
                                    )}
                                </div>
                                <button className="eliminar-item" onClick={() => removeFromCart(index)}>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Container>
    );
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 80px;
  padding: 15px 25px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid #ddd;
  z-index: 9999;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.496),
    0 0 15px rgba(255, 255, 255, 0.1);

  .footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  .cart-count {
    background-color: #ff4444;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    top: -5px;
    right: -5px;
  }

  p {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }

  span {
    font-size: 22px;
    font-weight: 300;
  }

  .confirmar {
    background: #000;
    color: #fff;
    padding: 12px 28px;
    font-size: 18px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s;
  }

  .confirmar:hover {
    background: #333;
  }

  .lista-pedido {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    background: #fff;
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2);
    margin-bottom: 15px;
  }

  .lista-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    background: #f5f5f5;
  }

  .lista-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .cerrar-lista {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s;
  }

  .cerrar-lista:hover {
    background: #ddd;
  }

  .lista-items {
    max-height: 300px;
    overflow-y: auto;
  }

  .item-pedido {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    transition: background 0.2s;
  }

  .item-pedido:hover {
    background: #f9f9f9;
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .item-nombre {
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }

  .item-details {
    font-size: 14px;
    color: #666;
  }

  .item-notas {
    font-size: 12px;
    color: #999;
    font-style: italic;
    margin-top: 5px;
  }

  .eliminar-item {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
    flex-shrink: 0;
  }

  .eliminar-item:hover {
    background: #cc0000;
  }
`;

const Icono = styled.div`
  font-size: 26px;
`;

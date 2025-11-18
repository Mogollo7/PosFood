import styled from "styled-components";
import { v } from "../../styles/variables";
import { useOrders } from "../../context/OrdersContext";
import { useState, useEffect } from "react";
import { PedidoDetail } from "./PedidoDetail";

export function Movimiento() {
  const { orders, deleteOrder } = useOrders();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Actualizar pedidos cuando cambie el contexto
  useEffect(() => {
    setPedidos(orders);
  }, [orders]);

  const handleSelectPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
  };

  const handleBack = () => {
    setPedidoSeleccionado(null);
  };

  const handleSavePedido = (datos) => {
    // Aquí puedes actualizar el pedido con los nuevos datos
    console.log("Pedido actualizado:", datos);
    handleBack();
  };
const getStatusTextColor = (estado) => {
  switch (estado) {
    case "pendiente":
      return "#c00404";     // verde oscuro
    case "en_preparacion":
      return "#0061c9";     // amarillo oscuro
    case "listo":
      return "#00a927";     // rojo oscuro
    default:
      return "white";
  }
}
  // Función para obtener el color según el estado
  const getStatusColor = (estado) => {
    switch(estado) {
      case 'pendiente':
        return '#fc8383'; // rojo
      case 'en_preparacion':
        return '#85bffd'; // azul
      case 'listo':
        return '#8cffa7'; // verde
      default:
        return '#777'; // gris por defecto
    }
  };
  
  // Función para formatear el texto del estado
  const formatEstado = (estado) => {
    if (!estado) return 'Pendiente';
    return estado.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Si hay un pedido seleccionado, mostrar el detalle
  if (pedidoSeleccionado) {
    return <PedidoDetail pedido={pedidoSeleccionado} onBack={handleBack} onSave={handleSavePedido} />;
  }

  return (
    <MovimientoContainer>
      <div className="header-movimientos">
        <h2>Movimientos</h2>
        <span></span>
      </div>

      <div className="card-container">
        <div className="card1">
          <h3>Pedidos Recientes</h3>
          
          {/* Cabecera de tabla */}
          <div className="tabla-header">
            <div className="header-cell">ID Pedido</div>
            <div className="header-cell">Fecha</div>
            <div className="header-cell"># Productos</div>
            <div className="header-cell">Total</div>
            <div className="header-cell estado">Estado</div>
          </div>
          
          <div className="pedidos-list">
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <div className="pedido-item" key={pedido.id} onClick={() => handleSelectPedido(pedido)}>
                  <div className="pedido-cell">#{pedido.numero}</div>
                  <div className="pedido-cell">{new Date(pedido.date).toLocaleDateString()}</div>
                  <div className="pedido-cell">{pedido.items?.length || 0}</div>
                  <div className="pedido-cell">${pedido.total.toLocaleString()}</div>
<div className="pedido-cell estado">
  <span
    className="estado-badge"
    style={{ backgroundColor: getStatusColor(pedido.estado || 'pendiente'), color: getStatusTextColor(pedido.estado || "pendiente"), }}
  >
    {formatEstado(pedido.estado)}
  </span>
</div>

                </div>
              ))
            ) : (
              <div className="no-pedidos">No hay pedidos disponibles</div>
            )}
          </div>
        </div>
      </div>
    </MovimientoContainer>
  );
}

const MovimientoContainer = styled.div`
  padding: 20px;
  overflow-y: auto;
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  margin-bottom: 100px;

  &::-webkit-scrollbar {
    width: 0px;
  }

  .header-movimientos {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    margin-bottom: 25px;
    padding-bottom: 10px;
  }

  .header-movimientos h2 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }

  .header-movimientos span {
    width: 100%;
    height: 2px;
    background-color: #c9c9c9;
    margin-top: 8px;
    border-radius: 2px;
  }

  .card-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 100%;
    height: 100%; /* Altura fija para ambas tarjetas */
  }

  .card1, .card2 {
    flex: 1;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.219),
    0 0 15px rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card1 h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  /* Estilo para la cabecera de la tabla */
  .tabla-header {
    display: flex;
    flex-direction: row;
    background-color: #ffffff;
    border-radius: 8px 8px 0 0;
    padding: 12px;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid #ddd;
    margin-bottom: 5px;
  }

  .header-cell {
    flex: 1;
    text-align: left;
    font-size: 14px;
  }

  .header-cell:last-child {
    text-align: center;
  }

  /* Estilos para la tarjeta de pedidos */
  .pedidos-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    flex: 1;
  }

  .pedido-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pedido-item:hover {
    background-color: #e9e9e9;
    transform: translateY(-2px);
  }

  .pedido-cell {
    flex: 1;
    padding: 0 5px;
    font-size: 14px;
  }

  .pedido-cell.precio {
    font-weight: 700;
  }

.pedido-cell.estado {
  text-align: center;
  padding: 5px 10px;
}

.estado-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 70px; /* ← cambia el tamaño de la pastilla */
  text-align: center;
}

  .no-pedidos {
    text-align: center;
    padding: 20px;
    color: #999;
    font-style: italic;
  }

  /* Estilos para la factura */
  .card2 {
    background-color: #fff;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .factura-header {
    border-bottom: 2px dashed #ccc;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }

  .factura-header h3 {
    margin-top: 0;
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }

  .factura-fecha {
    text-align: right;
    font-size: 14px;
    color: #666;
  }

  .resumen-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex: 1;
  }

  .resumen-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .resumen-label {
    font-weight: 500;
    color: #555;
  }

  .resumen-value {
    font-weight: 700;
    font-size: 18px;
    color: #333;
  }

  .factura-total {
    margin-top: auto;
    border-top: 2px dashed #ccc;
    padding-top: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }

  .total-label {
    font-weight: bold;
    font-size: 20px;
  }

  .total-value {
    font-weight: bold;
    font-size: 22px;
    color: #007bff;
  }

  .factura-footer {
    position: relative;
    margin-top: auto;
  }

  .zigzag-border {
    height: 16px;
    background: linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%),
                linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%);
    background-size: 16px 32px;
    background-position: 0 -16px;
    background-color: #f5f5f5;
  }

  .factura-gracias {
    text-align: center;
    padding: 10px 0;
    font-style: italic;
    color: #666;
    background-color: #f5f5f5;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;
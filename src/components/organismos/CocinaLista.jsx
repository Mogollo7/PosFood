import styled from "styled-components";
import { v } from "../../styles/variables";
import { useState, useEffect } from "react";
import { useOrders } from "../../context/OrdersContext";

export default function CocinaLista() {
  const { orders, updateOrderStatus } = useOrders();
  const [ordenesCocina, setOrdenesCocina] = useState([]);

  // Filtrar órdenes pendientes y en preparación
  useEffect(() => {
    const ordenesFiltradas = orders.filter(
      (order) => order.estado === "pendiente" || order.estado === "en_preparacion"
    );
    // Ordenar por fecha (más recientes primero)
    ordenesFiltradas.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrdenesCocina(ordenesFiltradas);
  }, [orders]);

  // Cambiar estado de la orden
  const handleCambiarEstado = (id, nuevoEstado) => {
    updateOrderStatus(id, nuevoEstado);
  };

  // Formatear fecha
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtener color según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "#ff6b6b";
      case "en_preparacion":
        return "#4ecdc4";
      case "listo":
        return "#95e1d3";
      default:
        return "#95a5a6";
    }
  };

  return (
    <Container>
      <div className="pedidos">
        <div className="header-pedidos">
          <h2>Órdenes de Cocina</h2>
          <span></span>
        </div>
        <div className="cardpedidos">
          {ordenesCocina.length > 0 ? (
            ordenesCocina.map((orden) => (
              <div className="cadDetails" key={orden.id}>
                <div className="orden-header">
                  <div className="orden-numero">
                    <h2>Pedido #{orden.numero}</h2>
                    <span
                      className="estado-badge"
                      style={{ backgroundColor: getEstadoColor(orden.estado) }}
                      title={orden.estado.toUpperCase()}
                    >
                    </span>
                  </div>
                  <p className="orden-fecha">{formatearFecha(orden.date)}</p>
                </div>

                <div className="items-container">
                  <h3 className="items-titulo">Items a preparar:</h3>
                  {orden.items && orden.items.length > 0 ? (
                    orden.items.map((item, index) => (
                      <div key={index} className="item-cocina">
                        <div className="item-header">
                          <span className="item-cantidad">{item.cantidad}x</span>
                          <span className="item-nombre">{item.nombre}</span>
                        </div>
                        {item.descripcion && (
                          <p className="item-descripcion">{item.descripcion}</p>
                        )}
                        {item.notas && (
                          <div className="item-notas">
                            <strong>Notas especiales:</strong> {item.notas}
                          </div>
                        )}
                        {item.categoria && (
                          <span className="item-categoria">
                            Tipo: {item.categoria === "normales" ? "Pizza Normal" : item.categoria === "quesudas" ? "Pizza Quesuda" : item.categoria}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="sin-items">No hay items en esta orden</p>
                  )}
                </div>

                <div className="orden-footer">
                  <div className="orden-total">
                    <strong>Total: ${orden.total.toLocaleString()}</strong>
                  </div>
                  <div className="botones-estado">
                    {orden.estado === "pendiente" && (
                      <button
                        className="btn-preparar"
                        onClick={() => handleCambiarEstado(orden.id, "en_preparacion")}
                      >
                        Iniciar Preparación
                      </button>
                    )}
                    {orden.estado === "en_preparacion" && (
                      <button
                        className="btn-listo"
                        onClick={() => handleCambiarEstado(orden.id, "listo")}
                      >
                        Marcar como Listo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-pedidos">
              <p>No hay órdenes pendientes en cocina</p>
            </div>
          )}
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
    background-color: #c9c9c9;
    margin-top: 8px;
    border-radius: 2px;
  }

  .cardpedidos {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
  }

  .cardpedidos .cadDetails {
    flex: 1 1 calc(33.333% - 20px);
    min-width: 300px;
    max-width: calc(33.333% - 20px);
    background-color: #ffffff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.219),
      0 0 15px rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .cardpedidos .cadDetails:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  }

  .orden-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e0e0e0;
  }

  .orden-numero {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .orden-numero h2 {
    margin: 0;
    font-size: 22px;
    font-weight: bold;
    color: #333;
  }

  .estado-badge {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .estado-badge:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  }

  .orden-fecha {
    margin: 0;
    font-size: 12px;
    color: #666;
  }

  .items-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .items-titulo {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }

  .item-cocina {
    background-color: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #007bff;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .item-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .item-cantidad {
    background-color: #007bff;
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    min-width: 35px;
    text-align: center;
  }

  .item-nombre {
    font-weight: 600;
    font-size: 16px;
    color: #333;
    flex: 1;
  }

  .item-descripcion {
    margin: 0;
    font-size: 13px;
    color: #666;
    font-style: italic;
  }

  .item-notas {
    margin-top: 5px;
    padding: 8px;
    background-color: #fff3cd;
    border-left: 3px solid #ffc107;
    border-radius: 4px;
    font-size: 12px;
    color: #856404;
  }

  .item-notas strong {
    display: block;
    margin-bottom: 4px;
  }

  .item-categoria {
    font-size: 11px;
    color: #999;
    text-transform: capitalize;
    margin-top: 4px;
  }

  .sin-items {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 20px;
  }

  .orden-footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 15px;
    border-top: 2px solid #e0e0e0;
  }

  .orden-total {
    text-align: right;
    font-size: 18px;
    color: #333;
  }

  .botones-estado {
    display: flex;
    gap: 10px;
  }

  .btn-preparar,
  .btn-listo {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-preparar {
    background-color: #4ecdc4;
    color: white;
  }

  .btn-preparar:hover {
    background-color: #45b8b0;
    transform: translateY(-2px);
  }

  .btn-listo {
    background-color: #95e1d3;
    color: #333;
  }

  .btn-listo:hover {
    background-color: #7dd3c1;
    transform: translateY(-2px);
  }

  .no-pedidos {
    width: 100%;
    text-align: center;
    padding: 60px 20px;
    color: #999;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    .cardpedidos .cadDetails {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
`;


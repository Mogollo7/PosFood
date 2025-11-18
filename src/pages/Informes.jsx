import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabase/supabase.config";
import { FaCheck } from "react-icons/fa";

export default function Informes() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const { data, error: pedidosError } = await supabase
          .from("pedidos")
          .select("id, numero, total, estado, fecha, tipo_pago, metodo_pago_id, pago(id, estado, fecha)")
          .order("fecha", { ascending: false });

        if (pedidosError) throw pedidosError;

        const pedidosRaw = data || [];
        const normalized = pedidosRaw.map((pd) => ({
          id: pd.id,
          numero: pd.numero,
          total: pd.total,
          estado: pd.estado,
          fecha: pd.fecha,
          tipo_pago: pd.tipo_pago,
          metodo_pago_id: pd.metodo_pago_id,
          pago: pd.pago && pd.pago.length > 0 ? pd.pago[0] : null,
        }));

        if (mounted) {
          setPedidos(normalized);
          setError(null);
        }
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPedidos();
    return () => {
      mounted = false;
    };
  }, []);

  const marcarPago = async (pedido) => {
    try {
      if (pedido.pago) {
        // Actualizar estado a "pago"
        const { error } = await supabase
          .from("pago")
          .update({ estado: "pago" })
          .eq("id", pedido.pago.id);
        if (error) throw error;

        setPedidos((prev) =>
          prev.map((p) =>
            p.id === pedido.id ? { ...p, pago: { ...p.pago, estado: "pago" } } : p
          )
        );
      } else {
        // Crear pago con estado "pago"
        const { data: created, error: createError } = await supabase
          .from("pago")
          .insert([{ pedido_id: pedido.id, estado: "pago" }])
          .select()
          .single();

        if (createError) throw createError;

        setPedidos((prev) =>
          prev.map((p) => (p.id === pedido.id ? { ...p, pago: created } : p))
        );
      }
    } catch (err) {
      console.error("Error al marcar pago:", err);
      setError(err.message || String(err));
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "pago":
        return "#8cffa7";
      case "debe":
        return "#fc8383";
      default:
        return "#ddd";
    }
  };

  const getStatusTextColor = (estado) => {
    switch (estado) {
      case "debe":
        return "#c00404";
      case "pago":
        return "#00a927";
      default:
        return "white";
    }
  };

  return (
    <Container>
      <div className="header-movimientos">
        <h2>Informes — Pedidos y Pagos</h2>
        <span />
      </div>

      <div className="card-container">
        <div className="card1">
          <h3>Pedidos</h3>

          <div className="tabla-header">
            <div className="header-cell"># Pedido</div>
            <div className="header-cell">Fecha</div>
            <div className="header-cell">Total</div>
            <div className="header-cell">Método</div>
            <div className="header-cell estado">Estado pago</div>
            <div className="header-cell">Acción</div>
          </div>

          <div className="pedidos-list">
            {loading && <div className="no-pedidos">Cargando pedidos…</div>}
            {error && <div style={{ color: "#a00" }}>Error: {error}</div>}
            {!loading && !error && pedidos.length === 0 && (
              <div className="no-pedidos">No hay pedidos</div>
            )}

            {!loading &&
              !error &&
              pedidos.map((p) => (
                <div className="pedido-item" key={p.id}>
                  <div className="pedido-cell">#{p.numero}</div>
                  <div className="pedido-cell">
                    {p.fecha ? new Date(p.fecha).toLocaleString() : "-"}
                  </div>
                  <div className="pedido-cell">
                    ${p.total?.toLocaleString() ?? "-"}
                  </div>
                  <div className="pedido-cell">
                    {p.tipo_pago ?? (p.metodo_pago_id ? "-" : "No definido")}
                  </div>
                  <div className="pedido-cell estado">
                    <span
                      className="estado-badge"
                      style={{
                        backgroundColor: getStatusColor(p.pago?.estado ?? "debe"),
                        color: getStatusTextColor(p.pago?.estado ?? "debe"),
                      }}
                    >
                      {(p.pago?.estado ?? "SIN PAGO").toString().toUpperCase()}
                    </span>
                  </div>

                  <div className="pedido-cell">
                    {p.pago && p.pago.estado === "pago" ? (
                      <FaCheck style={{ color: "green", fontSize: "20px" }} />
                    ) : (
                      <button
                        className="btn-accion"
                        onClick={() => marcarPago(p)}
                      >
                        {p.pago ? "Pagar" : "Pagar"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Container>
  );}

const Container = styled.div`
  padding: 20px;
  overflow-y: auto;
  background-color: #ffffff;
  height: 100%;
  width: 100%;

  .header-movimientos {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    margin-bottom: 25px;
    padding-bottom: 10px;
  }

  .header-movimientos h2 { margin: 0; font-size: 24px; font-weight: bold; }
  .header-movimientos span { width: 100%; height: 2px; background-color: #c9c9c9; margin-top: 8px; border-radius: 2px; }

  .card-container { display: flex; gap: 20px; width: 100%; }
  .card1 { flex: 1; border-radius: 12px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.12); display:flex; flex-direction:column; }

  .card1 h3 { margin-top: 0; margin-bottom: 12px; font-size: 18px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 10px; }

  .tabla-header { display:flex; padding:12px; font-weight:600; color:#333; border-bottom:2px solid #ddd; }
  .header-cell { flex:1; font-size:14px; }
  .header-cell.estado { text-align:center; }

  .pedidos-list { display:flex; flex-direction:column; gap:8px; margin-top:10px; }

  .pedido-item { display:flex; align-items:center; background:#f9f9f9; border-radius:8px; padding:12px; }
  .pedido-cell { flex:1; padding:0 5px; font-size:14px; }
  .pedido-cell.estado { text-align:center; }

  .estado-badge { display:inline-block; padding:5px 12px; border-radius:8px; font-weight:600; font-size:12px; text-transform:uppercase; }

  .no-pedidos { text-align:center; padding:20px; color:#999; font-style:italic; }

  .btn-accion { background:#000000; color:white; padding:8px 12px; border-radius:6px; border:none; cursor:pointer; }
  .btn-accion:hover { opacity:0.9; }
`;

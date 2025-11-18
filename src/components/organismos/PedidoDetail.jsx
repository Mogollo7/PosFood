import styled from "styled-components";
import { useState } from "react";
import { v } from "../../styles/variables";
import { useOrders } from "../../context/OrdersContext"; // Importamos el contexto para acceder a las funciones de actualización
import { supabase } from "../../supabase/supabase.config";
import { generarFacturaPDF } from "../../util/generarFacturaPDF";

export function PedidoDetail({ pedido, onBack, onSave }) {
  const { deleteOrder, cargarPedidos } = useOrders(); // Obtenemos funciones para eliminar/recargar pedidos
  const [tipoPago, setTipoPago] = useState(pedido.tipoPago || "efectivo");
  const [tipoPedido, setTipoPedido] = useState(pedido.tipoPedido || "mesa");
  const [numeroMesa, setNumeroMesa] = useState(pedido.numeroMesa || "");
  const [direccionDomicilio, setDireccionDomicilio] = useState(pedido.direccionDomicilio || "");
  const [nombreRemitente, setNombreRemitente] = useState(pedido.nombreRemitente || "");
  const [telefonoRemitente, setTelefonoRemitente] = useState(pedido.telefonoRemitente || "");
  const [costoDomicilio, setCostoDomicilio] = useState(pedido.costoDomicilio || 0);
  const [notasExtra, setNotasExtra] = useState(pedido.notasExtra || "");
  const [items, setItems] = useState(pedido.items || []);
  const [pagoExpanded, setPagoExpanded] = useState(false);
  const [tipoPedidoExpanded, setTipoPedidoExpanded] = useState(false);
  const [domicilioExpanded, setDomicilioExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Estado para controlar el proceso de eliminación

  const handleRemoveItem = async (index) => {
    let itemToRemove = items[index];
    try {
      setIsDeleting(true); // Indicamos que estamos en proceso de eliminación

      // Confirmación al usuario
      const confirmar = confirm(`¿Eliminar "${itemToRemove?.nombre || 'este producto'}" del pedido? Esta acción es permanente.`);
      if (!confirmar) return setIsDeleting(false);

      // Si el item tiene id en la BD, eliminar del table pedido_items
      if (itemToRemove?.id) {
        console.log(`[DEBUG] Eliminando pedido_items.id = ${itemToRemove.id}`, itemToRemove);
        const { data, error } = await supabase.from("pedido_items").delete().eq("id", itemToRemove.id);
        console.log(`[DEBUG] Delete response:`, { data, error });
        if (error) {
          console.error("Error eliminando item en supabase:", error);
          alert("No se pudo eliminar el item: " + error.message);
          return;
        }
        console.log(`[DEBUG] Item eliminado exitosamente de pedido_items`);
      } else {
        console.warn(`[DEBUG] Item NO tiene id. Item:`, itemToRemove);
      }

      // Eliminamos localmente del estado
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);

      // Recalcular totales y actualizar pedido (si existe updateOrder en el contexto)
      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
      const newTotal = newSubtotal + (tipoPedido === "domicilio" ? costoDomicilio : 0);
      const updatedPedido = {
        ...pedido,
        items: updatedItems,
        total: newTotal,
        subtotal: newSubtotal,
      };

      // Si no quedan items, eliminar el pedido completo
      if (updatedItems.length === 0) {
        // Eliminar pedido (y cascada eliminará pedidos_domicilio/pedido_items si está configurado)
        const { error: delPedidoErr } = await supabase.from("pedidos").delete().eq("id", pedido.id);
        if (delPedidoErr) {
          console.error("Error eliminando pedido:", delPedidoErr);
          alert("No se pudo eliminar el pedido: " + delPedidoErr.message);
          // restaurar items
          setItems(pedido.items || []);
          return;
        }

        // Actualizar contexto local
        if (deleteOrder) {
          try {
            await deleteOrder(pedido.id);
          } catch (err) {
            console.warn("deleteOrder falló al actualizar el store local:", err);
            if (cargarPedidos) await cargarPedidos();
          }
        } else if (cargarPedidos) {
          await cargarPedidos();
        }

        alert("Pedido eliminado porque no quedan productos");
        onBack();
        return;
      }

      // Si aún quedan items, actualizar total en la tabla pedidos y refrescar store
      const { error: updTotErr } = await supabase.from("pedidos").update({ total: newTotal }).eq("id", pedido.id);
      if (updTotErr) {
        console.warn("No se pudo actualizar el total del pedido:", updTotErr);
      }

      if (cargarPedidos) {
        try {
          await cargarPedidos();
        } catch (err) {
          console.warn("cargarPedidos falló tras eliminar item:", err);
        }
      }

      console.log(`Producto "${itemToRemove?.nombre}" eliminado correctamente del pedido #${pedido.numero}`);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      // Si hay un error, restauramos el estado original
      setItems(pedido.items || []);
      alert("No se pudo eliminar el producto. Inténtalo de nuevo.");
    } finally {
      setIsDeleting(false); // Finalizamos el proceso de eliminación
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
  const total = subtotal + (tipoPedido === "domicilio" ? costoDomicilio : 0);

  const handleSave = async () => {
    try {
      // Resuelve metodo_pago_id por nombre (efectivo/transferencia)
      let metodoPagoId = null;
      const { data: mpData, error: mpError } = await supabase
        .from("metodos_pago")
        .select("id")
        .eq("nombre", tipoPago)
        .limit(1)
        .maybeSingle();

      if (mpError) throw mpError;
      if (mpData) metodoPagoId = mpData.id;

      // Resuelve tipo_pedido_id por nombre (mesa/domicilio)
      let tipoPedidoId = null;
      const { data: tpData, error: tpError } = await supabase
        .from("tipos_pedido")
        .select("id")
        .eq("nombre", tipoPedido)
        .limit(1)
        .maybeSingle();

      if (tpError) throw tpError;
      if (tpData) tipoPedidoId = tpData.id;

      // Actualiza solo campos necesarios en pedidos
      const updatePayload = {
        tipo_pago: tipoPago,
        tipo_pedido: tipoPedido,
        numero_mesa: tipoPedido === "mesa" ? (numeroMesa ? Number(numeroMesa) : null) : null,
        notas_extra: notasExtra || null,
        metodo_pago_id: metodoPagoId,
        tipo_pedido_id: tipoPedidoId,
        total: total,
      };

      const { error: updError } = await supabase.from("pedidos").update(updatePayload).eq("id", pedido.id);
      if (updError) throw updError;

      // Manejo de pedidos_domicilio
      if (tipoPedido === "domicilio") {
        // Verificar si existe
        const { data: domData, error: domErr } = await supabase
          .from("pedidos_domicilio")
          .select("id")
          .eq("pedido_id", pedido.id)
          .limit(1)
          .maybeSingle();

        if (domErr) throw domErr;

        if (domData) {
          // Update existente
          const { error: updDomErr } = await supabase
            .from("pedidos_domicilio")
            .update({
              direccion: direccionDomicilio,
              nombre_remitente: nombreRemitente,
              telefono_remitente: telefonoRemitente,
              costo_domicilio: costoDomicilio || 0,
            })
            .eq("pedido_id", pedido.id);
          if (updDomErr) throw updDomErr;
        } else {
          // Insertar nuevo
          const { error: insDomErr } = await supabase.from("pedidos_domicilio").insert([{
            pedido_id: pedido.id,
            direccion: direccionDomicilio,
            nombre_remitente: nombreRemitente,
            telefono_remitente: telefonoRemitente,
            costo_domicilio: costoDomicilio || 0,
          }]);
          if (insDomErr) throw insDomErr;
        }
      } else {
        // Si cambió a mesa y existe domicilio, eliminarlo
        const { data: existsDom, error: existsErr } = await supabase
          .from("pedidos_domicilio")
          .select("id")
          .eq("pedido_id", pedido.id)
          .limit(1)
          .maybeSingle();
        if (existsErr) throw existsErr;
        if (existsDom) {
          const { error: delDomErr } = await supabase.from("pedidos_domicilio").delete().eq("pedido_id", pedido.id);
          if (delDomErr) throw delDomErr;
        }
      }

      // Actualizar contexto/local
      const updatedPedido = {
        ...pedido,
        tipoPago,
        tipoPedido,
        numeroMesa,
        direccionDomicilio,
        nombreRemitente,
        telefonoRemitente,
        costoDomicilio,
        notasExtra,
        items,
        subtotal,
        total,
      };

      // Refrescar store global de pedidos
      if (cargarPedidos) {
        try {
          await cargarPedidos();
        } catch (err) {
          console.warn("cargarPedidos falló después de guardar en DB:", err);
        }
      }

      // Llamada al callback padre
      onSave && onSave(updatedPedido);
      
      // Generar y descargar PDF de la factura
      await generarFacturaPDF(updatedPedido, {
        tipoPago,
        tipoPedido,
        costoDomicilio,
        numeroMesa,
        direccionDomicilio,
        nombreRemitente,
      });

      alert("Pedido actualizado correctamente y PDF generado");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Error guardando cambios: " + (err.message || JSON.stringify(err)));
    }
  };

  return (
    <Container>
      <BackButton onClick={onBack}>← Volver</BackButton>
      
      <ContentWrapper>
        {/* COLUMNA IZQUIERDA - FORMULARIO */}
        <LeftColumn>
          <SectionTitle>Detalles del Pedido</SectionTitle>

          {/* Lista de Productos */}
          <ProductosSection>
            <h3>Productos</h3>
            <ProductList>
              {items.map((item, index) => (
                <ProductItem key={index}>
                  <ProductInfo>
                    <ProductName>{item.nombre}</ProductName>
                    <ProductDetails>
                      {item.cantidad}x ${item.precio.toLocaleString()} = ${(item.cantidad * item.precio).toLocaleString()}
                    </ProductDetails>
                    {item.notas && <ProductNotes>Notas: {item.notas}</ProductNotes>}
                  </ProductInfo>
                  <DeleteBtn 
                    onClick={() => handleRemoveItem(index)} 
                    disabled={isDeleting}
                  >
                    {isDeleting ? "..." : "✕"}
                  </DeleteBtn>
                </ProductItem>
              ))}
            </ProductList>
          </ProductosSection>

          {/* Acordeón Pago */}
          <Accordion>
            <AccordionHeaderWithArrow expanded={pagoExpanded} onClick={() => setPagoExpanded(!pagoExpanded)}>
              Método de Pago
            </AccordionHeaderWithArrow>
            {pagoExpanded && (
              <AccordionContent>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <input
                      type="radio"
                      name="pago"
                      value="efectivo"
                      checked={tipoPago === "efectivo"}
                      onChange={(e) => setTipoPago(e.target.value)}
                    />
                    Efectivo
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input
                      type="radio"
                      name="pago"
                      value="transferencia"
                      checked={tipoPago === "transferencia"}
                      onChange={(e) => setTipoPago(e.target.value)}
                    />
                    Transferencia
                  </CheckboxLabel>
                </CheckboxGroup>
              </AccordionContent>
            )}
          </Accordion>

          {/* Acordeón Tipo de Pedido */}
          <Accordion>
            <AccordionHeaderWithArrow expanded={tipoPedidoExpanded} onClick={() => setTipoPedidoExpanded(!tipoPedidoExpanded)}>
              Tipo de Pedido
            </AccordionHeaderWithArrow>
            {tipoPedidoExpanded && (
              <AccordionContent>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <input
                      type="radio"
                      name="tipoPedido"
                      value="mesa"
                      checked={tipoPedido === "mesa"}
                      onChange={(e) => setTipoPedido(e.target.value)}
                    />
                    Mesa
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input
                      type="radio"
                      name="tipoPedido"
                      value="domicilio"
                      checked={tipoPedido === "domicilio"}
                      onChange={(e) => setTipoPedido(e.target.value)}
                    />
                    Domicilio
                  </CheckboxLabel>
                </CheckboxGroup>

                {/* Subaccordión para Mesa */}
                {tipoPedido === "mesa" && (
                  <SubSection>
                    <label>Número de Mesa:</label>
                    <input
                      type="text"
                      value={numeroMesa}
                      onChange={(e) => setNumeroMesa(e.target.value)}
                      placeholder="Ej: 1, 2, 3..."
                    />
                  </SubSection>
                )}

                {/* Subaccordión para Domicilio */}
                {tipoPedido === "domicilio" && (
                  <SubSection>
                    <Accordion>
                      <AccordionHeaderWithArrow expanded={domicilioExpanded} onClick={() => setDomicilioExpanded(!domicilioExpanded)}>
                        Información de Domicilio
                      </AccordionHeaderWithArrow>
                      {domicilioExpanded && (
                        <AccordionContent>
                          <FormGroup>
                            <label>Dirección del Domicilio:</label>
                            <input
                              type="text"
                              value={direccionDomicilio}
                              onChange={(e) => setDireccionDomicilio(e.target.value)}
                              placeholder="Calle, número, apto..."
                            />
                          </FormGroup>
                          <FormGroup>
                            <label>Nombre del Remitente:</label>
                            <input
                              type="text"
                              value={nombreRemitente}
                              onChange={(e) => setNombreRemitente(e.target.value)}
                              placeholder="Nombre de quien recibe"
                            />
                          </FormGroup>
                          <FormGroup>
                            <label>Teléfono:</label>
                            <input
                              type="tel"
                              value={telefonoRemitente}
                              onChange={(e) => setTelefonoRemitente(e.target.value)}
                              placeholder="Teléfono de contacto"
                            />
                          </FormGroup>
                          <FormGroup>
                            <label>Costo del Domicilio:</label>
                            <input
                              type="number"
                              value={costoDomicilio}
                              onChange={(e) => setCostoDomicilio(Number(e.target.value))}
                              placeholder="0"
                            />
                          </FormGroup>
                        </AccordionContent>
                      )}
                    </Accordion>
                  </SubSection>
                )}
              </AccordionContent>
            )}
          </Accordion>

          {/* Notas Extra */}
          <NotasSection>
            <label>Notas Extra del Pedido:</label>
            <textarea
              value={notasExtra}
              onChange={(e) => setNotasExtra(e.target.value)}
              placeholder="Agregar notas especiales del pedido..."
              rows={4}
            />
          </NotasSection>

          <ButtonGroup>
            <SaveBtn onClick={handleSave}>
              Guardar Cambios
            </SaveBtn>
          </ButtonGroup>
        </LeftColumn>

        {/* COLUMNA DERECHA - PREVIEW */}
        <RightColumn>
          <PreviewCard>
            <FacturaHeader>
              <span>ID Pedido: #{pedido.numero}</span>
              <span>Método: {tipoPago === "efectivo" ? "Efectivo" : "Transferencia"}</span>
            </FacturaHeader>

            <ItemsPreview>
              {items.map((item, index) => (
                <PreviewItem key={index}>
                  <ItemQuantityName>
                    <span className="cantidad">{item.cantidad}</span>
                    <span className="nombre">{item.nombre}</span>
                  </ItemQuantityName>
                  <span className="costo">${(item.cantidad * item.precio).toLocaleString()}</span>
                </PreviewItem>
              ))}
            </ItemsPreview>

            <Separator />

            <SummarySection>
              <SummaryLine>
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </SummaryLine>

              {tipoPedido === "domicilio" && (
                <SummaryLine>
                  <span>Domicilio:</span>
                  <span>${costoDomicilio.toLocaleString()}</span>
                </SummaryLine>
              )}

              <TotalLine>
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </TotalLine>
            </SummarySection>
          </PreviewCard>
        </RightColumn>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 20px;
  background: ${(props) => props.theme.bg || "#ffffff"};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #7c7c7c;
  margin-bottom: 20px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 30px;
  max-width: 1400px;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  flex: 0 0 350px;
  position: relative;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: bold;
`;

const ProductosSection = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;

  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProductItem = styled.div`
  background: white;
  border-left: 3px solid #7c7c7c;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductName = styled.span`
  font-weight: 600;
  color: #333;
`;

const ProductDetails = styled.span`
  font-size: 14px;
  color: #666;
`;

const ProductNotes = styled.span`
  font-size: 12px;
  color: #999;
  font-style: italic;
`;

const DeleteBtn = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #cc0000;
    transform: scale(1.05);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const Accordion = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const AccordionHeader = styled.div`
  padding: 15px;
  background: #f5f5f5;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;

  &:hover {
    background: #efefef;
  }
`;

const Arrow = styled.span`
  transition: transform 0.3s ease;
  transform: ${(props) => (props.expanded ? "rotate(0deg)" : "rotate(-90deg)")};
`;

// Componente que acepta expanded como boolean pero no lo pasa al DOM
const AccordionHeaderWithArrow = ({ expanded, onClick, children }) => (
  <AccordionHeader onClick={onClick}>
    <span>{children}</span>
    <Arrow expanded={expanded ? "true" : undefined}>▼</Arrow>
  </AccordionHeader>
);

const AccordionContent = styled.div`
  padding: 15px;
  background: white;
  border-top: 1px solid #ddd;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  input {
    cursor: pointer;
  }
`;

const SubSection = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;

  input {
    margin-left: 8px;
    border-radius: 4px;
    border: 1px solid #ababab;
    padding-left: 6px; /* mueve placeholder y texto */
  }

  ::placeholder {
    color: #cccccc;
  }
`;


const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;

  label {
    font-weight: 500;
    font-size: 14px;
  }

  input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

const NotasSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
  }

  textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SaveBtn = styled.button`
  flex: 1;
  padding: 12px 20px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #fff;
    border: 2px solid #000;
    color: #000;
  }
`;

const PreviewCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-top: 3px solid #333;
  position: relative;
  
  /* Borde troquelado inferior */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px; /* Ajusta para que se vea bien */
    width: 100%;
    height: 10px;
    background: repeating-linear-gradient(
      -45deg,
      white 0 5px,
      transparent 5px 10px
    );
  }
`;

const FacturaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

const ItemsPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

const PreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
`;

const ItemQuantityName = styled.div`
  display: flex;
  gap: 8px;

  .cantidad {
    min-width: 30px;
    text-align: left;
  }

  .nombre {
    flex: 1;
  }
`;

const Separator = styled.div`
  height: 1px;
  background: #ddd;
  margin: 15px 0;
`;

const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;

  span:last-child {
    text-align: right;
  }
`;

const TotalLine = styled(SummaryLine)`
  font-size: 16px;
  font-weight: bold;
  padding-top: 8px;
  border-top: 1px solid #ddd;
`;
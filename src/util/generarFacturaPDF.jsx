export const generarFacturaPDF = async (pedido, opciones = {}) => {
  const { 
    tipoPago = "efectivo",
    tipoPedido = "mesa",
    costoDomicilio = 0,
    numeroMesa = "",
    direccionDomicilio = "",
    nombreRemitente = "",
    anchoTicket = 80, 
  } = opciones;

  try {
    const libraryUrl = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js";
    
    if (!window.html2pdf) {
      await cargarLibreria(libraryUrl);
    }

    const hoy = new Date().toLocaleDateString("es-CO", {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const subtotal = pedido.items.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
    const total = subtotal + (tipoPedido === "domicilio" ? costoDomicilio : 0);

    const factura = generarElementoFactura({
      pedido,
      hoy,
      subtotal,
      total,
      tipoPago,
      tipoPedido,
      costoDomicilio,
      numeroMesa,
      direccionDomicilio,
      nombreRemitente,
      anchoTicket,
    });

    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.appendChild(factura);
    document.body.appendChild(tempDiv);

    await esperarRenderizado();

    // Calcular alto dinámico en mm
    const altoTicket = factura.scrollHeight * 0.264583; // px → mm

    const options = {
      margin: [0, 0, 0, 0], // sin márgenes para respetar ancho exacto
      filename: `Ticket_${pedido.numero}_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: factura.scrollWidth,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: "mm", 
        format: [anchoTicket, altoTicket], // ancho fijo, alto dinámico
        orientation: "portrait",
        compress: true
      },
    };

    await window.html2pdf().set(options).from(factura).save();
    document.body.removeChild(tempDiv);

    console.log(`✅ Ticket generado: ${anchoTicket}mm × ${altoTicket.toFixed(2)}mm`);

  } catch (error) {
    console.error("❌ Error generando ticket:", error);
    alert("Error generando ticket: " + error.message);
  }
};


/**
 * Espera a que el navegador complete el renderizado
 */
function esperarRenderizado() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 150);
      });
    });
  });
}

/**
 * Carga librería externa
 */
function cargarLibreria(url) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`No se pudo cargar ${url}`));
    document.head.appendChild(script);
  });
}

/**
 * Genera el HTML del ticket térmico
 */
function generarElementoFactura(datos) {
  const {
    pedido,
    hoy,
    subtotal,
    total,
    tipoPago,
    tipoPedido,
    costoDomicilio,
    numeroMesa,
    direccionDomicilio,
    nombreRemitente,
    anchoTicket,
  } = datos;

  const factura = document.createElement("div");
  
  factura.style.cssText = `
    font-family: 'Courier New', monospace;
    background: white;
    padding: 6px;
    margin: 0;
    width: ${anchoTicket}mm;
    box-sizing: border-box;
    font-size: 9px;
    line-height: 1.2;
    color: #000;
  `;

  // Encabezado compacto
  factura.innerHTML = `
    <div style="text-align: center; margin: 0 0 6px 0;">
      <div style="font-size: 16px; font-weight: bold; margin: 0;">PosFood</div>
      <div style="font-size: 8px; margin: 2px 0;">Dirección: ---------</div>
      <div style="font-size: 8px; margin: 2px 0;">NIT: 00000000</div>
    </div>

    <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>

    <div style="text-align: center; font-weight: bold; font-size: 11px; margin: 4px 0;">
      FACTURA DE VENTA
    </div>
    
    <div style="text-align: center; font-size: 9px; margin: 2px 0;">
      Pedido #${pedido.numero}
    </div>

    <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>

    <div style="font-size: 9px; margin: 0;">
      <div style="margin: 2px 0;">Fecha: ${hoy}</div>
      <div style="margin: 2px 0;">Cliente: ${tipoPedido === "mesa" ? `Mesa ${numeroMesa}` : "Domicilio"}</div>
      ${nombreRemitente ? `<div style="margin: 2px 0;">Nombre: ${nombreRemitente}</div>` : ""}
      ${direccionDomicilio && tipoPedido === "domicilio" ? 
        `<div style="margin: 2px 0; word-wrap: break-word;">Dir: ${direccionDomicilio}</div>` : ""}
    </div>

    <div style="border-top: 1px dashed #000; margin: 6px 0;"></div>
  `;

  // Tabla de productos
  const tablaProductos = document.createElement("div");
  tablaProductos.style.cssText = "margin: 0; font-size: 9px;";

  // Header de tabla
  const headerTabla = document.createElement("div");
  headerTabla.style.cssText = `
    display: flex;
    font-weight: bold;
    padding-bottom: 3px;
    border-bottom: 1px solid #000;
  `;
  headerTabla.innerHTML = `
    <div style="flex: 0 0 22px;">Cant</div>
    <div style="flex: 1; padding: 0 3px;">Producto</div>
    <div style="flex: 0 0 50px; text-align: right;">Total</div>
  `;
  tablaProductos.appendChild(headerTabla);

  // Productos
  pedido.items.forEach((item) => {
    const productoDiv = document.createElement("div");
    productoDiv.style.cssText = "margin: 4px 0; padding-bottom: 4px; border-bottom: 1px dotted #ccc;";
    
    const lineaPrincipal = document.createElement("div");
    lineaPrincipal.style.cssText = "display: flex; align-items: flex-start;";
    lineaPrincipal.innerHTML = `
      <div style="flex: 0 0 22px;">${item.cantidad}</div>
      <div style="flex: 1; padding: 0 3px; word-wrap: break-word; overflow-wrap: break-word;">
        ${item.nombre}
      </div>
      <div style="flex: 0 0 50px; text-align: right; font-weight: bold;">
        ${(item.cantidad * item.precio).toLocaleString("es-CO")}
      </div>
    `;
    productoDiv.appendChild(lineaPrincipal);

    // Detalle de precio unitario
    const detalleDiv = document.createElement("div");
    detalleDiv.style.cssText = "font-size: 8px; color: #666; margin-top: 2px; padding-left: 25px;";
    detalleDiv.innerHTML = `${item.cantidad} × $${item.precio.toLocaleString("es-CO")}`;
    productoDiv.appendChild(detalleDiv);

    tablaProductos.appendChild(productoDiv);
  });

  factura.appendChild(tablaProductos);

  // Separador antes de totales
  const separadorTotales = document.createElement("div");
  separadorTotales.style.cssText = "border-top: 1px dashed #000; margin: 8px 0;";
  factura.appendChild(separadorTotales);

  // Totales
  const totalesDiv = document.createElement("div");
  totalesDiv.style.cssText = "font-size: 10px; margin: 0;";
  totalesDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin: 3px 0;">
      <span>Subtotal:</span>
      <span>$${subtotal.toLocaleString("es-CO")}</span>
    </div>
    
    ${tipoPedido === "domicilio" ? `
    <div style="display: flex; justify-content: space-between; margin: 3px 0;">
      <span>Domicilio:</span>
      <span>$${costoDomicilio.toLocaleString("es-CO")}</span>
    </div>` : ""}
    
    <div style="display: flex; justify-content: space-between; 
      font-weight: bold; font-size: 12px; 
      border-top: 2px solid #000; 
      padding-top: 4px; margin-top: 4px;">
      <span>TOTAL:</span>
      <span>$${total.toLocaleString("es-CO")}</span>
    </div>
  `;
  factura.appendChild(totalesDiv);

  // Separador final
  const separadorFinal = document.createElement("div");
  separadorFinal.style.cssText = "border-top: 1px dashed #000; margin: 8px 0;";
  factura.appendChild(separadorFinal);

  // Pie de página
  const pieDiv = document.createElement("div");
  pieDiv.style.cssText = "text-align: center; font-size: 9px;";
  pieDiv.innerHTML = `
    <div style="margin: 4px 0;">
      <strong>Pago:</strong> ${tipoPago === "efectivo" ? "Efectivo" : "Transferencia"}
    </div>
    <div style="margin: 6px 0 4px 0; font-weight: bold;">
      ¡Gracias por su compra!
    </div>
    <div style="font-size: 8px; color: #666;">
      Elaborado por PosFood
    </div>
  `;
  factura.appendChild(pieDiv);

  // 👉 Espacio final extra
  const espacioFinal = document.createElement("div");
  espacioFinal.style.cssText = "height: 20mm;"; // puedes ajustar a 10mm, 15mm, etc.
  factura.appendChild(espacioFinal);

  return factura;
}
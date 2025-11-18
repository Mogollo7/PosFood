import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../supabase/supabase.config'
import { obtenerPedidos } from '../supabase/crudPedidos'
import { format } from 'date-fns'
import { FaShoppingBag } from 'react-icons/fa'
import './DashboardHome.css'

function DashboardHome() {
    const navigate = useNavigate()

    // Capacidad máxima de mesas
    const MAX_MESAS = 11
    const mesasOcupadas = 8
    const occupancy = (mesasOcupadas / MAX_MESAS) * 100

    // Reloj en tiempo real
    const [time, setTime] = useState(new Date())
    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    const chartData = [
        { date: 'Nov 21', pedidos: 30 },
        { date: 'Nov 22', pedidos: 55 },
        { date: 'Nov 23', pedidos: 75 },
        { date: 'Nov 24', pedidos: 65 },
        { date: 'Nov 25', pedidos: 85 },
        { date: 'Nov 26', pedidos: 100 }
    ]

    const pedidosData = [
        { id: 1, tipo: 'Pedido a domicilio', nombre: 'Hamburguesa', estado: 'Proceso' },
        { id: 2, tipo: 'Pedido a domicilio', nombre: 'Hamburguesa', estado: 'Terminado' },
        { id: 3, tipo: 'Pedido a domicilio', nombre: 'Hamburguesa', estado: 'Pagado' }
    ]

    // Datos dinámicos
    const [metrics, setMetrics] = useState({ transferencia: 0, efectivo: 0, total: 0 })
    const [chartPedidos, setChartPedidos] = useState([])
    const [pedidosRecientes, setPedidosRecientes] = useState([])

    useEffect(() => {
        async function loadPedidosRecientes() {
            try {
                const pedidos = await obtenerPedidos()
                setPedidosRecientes(pedidos.slice(0, 3))
            } catch (err) {
                console.error('Error cargando pedidos recientes:', err)
            }
        }
        loadPedidosRecientes()
    }, [])

    useEffect(() => {
        async function fetchMetrics() {
            try {
                // Traer pedidos recientes con fecha, total y tipo_pago
                const { data: pedidos, error } = await supabase
                    .from('pedidos')
                    .select('id, numero, total, fecha, tipo_pago')
                    .order('fecha', { ascending: false })
                    .limit(1000)

                if (error) {
                    console.error('Error al cargar pedidos:', error)
                    return
                }

                let transferencia = 0
                let efectivo = 0
                let total = 0
                const pedidosPorDia = {}

                pedidos.forEach((p) => {
                    const t = parseFloat(p.total || 0)
                    total += t
                    if (p.tipo_pago === 'transferencia') transferencia += t
                    if (p.tipo_pago === 'efectivo') efectivo += t

                    // agrupar por día para gráfico
                    const day = p.fecha ? format(new Date(p.fecha), "yyyy-MM-dd") : 'Sin fecha'
                    pedidosPorDia[day] = (pedidosPorDia[day] || 0) + 1
                })

                // preparar datos para el chart (últimos 7 días)
                const chartArr = Object.keys(pedidosPorDia)
                    .sort()
                    .slice(-7)
                    .map((d) => ({ date: d, pedidos: pedidosPorDia[d] }))

                setMetrics({ transferencia, efectivo, total })
                setChartPedidos(chartArr)
            } catch (err) {
                console.error(err)
            }
        }

        fetchMetrics()
    }, [])

    return (
        <div className='dashboard-main-content'>
            <div className='dashboard-content-grid'>
                {/* Tarjetas de métricas */}
                <div className='dashboard-metrics-container'>
                    <div className='dashboard-metric-card'>
                        <div className='dashboard-metric-label'>Transferencia</div>
                        <div className='dashboard-metric-value'>{metrics.transferencia.toFixed(2)}</div>
                        <div className='dashboard-metric-change'>+{(metrics.transferencia * 0.1).toFixed(2)}</div>
                    </div>
                    <div className='dashboard-metric-card'>
                        <div className='dashboard-metric-label'>Efectivo</div>
                        <div className='dashboard-metric-value'>{metrics.efectivo.toFixed(2)}</div>
                        <div className='dashboard-metric-change'>+{(metrics.efectivo * 0.1).toFixed(2)}</div>
                    </div>
                    <div className='dashboard-metric-card'>
                        <div className='dashboard-metric-label'>Total</div>
                        <div className='dashboard-metric-value'>{metrics.total.toFixed(2)}</div>
                        <div className='dashboard-metric-change'>+{(metrics.total * 0.1).toFixed(2)}</div>
                    </div>
                    <div className='dashboard-metric-card'>
                        <div className='dashboard-metric-label'>Time</div>
                        <div className='dashboard-metric-value'>{time.toLocaleTimeString()}</div>
                        <div className='dashboard-metric-change'>Cartas Anuales</div>
                    </div>
                </div>

                {/* Contenedor principal - Gráfico + Ocupación + Notificación */}
                <div className='dashboard-main-grid'>
                    {/* Gráfico y Pedidos */}
                    <div className='dashboard-left-column'>
                        <div className='dashboard-pedidos-chart'>
                            <h3>Pedidos</h3>
                            <p className='dashboard-chart-subtitle'>+59.00% últimos 7 días</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartPedidos.length ? chartPedidos : chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="date" stroke="#999" />
                                    <YAxis stroke="#999" />
                                    <Tooltip />
                                    <Bar dataKey="pedidos" fill="#000" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Tabla de pedidos */}
                        <div className='dashboard-pedidos-table'>
                            <div className='dashboard-table-header'>
                                <h3>Pedidos Ingresados</h3>
                                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard/pedidos') }} className='dashboard-ver-mas'>Ver mas</a>
                            </div>
                            <table>
                                <tbody>
                                    {pedidosRecientes.map((pedido) => {
                                        const primerProducto = (pedido.items && pedido.items[0]) ? pedido.items[0].nombre : 'Sin items'
                                        const tipo = pedido.tipo_pedido === 'domicilio' ? 'Pedido a domicilio' : 'Pedido en mesa'
                                        return (
                                            <tr key={pedido.id} className='dashboard-table-row'>
                                                <td className='dashboard-table-icon'>
                                                    <div className='dashboard-icon-circle'>
                                                        <FaShoppingBag size={16} color='#666' />
                                                    </div>
                                                </td>
                                                <td className='dashboard-table-info'>
                                                    <div className='dashboard-pedido-tipo'><strong>{tipo}</strong></div>
                                                    <div className='dashboard-pedido-nombre'>{primerProducto}</div>
                                                </td>
                                                <td className='dashboard-table-status'>{pedido.estado}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Columna derecha - Ocupación + Notificación + Ingresos */}
                    <div className='dashboard-right-column'>
                        {/* Ocupación Actual */}
                        <div className='dashboard-ocupacion-card'>
                            <h3>Ocupación Actual</h3>
                            <div className='dashboard-gauge-container'>
                                <div className='dashboard-gauge'>
                                    <div className='dashboard-gauge-fill' style={{ width: '76.7%' }}></div>
                                </div>
                                <div className='dashboard-gauge-text'>{occupancy.toFixed(1)}%</div>
                            </div>
                            <div className='dashboard-gauge-labels'>
                                <span>0%</span>
                                <span>100%</span>
                            </div>
                            <div className='dashboard-capacity-text'>Capacidad: {mesasOcupadas}/{MAX_MESAS}</div>
                        </div>

                        {/* Notificación */}
                        <div className='dashboard-notificacion-card'>
                            <h3>Notificación</h3>
                            <div className='dashboard-notificacion-content'>
                                <h4>Aumento de ingresos de al menos 20 %</h4>
                                <p>Hubo un aumento de al menos un 20% en las ventas totales</p>
                                <button onClick={() => navigate('/dashboard/ventas')} className='dashboard-leer-mas-btn'>Leer Mas</button>
                            </div>
                        </div>

                        {/* Ingresos */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome


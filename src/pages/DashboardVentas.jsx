import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './DashboardVentas.css'
import { supabase } from '../supabase/supabase.config'
import { format } from 'date-fns'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

function DashboardVentas() {
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState('ventas')

    // Capacidad máxima de mesas
    const MAX_MESAS = 11
    const mesasOcupadas = 7

    const ventasData = [
        { date: 'Nov 21', transferencia: 1000, efectivo: 900 },
        { date: 'Nov 22', transferencia: 1200, efectivo: 800 },
        { date: 'Nov 23', transferencia: 1100, efectivo: 950 },
        { date: 'Nov 24', transferencia: 1300, efectivo: 1100 },
        { date: 'Nov 25', transferencia: 1250, efectivo: 1050 },
        { date: 'Nov 26', transferencia: 1400, efectivo: 1200 }
    ]
    const [ventasDataState, setVentasDataState] = useState([])
    const [ingresosDataState, setIngresosDataState] = useState([])
    const [flujoDataState, setFlujoDataState] = useState([])

    useEffect(() => {
        async function fetchVentas() {
            try {
                // Obtener pedidos con datos necesarios
                const { data: pedidos, error: pedidosError } = await supabase
                    .from('pedidos')
                    .select('id, numero, total, fecha, tipo_pago, tipo_pedido')
                    .order('fecha', { ascending: true })
                    .limit(1000)

                if (pedidosError) {
                    console.error('Error al obtener pedidos:', pedidosError)
                    return
                }

                // Agrupar por fecha y tipo_pago
                const ventasMap = {}
                const ingresosMap = {}
                const pedidosById = {}
                pedidos.forEach((p) => {
                    const day = p.fecha ? format(new Date(p.fecha), 'yyyy-MM-dd') : 'Sin fecha'
                    ventasMap[day] = ventasMap[day] || { transferencia: 0, efectivo: 0 }
                    ingresosMap[day] = ingresosMap[day] || 0
                    const total = parseFloat(p.total || 0)
                    if (p.tipo_pago === 'transferencia') ventasMap[day].transferencia += total
                    else if (p.tipo_pago === 'efectivo') ventasMap[day].efectivo += total

                    ingresosMap[day] += 1
                    pedidosById[p.id] = p
                })

                const ventasArr = Object.keys(ventasMap).sort().map((d) => ({ date: d, ...ventasMap[d] }))
                const ingresosArr = Object.keys(ingresosMap).sort().map((d) => ({ date: d, ingresos: ingresosMap[d] }))

                // Obtener pagos para flujo de caja
                const { data: pagos, error: pagosError } = await supabase.from('pago').select('id, pedido_id, estado, fecha').order('fecha', { ascending: false }).limit(100)
                if (pagosError) {
                    console.error('Error al obtener pagos:', pagosError)
                }

                const flujoArr = (pagos || []).map((pago) => {
                    const pedido = pedidosById[pago.pedido_id] || {}
                    const monto = pedido.total ? parseFloat(pedido.total) : 0
                    const sign = pago.estado === 'pago' ? '+' : '-'
                    return {
                        date: pago.fecha ? format(new Date(pago.fecha), 'yyyy-MM-dd HH:mm') : '',
                        id: `#${pedido.numero || pago.pedido_id}`,
                        monto: `${sign}${monto}`,
                        tipo: pedido.tipo_pedido || 'N/A',
                        color: pago.estado === 'pago' ? '#4ade80' : '#ef4444',
                    }
                })

                setVentasDataState(ventasArr)
                setIngresosDataState(ingresosArr)
                setFlujoDataState(flujoArr)
            } catch (err) {
                console.error(err)
            }
        }

        fetchVentas()
    }, [])

    return (
        <div className='dashboard-main-content'>
            <div className='dashboard-ventas-container'>
                {/* topnav eliminado: la navegación global la gestiona App/Sidebar */}

                {/* Contenido principal */}
                <div className='dashboard-ventas-content'>
                    <div className='dashboard-ventas-header'>
                        <h1>Ventas</h1>
                        <div className='dashboard-capacity'>Mesas: {mesasOcupadas}/{MAX_MESAS} ({((mesasOcupadas / MAX_MESAS) * 100).toFixed(1)}%)</div>
                    </div>

                    <div className='dashboard-ventas-grid'>
                        {/* Gráfico de Ventas */}
                        <div className='dashboard-ventas-chart'>
                            <h3>Ventas</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={ventasDataState}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="date" stroke="#999" />
                                    <YAxis stroke="#999" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="transferencia" stroke="#00b050" strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="efectivo" stroke="#0070c0" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gráfico de Ingresos */}
                        <div className='dashboard-ingresos-chart'>
                            <h3>Ingresos</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ingresosDataState}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="date" stroke="#999" />
                                    <YAxis stroke="#999" />
                                    <Tooltip />
                                    <Bar dataKey="ingresos" fill="#000" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Flujo de caja */}
                        <div className='dashboard-flujo-caja'>
                            <h3>Flujo de caja</h3>
                            <div className='dashboard-flujo-list'>
                                {flujoDataState.map((item, index) => (
                                    <div key={index} className='dashboard-flujo-item'>
                                        <div className='dashboard-flujo-icon'>
                                            {item.monto.startsWith('+') ? (
                                                <FaArrowUp size={18} color='#4ade80' />
                                            ) : (
                                                <FaArrowDown size={18} color='#ef4444' />
                                            )}
                                        </div>
                                        <div className='dashboard-flujo-info'>
                                            <div className='dashboard-flujo-date'>{item.date}</div>
                                            <div className='dashboard-flujo-id'>{item.id}</div>
                                            <div className='dashboard-flujo-tipo'>{item.tipo}</div>
                                        </div>
                                        <div className='dashboard-flujo-monto' style={{ color: item.monto.startsWith('+') ? '#4ade80' : '#ef4444' }}>
                                            {item.monto}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardVentas


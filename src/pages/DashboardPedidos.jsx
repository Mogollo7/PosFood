import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FaBox, FaMotorcycle } from 'react-icons/fa'
import './DashboardPedidos.css'
import { obtenerPedidos } from '../supabase/crudPedidos'
import { format } from 'date-fns'

function DashboardPedidos() {
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState('pedidos')

    const COLORS = ['#000', '#999', '#ccc']
    const [productsData, setProductsData] = useState([])
    const [pedidosChartData, setPedidosChartData] = useState([])
    const [pedidosDataState, setPedidosDataState] = useState([])
    // Capacidad máxima de mesas
    const MAX_MESAS = 11
    const mesasOcupadas = 10

    const [statusCards, setStatusCards] = useState([
        { label: 'En proceso', count: 0 },
        { label: 'Terminado', count: 0 },
        { label: 'Mesa', count: mesasOcupadas },
        { label: 'Domicilio', count: 0 }
    ])

    useEffect(() => {
        async function loadPedidos() {
            try {
                const pedidos = await obtenerPedidos()
                setPedidosDataState(pedidos)

                // Distribución de productos
                const prodMap = {}
                pedidos.forEach((p) => {
                    p.items.forEach((it) => {
                        const name = it.nombre || `#${it.producto_id}`
                        prodMap[name] = (prodMap[name] || 0) + it.cantidad
                    })
                })
                const prodArr = Object.keys(prodMap).map((k) => ({ name: k, value: prodMap[k] }))
                setProductsData(prodArr)

                // Pedidos por hora (gráfico)
                const horaMap = {}
                pedidos.forEach((p) => {
                    const h = p.date ? format(new Date(p.date), 'HH:00') : 'Sin hora'
                    horaMap[h] = (horaMap[h] || 0) + 1
                })
                const horaArr = Object.keys(horaMap).sort().map((k) => ({ time: k, pedidos: horaMap[k] }))
                setPedidosChartData(horaArr)

                // Status cards
                const enProceso = pedidos.filter((p) => p.estado === 'en_preparacion' || p.estado === 'pendiente').length
                const terminado = pedidos.filter((p) => p.estado === 'listo').length
                const mesa = pedidos.filter((p) => p.tipo_pedido === 'mesa' && p.numero_mesa).length
                const domicilio = pedidos.filter((p) => p.tipo_pedido === 'domicilio').length
                setStatusCards([
                    { label: 'En proceso', count: enProceso },
                    { label: 'Terminado', count: terminado },
                    { label: 'Mesa', count: mesa },
                    { label: 'Domicilio', count: domicilio }
                ])
            } catch (err) {
                console.error('Error cargando pedidos para dashboard:', err)
            }
        }

        loadPedidos()
    }, [])

    return (
        <div className='dashboard-main-content'>
            <div className='dashboard-pedidos-container'>
                {/* topnav eliminado: la navegación global la gestiona App/Sidebar */}

                {/* Contenido principal */}
                <div className='dashboard-pedidos-content'>
                    {/* Tarjetas de estado */}
                    <div className='dashboard-status-cards'>
                        {statusCards.map((card, index) => (
                            <div key={index} className='dashboard-status-card'>
                                <div className='dashboard-status-label'>{card.label}</div>
                                <div className='dashboard-status-count'>{card.count}</div>
                                <div className='dashboard-status-circle'></div>
                            </div>
                        ))}
                    </div>
                    <div className='dashboard-capacity'>
                        Capacidad mesas: {mesasOcupadas}/{MAX_MESAS} ({((mesasOcupadas / MAX_MESAS) * 100).toFixed(1)}%)
                    </div>

                    {/* Grid principal - Productos + Pedidos + Tabla */}
                    <div className='dashboard-pedidos-grid'>
                        {/* Productos */}
                        <div className='dashboard-productos-card'>
                            <h3>Productos</h3>
                            <div className='dashboard-productos-content'>
                                <div className='dashboard-pie-chart-container'>
                                    <ResponsiveContainer width={200} height={200}>
                                        <PieChart>
                                            <Pie
                                                data={productsData}
                                                cx={100}
                                                cy={100}
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {productsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className='dashboard-pie-center-text'>
                                        <div className='dashboard-pie-total'>{productsData.reduce((s, p) => s + (p.value || 0), 0)}</div>
                                        <div className='dashboard-pie-label'>Total</div>
                                    </div>
                                </div>
                                <div className='dashboard-productos-list'>
                                    {productsData.map((product, index) => (
                                        <div key={index} className='dashboard-producto-item'>
                                            <div className='dashboard-producto-icon'>
                                                <FaBox size={16} color={['#000', '#999', '#ccc'][index % 3]} />
                                            </div>
                                            <div className='dashboard-producto-name'>{product.name}</div>
                                            <div className='dashboard-producto-count'>→ {product.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gráfico de Pedidos */}
                        <div className='dashboard-pedidos-chart-card'>
                            <h3>Pedidos</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={pedidosChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="time" stroke="#999" />
                                    <YAxis stroke="#999" />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="pedidos" stroke="#000" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Tabla de Pedidos */}
                    <div className='dashboard-tabla-pedidos'>
                        <h3>Lista de pedidos</h3>
                        <div className='dashboard-tabla-container'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Id Pedido</th>
                                        <th>Mesa</th>
                                        <th>Tipo</th>
                                        <th>Pedido</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosDataState.map((pedido, idx) => (
                                        <tr key={pedido.id || idx} className='dashboard-tabla-row'>
                                            <td>{idx + 1}</td>
                                            <td>{`#${pedido.numero || pedido.id}`}</td>
                                            <td>{pedido.numero_mesa || '-'}</td>
                                            <td>{pedido.tipo_pedido === 'mesa' && pedido.numero_mesa ? `Mesa ${pedido.numero_mesa}` : pedido.tipo_pedido === 'domicilio' ? 'Domicilio' : 'N/A'}</td>
                                            <td>{(pedido.items || []).map(i => i.nombre).join(', ')}</td>
                                            <td>{pedido.date ? new Date(pedido.date).toLocaleString() : ''}</td>
                                            <td><span className={`dashboard-estado-badge ${pedido.estado === 'listo' ? 'pagado' : 'debe'}`}>{pedido.estado}</span></td>
                                            <td>{pedido.total ? `$${pedido.total}` : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPedidos


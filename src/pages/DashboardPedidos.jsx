import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './DashboardPedidos.css'

function DashboardPedidos() {
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState('pedidos')

    const productsData = [
        { name: 'Pizza', value: 5 },
        { name: 'Lasaña', value: 7 },
        { name: 'Hamburguesa', value: 12 }
    ]

    const pedidosChartData = [
        { time: '12:00', pedidos: 25 },
        { time: '1:00', pedidos: 30 },
        { time: '2:00', pedidos: 28 },
        { time: '3:00', pedidos: 35 },
        { time: '4:00', pedidos: 32 },
        { time: '5:00', pedidos: 40 },
        { time: '6:00', pedidos: 38 },
        { time: '7:00', pedidos: 35 },
        { time: '8:00', pedidos: 30 },
        { time: '9:00', pedidos: 28 },
        { time: '10:00', pedidos: 20 }
    ]

    const pedidosData = [
        { no: 1, idPedido: '#088605', mesa: '-', pedido: 'Hamburguesa, pizza...', fecha: '21/06/2022 08:21', estado: 'Pagado', precio: '$101' },
        { no: 2, idPedido: '#088605', mesa: '-', pedido: 'Hamburguesa, pizza...', fecha: '21/06/2022 08:21', estado: 'Pagado', precio: '$101' },
        { no: 3, idPedido: '#088605', mesa: '-', pedido: 'Hamburguesa, pizza...', fecha: '21/06/2022 08:21', estado: 'Debe', precio: '$101' },
        { no: 4, idPedido: '#088605', mesa: '2', pedido: 'Hamburguesa, pizza...', fecha: '21/06/2022 08:21', estado: 'Debe', precio: '$101' }
    ]

    const COLORS = ['#000', '#999', '#ccc']

    const statusCards = [
        { label: 'En proceso', count: 12 },
        { label: 'Terminado', count: 24 },
        { label: 'Mesa', count: 10 },
        { label: 'Domicilio', count: 2 }
    ]

    return (
        <div className='dashboard-main-content'>
            <div className='dashboard-pedidos-container'>
                {/* Sidebar de navegación */}
                <div className='dashboard-pedidos-sidebar'>
                    <button 
                        className={`dashboard-pedidos-nav-btn ${activePage === 'home' ? 'active' : ''}`}
                        onClick={() => navigate('/dashboard')}
                    >
                        ← Home
                    </button>
                    <button 
                        className={`dashboard-pedidos-nav-btn ${activePage === 'pedidos' ? 'active' : ''}`}
                        onClick={() => setActivePage('pedidos')}
                    >
                        ← Pedidos
                    </button>
                </div>

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
                                        <div className='dashboard-pie-total'>24</div>
                                        <div className='dashboard-pie-label'>Total</div>
                                    </div>
                                </div>
                                <div className='dashboard-productos-list'>
                                    {productsData.map((product, index) => (
                                        <div key={index} className='dashboard-producto-item'>
                                            <div className='dashboard-producto-color' style={{ backgroundColor: COLORS[index] }}></div>
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
                                        <th>Pedido</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosData.map((pedido) => (
                                        <tr key={pedido.no} className='dashboard-tabla-row'>
                                            <td>{pedido.no}</td>
                                            <td>{pedido.idPedido}</td>
                                            <td>{pedido.mesa}</td>
                                            <td>{pedido.pedido}</td>
                                            <td>{pedido.fecha}</td>
                                            <td><span className={`dashboard-estado-badge ${pedido.estado === 'Pagado' ? 'pagado' : 'debe'}`}>{pedido.estado}</span></td>
                                            <td>{pedido.precio}</td>
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


import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './DashboardVentas.css'

function DashboardVentas() {
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState('ventas')

    const ventasData = [
        { date: 'Nov 21', transferencia: 1000, efectivo: 900 },
        { date: 'Nov 22', transferencia: 1200, efectivo: 800 },
        { date: 'Nov 23', transferencia: 1100, efectivo: 950 },
        { date: 'Nov 24', transferencia: 1300, efectivo: 1100 },
        { date: 'Nov 25', transferencia: 1250, efectivo: 1050 },
        { date: 'Nov 26', transferencia: 1400, efectivo: 1200 }
    ]

    const ingresosData = [
        { date: 'Nov 21', ingresos: 30 },
        { date: 'Nov 22', ingresos: 55 },
        { date: 'Nov 23', ingresos: 75 },
        { date: 'Nov 24', ingresos: 65 },
        { date: 'Nov 25', ingresos: 85 },
        { date: 'Nov 26', ingresos: 100 }
    ]

    const flujoData = [
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '+19000', tipo: 'Domicilio', color: '#4ade80' },
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '-19000', tipo: 'Domicilio', color: '#ef4444' },
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '-19000', tipo: 'Domicilio', color: '#ef4444' },
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '-19000', tipo: 'Domicilio', color: '#ef4444' },
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '+19000', tipo: 'Domicilio', color: '#4ade80' },
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '-19000', tipo: 'Domicilio', color: '#ef4444' },
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '-19000', tipo: 'Domicilio', color: '#ef4444' },
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '+19000', tipo: 'Domicilio', color: '#4ade80' },
        { date: 'Nov 21, 2017', id: '#D1874758756', monto: '-19000', tipo: 'Domicilio', color: '#ef4444' }
    ]

    return (
        <div className='dashboard-main-content'>
            <div className='dashboard-ventas-container'>
                {/* Sidebar de navegación */}
                <div className='dashboard-ventas-sidebar'>
                    <button 
                        className={`dashboard-ventas-nav-btn ${activePage === 'home' ? 'active' : ''}`}
                        onClick={() => navigate('/dashboard')}
                    >
                        ← Home
                    </button>
                    <button 
                        className={`dashboard-ventas-nav-btn ${activePage === 'pedidos' ? 'active' : ''}`}
                        onClick={() => navigate('/dashboard/pedidos')}
                    >
                        ← Pedidos
                    </button>
                    <button 
                        className={`dashboard-ventas-nav-btn ${activePage === 'ventas' ? 'active' : ''}`}
                        onClick={() => setActivePage('ventas')}
                    >
                        ← Ventas
                    </button>
                </div>

                {/* Contenido principal */}
                <div className='dashboard-ventas-content'>
                    <div className='dashboard-ventas-header'>
                        <h1>Ventas</h1>
                    </div>

                    <div className='dashboard-ventas-grid'>
                        {/* Gráfico de Ventas */}
                        <div className='dashboard-ventas-chart'>
                            <h3>Ventas</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={ventasData}>
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
                                <BarChart data={ingresosData}>
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
                                {flujoData.map((item, index) => (
                                    <div key={index} className='dashboard-flujo-item'>
                                        <div className='dashboard-flujo-icon'>
                                            <div className='dashboard-flujo-circle'></div>
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


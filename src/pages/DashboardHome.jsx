import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './DashboardHome.css'

function DashboardHome() {
    const navigate = useNavigate()

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

    return (
        <div className='dashboard-main-content'>
            <div className='dashboard-content-grid'>
                {/* Tarjetas de métricas */}
                <div className='dashboard-metrics-container'>
                    <div className='dashboard-metric-card'>
                        <div className='dashboard-metric-label'>Transferencia</div>
                        <div className='dashboard-metric-value'>50.000</div>
                        <div className='dashboard-metric-change'>+5.000</div>
                    </div>
                    <div className='dashboard-metric-card'>
                        <div className='dashboard-metric-label'>Efectivo</div>
                        <div className='dashboard-metric-value'>50.000</div>
                        <div className='dashboard-metric-change'>+5.000</div>
                    </div>
                    <div className='dashboard-metric-card'>
                        <div className='dashboard-metric-label'>Total</div>
                        <div className='dashboard-metric-value'>50.000</div>
                        <div className='dashboard-metric-change'>+5.000</div>
                    </div>
                    <div className='dashboard-metric-card'>
                        <div className='dashboard-metric-label'>Time</div>
                        <div className='dashboard-metric-value'>20:10:59</div>
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
                                <BarChart data={chartData}>
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
                                    {pedidosData.map((pedido) => (
                                        <tr key={pedido.id} className='dashboard-table-row'>
                                            <td className='dashboard-table-icon'>
                                                <div className='dashboard-icon-circle'></div>
                                            </td>
                                            <td className='dashboard-table-info'>
                                                <div className='dashboard-pedido-tipo'><strong>{pedido.tipo}</strong></div>
                                                <div className='dashboard-pedido-nombre'>{pedido.nombre}</div>
                                            </td>
                                            <td className='dashboard-table-status'>{pedido.estado}</td>
                                        </tr>
                                    ))}
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
                                <div className='dashboard-gauge-text'>76.7%</div>
                            </div>
                            <div className='dashboard-gauge-labels'>
                                <span>0%</span>
                                <span>100%</span>
                            </div>
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
                        <div className='dashboard-ingresos-card'>
                            <h3>Ingresos</h3>
                            <div className='dashboard-ingresos-content'>
                                <p className='dashboard-ingresos-text'>Dentro del div hay un si ya que sobresale de la</p>
                                <button className='dashboard-btn-leer-mas'>Leer Mas</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome


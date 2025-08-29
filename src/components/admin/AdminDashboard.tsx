import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { Package, Tag, AlertTriangle, ShoppingCart, Users, BrainCircuit } from 'lucide-react';
import type { Product } from '../../context/CartContext';
import Swal from 'sweetalert2';
import axios from 'axios'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

interface Order {
    _id: string;
    cliente: { nombre: string };
    total: number;
    createdAt: string;
}

interface Stats {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalUsers: number;
    lowStockProducts: Product[];
    recentOrders: Order[];
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const handleGenerateEmbeddings = async () => {
        Swal.fire({
            title: 'Generando vectores de búsqueda...',
            text: 'Este proceso puede tardar unos minutos. No cierres esta ventana.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            await api.post('/ia/generate-all-embeddings');
            Swal.fire('¡Éxito!', 'Los vectores para la búsqueda inteligente han sido generados para todos los productos.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudieron generar los vectores de búsqueda. Revisa la consola para más detalles.', 'error');
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center">Cargando estadísticas...</div>;
    }

    if (!stats) {
        return <div className="text-center text-red-500">No se pudieron cargar las estadísticas.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Productos Totales" value={stats.totalProducts} icon={Package} color="bg-sky-500" />
                <StatCard title="Categorías Totales" value={stats.totalCategories} icon={Tag} color="bg-emerald-500" />
                <StatCard title="Órdenes Totales" value={stats.totalOrders} icon={ShoppingCart} color="bg-indigo-500" />
                <StatCard title="Clientes Totales" value={stats.totalUsers} icon={Users} color="bg-pink-500" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BrainCircuit className="text-primary" />Mantenimiento de IA</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Haz clic en este botón para (re)generar los vectores de búsqueda para todos tus productos. 
                    Esto es necesario si has añadido productos antes de implementar esta función, o si quieres actualizar la inteligencia de la búsqueda.
                </p>
                <button 
                    onClick={handleGenerateEmbeddings} 
                    className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors"
                >
                    Generar Vectores de Búsqueda Inteligente
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="text-yellow-500" />Alerta de Bajo Stock</h3>
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                        {stats.lowStockProducts.length > 0 ? stats.lowStockProducts.map(p => (
                            <div key={p._id} className="flex justify-between items-center text-sm p-2 bg-yellow-50 rounded">
                                <span>{p.nombre}</span>
                                <span className="font-bold text-red-600">{p.stock} unidades</span>
                            </div>
                        )) : <p className="text-gray-500 text-sm">¡Todo bien! No hay productos con bajo stock.</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ShoppingCart className="text-indigo-500" />Últimos Pedidos</h3>
                    <div className="space-y-3 max-h-72 overflow-y-auto">
                        {stats.recentOrders.length > 0 ? stats.recentOrders.map(o => (
                            <div key={o._id} className="flex justify-between items-center text-sm p-2 bg-indigo-50 rounded">
                                <div>
                                    <p className="font-semibold">{o.cliente.nombre}</p>
                                    <p className="text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString('es-CR')}</p>
                                </div>
                                <span className="font-bold text-green-600">₡{o.total.toLocaleString('es-CR')}</span>
                            </div>
                        )) : <p className="text-gray-500 text-sm">Aún no hay pedidos recientes.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { predictiveSearch } from '../services/api';
import { Product } from '../context/CartContext';
import { ShoppingCart, LogIn, LogOut, UserCircle, ShieldCheck, Search, Menu, ChevronDown, Package as PackageIcon, Settings, Heart, Cpu } from 'lucide-react';

interface NavbarProps {
    toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const { cartItemCount } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsSearchOpen(false);
            return;
        }

        const debounceTimer = setTimeout(() => {
            predictiveSearch(query).then(res => {
                setResults(res.data);
                setIsSearchOpen(true);
            }).catch(() => {
                setResults([]);
                setIsSearchOpen(false);
            });
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
            setIsSearchOpen(false);
        }
    };
    
    const handleLogout = () => {
        setProfileOpen(false);
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-2 sm:px-6 py-3 flex items-center justify-between gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Abrir menú de categorías"><Menu size={24} className="text-gray-700" /></button>
                    <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-primary"/> 
                        <span className="hidden md:inline">Local<span className="text-primary">Tech</span></span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center px-1 sm:px-4 relative" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Busca productos..." 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => query.length > 1 && setIsSearchOpen(true)}
                            className="w-full pl-12 pr-4 py-2 border rounded-full text-sm sm:text-base transition-shadow focus:ring-2 focus:ring-primary"
                        />
                    </form>
                    {isSearchOpen && results.length > 0 && (
                        <div className="absolute top-full mt-2 w-full max-w-lg bg-white rounded-lg shadow-xl border overflow-hidden">
                            <ul>
                                {results.map(product => (
                                    <li key={product._id}>
                                        <Link 
                                            to={`/producto/${product._id}`} 
                                            onClick={() => {
                                                setQuery('');
                                                setIsSearchOpen(false);
                                            }}
                                            className="flex items-center gap-4 p-3 hover:bg-primary text-gray-800 hover:text-white transition-colors group"
                                        >
                                            <img src={product.imagen} alt={product.nombre} className="w-12 h-12 object-contain rounded flex-shrink-0"/>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800 group-hover:text-white">{product.nombre}</span>
                                                <span className="text-sm text-emerald-600 group-hover:text-white">{product.precio.toLocaleString('es-CR')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center justify-end gap-2 sm:gap-4">
                    <Link to="/cart" id="cart-icon-container" className="relative text-gray-600 hover:text-primary transition-colors p-2 sm:p-0">
                        <ShoppingCart className="h-6 w-6" />
                        {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{cartItemCount}</span>}
                    </Link>
                    {isAuthenticated ? (
                        <div className="relative" ref={profileDropdownRef}>
                            <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-2 font-semibold p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <UserCircle className="w-6 h-6 text-primary" />
                                <span className="text-gray-800 hidden sm:inline">{user?.nombre}</span>
                                <ChevronDown size={16} className={`text-gray-800 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                    {user?.rol === 'admin' && (
                                        <>
                                            <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold transition-colors">
                                                <ShieldCheck size={16} className="text-green-600" /> Panel de Admin
                                            </Link>
                                            <hr className="my-1" />
                                        </>
                                    )}
                                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"><Settings size={16} /> Mi Perfil</Link>
                                    <Link to="/my-orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"><PackageIcon size={16} /> Mis Pedidos</Link>
                                    <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"><Heart size={16} /> Mis Favoritos</Link>
                                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"><LogOut size={16} /> Salir</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="p-2 text-gray-600 hover:text-primary transition-colors sm:flex sm:items-center sm:gap-1">
                                <LogIn className="h-6 w-6 sm:h-5 sm:w-5" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                            <Link to="/register" className="bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-primary-hover transition-all duration-200 hidden sm:block">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
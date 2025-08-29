import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { semanticSearch } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { SearchX } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }

        const performSearch = async () => {
            setLoading(true);
            try {
                const res = await semanticSearch(query);
                setResults(res.data);
            } catch (error) {
                console.error("Error en la búsqueda semántica:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold my-8 text-gray-800">
                Resultados para: <span className="text-primary">"{query}"</span>
            </h1>

            {loading ? (
                <div className="text-center">Cargando resultados...</div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {results.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-12 rounded-lg shadow">
                    <SearchX size={48} className="mx-auto text-gray-400" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">No se encontraron resultados</h2>
                    <p className="text-gray-500 mt-2">No pudimos encontrar productos que coincidan con tu búsqueda. Intenta con otras palabras.</p>
                    <Link to="/" className="mt-6 inline-block bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-hover">
                        Volver al inicio
                    </Link>
                </div>
            )}
        </div>
    );
};
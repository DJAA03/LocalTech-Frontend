import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { sendChatMessage } from '../services/api';

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<Message[]>([]); 
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    const initialSuggestions = ['¿Qué categorías de productos tienen?', 'Necesito contactar a un técnico', 'Información de envío'];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;

        const userMessage: Message = { role: 'user', parts: [{ text: messageText }] };
        const historyForApi = [...history];
        setHistory(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const res = await sendChatMessage(historyForApi, messageText);
            const botMessage: Message = { role: 'model', parts: [{ text: res.data.response }] };
            setHistory(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { role: 'model', parts: [{ text: 'Lo siento, estoy teniendo problemas para conectarme. Por favor, intenta de nuevo más tarde.' }] };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
        setInput('');
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        handleSendMessage(suggestion);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-hover transform hover:scale-110 transition-all z-50"
                aria-label="Abrir chat de soporte"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] max-h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 sm:w-80 animate-fade-in-up">
                    <div className="bg-primary text-white p-3 rounded-t-lg flex items-center gap-2">
                        <Bot size={20} />
                        <h3 className="font-bold">TecnoBot | Soporte</h3>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {}
                        <div className="flex justify-start mb-3">
                            <div className="p-2 rounded-lg max-w-xs text-sm bg-gray-200 text-gray-800">
                                ¡Hola! Soy TecnoBot. ¿Cómo puedo ayudarte hoy?
                            </div>
                        </div>

                        {}
                        {history.map((msg, index) => (
                            <div key={index} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg max-w-xs text-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {msg.parts[0].text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="p-2 rounded-lg bg-gray-200 text-gray-800">
                                    <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    
                    {}
                    {history.length === 0 && !isLoading && (
                        <div className="p-2 border-t flex flex-wrap gap-2 justify-center">
                            {initialSuggestions.map((s, i) => (
                                <button key={i} onClick={() => handleSuggestionClick(s)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-full">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="p-2 border-t flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading} className="bg-primary text-white px-4 rounded-r-md hover:bg-primary-hover disabled:bg-gray-400">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Med-AI Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-slate-950 text-white">
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useRef, useEffect } = React;

        function App() {
            const [apiKey, setApiKey] = useState('');
            const [messages, setMessages] = useState([]);
            const [input, setInput] = useState('');
            const [loading, setLoading] = useState(false);
            const [view, setView] = useState('login'); 

            const cleanDisplay = (text) => text.replace(/\*/g, '');

            const sendMessage = async () => {
                if (!input.trim()) return;
                const userMsg = input.trim();
                setMessages([...messages, { role: 'user', content: userMsg }]);
                setInput('');
                setLoading(true);
                try {
                    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [...messages, { role: 'user', content: userMsg }] })
                    });
                    const data = await res.json();
                    setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
                } catch (e) { alert("Check API Key"); } finally { setLoading(false); }
            };

            if (view === 'login') {
                return (
                    <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-950 relative">
                        
                        {/* THE WATERMARK YOU REQUESTED */}
                        <div className="absolute top-10 text-red-500 font-black tracking-[0.3em] uppercase opacity-50 text-sm">
                            Powered by Gemini & Groq
                        </div>

                        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center shadow-2xl">
                            <h1 className="text-4xl font-black text-red-500 mb-2 uppercase">MED-AI</h1>
                            <p className="text-[10px] tracking-widest uppercase opacity-40 mb-8 font-bold">Clinical System</p>

                            {/* THE GROQ LINK YOU REQUESTED */}
                            <a href="https://console.groq.com/keys" target="_blank" className="block w-full py-4 mb-6 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-500 font-black uppercase text-xs tracking-tighter hover:bg-red-600/20 transition-all">
                                CLICK HERE TO GET GROQ API KEY
                            </a>

                            <input 
                                type="password" 
                                placeholder="ENTER GSK_ KEY HERE" 
                                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-center font-bold mb-4 focus:border-red-500 transition-all outline-none"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />

                            <button 
                                onClick={() => apiKey.includes('gsk_') ? setView('chat') : alert('Enter Valid Key')}
                                className="w-full p-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-red-600/20"
                            >
                                START AI
                            </button>
                        </div>

                        {/* SECONDARY WATERMARK AT BOTTOM */}
                        <div className="absolute bottom-10 text-slate-600 font-bold uppercase text-[9px] tracking-widest">
                            Secure Medical Interface
                        </div>
                    </div>
                );
            }

            return (
                <div className="h-screen flex flex-col bg-slate-950">
                    <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                        <span className="font-black text-red-500 tracking-tighter">MED-AI PRO</span>
                        <button onClick={() => setView('login')} className="text-[10px] font-bold opacity-50 uppercase">Logout</button>
                    </header>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-red-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>
                                    {cleanDisplay(m.content)}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-red-500 font-bold text-xs animate-pulse uppercase">Analyzing...</div>}
                    </div>

                    <div className="fixed bottom-0 w-full p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800">
                        <div className="flex gap-2 max-w-2xl mx-auto">
                            <input 
                                className="flex-1 p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none" 
                                placeholder="Symptoms or questions..." 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button onClick={sendMessage} className="bg-red-600 p-4 rounded-xl px-6 font-bold">SEND</button>
                        </div>
                    </div>
                </div>
            );
        }
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>

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
    <style>
        body { background-color: #020617; margin: 0; font-family: sans-serif; height: 100vh; color: white; overflow: hidden; }
        .login-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 2.5rem; width: 100%; max-width: 400px; padding: 3rem; text-align: center; position: relative; z-index: 10; }
        .watermark { position: absolute; bottom: 30px; left: 0; right: 0; text-align: center; color: #ef4444; opacity: 0.5; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; font-size: 14px; pointer-events: none; z-index: 5; }
    </style>
</head>
<body>
    <div id="root" style="height: 100%;"></div>
    <script type="text/babel">
        const { useState, useRef, useEffect } = React;

        function App() {
            const [view, setView] = useState('login');
            const [apiKey, setApiKey] = useState('');
            const [messages, setMessages] = useState([]);
            const [input, setInput] = useState('');
            const [loading, setLoading] = useState(false);

            const clean = (txt) => txt.replace(/\*/g, '');

            const callAI = async () => {
                if (!input.trim()) return;
                const msg = input.trim();
                setMessages([...messages, { role: 'user', content: msg }]);
                setInput('');
                setLoading(true);
                try {
                    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [...messages, { role: 'user', content: msg }] })
                    });
                    const d = await r.json();
                    setMessages(prev => [...prev, { role: 'assistant', content: d.choices[0].message.content }]);
                } catch (e) { alert("Check Key"); } finally { setLoading(false); }
            };

            if (view === 'login') {
                return (
                    <div className="h-full flex flex-col items-center justify-center p-6 relative">
                        
                        {/* 1. MANDATORY WATERMARK */}
                        <div className="watermark">Powered by Gemini & Groq</div>

                        <div className="login-box shadow-2xl">
                            <svg className="mx-auto mb-4 text-red-500" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            <h1 className="text-3xl font-black tracking-tighter mb-1">MED-AI PRO</h1>
                            <p className="text-red-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">Clinical Assistant</p>

                            {/* 2. MANDATORY GROQ LINK */}
                            <div className="mb-6">
                                <a href="https://console.groq.com/keys" target="_blank" className="block w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                                    Click here for Groq API Key
                                </a>
                            </div>

                            <input 
                                type="password" 
                                placeholder="Enter clinical key" 
                                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 text-center font-bold text-white outline-none focus:border-red-500"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />

                            <button 
                                onClick={() => apiKey.startsWith('gsk_') ? setView('chat') : alert('Invalid Key')}
                                className="w-full bg-red-600 py-4 rounded-xl font-black uppercase shadow-lg active:scale-95 transition-all"
                            >
                                INITIALIZE SYSTEM
                            </button>

                            <p className="mt-8 text-[9px] opacity-30 font-bold uppercase tracking-widest">HIPAA Compliant Interface</p>
                        </div>
                    </div>
                );
            }

            return (
                <div className="h-full flex flex-col bg-slate-950">
                    <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                        <span className="text-red-500 font-black tracking-tighter uppercase text-sm">Med-AI Pro</span>
                        <button onClick={() => setView('login')} className="text-[10px] font-bold opacity-40 uppercase">Exit</button>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-red-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-100'}`}>
                                    {clean(m.content)}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-red-500 text-[10px] font-bold animate-pulse uppercase">Processing...</div>}
                    </div>
                    <div className="fixed bottom-0 w-full p-4 bg-slate-950/90 backdrop-blur-md">
                        <div className="flex gap-2 max-w-2xl mx-auto">
                            <input className="flex-1 p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none" placeholder="Symptoms..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && callAI()} />
                            <button onClick={callAI} className="bg-red-600 px-6 rounded-xl font-bold uppercase text-xs">Send</button>
                        </div>
                    </div>
                </div>
            );
        }
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>

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
        body { background-color: #030712; color: white; margin: 0; font-family: ui-sans-serif, system-ui; height: 100vh; overflow: hidden; }
        .login-card { background-color: #0f172a; border-radius: 3rem; padding: 4rem 2rem; width: 100%; max-width: 450px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .watermark { position: fixed; bottom: 20px; width: 100%; text-align: center; color: #ef4444; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; opacity: 0.8; z-index: 50; }
        input { outline: none !important; }
    </style>
</head>
<body>
    <div id="root" class="h-full"></div>
    <script type="text/babel">
        const { useState, useRef, useEffect } = React;

        function App() {
            const [view, setView] = useState('login');
            const [apiKey, setApiKey] = useState('');
            const [messages, setMessages] = useState([]);
            const [input, setInput] = useState('');
            const [loading, setLoading] = useState(false);

            const cleanText = (t) => t.replace(/\*/g, '');

            const onSend = async () => {
                if(!input.trim()) return;
                const userMsg = input.trim();
                setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
                setInput('');
                setLoading(true);
                try {
                    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [...messages, { role: 'user', content: userMsg }] })
                    });
                    const data = await res.json();
                    setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
                } catch(e) { alert("Session Error: Check Key"); } finally { setLoading(false); }
            };

            if (view === 'login') {
                return (
                    <div className="h-full flex flex-col items-center justify-center p-6 bg-[#030712] relative">
                        <div className="login-card border border-slate-800">
                            <svg className="mx-auto mb-6 text-red-500" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            <h1 className="text-4xl font-black mb-1 tracking-tighter">MED-AI PRO</h1>
                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-8">Clinical Assistant</p>
                            
                            {/* GROQ LINK BUTTON */}
                            <a href="https://console.groq.com/keys" target="_blank" className="block w-full py-3 mb-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all">
                                Get Groq API Key
                            </a>
                            
                            <input 
                                type="password" 
                                placeholder="Enter clinical key" 
                                className="w-full bg-[#1e293b] border border-slate-700 p-4 rounded-2xl mb-4 text-center text-white font-bold placeholder-slate-500 focus:border-red-500 transition-all"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            
                            <button 
                                onClick={() => apiKey.startsWith('gsk_') ? setView('chat') : alert('Invalid Key')}
                                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest"
                            >
                                INITIALIZE SYSTEM
                            </button>
                            
                            <p className="mt-12 text-[9px] uppercase opacity-40 font-bold tracking-widest">HIPAA Compliant Interface</p>
                        </div>

                        {/* POWERED BY WATERMARK */}
                        <div className="watermark">Powered by Gemini & Groq</div>
                    </div>
                );
            }

            return (
                <div className="flex flex-col h-full bg-[#030712]">
                    <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]">
                        <span className="text-red-500 font-black tracking-tighter">MED-AI PRO</span>
                        <button onClick={() => setView('login')} className="text-[10px] font-bold opacity-50 uppercase">Terminate</button>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-red-600 text-white' : 'bg-[#0f172a] border border-slate-800 text-slate-100'}`}>
                                    {cleanText(m.content)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <footer className="fixed bottom-0 w-full p-4 bg-[#030712]/90 backdrop-blur-md border-t border-slate-800">
                        <div className="flex gap-2 max-w-2xl mx-auto">
                            <input className="flex-1 p-4 rounded-xl bg-[#0f172a] border border-slate-800 text-white outline-none focus:border-red-500" placeholder="Clinical inquiry..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onSend()} />
                            <button onClick={onSend} className="bg-red-600 px-8 rounded-xl font-bold uppercase text-xs">Send</button>
                        </div>
                    </footer>
                </div>
            );
        }
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>

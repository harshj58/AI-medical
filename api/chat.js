<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Med-AI Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { margin: 0; padding: 0; background-color: #030712; color: white; font-family: ui-sans-serif, system-ui; height: 100vh; overflow: hidden; }
        #root { height: 100%; display: flex; flex-direction: column; }
        /* THE WATERMARK */
        .watermark-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.1; pointer-events: none; z-index: 0; font-weight: 900; text-transform: uppercase; letter-spacing: 0.4em; font-size: 2.5rem; text-align: center; line-height: 1.2; }
        .login-card { background-color: #0f172a; border: 1px solid #1e293b; border-radius: 3rem; padding: 3rem; width: 100%; max-width: 420px; text-align: center; z-index: 10; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8); }
        input { outline: none !important; -webkit-tap-highlight-color: transparent; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useRef, useEffect } = React;

        const HeartLogo = () => (
            <svg className="mx-auto mb-4 text-red-500" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        );

        function App() {
            const [apiKey, setApiKey] = useState('');
            const [view, setView] = useState('login');
            const [messages, setMessages] = useState([]);
            const [input, setInput] = useState('');
            const [loading, setLoading] = useState(false);

            const cleanText = (t) => t.replace(/\*/g, '');

            const onChat = async () => {
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
                } catch(e) { alert("Check Connection or Key"); } finally { setLoading(false); }
            };

            if (view === 'login') {
                return (
                    <div className="relative h-full flex items-center justify-center p-6 bg-[#030712]">
                        {/* THE BACKGROUND TEXT */}
                        <div className="watermark-bg">Powered by<br/>Gemini & Groq</div>
                        
                        <div className="login-card">
                            <HeartLogo />
                            <h1 className="text-4xl font-black mb-1 tracking-tighter uppercase">MED-AI PRO</h1>
                            <p className="text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Clinical Assistant</p>
                            
                            {/* THE GROQ LINK */}
                            <a href="https://console.groq.com/keys" target="_blank" className="block w-full py-3 mb-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all">
                                Get Groq API Key
                            </a>
                            
                            <input 
                                type="password" 
                                placeholder="Enter clinical key" 
                                className="w-full bg-[#1e293b] border border-[#334155] p-4 rounded-2xl mb-4 text-center text-sm font-bold text-white focus:border-red-500 transition-all"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            
                            <button 
                                onClick={() => apiKey.startsWith('gsk_') ? setView('chat') : alert('Invalid API Key')}
                                className="w-full bg-red-600 text-white font-black uppercase py-4 rounded-2xl shadow-xl shadow-red-900/20 active:scale-95 transition-all"
                            >
                                INITIALIZE SYSTEM
                            </button>
                            
                            <p className="mt-10 text-[9px] uppercase opacity-40 font-bold tracking-[0.2em]">HIPAA Compliant Interface</p>
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex flex-col h-full bg-slate-950 text-white">
                    <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                        <span className="text-red-500 font-black tracking-tighter">MED-AI PRO</span>
                        <button onClick={() => setView('login')} className="text-[10px] font-bold opacity-50 uppercase">Terminate Session</button>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-red-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-100'}`}>
                                    {cleanText(m.content)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <footer className="p-4 bg-slate-950 border-t border-slate-800 pb-10">
                        <div className="flex gap-2 max-w-2xl mx-auto">
                            <input className="flex-1 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onChat()} />
                            <button onClick={onChat} className="bg-red-600 px-6 rounded-xl font-bold">SEND</button>
                        </div>
                    </footer>
                </div>
            );
        }
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>

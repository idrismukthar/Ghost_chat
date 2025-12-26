import React, {useState, useEffect, useRef} from 'react';
import * as API from '../wailsjs/go/main/App';
import {EventsOn} from '../wailsjs/runtime/runtime';

// Import local sounds
import sApple from './assets/sounds/applepay.mp3';
import sDiscord from './assets/sounds/discord.mp3';
import sFart from './assets/sounds/fart.mp3';
import sFears from './assets/sounds/fears.mp3';
import sIphone from './assets/sounds/iphone_notis.mp3';
import sRizz from './assets/sounds/rizz.mp3';
import sVine from './assets/sounds/vine.mp3';
import sWhatsapp from './assets/sounds/whatsapp.mp3';
import sWrong from './assets/sounds/wrong.mp3';

function App() {
    const [name, setName] = useState('Ghost' + Math.floor(Math.random()*100));
    const [port, setPort] = useState('9999');
    const [ip, setIp] = useState('127.0.0.1');
    const [key, setKey] = useState('ghost_chat_secure_32_char_key!!');
    const [messages, setMessages] = useState([]);
    const [inChat, setInChat] = useState(false);
    const [isServer, setIsServer] = useState(false);
    const [text, setText] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [wallpaper, setWallpaper] = useState(null);

    const [config, setConfig] = useState({
        theme: 'hacker',
        bgMode: 'emoji', // 'emoji' or 'wallpaper'
        emoji: '👻',
        opacity: 0.2,
        blur: 1,
        emojiRotate: -15,
        emojiGap: 80,
        sound: 'discord',
        isMuted: false
    });

    const sounds = {
        apple: sApple, discord: sDiscord, fart: sFart, fears: sFears,
        iphone: sIphone, rizz: sRizz, vine: sVine, whatsapp: sWhatsapp, wrong: sWrong
    };

    const themes = {
        hacker: { bg: '#000', text: '#0f0', accent: '#0a0', panel: 'rgba(0,25,0,0.9)' },
        cyber: { bg: '#2b0035', text: '#ff00ff', accent: '#00ffff', panel: 'rgba(43,0,53,0.9)' },
        dracula: { bg: '#282a36', text: '#f8f8f2', accent: '#bd93f9', panel: 'rgba(68,71,90,0.9)' },
        nord: { bg: '#2e3440', text: '#eceff4', accent: '#88c0d0', panel: 'rgba(59,66,82,0.9)' },
        blood: { bg: '#1a0000', text: '#ff4d4d', accent: '#990000', panel: 'rgba(40,0,0,0.9)' },
        toxic: { bg: '#0d1a00', text: '#adff2f', accent: '#32cd32', panel: 'rgba(13,26,0,0.9)' }
    };
    const activeTheme = themes[config.theme] || themes.hacker;

    const audioRef = useRef(null);

    useEffect(() => {
        const quit = EventsOn("new_message", (msg) => {
            setMessages(prev => {
                if (prev.length > 0 && prev[prev.length - 1] === msg) return prev;
                return [...prev, msg];
            });

            // SOUND LOGIC: Only play if NOT from me
            const myTag = `[${name}]:`;
            if(audioRef.current && !config.isMuted && !msg.startsWith(myTag)) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
            }
        });
        return () => quit();
    }, [name, config.isMuted]);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setWallpaper(reader.result);
                setConfig({...config, bgMode: 'wallpaper'});
            };
            reader.readAsDataURL(file);
        }
    };

    const generateKey = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let res = "";
        for (let i = 0; i < 32; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        setKey(res);
    };

    const sendMessage = () => {
        if (text.trim() !== "") {
            API.SendMessage(text, name, isServer);
            setText('');
        }
    };

    // BACKGROUND STYLING
    const backgroundLayer = {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 0, opacity: config.opacity, filter: `blur(${config.blur}px)`,
        pointerEvents: 'none'
    };

    const emojiBg = {
        ...backgroundLayer,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg width='${config.emojiGap}' height='${config.emojiGap}' xmlns='http://www.w3.org/2000/svg'><text x='50%' y='50%' font-size='25' text-anchor='middle' dominant-baseline='middle'>${config.emoji}</text></svg>`)}")`,
        backgroundRepeat: 'repeat',
        transform: `scale(1.2) rotate(${config.emojiRotate}deg)`,
        display: config.bgMode === 'emoji' ? 'block' : 'none'
    };

    const wallpaperBg = {
        ...backgroundLayer,
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: config.bgMode === 'wallpaper' ? 'block' : 'none'
    };

    if (!inChat) {
        return (
            <div style={{padding: '30px', background: '#050505', color: '#0f0', height: '100vh', fontFamily: 'monospace', overflowY: 'auto'}}>
                <h1 style={{borderBottom: '2px solid #0f0', paddingBottom: '10px'}}>GHOST_CHAT V2</h1>
                <div style={formGroup}><label>NICKNAME</label><input value={name} onChange={e=>setName(e.target.value)} style={setupInput}/></div>
                <div style={formGroup}><label>PORT</label><input value={port} onChange={e=>setPort(e.target.value)} style={setupInput}/></div>
                <div style={formGroup}><label>32-CHAR KEY</label>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input value={key} onChange={e=>setKey(e.target.value)} style={{...setupInput, flex: 1}}/>
                        <button onClick={generateKey} style={{...setupBtn, width: '80px'}}>GEN</button>
                    </div>
                </div>
                <button onClick={() => API.StartHost(name, port, 10, key).then(r=>r.includes("✅")&&(setInChat(true),setIsServer(true)))} style={setupBtn}>HOST SERVER</button>
                <div style={{margin: '20px 0', textAlign: 'center', opacity: 0.4}}>-----------------------------</div>
                <div style={formGroup}><label>TARGET IP</label><input value={ip} onChange={e=>setIp(e.target.value)} style={setupInput}/></div>
                <button onClick={() => API.JoinRoom(ip, port, name, key).then(r=>r.includes("✅")&&setInChat(true))} style={{...setupBtn, background: '#333', color: '#fff'}}>JOIN ROOM</button>
            </div>
        );
    }

    return (
        <div style={{backgroundColor: activeTheme.bg, color: activeTheme.text, height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'monospace'}}>
            <div style={emojiBg}></div>
            <div style={wallpaperBg}></div>
            <audio ref={audioRef} src={sounds[config.sound]} />
            
            <div style={{position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100vh'}}>
                <div style={{padding: '10px 20px', background: activeTheme.panel, display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${activeTheme.accent}`}}>
                    <span>GHOST: {name} | {isServer ? 'HOST' : 'CLIENT'}</span>
                    <div>
                        <button onClick={() => setConfig({...config, isMuted: !config.isMuted})} style={{...miniBtn, background: config.isMuted ? '#f00' : '#444'}}>
                            {config.isMuted ? '🔇' : '🔊'}
                        </button>
                        <button onClick={() => setShowSettings(true)} style={{...miniBtn, marginLeft:'5px'}}>⚙️ CONFIG</button>
                        <button onClick={() => API.KillGhost(isServer)} style={{...miniBtn, background: '#f00', marginLeft:'5px'}}>KILL</button>
                    </div>
                </div>

                <div style={{flex: 1, overflowY: 'auto', padding: '20px'}}>
                    {messages.map((m, i) => <div key={i} style={{marginBottom: '10px', padding: '12px', background: 'rgba(0,0,0,0.7)', borderLeft: `4px solid ${activeTheme.accent}`, borderRadius: '4px'}}>{m}</div>)}
                </div>

                <div style={{padding: '20px', background: activeTheme.panel, display: 'flex', gap: '10px'}}>
                    <input style={{flex: 1, background: '#000', color: activeTheme.text, border: `1px solid ${activeTheme.accent}`, padding: '12px', outline: 'none', borderRadius: '4px'}}
                        value={text} onChange={e=>setText(e.target.value)} 
                        onKeyDown={e=>e.key === 'Enter' && sendMessage()}
                        placeholder="Transmit data..." />
                    <button onClick={sendMessage} style={{background: activeTheme.accent, border: 'none', padding: '0 25px', cursor: 'pointer', fontSize: '20px', borderRadius: '4px'}}>👻</button>
                </div>
            </div>

            {showSettings && (
                <div style={modalOverlay}>
                    <div style={{...modalContent, background: activeTheme.panel, border: `2px solid ${activeTheme.accent}`}}>
                        <h3 style={{marginTop: 0}}>SYSTEM CONFIG</h3>
                        
                        <label>BG MODE</label>
                        <select value={config.bgMode} onChange={e=>setConfig({...config, bgMode: e.target.value})} style={modalInput}>
                            <option value="emoji">EMOJI GRID</option>
                            <option value="wallpaper">CUSTOM WALLPAPER</option>
                        </select>

                        <label>UPLOAD WALLPAPER</label>
                        <input type="file" accept="image/*" onChange={handleFile} style={{...modalInput, fontSize: '12px'}}/>

                        <div style={{display: 'flex', gap: '10px'}}>
                            <div style={{flex: 1}}>
                                <label>OPACITY ({config.opacity})</label>
                                <input type="range" min="0" max="1" step="0.1" value={config.opacity} onChange={e=>setConfig({...config, opacity: e.target.value})} style={{width:'100%'}}/>
                            </div>
                            <div style={{flex: 1}}>
                                <label>BLUR ({config.blur}px)</label>
                                <input type="range" min="0" max="20" value={config.blur} onChange={e=>setConfig({...config, blur: e.target.value})} style={{width:'100%'}}/>
                            </div>
                        </div>

                        <label>THEME</label>
                        <select value={config.theme} onChange={e=>setConfig({...config, theme: e.target.value})} style={modalInput}>
                            {Object.keys(themes).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                        </select>

                        <label>NOTIFICATION SOUND</label>
                        <select value={config.sound} onChange={e=>setConfig({...config, sound: e.target.value})} style={modalInput}>
                            {Object.keys(sounds).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                        </select>

                        <button onClick={() => setShowSettings(false)} style={{...setupBtn, marginTop: '20px', width: '100%'}}>SAVE & EXIT</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const formGroup = { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' };
const setupInput = { padding: '12px', background: '#111', color: '#0f0', border: '1px solid #333', borderRadius: '4px' };
const setupBtn = { padding: '12px', background: '#0f0', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' };
const miniBtn = { padding: '5px 10px', background: '#444', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modalContent = { width: '420px', padding: '25px', color: '#fff', borderRadius: '8px' };
const modalInput = { width: '100%', padding: '10px', margin: '8px 0 15px 0', background: '#000', color: 'inherit', border: '1px solid #555', borderRadius: '4px' };

export default App;
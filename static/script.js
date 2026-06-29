/* ============================================================
   MIKU x RAIN — 前端逻辑
   数据从 Python 后端 (FastAPI) 拉取;后端不可用时回退到本地内置数据。
   ============================================================ */

/* 本地回退数据:直接双击 index.html(没开后端)时也能看到内容 */
const FALLBACK_WIKI = [
    { title: "初音未来", desc: "Crypton 旗下 VOCALOID2 虚拟歌姬,象征色 #39C5BB。", tag: "角色" },
    { title: "RAIN", desc: "本站原创主题角色,代表雨夜与电子。", tag: "原创" },
    { title: "VOCALOID", desc: "Yamaha 开发的歌声合成技术。", tag: "技术" },
    { title: "Magical Mirai", desc: "初音未来官方年度演唱会。", tag: "活动" },
    { title: "Glassmorphism", desc: "本站采用的毛玻璃 UI 设计风格。", tag: "设计" },
    { title: "Cyberpunk", desc: "霓虹 + 暗黑的未来主义视觉风格。", tag: "设计" },
];

let WIKI_DATA = [];

/* ========== 后端状态指示灯 ========== */
const statusDot = document.getElementById('api-status');
function setStatus(online) {
    statusDot.classList.toggle('online', online);
    statusDot.classList.toggle('offline', !online);
    statusDot.title = online ? '后端已连接' : '后端离线(使用本地数据)';
}

/* ========== 从后端加载 Wiki 数据(失败则回退) ========== */
async function loadWiki() {
    try {
        const res = await fetch('/api/wiki');
        if (!res.ok) throw new Error('bad status');
        WIKI_DATA = await res.json();
        setStatus(true);
    } catch (e) {
        WIKI_DATA = FALLBACK_WIKI;
        setStatus(false);
    }
    renderWiki(WIKI_DATA);
}

/* ========== 渲染 Wiki 卡片 ========== */
const grid = document.getElementById('wiki-grid');
function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function renderWiki(list) {
    if (!list.length) { grid.innerHTML = '<p class="no-result">// 未找到匹配的条目</p>'; return; }
    grid.innerHTML = list.map(item => `
        <div class="wiki-item">
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.desc)}</p>
            <span class="tag">${escapeHTML(item.tag)}</span>
        </div>`).join('');
}

/* ========== 功能 1: Tab 切换(含滑动方向 + 本地记忆) ========== */
const tabOrder = ['view-welcome', 'view-wiki', 'view-guestbook', 'view-about'];
function switchTo(targetId) {
    const curBtn = document.querySelector('.tab-btn.active');
    const curId = curBtn ? curBtn.dataset.target : tabOrder[0];
    if (curId === targetId) return;
    const goingBack = tabOrder.indexOf(targetId) < tabOrder.indexOf(curId);
    curBtn?.classList.remove('active');
    document.querySelector(`[data-target="${targetId}"]`)?.classList.add('active');
    const curView = document.querySelector('.view.active');
    curView?.classList.remove('active');
    const newView = document.getElementById(targetId);
    newView.classList.toggle('reverse', goingBack);
    newView.classList.add('active');
    localStorage.setItem('miku_tab', targetId);
    if (targetId === 'view-guestbook') loadMessages();   // 进留言板时刷新
}
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTo(btn.dataset.target));
});

/* ========== 功能 2: 搜索过滤 ========== */
const searchInput = document.getElementById('global-search');
function filterWiki(kw) {
    kw = kw.trim().toLowerCase();
    return WIKI_DATA.filter(i =>
        i.title.toLowerCase().includes(kw) ||
        i.desc.toLowerCase().includes(kw) ||
        i.tag.toLowerCase().includes(kw)
    );
}
function doSearch() {
    renderWiki(filterWiki(searchInput.value));
    switchTo('view-wiki');
}
searchInput.addEventListener('input', () => renderWiki(filterWiki(searchInput.value)));
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
document.getElementById('search-btn').addEventListener('click', doSearch);

/* ========== 功能 3: 音乐控件 ========== */
const audio = new Audio('miku.mp3');
audio.loop = true;
const toggle = document.getElementById('audio-toggle');
const label = document.getElementById('audio-label');
toggle.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(() => alert('请将音乐文件命名为 miku.mp3 放在 static 目录'));
        toggle.classList.add('active');
        toggle.textContent = '❚❚ PAUSE';
        label.textContent = 'SOUND ON';
    } else {
        audio.pause();
        toggle.classList.remove('active');
        toggle.textContent = '♪ PLAY';
        label.textContent = 'SOUND OFF';
    }
});

/* ========== 功能 4: 暗/亮主题切换(本地记忆) ========== */
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }
    localStorage.setItem('miku_theme', theme);
}
themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'light' ? 'dark' : 'light');
});

/* ========== 功能 5: Guestbook 留言板(读写 Python 后端) ========== */
const msgList = document.getElementById('msg-list');
async function loadMessages() {
    try {
        const res = await fetch('/api/messages');
        if (!res.ok) throw new Error('bad status');
        const msgs = await res.json();
        renderMessages(msgs);
        setStatus(true);
    } catch (e) {
        msgList.innerHTML = '<p class="no-result">// 留言板需要启动 Python 后端(见 README)</p>';
        setStatus(false);
    }
}
function renderMessages(msgs) {
    if (!msgs.length) { msgList.innerHTML = '<p class="no-result">// 还没有留言,来做第一个吧</p>'; return; }
    msgList.innerHTML = msgs.map(m => `
        <div class="msg-item">
            <div class="meta">${escapeHTML(m.name)} · ${escapeHTML(m.time)}</div>
            <div class="body">${escapeHTML(m.message)}</div>
        </div>`).join('');
}
document.getElementById('guestbook-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('gb-name').value.trim();
    const message = document.getElementById('gb-msg').value.trim();
    if (!name || !message) return;
    try {
        const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message })
        });
        if (!res.ok) throw new Error('bad status');
        document.getElementById('gb-name').value = '';
        document.getElementById('gb-msg').value = '';
        loadMessages();
    } catch (err) {
        alert('发送失败:请确认 Python 后端已启动(见 README)');
    }
});

/* ========== 启动时恢复上次状态 ========== */
(function restore() {
    applyTheme(localStorage.getItem('miku_theme') || 'dark');
    const lastTab = localStorage.getItem('miku_tab');
    if (lastTab && lastTab !== 'view-welcome') switchTo(lastTab);
})();
loadWiki();

/* ========== 背景:赛博雨滴(贴合 RAIN 主题) ========== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let drops = [];
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);
function makeDrops() {
    drops = [];
    const count = Math.min(260, Math.floor(innerWidth / 5));
    for (let i = 0; i < count; i++) {
        const depth = Math.random();               // 0=远(慢/细/暗) 1=近(快/长/亮)
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            len: 8 + depth * 18,
            speed: 4 + depth * 12,
            slant: 1.0 + depth * 0.6,               // 轻微斜飘
            alpha: 0.08 + depth * 0.28,
            tint: Math.random() > 0.85               // 少量粉色雨丝点缀
        });
    }
}
makeDrops();
addEventListener('resize', makeDrops);
function rain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.slant, d.y + d.len);
        ctx.strokeStyle = d.tint ? `rgba(255,20,147,${d.alpha})` : `rgba(150,230,225,${d.alpha})`;
        ctx.stroke();
        d.y += d.speed; d.x += d.slant * 0.4;
        if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(rain);
}
rain();

/* ========== Hero 底部音频波形(播放时更激烈) ========== */
const wave = document.getElementById('waveform');
if (wave) {
    const wctx = wave.getContext('2d');
    function wresize() { wave.width = wave.offsetWidth; wave.height = wave.offsetHeight; }
    wresize(); addEventListener('resize', wresize);
    let t = 0;
    function drawWave() {
        wresize._w = wave.width;
        wctx.clearRect(0, 0, wave.width, wave.height);
        const mid = wave.height * 0.6;
        const energy = audio && !audio.paused ? 1 : 0.4;   // 放音乐时波形更high
        const bars = Math.floor(wave.width / 6);
        for (let i = 0; i < bars; i++) {
            const x = i * 6;
            const n = Math.sin(i * 0.25 + t) * Math.sin(i * 0.07 + t * 0.6);
            const h = (8 + Math.abs(n) * 46 * energy);
            const grad = wctx.createLinearGradient(0, mid - h, 0, mid + h);
            grad.addColorStop(0, 'rgba(57,197,187,0.0)');
            grad.addColorStop(0.5, `rgba(57,197,187,${0.5 * energy + 0.2})`);
            grad.addColorStop(1, 'rgba(255,20,147,0.0)');
            wctx.fillStyle = grad;
            wctx.fillRect(x, mid - h, 3, h * 2);
        }
        t += 0.08;
        requestAnimationFrame(drawWave);
    }
    drawWave();
}

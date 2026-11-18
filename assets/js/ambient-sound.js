// ==========================================
// ÂM THANH KHÔNG GIAN THEO ĐỊA ĐIỂM & THỜI TIẾT (WEB AUDIO API)
// Không cần file MP3, hoạt động 100% offline, crossfade mượt
// ==========================================
const AMBIENT_MOODS = {
  ocean:    { icon: '🌊', label: 'Sóng biển' },
  rain:     { icon: '🌧️', label: 'Mưa rơi' },
  storm:    { icon: '⛈️', label: 'Mưa dông' },
  mountain: { icon: '🏔️', label: 'Gió núi & Suối' },
  night:    { icon: '🌙', label: 'Đêm yên tĩnh' },
  sunny:    { icon: '🍃', label: 'Gió nhẹ & Chim hót' }
};

let ambientCtx = null;
let ambientMaster = null;
let ambientEnabled = true;
let ambientVolume = 0.45;
let ambientOverride = 'auto'; // 'auto' | key of AMBIENT_MOODS
let ambientActiveMood = null;
let ambientPlaceName = '';
let ambientLastScene = 'partly-day';
let ambientCurrentStopper = null;
let ambientNoiseBuf = null;
let ambientWaitingGesture = false;

function detectAmbientMood(placeName, scene) {
  if (scene === 'storm') return 'storm';
  if (scene === 'rain-light' || scene === 'rain' || scene === 'rain-heavy') return 'rain';
  if (scene === 'fog' || scene === 'snow') return 'mountain';

  const norm = (typeof removeAccents === 'function' ? removeAccents(placeName || '') : String(placeName || '').toLowerCase());
  const coastalRe = /bien|dao|vinh|da nang|cat ba|ha long|do son|sam son|quy nhon|phu quoc|nha trang|vung tau|con dao|mui ne|phan thiet|hoi an|phu yen|ninh thuan|ha tinh|khanh hoa|quang ninh|hai phong|binh dinh/;
  const mountainRe = /sa pa|sapa|da lat|ta xua|moc chau|mang den|ba vi|cuc phuong|mai chau|cao bang|ha giang|khoang xanh|thien son|suoi|thac|deo|nui|trang an|quang binh|phong nha|lam dong|son la|lao cai|kon tum|yen bai|hoa binh/;

  if (coastalRe.test(norm)) return 'ocean';
  if (mountainRe.test(norm)) return 'mountain';
  if (scene === 'clear-night' || scene === 'partly-night' || scene === 'cloudy-night') return 'night';
  return 'sunny';
}

function getPinkNoiseBuffer(ctx) {
  if (ambientNoiseBuf && ambientNoiseBuf.sampleRate === ctx.sampleRate) return ambientNoiseBuf;
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const out = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520;
    b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.0168980;
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.08;
    b6 = w * 0.115926;
  }
  ambientNoiseBuf = buf;
  return buf;
}

function createLoopNoise(ctx) {
  const src = ctx.createBufferSource();
  src.buffer = getPinkNoiseBuffer(ctx);
  src.loop = true;
  return src;
}

// Tạo từng khung cảnh âm thanh mềm mượt bằng Web Audio API
function startMoodGraph(mood) {
  if (!ambientCtx || !ambientMaster) return null;
  const ctx = ambientCtx;
  const now = ctx.currentTime;
  const groupGain = ctx.createGain();
  groupGain.gain.setValueAtTime(0.0001, now);
  groupGain.gain.linearRampToValueAtTime(1.0, now + 0.9);
  groupGain.connect(ambientMaster);

  const nodes = [];
  const timers = [];

  const track = n => { nodes.push(n); return n; };

  if (mood === 'ocean') {
    // Sóng biển rì rào: 2 lớp sóng đánh vào bờ & rút ra theo nhịp chậm ~9 giây
    const src = track(createLoopNoise(ctx));
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 380;
    lp.Q.value = 0.7;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.55;

    const lfo = track(ctx.createOscillator());
    lfo.frequency.value = 0.115; // ~8.7s / đợt sóng
    const lfoFreq = ctx.createGain();
    lfoFreq.gain.value = 260;
    const lfoAmp = ctx.createGain();
    lfoAmp.gain.value = 0.34;

    lfo.connect(lfoFreq).connect(lp.frequency);
    lfo.connect(lfoAmp).connect(waveGain.gain);
    src.connect(lp).connect(waveGain).connect(groupGain);
    src.start();
    lfo.start();

    // Lớp bọt sóng xa nhẹ
    const foam = track(createLoopNoise(ctx));
    const hp = ctx.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.value = 1150;
    hp.Q.value = 0.6;
    const foamGain = ctx.createGain();
    foamGain.gain.value = 0.12;
    foam.connect(hp).connect(foamGain).connect(groupGain);
    foam.start();
  } else if (mood === 'rain' || mood === 'storm') {
    // Tiếng mưa rơi đều êm tai
    const src = track(createLoopNoise(ctx));
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = mood === 'storm' ? 1050 : 1400;
    bp.Q.value = 0.45;
    const rainGain = ctx.createGain();
    rainGain.gain.value = mood === 'storm' ? 0.62 : 0.45;
    src.connect(bp).connect(rainGain).connect(groupGain);
    src.start();

    // Tí tách hạt mưa nhẹ rơi
    const dropTimer = setInterval(() => {
      if (!ambientCtx || !ambientEnabled) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      const f = 900 + Math.random() * 1400;
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.55, t + 0.045);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.028, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
      o.connect(g).connect(groupGain);
      o.start(t);
      o.stop(t + 0.06);
    }, mood === 'storm' ? 320 : 520);
    timers.push(dropTimer);

    // Sấm rền xa nhẹ cho mưa dông
    if (mood === 'storm') {
      const triggerThunder = () => {
        if (!ambientCtx || !ambientEnabled) return;
        const t = ctx.currentTime;
        const th = createLoopNoise(ctx);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(95, t);
        lp.frequency.exponentialRampToValueAtTime(42, t + 3.2);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.85, t + 0.45);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
        th.connect(lp).connect(g).connect(groupGain);
        th.start(t);
        th.stop(t + 3.7);
      };
      timers.push(setTimeout(triggerThunder, 1600));
      timers.push(setInterval(triggerThunder, 9500));
    }
  } else if (mood === 'mountain') {
    // Gió núi thổi qua rừng thông + tiếng suối róc rách xa
    const wind = track(createLoopNoise(ctx));
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 390;
    bp.Q.value = 2.4;
    const wg = ctx.createGain();
    wg.gain.value = 0.42;

    const lfo = track(ctx.createOscillator());
    lfo.frequency.value = 0.09;
    const lfoF = ctx.createGain();
    lfoF.gain.value = 170;
    lfo.connect(lfoF).connect(bp.frequency);
    wind.connect(bp).connect(wg).connect(groupGain);
    wind.start();
    lfo.start();

    // Suối chảy nhẹ
    const stream = track(createLoopNoise(ctx));
    const sbp = ctx.createBiquadFilter();
    sbp.type = 'bandpass';
    sbp.frequency.value = 1950;
    sbp.Q.value = 1.2;
    const sg = ctx.createGain();
    sg.gain.value = 0.14;
    stream.connect(sbp).connect(sg).connect(groupGain);
    stream.start();
  } else if (mood === 'night') {
    // Đêm yên tĩnh: gió đêm rất nhẹ + tiếng dế kêu dịu xa xa
    const air = track(createLoopNoise(ctx));
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 260;
    const ag = ctx.createGain();
    ag.gain.value = 0.25;
    air.connect(lp).connect(ag).connect(groupGain);
    air.start();

    const cricketTimer = setInterval(() => {
      if (!ambientCtx || !ambientEnabled || Math.random() > 0.65) return;
      const base = ctx.currentTime;
      const pulses = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < pulses; i++) {
        const t = base + i * 0.085;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 4150 + Math.random() * 140;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.018, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        o.connect(g).connect(groupGain);
        o.start(t);
        o.stop(t + 0.065);
      }
    }, 1800);
    timers.push(cricketTimer);
  } else {
    // Nắng nhẹ: gió hiu hiu + tiếng chim hót thưa thoáng
    const breeze = track(createLoopNoise(ctx));
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 460;
    bp.Q.value = 1.6;
    const bg = ctx.createGain();
    bg.gain.value = 0.22;
    breeze.connect(bp).connect(bg).connect(groupGain);
    breeze.start();

    const birdTimer = setInterval(() => {
      if (!ambientCtx || !ambientEnabled || Math.random() > 0.55) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      const f1 = 2200 + Math.random() * 900;
      o.frequency.setValueAtTime(f1, t);
      o.frequency.exponentialRampToValueAtTime(f1 * 1.32, t + 0.07);
      o.frequency.exponentialRampToValueAtTime(f1 * 0.92, t + 0.16);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.025, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(groupGain);
      o.start(t);
      o.stop(t + 0.19);
    }, 2400);
    timers.push(birdTimer);
  }

  return () => {
    timers.forEach(id => { clearInterval(id); clearTimeout(id); });
    try {
      const t = ctx.currentTime;
      groupGain.gain.cancelScheduledValues(t);
      groupGain.gain.setValueAtTime(Math.max(0.0001, groupGain.gain.value), t);
      groupGain.gain.linearRampToValueAtTime(0.0001, t + 0.6);
      setTimeout(() => {
        nodes.forEach(n => { try { n.stop(); } catch (e) { } });
        try { groupGain.disconnect(); } catch (e) { }
      }, 650);
    } catch (e) { }
  };
}

function ensureAudioContext() {
  if (!ambientCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    ambientCtx = new AudioCtx();
    ambientMaster = ambientCtx.createGain();
    ambientMaster.gain.value = ambientVolume;
    ambientMaster.connect(ambientCtx.destination);
    ambientCtx.onstatechange = () => {
      ambientWaitingGesture = ambientCtx.state !== 'running';
      renderAmbientWidget();
    };
  }
  if (ambientCtx.state === 'suspended') {
    ambientWaitingGesture = true;
    ambientCtx.resume().then(() => {
      ambientWaitingGesture = ambientCtx.state !== 'running';
      renderAmbientWidget();
    }).catch(() => { });
  } else {
    ambientWaitingGesture = false;
  }
  return true;
}

function bindFirstGestureAudioUnlock() {
  const unlock = () => {
    if (!ambientEnabled) return;
    if (ensureAudioContext() && ambientCtx && ambientCtx.state === 'running') {
      ambientWaitingGesture = false;
      if (!ambientCurrentStopper) applyAmbientMood(true);
      else renderAmbientWidget();
      ['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.removeEventListener(ev, unlock, true));
    }
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, unlock, true));
}

function applyAmbientMood(force = false) {
  if (!ambientEnabled) {
    if (ambientCurrentStopper) {
      ambientCurrentStopper();
      ambientCurrentStopper = null;
    }
    ambientActiveMood = null;
    renderAmbientWidget();
    return;
  }

  const desired = ambientOverride === 'auto'
    ? detectAmbientMood(ambientPlaceName, ambientLastScene)
    : ambientOverride;

  if (desired !== ambientActiveMood || force) {
    if (ambientCurrentStopper) {
      ambientCurrentStopper();
      ambientCurrentStopper = null;
    }
    ambientActiveMood = desired;
    ambientCurrentStopper = startMoodGraph(desired);
  }
  renderAmbientWidget();
}

function toggleAmbientSound() {
  if (!ambientEnabled) {
    if (!ensureAudioContext()) {
      showToast('Trình duyệt không hỗ trợ Web Audio API.');
      return;
    }
    ambientEnabled = true;
    applyAmbientMood(true);
    const info = AMBIENT_MOODS[ambientActiveMood] || AMBIENT_MOODS.sunny;
    showToast(`${info.icon} Đã bật âm thanh không gian: ${info.label}`);
  } else {
    ambientEnabled = false;
    applyAmbientMood();
  }
}

function setAmbientVolume(val) {
  ambientVolume = Math.max(0, Math.min(1, Number(val) / 100));
  if (ambientMaster && ambientCtx) {
    ambientMaster.gain.setTargetAtTime(ambientVolume, ambientCtx.currentTime, 0.05);
  }
}

function setAmbientMoodOverride(val) {
  ambientOverride = val || 'auto';
  if (!ambientEnabled) {
    if (!ensureAudioContext()) return;
    ambientEnabled = true;
  }
  applyAmbientMood(true);
}

function updateAmbientSoundForPlace(placeName, scene) {
  ambientPlaceName = placeName || '';
  ambientLastScene = scene || 'partly-day';
  if (ambientEnabled && ambientOverride === 'auto') {
    applyAmbientMood(false);
  } else {
    renderAmbientWidget();
  }
}

function renderAmbientWidget() {
  const pill = document.getElementById('ambient-sound-widget');
  if (!pill) return;
  const moodKey = ambientOverride === 'auto'
    ? detectAmbientMood(ambientPlaceName, ambientLastScene)
    : ambientOverride;
  const info = AMBIENT_MOODS[moodKey] || AMBIENT_MOODS.sunny;

  if (!ambientEnabled) {
    pill.innerHTML = `
      <button onclick="toggleAmbientSound()"
        class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/92 hover:bg-white backdrop-blur-md text-stone-700 border border-stone-200/90 shadow-lg text-xs font-semibold transition"
        title="Bật âm thanh không gian theo vùng & thời tiết đang xem">
        <span class="text-sm">${info.icon}</span>
        <span>Âm thanh không gian</span>
        <i class="fa-solid fa-volume-xmark text-stone-400 text-[11px]"></i>
      </button>`;
    return;
  }

  const placeTag = (ambientOverride === 'auto' && ambientPlaceName) ? ` · ${escapeHtml(ambientPlaceName)}` : '';
  const hint = ambientWaitingGesture ? ' <span class="text-[9px] text-amber-300/90 font-normal">(chạm trang để phát)</span>' : '';
  pill.innerHTML = `
    <div class="flex flex-wrap items-center gap-2 px-3 py-2 rounded-2xl bg-stone-900/88 backdrop-blur-md text-white border border-white/15 shadow-xl text-xs">
      <button onclick="toggleAmbientSound()"
        class="w-7 h-7 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 flex items-center justify-center shrink-0 transition"
        title="Tắt âm thanh">
        <span class="ambient-eq"><i></i><i></i><i></i></span>
      </button>
      <div class="min-w-0 max-w-[175px]">
        <div class="font-bold text-[11px] truncate">${info.icon} ${info.label}${placeTag}${hint}</div>
        <div class="flex items-center gap-1.5 mt-0.5">
          <input type="range" min="5" max="100" value="${Math.round(ambientVolume * 100)}"
            oninput="setAmbientVolume(this.value)"
            class="w-20 h-1 accent-amber-400 cursor-pointer" title="Âm lượng">
          <select onchange="setAmbientMoodOverride(this.value)"
            class="bg-white/10 text-[10px] text-amber-200 rounded-md px-1 py-0.5 border border-white/15 focus:outline-none cursor-pointer"
            title="Chọn chế độ âm thanh">
            <option value="auto" ${ambientOverride === 'auto' ? 'selected' : ''} class="text-stone-900">Tự động</option>
            <option value="ocean" ${ambientOverride === 'ocean' ? 'selected' : ''} class="text-stone-900">🌊 Biển</option>
            <option value="rain" ${ambientOverride === 'rain' ? 'selected' : ''} class="text-stone-900">🌧️ Mưa</option>
            <option value="storm" ${ambientOverride === 'storm' ? 'selected' : ''} class="text-stone-900">⛈️ Dông</option>
            <option value="mountain" ${ambientOverride === 'mountain' ? 'selected' : ''} class="text-stone-900">🏔️ Núi</option>
            <option value="night" ${ambientOverride === 'night' ? 'selected' : ''} class="text-stone-900">🌙 Đêm</option>
            <option value="sunny" ${ambientOverride === 'sunny' ? 'selected' : ''} class="text-stone-900">🍃 Nắng</option>
          </select>
        </div>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  if (ambientEnabled && ensureAudioContext()) {
    applyAmbientMood(true);
    bindFirstGestureAudioUnlock();
  }
  renderAmbientWidget();
});


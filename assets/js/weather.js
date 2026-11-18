// ==========================================
// DỰ BÁO THỜI TIẾT THỜI GIAN THỰC + HIỆU ỨNG MOTION (THẺ + BẢN ĐỒ + MODAL)
// ==========================================
const weatherCache = {};       // chi tiết 5 ngày: key -> { ts, data }
const liveWeatherByDest = {};  // thời tiết hiện tại: destId -> { temp, code, isDay, wind, info }
let lastBatchSignature = '';
let lastBatchTime = 0;
const WEATHER_TTL_MS = 15 * 60 * 1000;

let weatherEffectsEnabled = true;
let weatherMapLayer = null;
let mapAutoWeatherBound = false;
let mapMoveWeatherTimer = null;
let mapCenterWeatherCache = {}; // "lat,lng" -> { ts, wx }
let mapCenterWeatherState = null; // { name, lat, lng, destId, wx }
let lastRenderedMapScene = '';
let focusedMapWeatherDestId = null;
let activeWeatherDest = null;
let activeWeatherData = null;

function mapWmoWeather(code, isDay = 1) {
  const day = Boolean(isDay);
  if (code === 0) {
    return day
      ? { label: 'Trời quang nắng đẹp', icon: '☀️', scene: 'clear-day' }
      : { label: 'Đêm quang đãng', icon: '🌙', scene: 'clear-night' };
  }
  if (code === 1 || code === 2) {
    return day
      ? { label: 'Nắng nhẹ, ít mây', icon: '⛅', scene: 'partly-day' }
      : { label: 'Đêm ít mây', icon: '☁️', scene: 'partly-night' };
  }
  if (code === 3) {
    return { label: 'Nhiều mây âm u', icon: '☁️', scene: day ? 'cloudy-day' : 'cloudy-night' };
  }
  if (code === 45 || code === 48) {
    return { label: 'Có sương mù', icon: '🌫️', scene: 'fog' };
  }
  if (code >= 51 && code <= 57) {
    return { label: 'Mưa phùn nhẹ', icon: '🌦️', scene: 'rain-light' };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    const heavy = code === 65 || code === 82;
    return { label: heavy ? 'Mưa to' : 'Có mưa rào', icon: '🌧️', scene: heavy ? 'rain-heavy' : 'rain' };
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return { label: 'Tuyết rơi / Rét đậm', icon: '❄️', scene: 'snow' };
  }
  if (code >= 95) {
    return { label: 'Mưa dông & Sấm sét', icon: '⛈️', scene: 'storm' };
  }
  return { label: 'Thời tiết ôn hòa', icon: '🌤️', scene: day ? 'partly-day' : 'partly-night' };
}

function getTravelWeatherTip(code, temp, wind, rainProb) {
  if (code >= 95) return '⛈️ Đang có dông sét — tránh hoạt động ngoài trời, bãi biển và đỉnh núi; ưu tiên nghỉ ngơi trong nhà.';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return '☔ Trời đang có mưa — nhớ mang ô/áo mưa và ưu tiên lịch trình cafe, ẩm thực hoặc bảo tàng.';
  if (code >= 51 && code <= 57) return '🌦️ Mưa phùn nhẹ — mang theo áo khoác mỏng chống nước và giày chống trơn nhé.';
  if (code === 45 || code === 48) return '🌫️ Có sương mù — rất hợp săn mây nhưng cần lái xe chậm và bật đèn sương mù.';
  if (temp <= 16) return '🧥 Trời khá lạnh — nhớ mang áo ấm, khăn choàng và giữ ấm khi đi dạo tối hoặc sáng sớm.';
  if (temp >= 33) return '🧴 Trời nắng nóng — chuẩn bị kem chống nắng, mũ nón, kính râm và uống đủ nước.';
  if (wind >= 28) return '💨 Gió khá mạnh — lưu ý nếu đi tàu thuyền ra đảo hoặc chụp ảnh ngoài trời.';
  if (rainProb >= 60) return '🌂 Hôm nay có khả năng mưa — nên đem theo ô gấp gọn trong balo cho yên tâm.';
  return '✨ Thời tiết lý tưởng để dạo chơi, chụp ảnh và khám phá ẩm thực địa phương!';
}

// ==========================================
// 1. TẠO LAYER HIỆU ỨNG MOTION (DÙNG CHO MODAL, THẺ & BẢN ĐỒ)
// ==========================================
function buildWeatherSceneHTML(scene, compact = false) {
  let layers = '';

  if (scene === 'clear-night' || scene === 'partly-night' || scene === 'cloudy-night') {
    const stars = compact
      ? [[14, 22, 2, 0], [36, 16, 2.5, 0.8], [58, 28, 2, 1.4], [76, 18, 2.5, 0.4], [88, 36, 2, 1.9]]
      : [[10, 18, 2, 0], [22, 34, 3, 0.7], [34, 15, 2, 1.3], [48, 28, 2.5, 0.3],
         [60, 14, 3, 1.8], [72, 30, 2, 0.9], [85, 20, 2.5, 1.5], [16, 52, 2, 2.1],
         [42, 48, 2, 1.1], [66, 46, 2.5, 0.5], [90, 44, 2, 1.7]];
    layers += stars.map(([x, y, sz, d]) =>
      `<span class="wx-star" style="left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;animation-delay:${d}s"></span>`
    ).join('');
    if (scene !== 'cloudy-night') {
      layers += `<div class="wx-moon${compact ? ' wx-moon-sm' : ''}"></div>`;
    }
  }

  if (scene === 'clear-day' || scene === 'partly-day') {
    layers += `<div class="wx-sun-wrap${compact ? ' wx-sun-sm' : ''}"><div class="wx-sun-rays"></div><div class="wx-sun-core"></div></div>`;
  }

  if (['partly-day', 'partly-night', 'cloudy-day', 'cloudy-night', 'rain-light', 'rain', 'rain-heavy', 'storm'].includes(scene)) {
    const dark = ['cloudy-night', 'rain', 'rain-heavy', 'storm'].includes(scene) ? ' wx-cloud-dark' : '';
    const count = compact ? 2 : ((scene === 'partly-day' || scene === 'partly-night') ? 2 : 4);
    const defs = compact
      ? [{ top: 14, scale: 0.55, dur: 18, delay: -3, op: 0.75 }, { top: 40, scale: 0.44, dur: 25, delay: -11, op: 0.6 }]
      : [{ top: 14, scale: 1.0, dur: 22, delay: -4, op: 0.92 }, { top: 36, scale: 0.78, dur: 30, delay: -14, op: 0.75 },
         { top: 8, scale: 1.25, dur: 26, delay: -18, op: 0.85 }, { top: 44, scale: 0.9, dur: 19, delay: -8, op: 0.7 }];
    for (let i = 0; i < count; i++) {
      const c = defs[i];
      layers += `<div class="wx-cloud${dark}" style="top:${c.top}%;transform:scale(${c.scale});opacity:${c.op};animation-duration:${c.dur}s;animation-delay:${c.delay}s"></div>`;
    }
  }

  if (scene === 'fog') {
    layers += compact
      ? `<div class="wx-fog wx-fog-1"></div><div class="wx-fog wx-fog-2"></div>`
      : `<div class="wx-fog wx-fog-1"></div><div class="wx-fog wx-fog-2"></div><div class="wx-fog wx-fog-3"></div>`;
  }

  if (scene === 'rain-light' || scene === 'rain' || scene === 'rain-heavy' || scene === 'storm') {
    const drops = compact
      ? (scene === 'rain-light' ? 9 : 14)
      : (scene === 'rain-light' ? 18 : scene === 'rain' ? 32 : 48);
    for (let i = 0; i < drops; i++) {
      const left = ((i * 37) % 100);
      const dur = (scene === 'rain-light' ? 0.95 : 0.65) + ((i % 4) * 0.12);
      const delay = -((i * 0.19) % 1.3);
      const h = compact ? 10 : (scene === 'rain-light' ? 12 : 18 + (i % 3) * 4);
      layers += `<span class="wx-drop${compact ? ' wx-drop-card' : ''}" style="left:${left}%;height:${h}px;animation-duration:${dur.toFixed(2)}s;animation-delay:${delay.toFixed(2)}s"></span>`;
    }
  }

  if (scene === 'storm') {
    layers += `<div class="wx-flash"></div>`;
    if (!compact) {
      layers += `<svg class="wx-bolt" viewBox="0 0 64 120"><polygon points="36,0 12,62 30,62 18,120 56,48 36,48" fill="#FEF08A"/></svg>`;
    }
  }

  if (scene === 'snow') {
    const count = compact ? 10 : 28;
    for (let i = 0; i < count; i++) {
      const left = (i * 29) % 100;
      const sz = compact ? (3 + (i % 2) * 2) : (4 + (i % 4) * 2);
      const dur = 3.2 + (i % 4) * 0.7;
      const delay = -((i * 0.4) % 4);
      layers += `<span class="wx-flake" style="left:${left}%;width:${sz}px;height:${sz}px;animation-duration:${dur}s;animation-delay:${delay.toFixed(2)}s"></span>`;
    }
  }

  return layers;
}

// ==========================================
// 2. NẠP THỜI TIẾT HÀNG LOẠT (1 REQUEST CHO TẤT CẢ ĐỊA ĐIỂM)
// ==========================================
function toggleWeatherEffects() {
  weatherEffectsEnabled = !weatherEffectsEnabled;
  const btn = document.getElementById('weather-fx-toggle');
  if (btn) {
    btn.className = weatherEffectsEnabled
      ? 'px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold hover:bg-sky-100 transition flex items-center gap-1'
      : 'px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 border border-stone-200 text-xs font-medium hover:bg-stone-200 transition flex items-center gap-1';
    btn.innerHTML = `<i class="fa-solid fa-cloud-sun"></i><span>${weatherEffectsEnabled ? 'Thời tiết: Bật' : 'Thời tiết: Tắt'}</span>`;
  }
  renderMapWeatherLayer();
  if (weatherEffectsEnabled) updateWeatherFromMapCenter();
  else renderMapWeatherOverlay();
}

async function syncLiveWeatherEffects() {
  if (!Array.isArray(destinations) || destinations.length === 0) {
    renderMapWeatherLayer();
    updateWeatherFromMapCenter();
    return;
  }

  const valid = destinations.filter(d => Number.isFinite(Number(d.lat)) && Number.isFinite(Number(d.lng)));
  if (!valid.length) return;

  const sig = valid.map(d => `${d.id}:${Number(d.lat).toFixed(2)},${Number(d.lng).toFixed(2)}`).join('|');
  const fresh = sig === lastBatchSignature && (Date.now() - lastBatchTime) < WEATHER_TTL_MS;

  if (!fresh) {
    lastBatchSignature = sig;
    lastBatchTime = Date.now();
    try {
      const lats = valid.map(d => Number(d.lat).toFixed(4)).join(',');
      const lngs = valid.map(d => Number(d.lng).toFixed(4)).join(',');
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,is_day,weather_code,wind_speed_10m&timezone=Asia%2FHo_Chi_Minh`;
      const res = await fetch(url);
      if (res.ok) {
        const raw = await res.json();
        const arr = Array.isArray(raw) ? raw : [raw];
        valid.forEach((dest, i) => {
          const item = arr[i];
          if (!item || !item.current) return;
          const cur = item.current;
          liveWeatherByDest[dest.id] = {
            temp: Math.round(cur.temperature_2m),
            code: cur.weather_code,
            isDay: cur.is_day,
            wind: Math.round(cur.wind_speed_10m || 0),
            info: mapWmoWeather(cur.weather_code, cur.is_day)
          };
        });
      }
    } catch (e) {
      console.warn('Không tải được thời tiết hàng loạt:', e.message);
    }
  }

  if (!focusedMapWeatherDestId || !destinations.some(d => d.id === focusedMapWeatherDestId)) {
    focusedMapWeatherDestId = valid[0].id;
  }

  updateCardWeatherLabels();
  renderMapWeatherLayer();
  updateWeatherFromMapCenter();
}

// Cập nhật chữ nhiệt độ gọn trên nút thời tiết của thẻ (không chạy hiệu ứng trên thẻ)
function getCardWeatherBtnLabel(destId) {
  const wx = liveWeatherByDest[destId];
  if (!wx) return '<i class="fa-solid fa-cloud-sun"></i>';
  return `<span>${wx.info.icon}</span><span class="font-bold">${wx.temp}°</span>`;
}

function updateCardWeatherLabels() {
  destinations.forEach(dest => {
    const card = document.getElementById('card-' + dest.id);
    if (!card) return;
    const btn = card.querySelector('.card-wx-btn');
    if (btn) {
      const wx = liveWeatherByDest[dest.id];
      btn.innerHTML = getCardWeatherBtnLabel(dest.id);
      if (wx) btn.title = `${wx.info.label} · ${wx.temp}°C (Bấm xem dự báo 5 ngày)`;
    }
  });
}

// ==========================================
// 4. HIỆU ỨNG MOTION TRỰC TIẾP TRÊN BẢN ĐỒ LEAFLET
// ==========================================
function getMapMiniMotionClass(scene) {
  if (scene === 'clear-day') return 'mwx-sun';
  if (scene === 'clear-night' || scene === 'partly-night') return 'mwx-moon';
  if (scene === 'rain-light' || scene === 'rain' || scene === 'rain-heavy') return 'mwx-rain';
  if (scene === 'storm') return 'mwx-storm';
  if (scene === 'fog') return 'mwx-fog';
  if (scene === 'snow') return 'mwx-snow';
  return 'mwx-cloud';
}

function renderMapWeatherLayer() {
  if (!map || typeof L === 'undefined') return;
  if (!weatherMapLayer) {
    weatherMapLayer = L.layerGroup().addTo(map);
  }
  if (!mapAutoWeatherBound) {
    mapAutoWeatherBound = true;
    map.on('moveend', () => {
      clearTimeout(mapMoveWeatherTimer);
      mapMoveWeatherTimer = setTimeout(updateWeatherFromMapCenter, 220);
    });
  }
  weatherMapLayer.clearLayers();
  if (!weatherEffectsEnabled) return;

  destinations.forEach(dest => {
    const wx = liveWeatherByDest[dest.id];
    if (!wx || !Number.isFinite(Number(dest.lat)) || !Number.isFinite(Number(dest.lng))) return;
    const cls = getMapMiniMotionClass(wx.info.scene);
    const extraFx = (cls === 'mwx-rain' || cls === 'mwx-storm')
      ? '<span class="mwx-drops"><i></i><i></i><i></i></span>'
      : cls === 'mwx-sun'
        ? '<span class="mwx-sun-halo"></span>'
        : cls === 'mwx-fog'
          ? '<span class="mwx-mist-ring"></span>'
          : '';

    const icon = L.divIcon({
      className: '',
      html: `<div class="map-wx-badge ${cls}" title="${escapeHtml(dest.name)}: ${wx.info.label} (${wx.temp}°C)">${extraFx}<span class="mwx-ic">${wx.info.icon}</span><span class="mwx-t">${wx.temp}°</span></div>`,
      iconSize: [52, 22],
      iconAnchor: [-10, 26] // lệch nhẹ góc trên-phải pin để không che số trên pin
    });

    const m = L.marker([dest.lat, dest.lng], { icon, zIndexOffset: 200 });
    m.on('click', () => {
      setMapWeatherFocus(dest.id);
      openWeatherModal(dest.id);
    });
    weatherMapLayer.addLayer(m);
  });
}

function findNearestDestToPoint(lat, lng) {
  let best = null, bestDist = Infinity;
  const cosLat = Math.cos(lat * Math.PI / 180);
  destinations.forEach(d => {
    const dlat = Number(d.lat), dlng = Number(d.lng);
    if (!Number.isFinite(dlat) || !Number.isFinite(dlng) || !liveWeatherByDest[d.id]) return;
    const dist = Math.hypot(dlat - lat, (dlng - lng) * cosLat);
    if (dist < bestDist) { bestDist = dist; best = d; }
  });
  return { dest: best, dist: bestDist };
}

async function updateWeatherFromMapCenter() {
  if (!map || !weatherEffectsEnabled) {
    renderMapWeatherOverlay();
    return;
  }
  const c = map.getCenter();
  const { dest, dist } = findNearestDestToPoint(c.lat, c.lng);

  // Ưu tiên địa điểm đã đi gần tâm bản đồ nhất (trong phạm vi ~1.8° ≈ 200km)
  if (dest && dist <= 1.8) {
    focusedMapWeatherDestId = dest.id;
    mapCenterWeatherState = {
      name: dest.name, lat: dest.lat, lng: dest.lng, destId: dest.id, wx: liveWeatherByDest[dest.id]
    };
    renderMapWeatherOverlay();
    return;
  }

  // Nếu kéo sang vùng chưa có địa điểm nào (hoặc bản đồ trống): lấy thời tiết thật ngay tại tâm bản đồ
  const gLat = (Math.round(c.lat * 5) / 5).toFixed(1);
  const gLng = (Math.round(c.lng * 5) / 5).toFixed(1);
  const key = `${gLat},${gLng}`;
  const provName = (typeof findProvince === 'function' && findProvince(c.lat, c.lng)) || 'Việt Nam';
  const cached = mapCenterWeatherCache[key];

  if (cached && (Date.now() - cached.ts) < WEATHER_TTL_MS) {
    focusedMapWeatherDestId = null;
    mapCenterWeatherState = { name: provName, lat: c.lat, lng: c.lng, destId: null, wx: cached.wx };
    renderMapWeatherOverlay();
    return;
  }

  // Trong lúc tải vùng mới, tạm giữ địa điểm gần nhất nếu có
  if (dest && !mapCenterWeatherState) {
    mapCenterWeatherState = { name: dest.name, lat: dest.lat, lng: dest.lng, destId: dest.id, wx: liveWeatherByDest[dest.id] };
    renderMapWeatherOverlay();
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${gLat}&longitude=${gLng}&current=temperature_2m,is_day,weather_code,wind_speed_10m&timezone=Asia%2FHo_Chi_Minh`;
    const res = await fetch(url);
    if (!res.ok) return;
    const raw = await res.json();
    if (!raw || !raw.current) return;
    const cur = raw.current;
    const wx = {
      temp: Math.round(cur.temperature_2m),
      code: cur.weather_code,
      isDay: cur.is_day,
      wind: Math.round(cur.wind_speed_10m || 0),
      info: mapWmoWeather(cur.weather_code, cur.is_day)
    };
    mapCenterWeatherCache[key] = { ts: Date.now(), wx };
    focusedMapWeatherDestId = null;
    mapCenterWeatherState = { name: provName, lat: c.lat, lng: c.lng, destId: null, wx };
    renderMapWeatherOverlay();
  } catch (e) { }
}

function openMapCenterWeatherModal() {
  if (!mapCenterWeatherState) return;
  if (mapCenterWeatherState.destId) {
    openWeatherModal(mapCenterWeatherState.destId);
    return;
  }
  openWeatherModalForPoint({
    id: 'map-center-' + Number(mapCenterWeatherState.lat).toFixed(2) + '-' + Number(mapCenterWeatherState.lng).toFixed(2),
    name: mapCenterWeatherState.name,
    lat: mapCenterWeatherState.lat,
    lng: mapCenterWeatherState.lng
  });
}

function setMapWeatherFocus(destId) {
  if (!destId) return;
  focusedMapWeatherDestId = destId;
  const dest = destinations.find(d => d.id === destId);
  if (dest && liveWeatherByDest[dest.id]) {
    mapCenterWeatherState = { name: dest.name, lat: dest.lat, lng: dest.lng, destId: dest.id, wx: liveWeatherByDest[dest.id] };
  }
  renderMapWeatherOverlay();
}

function renderMapWeatherOverlay() {
  const overlay = document.getElementById('map-weather-overlay');
  const hud = document.getElementById('map-weather-hud');
  if (!overlay || !hud) return;

  if (!weatherEffectsEnabled) {
    overlay.innerHTML = '';
    overlay.className = 'absolute inset-0 pointer-events-none overflow-hidden hidden';
    hud.classList.add('hidden');
    lastRenderedMapScene = '';
    return;
  }

  let st = mapCenterWeatherState;
  if (!st && focusedMapWeatherDestId) {
    const dest = destinations.find(d => d.id === focusedMapWeatherDestId);
    if (dest && liveWeatherByDest[dest.id]) {
      st = { name: dest.name, lat: dest.lat, lng: dest.lng, destId: dest.id, wx: liveWeatherByDest[dest.id] };
    }
  }
  if (!st || !st.wx) {
    overlay.innerHTML = '';
    overlay.className = 'absolute inset-0 pointer-events-none overflow-hidden hidden';
    hud.classList.add('hidden');
    lastRenderedMapScene = '';
    return;
  }

  const wx = st.wx;
  // Chỉ vẽ lại animation khi cảnh thời tiết đổi, tránh giật/reset hiệu ứng khi kéo nhẹ bản đồ
  if (lastRenderedMapScene !== wx.info.scene) {
    lastRenderedMapScene = wx.info.scene;
    overlay.className = `absolute inset-0 pointer-events-none overflow-hidden map-wx-ambient map-wx-tint-${wx.info.scene}`;
    overlay.innerHTML = buildWeatherSceneHTML(wx.info.scene, false);
  }

  hud.classList.remove('hidden');
  hud.innerHTML = `
    <button onclick="openMapCenterWeatherModal()"
      class="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-900/75 hover:bg-stone-900/90 backdrop-blur-md text-white border border-white/15 shadow-lg text-xs transition"
      title="Bấm xem dự báo 5 ngày tại ${escapeHtml(st.name)}">
      <span class="text-base leading-none">${wx.info.icon}</span>
      <span class="font-bold max-w-[130px] truncate">${escapeHtml(st.name)}</span>
      <span class="font-extrabold text-amber-300">${wx.temp}°C</span>
      <span class="hidden sm:inline text-[10px] text-white/75">· ${escapeHtml(wx.info.label)}</span>
    </button>`;
}

// ==========================================
// 5. MODAL CHI TIẾT DỰ BÁO 5 NGÀY (OPEN-METEO)
// ==========================================
function formatDayVi(isoDate, idx) {
  if (idx === 0) return 'Hôm nay';
  if (idx === 1) return 'Ngày mai';
  const d = new Date(isoDate + 'T00:00:00');
  const names = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
  return `${names[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

async function fetchWeatherForDest(dest) {
  const key = `${dest.id}_${Number(dest.lat).toFixed(2)}_${Number(dest.lng).toFixed(2)}`;
  const cached = weatherCache[key];
  if (cached && (Date.now() - cached.ts) < WEATHER_TTL_MS) return cached.data;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(dest.lat)}&longitude=${encodeURIComponent(dest.lng)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=5&timezone=Asia%2FHo_Chi_Minh`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  weatherCache[key] = { ts: Date.now(), data };
  return data;
}

function renderWeatherHero(dest, data, selectedDayIdx = -1) {
  const hero = document.getElementById('weather-hero');
  const sceneBox = document.getElementById('weather-scene-layers');
  const contentBox = document.getElementById('weather-hero-content');
  const tipBox = document.getElementById('weather-tip');
  if (!hero || !sceneBox || !contentBox) return;

  const cur = data.current || {};
  const daily = data.daily || {};
  const isLive = selectedDayIdx < 0;

  const code = isLive ? cur.weather_code : (daily.weather_code ? daily.weather_code[selectedDayIdx] : cur.weather_code);
  const isDay = isLive ? cur.is_day : 1;
  const info = mapWmoWeather(code, isDay);

  hero.className = `relative rounded-2xl overflow-hidden p-5 text-white shadow-inner min-h-[196px] flex flex-col justify-between wx-bg-${info.scene}`;
  sceneBox.innerHTML = buildWeatherSceneHTML(info.scene, false);

  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(dest.lat + ',' + dest.lng)}`;

  if (isLive) {
    const temp = Math.round(cur.temperature_2m ?? 0);
    const feels = Math.round(cur.apparent_temperature ?? temp);
    const hum = Math.round(cur.relative_humidity_2m ?? 0);
    const wind = Math.round(cur.wind_speed_10m ?? 0);
    const rain = Number(cur.precipitation ?? 0).toFixed(1);
    const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0]) || 0;
    const timeStr = cur.time ? cur.time.replace('T', ' • ') : '';

    contentBox.innerHTML = `
      <div class="flex items-start justify-between gap-2 relative z-10">
        <div>
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-xs text-[10px] font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Hiện tại ${timeStr ? '· ' + escapeHtml(timeStr) : ''}</span>
          </div>
          <h4 class="text-lg sm:text-xl font-bold mt-1.5 drop-shadow-xs">${escapeHtml(dest.name)}</h4>
          <p class="text-xs text-white/90 font-medium">${info.icon} ${info.label}</p>
        </div>
        <div class="text-right">
          <div class="text-4xl sm:text-5xl font-extrabold leading-none drop-shadow-sm">${temp}°</div>
          <div class="text-[11px] text-white/85 mt-1">Cảm giác ${feels}°C</div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2 mt-5 relative z-10 text-[11px]">
        <div class="bg-black/20 backdrop-blur-xs rounded-xl px-2.5 py-1.5">
          <div class="text-white/70 text-[10px]">Độ ẩm</div>
          <div class="font-bold">💧 ${hum}%</div>
        </div>
        <div class="bg-black/20 backdrop-blur-xs rounded-xl px-2.5 py-1.5">
          <div class="text-white/70 text-[10px]">Gió</div>
          <div class="font-bold">💨 ${wind} km/h</div>
        </div>
        <div class="bg-black/20 backdrop-blur-xs rounded-xl px-2.5 py-1.5">
          <div class="text-white/70 text-[10px]">Lượng mưa</div>
          <div class="font-bold">☔ ${rain} mm</div>
        </div>
      </div>`;

    if (tipBox) {
      tipBox.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <p class="text-xs text-stone-700 leading-relaxed">${getTravelWeatherTip(code, temp, wind, rainProb)}</p>
          <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer"
            class="shrink-0 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition inline-flex items-center gap-1">
            <i class="fa-solid fa-diamond-turn-right text-terracotta-500"></i> Maps
          </a>
        </div>`;
    }
  } else {
    const tMax = Math.round(daily.temperature_2m_max[selectedDayIdx]);
    const tMin = Math.round(daily.temperature_2m_min[selectedDayIdx]);
    const prob = daily.precipitation_probability_max ? daily.precipitation_probability_max[selectedDayIdx] : 0;
    const dayLabel = formatDayVi(daily.time[selectedDayIdx], selectedDayIdx);

    contentBox.innerHTML = `
      <div class="flex items-start justify-between gap-2 relative z-10">
        <div>
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-xs text-[10px] font-semibold">
            <span>📅 Dự báo ${escapeHtml(dayLabel)}</span>
            <button onclick="selectWeatherDay(-1)" class="underline ml-1 hover:text-amber-200">Về hiện tại</button>
          </div>
          <h4 class="text-lg sm:text-xl font-bold mt-1.5 drop-shadow-xs">${escapeHtml(dest.name)}</h4>
          <p class="text-xs text-white/90 font-medium">${info.icon} ${info.label}</p>
        </div>
        <div class="text-right">
          <div class="text-3xl sm:text-4xl font-extrabold leading-none drop-shadow-sm">${tMax}° / ${tMin}°</div>
          <div class="text-[11px] text-white/85 mt-1">Khả năng mưa ${prob}%</div>
        </div>
      </div>
      <div class="mt-5 relative z-10 text-[11px] text-white/85 bg-black/20 backdrop-blur-xs rounded-xl px-3 py-2">
        Nhiệt độ dao động <b>${tMin}°C – ${tMax}°C</b> · Xác suất mưa <b>${prob}%</b>
      </div>`;

    if (tipBox) {
      tipBox.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <p class="text-xs text-stone-700 leading-relaxed">${getTravelWeatherTip(code, tMax, 10, prob)}</p>
          <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer"
            class="shrink-0 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold transition inline-flex items-center gap-1">
            <i class="fa-solid fa-diamond-turn-right text-terracotta-500"></i> Maps
          </a>
        </div>`;
    }
  }

  const dailyEl = document.getElementById('weather-daily-grid');
  if (dailyEl && daily.time) {
    dailyEl.innerHTML = daily.time.map((dt, idx) => {
      const dInfo = mapWmoWeather(daily.weather_code[idx], 1);
      const maxT = Math.round(daily.temperature_2m_max[idx]);
      const minT = Math.round(daily.temperature_2m_min[idx]);
      const prob = daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 0;
      const active = selectedDayIdx === idx;
      return `
        <button onclick="selectWeatherDay(${idx})"
          class="p-2 rounded-xl border text-center transition ${active ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-300' : 'bg-stone-50 hover:bg-stone-100 border-stone-200'}">
          <div class="text-[10px] font-bold text-stone-600 truncate">${formatDayVi(dt, idx)}</div>
          <div class="text-xl my-1">${dInfo.icon}</div>
          <div class="text-[11px] font-bold text-stone-800">${maxT}° <span class="font-normal text-stone-400">${minT}°</span></div>
          <div class="text-[10px] text-sky-600 font-medium mt-0.5">💧 ${prob}%</div>
        </button>`;
    }).join('');
  }
}

function selectWeatherDay(idx) {
  if (!activeWeatherDest || !activeWeatherData) return;
  renderWeatherHero(activeWeatherDest, activeWeatherData, idx);
}

async function openWeatherModal(destId) {
  const dest = destinations.find(d => d.id === destId);
  if (!dest) return;
  openWeatherModalForPoint(dest);
}

async function openWeatherModalForPoint(dest) {
  if (!dest) return;
  activeWeatherDest = dest;
  activeWeatherData = null;

  const modal = document.getElementById('weather-modal');
  const hero = document.getElementById('weather-hero');
  const sceneBox = document.getElementById('weather-scene-layers');
  const contentBox = document.getElementById('weather-hero-content');
  const dailyEl = document.getElementById('weather-daily-grid');
  const tipBox = document.getElementById('weather-tip');
  if (!modal) return;

  hero.className = 'relative rounded-2xl overflow-hidden p-5 text-white shadow-inner min-h-[196px] flex flex-col justify-center items-center wx-bg-partly-day';
  sceneBox.innerHTML = buildWeatherSceneHTML('partly-day', false);
  contentBox.innerHTML = `<div class="relative z-10 text-center"><i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i><p class="text-xs font-semibold">Đang tải thời tiết tại ${escapeHtml(dest.name)}...</p></div>`;
  if (dailyEl) dailyEl.innerHTML = '';
  if (tipBox) tipBox.innerHTML = '';

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  try {
    const data = await fetchWeatherForDest(dest);
    if (activeWeatherDest && activeWeatherDest.id === dest.id) {
      activeWeatherData = data;
      renderWeatherHero(dest, data, -1);
    }
  } catch (e) {
    contentBox.innerHTML = `<div class="relative z-10 text-center"><p class="text-sm font-bold">Không tải được dữ liệu thời tiết</p><p class="text-xs text-white/80 mt-1">Kiểm tra kết nối mạng và thử lại nhé.</p></div>`;
  }
}

function closeWeatherModal() {
  const modal = document.getElementById('weather-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// ==========================================
// THẺ KỶ NIỆM HỘ CHIẾU / BOARDING PASS (CANVAS PNG)
// ==========================================
let currentPassportLayout = 'boarding'; // 'boarding' (1200x630) | 'story' (1080x1920)

function openPassportModal() {
  const modal = document.getElementById('passport-modal');
  if (!modal) return;
  const ti = document.getElementById('passport-title-input');
  const mi = document.getElementById('passport-motto-input');
  if (ti && typeof currentUser !== 'undefined' && currentUser.name) ti.value = currentUser.name;
  if (mi && typeof currentUser !== 'undefined') mi.value = currentUser.subtitle || 'Cùng nhau vẽ kín bản đồ Việt Nam';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  renderPassportCanvas();
}

function closePassportModal() {
  const modal = document.getElementById('passport-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function setPassportLayout(layout) {
  currentPassportLayout = layout;
  document.querySelectorAll('.passport-layout-btn').forEach(btn => {
    const active = btn.dataset.layout === layout;
    btn.className = active
      ? 'passport-layout-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 text-white transition'
      : 'passport-layout-btn px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-100 text-stone-600 hover:bg-stone-200 transition';
  });
  renderPassportCanvas();
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// Vẽ bản đồ Việt Nam 63 tỉnh (tô màu theo Chồng/Vợ/Cả hai) trực tiếp từ GeoJSON
function drawVietnamSilhouette(ctx, boxX, boxY, boxW, boxH, visitedMap, darkBg) {
  if (typeof VN_PROVINCES_GEOJSON === 'undefined') return;
  const minLng = 102.0, maxLng = 109.7, minLat = 8.3, maxLat = 23.5;
  const scaleX = boxW / (maxLng - minLng);
  const scaleY = boxH / (maxLat - minLat);
  const scale = Math.min(scaleX, scaleY);
  const mapW = (maxLng - minLng) * scale;
  const mapH = (maxLat - minLat) * scale;
  const ox = boxX + (boxW - mapW) / 2;
  const oy = boxY + (boxH - mapH) / 2;

  const proj = (lng, lat) => [ox + (lng - minLng) * scale, oy + (maxLat - lat) * scale];

  // Vẽ tỉnh chưa đi trước, tỉnh đã đi vẽ đè lên sau cho sắc nét
  const features = VN_PROVINCES_GEOJSON.features.slice().sort((a, b) => {
    const av = visitedMap[a.properties.name] ? 1 : 0;
    const bv = visitedMap[b.properties.name] ? 1 : 0;
    return av - bv;
  });

  features.forEach(f => {
    const info = visitedMap[f.properties.name];
    const col = info ? PROVINCE_COLORS[info.status] : null;
    ctx.beginPath();
    f.geometry.coordinates.forEach(poly => {
      const ring = poly[0];
      if (!ring || ring.length < 3) return;
      ring.forEach((pt, idx) => {
        const [x, y] = proj(pt[0], pt[1]);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
    });
    if (col) {
      ctx.fillStyle = col.fill;
      ctx.strokeStyle = darkBg ? 'rgba(255,255,255,0.65)' : '#ffffff';
      ctx.lineWidth = 1.1;
    } else {
      ctx.fillStyle = darkBg ? 'rgba(255,255,255,0.11)' : '#E7E5E4';
      ctx.strokeStyle = darkBg ? 'rgba(255,255,255,0.22)' : '#D6D3D1';
      ctx.lineWidth = 0.7;
    }
    ctx.fill();
    ctx.stroke();
  });
}

function drawPassportStamp(ctx, cx, cy, r, color, line1, line2, angleRad) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.82;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 13px Inter, sans-serif';
  ctx.fillText(line1, 0, -7);
  ctx.font = '700 10px Inter, sans-serif';
  ctx.fillText(line2, 0, 10);
  ctx.restore();
}

function drawBarcode(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  let cx = x;
  const pattern = [3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 1, 4, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 2, 1, 3, 1, 2, 3, 2, 1, 2, 4, 1, 2, 1, 3, 1];
  let idx = 0;
  while (cx < x + w - 4) {
    const bw = pattern[idx % pattern.length] * 1.6;
    if (idx % 2 === 0) ctx.fillRect(cx, y, bw, h);
    cx += bw + 1.5;
    idx++;
  }
}

function getPassportSummary() {
  const st = getBadgeStats();
  const visitedMap = getVisitedProvincesMap();
  const totalProvs = typeof VN_PROVINCES_GEOJSON !== 'undefined' ? VN_PROVINCES_GEOJSON.features.length : 63;
  const provCounts = { both: 0, husband: 0, wife: 0, mixed: 0 };
  Object.values(visitedMap).forEach(v => { provCounts[v.status] = (provCounts[v.status] || 0) + 1; });

  let totalItems = 0, checkedItems = 0;
  destinations.forEach(d => (d.items || []).forEach(i => { totalItems++; if (i.checked) checkedItems++; }));
  const activeBadges = typeof getActiveBadges === 'function' ? getActiveBadges() : BADGES;
  const earnedBadges = activeBadges.filter(b => (st[b.stat] || 0) >= b.target);
  const pct = totalProvs ? Math.round((st.provinces / totalProvs) * 100) : 0;
  const solo = typeof isSoloMode === 'function' && isSoloMode();

  const titleInput = document.getElementById('passport-title-input');
  const mottoInput = document.getElementById('passport-motto-input');
  const passenger = (titleInput && titleInput.value.trim()) || 'Ngọc Sơn & Huyền Thương';
  const motto = (mottoInput && mottoInput.value.trim()) || 'Cùng nhau vẽ kín bản đồ Việt Nam';

  return { st, visitedMap, totalProvs, provCounts, totalItems, checkedItems, earnedBadges, totalBadges: activeBadges.length, pct, passenger, motto, solo };
}

function drawBoardingPass(ctx, W, H, data) {
  const { st, visitedMap, totalProvs, provCounts, totalItems, checkedItems, earnedBadges, totalBadges, pct, passenger, motto, solo } = data;
  const splitX = 820;

  // Nền ngoài tinh tế
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#F5EFE6');
  bg.addColorStop(1, '#E8DDD0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Thẻ vé chính
  const pad = 28;
  const tx = pad, ty = pad, tw = W - pad * 2, th = H - pad * 2;
  ctx.save();
  ctx.shadowColor = 'rgba(28, 25, 23, 0.18)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  rrect(ctx, tx, ty, tw, th, 28);
  ctx.fillStyle = '#FFFDF9';
  ctx.fill();
  ctx.restore();

  // Clip bên trong vé
  ctx.save();
  rrect(ctx, tx, ty, tw, th, 28);
  ctx.clip();

  // Thanh header màu xanh đen sang trọng
  const hdrH = 92;
  const hdrGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty + hdrH);
  hdrGrad.addColorStop(0, '#1C1917');
  hdrGrad.addColorStop(0.65, '#292524');
  hdrGrad.addColorStop(1, '#7C2D12');
  ctx.fillStyle = hdrGrad;
  ctx.fillRect(tx, ty, tw, hdrH);

  // Header trái
  ctx.fillStyle = '#FCD34D';
  ctx.font = '700 13px Inter, sans-serif';
  ctx.fillText('VIETNAM TRAVEL PASSPORT  •  NHẬT KÝ XÊ DỊCH', tx + 34, ty + 35);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 28px "Playfair Display", Georgia, serif';
  ctx.fillText('BOARDING PASS', tx + 34, ty + 70);

  // Header phải (cuống vé)
  ctx.fillStyle = '#FCD34D';
  ctx.font = '700 12px Inter, sans-serif';
  ctx.fillText('BẢN ĐỒ HÀNH TRÌNH', splitX + 28, ty + 36);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 22px Inter, sans-serif';
  ctx.fillText(`${st.provinces}/${totalProvs} TỈNH (${pct}%)`, splitX + 28, ty + 68);

  // Hành khách & Hành trình
  const lx = tx + 34;
  ctx.fillStyle = '#A8A29E';
  ctx.font = '700 11px Inter, sans-serif';
  ctx.fillText('HÀNH KHÁCH / PASSENGERS', lx, ty + 128);
  ctx.fillStyle = '#1C1917';
  ctx.font = '700 32px "Playfair Display", Georgia, serif';
  ctx.fillText(passenger, lx, ty + 165);

  ctx.fillStyle = '#78716C';
  ctx.font = 'italic 500 15px Inter, sans-serif';
  ctx.fillText(`“${motto}”`, lx, ty + 194);

  // Đường bay mô phỏng: VN ✈ 63 TỈNH
  const routeY = ty + 224;
  rrect(ctx, lx, routeY, splitX - lx - 36, 72, 16);
  ctx.fillStyle = '#FAF6F0';
  ctx.fill();
  ctx.strokeStyle = '#E7E0D5';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = '#1C1917';
  ctx.font = '800 30px Inter, sans-serif';
  ctx.fillText('VN', lx + 22, routeY + 42);
  ctx.fillStyle = '#78716C';
  ctx.font = '600 11px Inter, sans-serif';
  ctx.fillText('BẮC — TRUNG — NAM', lx + 22, routeY + 59);

  // Đường nét đứt + máy bay
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lx + 155, routeY + 34);
  ctx.lineTo(lx + 420, routeY + 34);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#EA580C';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✈', lx + 288, routeY + 42);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#C2410C';
  ctx.font = '800 28px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${st.provinces}/${totalProvs}`, splitX - 58, routeY + 41);
  ctx.fillStyle = '#78716C';
  ctx.font = '600 11px Inter, sans-serif';
  ctx.fillText('TỈNH THÀNH ĐÃ PHỦ', splitX - 58, routeY + 59);
  ctx.textAlign = 'left';

  // 4 ô thống kê chính
  const statsY = ty + 314;
  const stats = [
    { label: 'ĐIỂM ĐẾN', value: `${st.places}`, sub: 'địa danh', color: '#1C1917' },
    { label: 'TRẢI NGHIỆM', value: `${checkedItems}/${totalItems}`, sub: 'đã check-in', color: '#D97706' },
    { label: 'HUY HIỆU', value: `${earnedBadges.length}/${totalBadges}`, sub: 'thành tích', color: '#059669' },
    { label: 'ĐẶC SẢN', value: `${st.food}`, sub: 'món đã thử', color: '#E11D48' }
  ];
  const cardW = (splitX - lx - 36 - 36) / 4;
  stats.forEach((s, idx) => {
    const cx = lx + idx * (cardW + 12);
    rrect(ctx, cx, statsY, cardW, 76, 14);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#A8A29E';
    ctx.font = '700 10px Inter, sans-serif';
    ctx.fillText(s.label, cx + 14, statsY + 21);
    ctx.fillStyle = s.color;
    ctx.font = '800 24px Inter, sans-serif';
    ctx.fillText(s.value, cx + 14, statsY + 49);
    ctx.fillStyle = '#78716C';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.fillText(s.sub, cx + 14, statsY + 65);
  });

  // Phân bổ 3 màu Chồng / Vợ / Cả hai
  const whoY = ty + 410;
  const pills = solo ? [
    { dot: '#F97316', text: `Miền Bắc: ${st.north} điểm` },
    { dot: '#FB923C', text: `Miền Trung: ${st.central} điểm` },
    { dot: '#FDBA74', text: `Miền Nam: ${st.south} điểm` }
  ] : (() => {
    const L = typeof getWhoLabels === 'function' ? getWhoLabels() : { bothMap: 'Cùng đi', husbandMap: 'Bạn trai', wifeMap: 'Bạn gái' };
    return [
      { dot: '#F43F5E', text: `${L.bothMap}: ${provCounts.both} tỉnh (${st.both} điểm)` },
      { dot: '#38BDF8', text: `${L.husbandMap}: ${provCounts.husband} tỉnh (${st.husband} điểm)` },
      { dot: '#C084FC', text: `${L.wifeMap}: ${provCounts.wife} tỉnh (${st.wife} điểm)` }
    ];
  })();
  if (!solo && provCounts.mixed > 0) pills.push({ dot: '#FBBF24', text: `Đi riêng: ${provCounts.mixed} tỉnh` });
  let px = lx;
  pills.forEach(p => {
    ctx.font = '600 12px Inter, sans-serif';
    const tw2 = ctx.measureText(p.text).width + 30;
    rrect(ctx, px, whoY, tw2, 28, 14);
    ctx.fillStyle = '#F5F5F4';
    ctx.fill();
    ctx.fillStyle = p.dot;
    ctx.beginPath();
    ctx.arc(px + 13, whoY + 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#44403C';
    ctx.fillText(p.text, px + 24, whoY + 18);
    px += tw2 + 10;
  });

  // Dải huy hiệu nổi bật + Barcode chân vé
  const footY = ty + 462;
  ctx.fillStyle = '#A8A29E';
  ctx.font = '700 10px Inter, sans-serif';
  ctx.fillText('HUY HIỆU NỔI BẬT', lx, footY);
  const topIcons = earnedBadges.slice(-10).map(b => b.icon).join('  ');
  ctx.font = '24px sans-serif';
  ctx.fillText(topIcons || '🌱', lx, footY + 34);

  const today = new Date().toLocaleDateString('vi-VN');
  drawBarcode(ctx, lx, ty + th - 46, 360, 26, '#292524');
  ctx.fillStyle = '#78716C';
  ctx.font = '600 11px monospace';
  ctx.fillText(`ISSUED ${today}  •  GATE VN-63`, lx + 375, ty + th - 29);

  // Dấu mộc hộ chiếu tròn
  drawPassportStamp(ctx, splitX - 92, ty + th - 78, 46, '#C2410C', 'VIETNAM', `${pct}% EXPLORED`, -0.22);

  // Đường xé vé nét đứt
  ctx.save();
  ctx.setLineDash([7, 7]);
  ctx.strokeStyle = '#D6D3D1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(splitX, ty + hdrH + 14);
  ctx.lineTo(splitX, ty + th - 14);
  ctx.stroke();
  ctx.restore();

  // Phần cuống vé bên phải: Bản đồ Việt Nam 3 màu
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(splitX + 1, ty + hdrH, tx + tw - splitX, th - hdrH);
  drawVietnamSilhouette(ctx, splitX + 26, ty + hdrH + 18, tx + tw - splitX - 52, th - hdrH - 72, visitedMap, false);

  // Chú thích nhỏ dưới bản đồ
  ctx.fillStyle = '#78716C';
  ctx.font = '600 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  const L2 = typeof getWhoLabels === 'function' ? getWhoLabels() : { bothMap: 'Cùng đi', husbandMap: 'Bạn trai', wifeMap: 'Bạn gái' };
  ctx.fillText(solo ? `📍 Đã đi ${st.provinces}/${totalProvs} tỉnh thành` : `❤️ ${L2.bothMap}   💙 ${L2.husbandMap}   🌸 ${L2.wifeMap}`, splitX + (tx + tw - splitX) / 2, ty + th - 22);
  ctx.textAlign = 'left';

  ctx.restore();

  // Rãnh khuyết hình bán nguyệt trên & dưới đường xé vé
  ctx.fillStyle = '#EFE6DA';
  ctx.beginPath();
  ctx.arc(splitX, ty, 16, 0, Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(splitX, ty + th, 16, Math.PI, Math.PI * 2);
  ctx.fill();
}

function drawStoryPassport(ctx, W, H, data) {
  const { st, visitedMap, totalProvs, provCounts, totalItems, checkedItems, earnedBadges, totalBadges, pct, passenger, motto, solo } = data;

  // Nền hộ chiếu tối sang trọng ánh vàng đồng
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#18181B');
  bg.addColorStop(0.5, '#1C1917');
  bg.addColorStop(1, '#2B1914');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Ánh sáng nền nhẹ
  const glow1 = ctx.createRadialGradient(W * 0.85, H * 0.14, 20, W * 0.85, H * 0.14, 380);
  glow1.addColorStop(0, 'rgba(234, 88, 12, 0.25)');
  glow1.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(W * 0.15, H * 0.85, 20, W * 0.15, H * 0.85, 420);
  glow2.addColorStop(0, 'rgba(244, 63, 94, 0.2)');
  glow2.addColorStop(1, 'rgba(244, 63, 94, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Khung viền vàng mảnh kiểu bìa hộ chiếu
  rrect(ctx, 44, 44, W - 88, H - 88, 42);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FCD34D';
  ctx.font = '700 22px Inter, sans-serif';
  ctx.fillText('VIETNAM TRAVEL PASSPORT', W / 2, 130);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 62px "Playfair Display", Georgia, serif';
  ctx.fillText(passenger, W / 2, 212);

  ctx.fillStyle = '#D6D3D1';
  ctx.font = 'italic 500 26px Inter, sans-serif';
  ctx.fillText(`“${motto}”`, W / 2, 264);

  // Khung bản đồ Việt Nam lớn ở trung tâm
  rrect(ctx, 84, 310, W - 168, 860, 36);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  drawVietnamSilhouette(ctx, 130, 345, W - 260, 745, visitedMap, true);

  // Dấu mộc vàng trên góc bản đồ
  drawPassportStamp(ctx, W - 220, 460, 78, '#FCD34D', `${st.provinces}/${totalProvs} TỈNH`, `${pct}% VIETNAM`, 0.2);

  // Chú thích 3 màu dưới bản đồ
  ctx.fillStyle = '#E7E5E4';
  ctx.font = '600 24px Inter, sans-serif';
  const L3 = typeof getWhoLabels === 'function' ? getWhoLabels() : { bothMap: 'Cùng đi', husbandMap: 'Bạn trai', wifeMap: 'Bạn gái' };
  ctx.fillText(solo ? `🏔️ Bắc: ${st.north}    🏖️ Trung: ${st.central}    🌴 Nam: ${st.south}` : `❤️ ${L3.bothMap}: ${provCounts.both}    💙 ${L3.husbandMap}: ${provCounts.husband}    🌸 ${L3.wifeMap}: ${provCounts.wife}`, W / 2, 1135);

  // 4 thẻ thống kê 2x2
  const stats = [
    { label: 'TỈNH THÀNH ĐÃ PHỦ', val: `${st.provinces}/${totalProvs}`, color: '#FCD34D' },
    { label: 'ĐỊA DANH ĐÃ ĐI', val: `${st.places}`, color: '#FFFFFF' },
    { label: 'TRẢI NGHIỆM', val: `${checkedItems}/${totalItems}`, color: '#34D399' },
    { label: 'HUY HIỆU THÀNH TÍCH', val: `${earnedBadges.length}/${totalBadges}`, color: '#FB7185' }
  ];
  const sw = (W - 168 - 28) / 2, sh = 148;
  stats.forEach((s, idx) => {
    const col = idx % 2, row = Math.floor(idx / 2);
    const sx = 84 + col * (sw + 28), sy = 1210 + row * (sh + 24);
    rrect(ctx, sx, sy, sw, sh, 24);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#A8A29E';
    ctx.font = '700 18px Inter, sans-serif';
    ctx.fillText(s.label, sx + 30, sy + 48);
    ctx.fillStyle = s.color;
    ctx.font = '800 54px Inter, sans-serif';
    ctx.fillText(s.val, sx + 30, sy + 114);
  });

  // Thanh huy hiệu nổi bật
  ctx.textAlign = 'center';
  ctx.fillStyle = '#A8A29E';
  ctx.font = '700 20px Inter, sans-serif';
  ctx.fillText('HUY HIỆU ĐÃ CHINH PHỤC', W / 2, 1605);
  ctx.font = '46px sans-serif';
  ctx.fillText(earnedBadges.slice(-10).map(b => b.icon).join('  ') || '🌱', W / 2, 1672);

  // Chân trang
  const today = new Date().toLocaleDateString('vi-VN');
  ctx.fillStyle = '#78716C';
  ctx.font = '600 20px Inter, sans-serif';
  ctx.fillText(`NHẬT KÝ XÊ DỊCH  •  CẬP NHẬT ${today}`, W / 2, 1815);
  ctx.textAlign = 'left';
}

function renderPassportCanvas() {
  const canvas = document.getElementById('passport-canvas');
  if (!canvas) return;
  const isStory = currentPassportLayout === 'story';
  canvas.width = isStory ? 1080 : 1200;
  canvas.height = isStory ? 1920 : 630;
  canvas.style.maxHeight = isStory ? '58vh' : '380px';
  const ctx = canvas.getContext('2d');
  const data = getPassportSummary();
  if (isStory) drawStoryPassport(ctx, canvas.width, canvas.height, data);
  else drawBoardingPass(ctx, canvas.width, canvas.height, data);
}

function downloadPassportPNG() {
  const canvas = document.getElementById('passport-canvas');
  if (!canvas) return;
  renderPassportCanvas();
  const a = document.createElement('a');
  const suffix = currentPassportLayout === 'story' ? 'story-passport' : 'boarding-pass';
  a.download = `nhat-ky-xe-dich-${suffix}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('Đã tải ảnh Hộ chiếu hành trình!');
}

async function copyPassportPNG() {
  const canvas = document.getElementById('passport-canvas');
  if (!canvas || !navigator.clipboard || typeof ClipboardItem === 'undefined') {
    showToast('Trình duyệt không hỗ trợ copy ảnh — hãy dùng nút Tải ảnh PNG!');
    return;
  }
  renderPassportCanvas();
  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showToast('Đã sao chép ảnh! Bạn có thể dán (Ctrl+V) ngay.');
  } catch (e) {
    showToast('Không copy được ảnh — hãy bấm Tải ảnh PNG!');
  }
}


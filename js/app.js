// ==========================================
// 1. DỮ LIỆU GỐC & KẾT NỐI GOOGLE SHEETS BACKEND
// ==========================================
const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbyRymBWCpKzntL8NlmxdMJDHNTlSexohJcozVMGycNpjHLZ-7Y-TyFph5B19834-aI/exec';
const OWNER_PIN = '182001';
const STORAGE_KEY = 'couple_travel_journal_son_thuong_v1';

const PROVINCE_PRESETS = [
  { name: 'Hà Giang', region: 'Miền Bắc', lat: 22.8233, lng: 104.9836 },
  { name: 'Yên Bái (Mù Cang Chải)', region: 'Miền Bắc', lat: 21.8481, lng: 104.0853 },
  { name: 'Bắc Kạn (Hồ Ba Bể)', region: 'Miền Bắc', lat: 22.4044, lng: 105.6131 },
  { name: 'Tuyên Quang (Na Hang)', region: 'Miền Bắc', lat: 22.3564, lng: 105.3986 },
  { name: 'Lạng Sơn', region: 'Miền Bắc', lat: 21.8537, lng: 106.7615 },
  { name: 'Điện Biên', region: 'Miền Bắc', lat: 21.3860, lng: 103.0230 },
  { name: 'Nghệ An (Pù Mát / Cửa Lò)', region: 'Miền Trung', lat: 18.8068, lng: 105.7145 },
  { name: 'Quảng Trị', region: 'Miền Trung', lat: 16.7504, lng: 107.1856 },
  { name: 'Phú Yên', region: 'Miền Trung', lat: 13.0882, lng: 109.0929 },
  { name: 'Nha Trang - Khánh Hòa', region: 'Miền Trung', lat: 12.2388, lng: 109.1967 },
  { name: 'Ninh Thuận (Vĩnh Hy)', region: 'Miền Trung', lat: 11.7167, lng: 109.1950 },
  { name: 'Mũi Né - Phan Thiết', region: 'Miền Trung', lat: 10.9333, lng: 108.2833 },
  { name: 'Buôn Ma Thuột - Đắk Lắk', region: 'Miền Trung', lat: 12.6667, lng: 108.0500 },
  { name: 'TP. Hồ Chí Minh', region: 'Miền Nam', lat: 10.7769, lng: 106.7009 },
  { name: 'Vũng Tàu', region: 'Miền Nam', lat: 10.3460, lng: 107.0843 },
  { name: 'Cần Thơ', region: 'Miền Nam', lat: 10.0452, lng: 105.7469 },
  { name: 'Phú Quốc - Kiên Giang', region: 'Miền Nam', lat: 10.2899, lng: 103.9840 },
  { name: 'Côn Đảo', region: 'Miền Nam', lat: 8.6833, lng: 106.6000 }
];

const PRELOADED_DATA = [
  {
    id: 'da-nang', name: 'Đà Nẵng', region: 'Miền Trung', who: 'both', lat: 16.0544, lng: 108.2022, photos: [],
    items: [
      { text: 'Bà Nà Hills & Cầu Vàng', checked: true, type: 'sight' },
      { text: 'Cầu Rồng phun lửa & Cầu Tình Yêu', checked: true, type: 'sight' },
      { text: 'Tắm biển Mỹ Khê', checked: true, type: 'sight' },
      { text: 'Bán đảo Sơn Trà & Chùa Linh Ứng', checked: true, type: 'sight' },
      { text: 'Ăn kem bơ Cô Vân chợ Bắc Mỹ An', checked: true, type: 'food' },
      { text: 'Chè sầu Liên', checked: true, type: 'food' },
      { text: 'Bánh tráng cuốn thịt heo & Mì Quảng', checked: true, type: 'food' },
      { text: 'Ngũ Hành Sơn', checked: false, type: 'sight' }
    ]
  },
  {
    id: 'hoi-an', name: 'Hội An - Quảng Nam', region: 'Miền Trung', who: 'both', lat: 15.8801, lng: 108.3380, photos: [],
    items: [
      { text: 'Dạo phố cổ Hội An & Chùa Cầu', checked: true, type: 'sight' },
      { text: 'Thả hoa đăng sông Hoài buổi tối', checked: true, type: 'exp' },
      { text: 'Uống nước Mót Hội An', checked: true, type: 'food' },
      { text: 'Ăn Cao Lầu & Bánh mì Phượng / Madam Khánh', checked: true, type: 'food' },
      { text: 'Rừng dừa Bảy Mẫu', checked: false, type: 'exp' },
      { text: 'Biển An Bàng', checked: false, type: 'sight' }
    ]
  },
  {
    id: 'hue', name: 'Huế', region: 'Miền Trung', who: 'both', lat: 16.4637, lng: 107.5909, photos: [],
    items: [
      { text: 'Tham quan Đại Nội Huế', checked: true, type: 'sight' },
      { text: 'Uống Cà phê muối Huế chính gốc', checked: true, type: 'food' },
      { text: 'Chùa Thiên Mụ & Sông Hương', checked: false, type: 'sight' },
      { text: 'Lăng Khải Định / Minh Mạng / Tự Đức', checked: false, type: 'sight' },
      { text: 'Phá Tam Giang & Đầm Chuồn', checked: false, type: 'exp' },
      { text: 'Bún bò Huế & Bánh bèo nậm lọc', checked: false, type: 'food' }
    ]
  },
  {
    id: 'sapa', name: 'Sa Pa - Lào Cai', region: 'Miền Bắc', who: 'both', lat: 22.3364, lng: 103.8438, photos: [],
    items: [
      { text: 'Chinh phục đỉnh Fansipan', checked: true, type: 'sight' },
      { text: 'Bản Cát Cát', checked: true, type: 'sight' },
      { text: 'Hái dâu tây tại vườn dâu Sa Pa', checked: true, type: 'exp' },
      { text: 'Nhà thờ Đá & Quảng trường trung tâm', checked: true, type: 'sight' },
      { text: 'Ăn lẩu cá tầm & Đồ nướng Sa Pa', checked: true, type: 'food' },
      { text: 'Đèo Ô Quy Hồ & Cầu Kính Rồng Mây', checked: false, type: 'sight' }
    ]
  },
  {
    id: 'cat-ba', name: 'Cát Bà - Hải Phòng', region: 'Miền Bắc', who: 'both', lat: 20.7278, lng: 107.0481, photos: [],
    items: [
      { text: 'Nghỉ dưỡng Flamingo Cát Bà', checked: true, type: 'exp' },
      { text: 'Du thuyền / Chèo kayak Vịnh Lan Hạ', checked: true, type: 'exp' },
      { text: 'Bãi tắm Cát Cò 1, 2, 3', checked: true, type: 'sight' },
      { text: 'Thưởng thức hải sản Cát Bà (tu hài, bề bề)', checked: true, type: 'food' },
      { text: 'Vườn Quốc gia Cát Bà & Đỉnh Ngự Lâm', checked: false, type: 'sight' }
    ]
  },
  {
    id: 'vinpearl-qn', name: 'Vinpearl Đảo Rều - Quảng Ninh', region: 'Miền Bắc', who: 'both', lat: 20.9585, lng: 107.0392, photos: [],
    items: [
      { text: 'Đi tàu ra đảo riêng Vinpearl Resort & Spa Hạ Long', checked: true, type: 'exp' },
      { text: 'Bơi hồ bơi vô cực view vịnh Hạ Long', checked: true, type: 'exp' },
      { text: 'Ngắm hoàng hôn trên bãi biển riêng của đảo', checked: true, type: 'sight' },
      { text: 'Buffet hải sản tại nhà hàng trên đảo', checked: true, type: 'food' }
    ]
  },
  {
    id: 'da-lat', name: 'Đà Lạt - Lâm Đồng', region: 'Miền Trung', who: 'both', lat: 11.9404, lng: 108.4583, photos: [],
    items: [
      { text: 'Quảng trường Lâm Viên & Hồ Xuân Hương', checked: true, type: 'sight' },
      { text: 'Chợ đêm Đà Lạt & Bánh tráng nướng', checked: true, type: 'food' },
      { text: 'Săn mây Cầu Đất / Đồi Đa Phú', checked: true, type: 'exp' },
      { text: 'Lẩu gà lá é & Sữa đậu nành nóng', checked: true, type: 'food' },
      { text: 'Cà phê view thung lũng rừng thông', checked: true, type: 'exp' },
      { text: 'Thác Datanla / Langbiang', checked: false, type: 'sight' }
    ]
  },
  {
    id: 'trang-an', name: 'Tràng An - Ninh Bình', region: 'Miền Bắc', who: 'both', lat: 20.2506, lng: 105.9745, photos: [],
    items: [
      { text: 'Đi đò xuyên hang động Quần thể Tràng An', checked: true, type: 'exp' },
      { text: 'Hang Múa & Đỉnh Ngọa Long', checked: true, type: 'sight' },
      { text: 'Cố đô Hoa Lư / Chùa Bái Đính', checked: true, type: 'sight' },
      { text: 'Thịt dê núi & Cơm cháy Ninh Bình', checked: true, type: 'food' },
      { text: 'Tam Cốc - Bích Động', checked: false, type: 'sight' }
    ]
  },
  {
    id: 'ta-xua', name: 'Tà Xùa - Sơn La', region: 'Miền Bắc', who: 'both', lat: 21.3211, lng: 104.3983, photos: [],
    items: [
      { text: 'Săn biển mây Tà Xùa', checked: true, type: 'exp' },
      { text: 'Sống lưng khủng long Háng Đồng', checked: true, type: 'sight' },
      { text: 'Check-in Cây Cô Đơn & Mỏm Cá Heo', checked: true, type: 'sight' },
      { text: 'Cà phê săn mây trên đỉnh gió', checked: true, type: 'exp' },
      { text: 'Thảo nguyên Tà Xùa', checked: false, type: 'sight' }
    ]
  },
  {
    id: 'ha-long', name: 'Hạ Long - Quảng Ninh', region: 'Miền Bắc', who: 'husband', lat: 20.9599, lng: 107.0425, photos: [],
    items: [
      { text: 'Tham quan Vịnh Hạ Long (Hang Sửng Sốt / Đảo Ti Tốp)', checked: true, type: 'sight' },
      { text: 'Bảo tàng Quảng Ninh & Cung Cá Heo', checked: true, type: 'sight' },
      { text: 'Bãi Cháy & Cáp treo Nữ Hoàng', checked: true, type: 'exp' },
      { text: 'Chả mực Hạ Long & Sữa chua trân châu', checked: true, type: 'food' }
    ]
  },
  {
    id: 'do-son', name: 'Đồ Sơn - Hải Phòng', region: 'Miền Bắc', who: 'husband', lat: 20.7253, lng: 106.7844, photos: [],
    items: [
      { text: 'Tắm biển Đồ Sơn', checked: true, type: 'sight' },
      { text: 'Dinh Bảo Đại & Hòn Dấu', checked: true, type: 'sight' },
      { text: 'Ăn hải sản tươi sống ven biển', checked: true, type: 'food' },
      { text: 'Foodtour Hải Phòng (Bánh đa cua, bánh mì que)', checked: true, type: 'food' }
    ]
  },
  {
    id: 'mai-chau', name: 'Mai Châu - Hòa Bình', region: 'Miền Bắc', who: 'husband', lat: 20.6656, lng: 105.0844, photos: [],
    items: [
      { text: 'Đèo Thung Khe (Đèo Đá Trắng)', checked: true, type: 'sight' },
      { text: 'Đạp xe quanh Bản Lác & Bản Pom Coọng', checked: true, type: 'exp' },
      { text: 'Cơm lam, gà đồi & Lợn mán nướng', checked: true, type: 'food' }
    ]
  },
  {
    id: 'khoang-xanh', name: 'Khoang Xanh Suối Tiên - Ba Vì', region: 'Miền Bắc', who: 'husband', lat: 21.0853, lng: 105.3578, photos: [],
    items: [
      { text: 'Tắm suối thác Mơ & Thác Hòa Lan', checked: true, type: 'sight' },
      { text: 'Tắm khoáng nóng & Bùn khoáng', checked: true, type: 'exp' },
      { text: 'Sữa tươi & Bánh sữa Ba Vì', checked: true, type: 'food' }
    ]
  },
  {
    id: 'thien-son', name: 'Thiên Sơn - Suối Ngà (Ba Vì)', region: 'Miền Bắc', who: 'husband', lat: 21.0731, lng: 105.3689, photos: [],
    items: [
      { text: 'Khám phá khu Hạ Sơn, Trung Sơn & Ngoạn Sơn', checked: true, type: 'sight' },
      { text: 'Ngắm Thác Cổng Trời', checked: true, type: 'sight' },
      { text: 'Dã ngoại & Ăn gà đồi nướng bên suối', checked: true, type: 'food' }
    ]
  },
  {
    id: 'cuc-phuong', name: 'Cúc Phương - Ninh Bình', region: 'Miền Bắc', who: 'husband', lat: 20.3497, lng: 105.5964, photos: [],
    items: [
      { text: 'Nghỉ dưỡng Wyndham Grand Vedana Ninh Bình', checked: true, type: 'exp' },
      { text: 'Trekking rừng nguyên sinh Cúc Phương & Cây Chò ngàn năm', checked: true, type: 'sight' },
      { text: 'Động Người Xưa', checked: true, type: 'sight' }
    ]
  },
  {
    id: 'sam-son', name: 'Sầm Sơn - Thanh Hóa', region: 'Miền Trung', who: 'husband', lat: 19.7456, lng: 105.9022, photos: [],
    items: [
      { text: 'Tắm biển Sầm Sơn', checked: true, type: 'sight' },
      { text: 'Hòn Trống Mái & Đền Độc Cước', checked: true, type: 'sight' },
      { text: 'Nem chua Thanh Hóa & Hải sản biển', checked: true, type: 'food' }
    ]
  },
  {
    id: 'ha-tinh', name: 'Hà Tĩnh', region: 'Miền Trung', who: 'husband', lat: 18.3559, lng: 105.8877, photos: [],
    items: [
      { text: 'Biển Thiên Cầm / Biển Xuân Thành', checked: true, type: 'sight' },
      { text: 'Ngã ba Đồng Lộc', checked: true, type: 'sight' },
      { text: 'Cu đơ Hà Tĩnh & Mực nhảy Vũng Áng', checked: true, type: 'food' }
    ]
  },
  {
    id: 'quang-binh', name: 'Quảng Bình', region: 'Miền Trung', who: 'husband', lat: 17.4689, lng: 106.6223, photos: [],
    items: [
      { text: 'Nghỉ dưỡng Sea Star Resort Quảng Bình', checked: true, type: 'exp' },
      { text: 'Động Phong Nha / Động Thiên Đường', checked: true, type: 'sight' },
      { text: 'Biển Nhật Lệ & Đồi cát Quang Phú', checked: true, type: 'sight' },
      { text: 'Bánh bột lọc & Cháo canh Quảng Bình', checked: true, type: 'food' }
    ]
  },
  {
    id: 'mang-den', name: 'Măng Đen - Kon Tum', region: 'Miền Trung', who: 'wife', lat: 14.6022, lng: 108.2933, photos: [],
    items: [
      { text: 'Rừng thông Măng Đen & Hồ Đăk Ke', checked: true, type: 'sight' },
      { text: 'Thác Pa Sỹ & Tượng Đức Mẹ Măng Đen', checked: true, type: 'sight' },
      { text: 'Gà nướng cơm lam Măng Đen', checked: true, type: 'food' },
      { text: 'Chồng cùng đi Măng Đen lần tới', checked: false, type: 'exp' }
    ]
  },
  {
    id: 'cao-bang', name: 'Cao Bằng', region: 'Miền Bắc', who: 'wife', lat: 22.6657, lng: 106.2579, photos: [],
    items: [
      { text: 'Thác Bản Giốc', checked: true, type: 'sight' },
      { text: 'Động Ngườm Ngao & Suối Lê Nin', checked: true, type: 'sight' },
      { text: 'Bánh cuốn canh & Vịt quay 7 vị', checked: true, type: 'food' },
      { text: 'Chồng cùng đi Cao Bằng lần tới', checked: false, type: 'exp' }
    ]
  },
  {
    id: 'moc-chau', name: 'Mộc Châu - Sơn La', region: 'Miền Bắc', who: 'wife', lat: 20.8475, lng: 104.6406, photos: [],
    items: [
      { text: 'Đồi chè Trái Tim & Rừng thông Bản Áng', checked: true, type: 'sight' },
      { text: 'Thác Dải Yếm & Cầu Kính Bạch Long', checked: true, type: 'sight' },
      { text: 'Bê chao Mộc Châu & Sữa tươi', checked: true, type: 'food' },
      { text: 'Chồng cùng đi Mộc Châu lần tới', checked: false, type: 'exp' }
    ]
  },
  {
    id: 'quy-nhon', name: 'Quy Nhơn - Bình Định', region: 'Miền Trung', who: 'wife', lat: 13.7820, lng: 109.2192, photos: [],
    items: [
      { text: 'Kỳ Co - Eo Gió', checked: true, type: 'sight' },
      { text: 'Ghềnh Ráng Tiên Sa & Bãi tắm Hoàng Hậu', checked: true, type: 'sight' },
      { text: 'Bánh xèo tôm nhảy & Bún chả cá Quy Nhơn', checked: true, type: 'food' },
      { text: 'Chồng cùng đi Quy Nhơn lần tới', checked: false, type: 'exp' }
    ]
  }
];

// ==========================================
// 2. QUẢN LÝ TRẠNG THÁI & LƯU TRỮ
// ==========================================
let destinations = [];
let isOwnerMode = false;
let currentFilter = 'all';
let searchQuery = '';
let map = null;
let markersLayer = null;
let syncTimeout = null;
let currentPhotoDestId = null;

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(PRELOADED_DATA));
}

function loadLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { }
  return cloneDefaultData();
}

function setSyncStatus(state, text) {
  const badge = document.getElementById('cloud-sync-status');
  if (!badge) return;
  if (state === 'syncing') {
    badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200';
    badge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${text}`;
  } else if (state === 'ok') {
    badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200';
    badge.innerHTML = `<i class="fa-solid fa-cloud-check"></i> ${text}`;
  } else {
    badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-100 text-red-800 border border-red-200';
    badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${text}`;
  }
}

function saveData(autoSync = true) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
  } catch (e) { }
  updateAllUI();

  if (autoSync && isOwnerMode) {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncToCloud(false);
    }, 800);
  }
}

async function loadFromCloud() {
  if (!GOOGLE_SHEET_API_URL) return 'error';
  try {
    const res = await fetch(`${GOOGLE_SHEET_API_URL}?action=read&t=${Date.now()}`, {
      method: 'GET',
      redirect: 'follow'
    });
    const text = await res.text();
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      setSyncStatus('error', 'Chưa mở quyền Anyone');
      return 'error';
    }
    const data = JSON.parse(text);
    if (Array.isArray(data) && data.length > 0) {
      // Giữ lại bình luận lưu trên máy mà cloud chưa có (tránh bị ghi đè khi tải lại trang)
      const localById = {};
      destinations.forEach(d => { localById[d.id] = d; });
      data.forEach(d => {
        const local = localById[d.id];
        if (!local || !Array.isArray(local.comments) || !local.comments.length) return;
        const have = new Set((d.comments || []).map(c => c.id));
        const extra = local.comments.filter(c => !have.has(c.id) && c.pending && (Date.now() - new Date(c.time)) < 10 * 60 * 1000);
        if (extra.length) d.comments = (d.comments || []).concat(extra).sort((a, b) => new Date(a.time) - new Date(b.time));
      });
      destinations = data;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
      } catch (e) { }
      return 'loaded';
    }
    return 'empty';
  } catch (e) {
    console.warn('Đang dùng dữ liệu cục bộ:', e.message);
    return 'error';
  }
}

async function syncToCloud(showNotification = false) {
  if (!GOOGLE_SHEET_API_URL) return;
  setSyncStatus('syncing', 'Đang lưu lên Sheets...');
  try {
    const formBody = new URLSearchParams();
    formBody.append('pin', OWNER_PIN);
    formBody.append('data', JSON.stringify(destinations));

    await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formBody
    });

    setTimeout(async () => {
      const status = await loadFromCloud();
      if (status === 'loaded') {
        setSyncStatus('ok', 'Đã đồng bộ');
        if (showNotification) showToast('Đã lưu và xác nhận dữ liệu trên Google Sheets!');
      } else {
        setSyncStatus('error', 'Kiểm tra quyền Deploy');
        if (showNotification) {
          showToast('Đã gửi dữ liệu! Nếu chưa thấy cập nhật, hãy kiểm tra quyền Anyone trên Apps Script.');
        }
      }
    }, 1200);
  } catch (e) {
    setSyncStatus('error', 'Lỗi kết nối Cloud');
    if (showNotification) showToast('Không kết nối được Google Sheets.');
  }
}

// ==========================================
// 3. CHẾ ĐỘ CHỦ NHÂN & MÃ PIN
// ==========================================
function updateModeUI() {
  const btn = document.getElementById('mode-toggle-btn');
  const icon = document.getElementById('mode-icon');
  const label = document.getElementById('mode-label');
  const toolbar = document.getElementById('owner-toolbar');

  if (isOwnerMode) {
    btn.className = 'px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5';
    icon.className = 'fa-solid fa-lock-open text-amber-600';
    label.textContent = 'Chế độ Chủ nhân';
    toolbar.classList.remove('hidden');
  } else {
    btn.className = 'px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-xs sm:text-sm font-medium transition flex items-center gap-1.5';
    icon.className = 'fa-solid fa-lock text-stone-500';
    label.textContent = 'Chế độ xem';
    toolbar.classList.add('hidden');
  }
  updateAllUI();
}

function handleModeToggle() {
  if (isOwnerMode) {
    isOwnerMode = false;
    updateModeUI();
    showToast('Đã chuyển sang chế độ Khách xem.');
  } else {
    openPinModal();
  }
}

function openPinModal() {
  const modal = document.getElementById('pin-modal');
  const input = document.getElementById('pin-input');
  const err = document.getElementById('pin-error');
  input.value = '';
  err.classList.add('hidden');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => input.focus(), 100);
}

function closePinModal() {
  const modal = document.getElementById('pin-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function submitPin() {
  const val = document.getElementById('pin-input').value.trim();
  if (val === OWNER_PIN) {
    isOwnerMode = true;
    closePinModal();
    updateModeUI();
    showToast('Đã mở khóa chế độ Chủ nhân!');
  } else {
    document.getElementById('pin-error').classList.remove('hidden');
  }
}

// ==========================================
// 4. HIỂN THỊ GIAO DIỆN & THỐNG KÊ
// ==========================================
function updateStats() {
  const totalPlaces = destinations.length;
  let totalItems = 0;
  let checkedItems = 0;
  let bothCount = 0;
  let husbandCount = 0;
  let wifeCount = 0;
  let northCount = 0;
  let centralCount = 0;
  let southCount = 0;

  destinations.forEach(d => {
    if (d.who === 'both') bothCount++;
    else if (d.who === 'husband') husbandCount++;
    else if (d.who === 'wife') wifeCount++;

    if (d.region === 'Miền Bắc') northCount++;
    else if (d.region === 'Miền Trung') centralCount++;
    else if (d.region === 'Miền Nam') southCount++;

    (d.items || []).forEach(it => {
      totalItems++;
      if (it.checked) checkedItems++;
    });
  });

  const percent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  document.getElementById('map-counter-badge').textContent = `${totalPlaces} địa điểm`;
  document.getElementById('stat-total-places').textContent = totalPlaces;
  document.getElementById('stat-checked-items').textContent = `${checkedItems}/${totalItems}`;
  document.getElementById('stat-both-count').textContent = `${bothCount} điểm`;
  document.getElementById('stat-husband-count').textContent = `${husbandCount} điểm`;
  document.getElementById('stat-wife-count').textContent = `${wifeCount} điểm`;
  document.getElementById('stat-overall-percent').textContent = `${percent}%`;
  document.getElementById('stat-progress-bar').style.width = `${percent}%`;
  document.getElementById('stat-north').textContent = `Miền Bắc: ${northCount}`;
  document.getElementById('stat-central').textContent = `Miền Trung: ${centralCount}`;
  document.getElementById('stat-south').textContent = `Miền Nam: ${southCount}`;

  document.getElementById('count-all').textContent = totalPlaces;
  document.getElementById('count-both').textContent = bothCount;
  document.getElementById('count-husband').textContent = husbandCount;
  document.getElementById('count-wife').textContent = wifeCount;
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.className = 'filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 text-white whitespace-nowrap transition';
    } else {
      btn.className = 'filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 whitespace-nowrap transition';
    }
  });
  renderCards();
}

function handleSearch(val) {
  searchQuery = val.toLowerCase().trim();
  renderCards();
}

function getWhoBadgeHTML(dest) {
  if (isOwnerMode) {
    return `
                <select onchange="changeDestinationWho('${dest.id}', this.value)" class="text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${dest.who === 'both' ? 'bg-rose-50 text-rose-700 border-rose-200' :
        dest.who === 'husband' ? 'bg-sky-50 text-sky-700 border-sky-200' :
          'bg-purple-50 text-purple-700 border-purple-200'
      }">
                    <option value="both" ${dest.who === 'both' ? 'selected' : ''}>❤️ Cả hai cùng đi</option>
                    <option value="husband" ${dest.who === 'husband' ? 'selected' : ''}>💙 Chồng đã đi</option>
                    <option value="wife" ${dest.who === 'wife' ? 'selected' : ''}>🌸 Vợ đã đi</option>
                </select>
            `;
  }
  if (dest.who === 'both') {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">❤️ Cả hai cùng đi</span>`;
  } else if (dest.who === 'husband') {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">💙 Chồng đã đi</span>`;
  }
  return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">🌸 Vợ đã đi</span>`;
}

function renderCards() {
  const grid = document.getElementById('destinations-grid');
  if (!grid) return;

  const filtered = destinations.filter(d => {
    if (currentFilter === 'both' && d.who !== 'both') return false;
    if (currentFilter === 'husband' && d.who !== 'husband') return false;
    if (currentFilter === 'wife' && d.who !== 'wife') return false;
    if (currentFilter === 'incomplete') {
      const hasUnchecked = (d.items || []).some(it => !it.checked);
      if (!hasUnchecked) return false;
    }
    if (searchQuery) {
      const matchName = d.name.toLowerCase().includes(searchQuery) || d.region.toLowerCase().includes(searchQuery);
      const matchItem = (d.items || []).some(it => it.text.toLowerCase().includes(searchQuery));
      if (!matchName && !matchItem) return false;
    }
    return true;
  }).sort((a, b) => (b.lat || 0) - (a.lat || 0)); // Sắp xếp từ Bắc xuống Nam (vĩ độ giảm dần)

  if (filtered.length === 0) {
    grid.innerHTML = `
                <div class="col-span-full bg-white rounded-3xl border border-stone-200 p-10 text-center">
                    <p class="text-sm font-semibold text-stone-700">Không tìm thấy địa điểm phù hợp</p>
                    <p class="text-xs text-stone-400 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé.</p>
                </div>
            `;
    return;
  }

  grid.innerHTML = filtered.map(dest => {
    const items = dest.items || [];
    const checkedCount = items.filter(i => i.checked).length;
    const percent = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;
    const photos = dest.photos || [];
    const borderAccent = dest.who === 'both' ? 'border-rose-200/80' : dest.who === 'husband' ? 'border-sky-200/80' : 'border-purple-200/80';

    return `
                <div id="card-${dest.id}" class="bg-white rounded-3xl border ${borderAccent} shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden">
                    <div class="p-5">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <span class="text-[11px] font-medium text-stone-400">${dest.region}</span>
                                <h3 class="font-bold text-stone-900 text-base leading-snug cursor-pointer hover:text-terracotta-600 transition" onclick="focusOnMap(${dest.lat}, ${dest.lng}, '${dest.id}')">
                                    ${dest.name}
                                </h3>
                            </div>
                            <div class="flex items-center gap-1.5">
                                ${getWhoBadgeHTML(dest)}
                            </div>
                        </div>

                        <!-- Thanh tiến độ & nút ảnh -->
                        <div class="mt-3 flex items-center justify-between gap-2">
                            <div class="flex-1">
                                <div class="flex justify-between text-[11px] text-stone-500 mb-1">
                                    <span>Hoàn thành ${checkedCount}/${items.length}</span>
                                    <span class="font-semibold text-stone-700">${percent}%</span>
                                </div>
                                <div class="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-300 ${dest.who === 'both' ? 'bg-rose-500' : dest.who === 'husband' ? 'bg-sky-500' : 'bg-purple-500'
      }" style="width: ${percent}%"></div>
                                </div>
                            </div>

${isOwnerMode && photos.length > 0 ? `
                            <button onclick="openPhotoModal('${dest.id}')"
                                onmouseenter="showHoverPhoto(event, '${dest.id}')"
                                onmouseleave="hideHoverPhoto()"
                                class="px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition flex items-center gap-1 ${photos.length > 0 ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
      }" title="Xem / Thêm ảnh kỷ niệm">
                                <i class="fa-regular fa-images"></i>
                                <span>${photos.length > 0 ? photos.length : '+Ảnh'}</span>
                            </button>
`: ''}
                            <button onclick="openCommentModal('${dest.id}')"
                                onmouseenter="showHoverComments(event, '${dest.id}')"
                                onmouseleave="hideHoverComments()"
                                class="px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition flex items-center gap-1 ${(dest.comments || []).length > 0 ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'}">
                                <i class="fa-regular fa-comment-dots"></i>
                                <span>${(dest.comments || []).length > 0 ? dest.comments.length : 'Bình luận'}</span>
                            </button>
                        </div>

                        <!-- Danh sách trải nghiệm con -->
                        <ul class="mt-4 space-y-2">
                            ${items.map((item, idx) => {
        const typeIcon = item.type === 'food' ? '🍜' : item.type === 'exp' ? '✨' : '📍';
        return `
                                    <li class="flex items-start justify-between gap-2 group text-xs">
                                        <label class="flex items-start gap-2.5 flex-1 ${isOwnerMode ? 'cursor-pointer' : 'cursor-default'}">
                                            <input type="checkbox" ${item.checked ? 'checked' : ''} ${!isOwnerMode ? 'disabled' : ''}
                                                onchange="toggleSubItem('${dest.id}', ${idx})"
                                                class="mt-0.5 w-4 h-4 rounded accent-terracotta-500 ${isOwnerMode ? 'cursor-pointer' : 'cursor-default'}">
                                            <span class="${item.checked ? 'text-stone-800 font-medium' : 'text-stone-400'} leading-relaxed">
                                                <span class="mr-1">${typeIcon}</span>${item.text}
                                            </span>
                                        </label>
                                        ${isOwnerMode ? `
                                            <button onclick="deleteSubItem('${dest.id}', ${idx})" class="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition px-1" title="Xóa mục này">
                                                <i class="fa-solid fa-trash-can text-[11px]"></i>
                                            </button>
                                        ` : ''}
                                    </li>
                                `;
      }).join('')}
                        </ul>
                    </div>

                    <!-- Ô thêm địa điểm con / món ăn (Chỉ hiện khi mở khóa Chủ nhân) -->
                    ${isOwnerMode ? `
                        <div class="px-4 py-3 bg-stone-50/90 border-t border-stone-100 flex items-center gap-1.5">
                            <select id="new-item-type-${dest.id}" class="px-2 py-1.5 rounded-lg bg-white border border-stone-200 text-[11px] focus:outline-none">
                                <option value="sight">📍 Điểm</option>
                                <option value="food">🍜 Món</option>
                                <option value="exp">✨ Trải nghiệm</option>
                            </select>
                            <input type="text" id="new-item-input-${dest.id}" onkeydown="if(event.key==='Enter') addSubItem('${dest.id}')"
                                placeholder="Thêm điểm đến, món ăn..." class="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs focus:outline-none focus:border-terracotta-500">
                            <button onclick="addSubItem('${dest.id}')" class="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold transition">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
  }).join('');
}

function updateAllUI() {
  updateStats();
  renderCards();
  renderMapMarkers();
}

// ==========================================
// 5. BẢN ĐỒ LEAFLET (KHÔNG CẦN API KEY)
// ==========================================
function initMap() {
  const mapEl = document.getElementById('vietnam-map');
  if (!mapEl || map) return;

  map = L.map('vietnam-map', {
    center: [16.5, 106.8],
    zoom: 5,
    zoomControl: true
  });

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri & OpenStreetMap',
    maxZoom: 18
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  renderMapMarkers();

  // Đảm bảo bản đồ tính đúng kích thước sau khi nhúng iframe Google Sites
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 350);
  window.addEventListener('resize', () => {
    if (map) map.invalidateSize();
  });
}

function renderMapMarkers() {
  if (!map || !markersLayer) return;
  markersLayer.clearLayers();

  destinations.forEach(dest => {
    const items = dest.items || [];
    const checkedCount = items.filter(i => i.checked).length;
    const pinClass = dest.who === 'both' ? 'pin-both' : dest.who === 'husband' ? 'pin-husband' : 'pin-wife';
    const whoText = dest.who === 'both' ? '❤️ Cả hai cùng đi' : dest.who === 'husband' ? '💙 Chồng đã đi' : '🌸 Vợ đã đi';

    const icon = L.divIcon({
      className: '',
      html: `<div class="custom-pin ${pinClass}" style="width: 28px; height: 28px;">${checkedCount}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const checkedList = items.filter(i => i.checked).map(i => `<li class="text-stone-700">✓ ${i.text}</li>`).join('');
    const uncheckedList = items.filter(i => !i.checked).map(i => `<li class="text-stone-400">○ ${i.text}</li>`).join('');
    const coverPhoto = (dest.photos && dest.photos.length > 0)
      ? `<img src="${dest.photos[0]}" referrerpolicy="no-referrer" class="w-full h-24 object-cover rounded-lg mb-2" onerror="this.style.display='none'">`
      : '';

    const popupHTML = `
                <div class="w-56 font-sans text-xs">
                    ${coverPhoto}
                    <div class="font-bold text-sm text-stone-900">${dest.name}</div>
                    <div class="text-[11px] font-semibold mt-0.5 mb-2">${whoText}</div>
                    <ul class="space-y-1 max-h-36 overflow-y-auto pr-1">
                        ${checkedList}
                        ${uncheckedList}
                    </ul>
                </div>
            `;

    const marker = L.marker([dest.lat, dest.lng], { icon }).bindPopup(popupHTML);
    markersLayer.addLayer(marker);
  });
}

function focusOnMap(lat, lng, destId) {
  if (!map) return;
  document.getElementById('vietnam-map').scrollIntoView({ behavior: 'smooth', block: 'center' });
  map.setView([lat, lng], 8, { animate: true });
}

// ==========================================
// 6. CÁC THAO TÁC CHỈNH SỬA DỮ LIỆU
// ==========================================
function toggleSubItem(destId, itemIdx) {
  if (!isOwnerMode) return;
  const dest = destinations.find(d => d.id === destId);
  if (!dest || !dest.items[itemIdx]) return;
  dest.items[itemIdx].checked = !dest.items[itemIdx].checked;
  saveData(true);
}

function addSubItem(destId) {
  if (!isOwnerMode) return;
  const input = document.getElementById(`new-item-input-${destId}`);
  const typeSelect = document.getElementById(`new-item-type-${destId}`);
  const text = input.value.trim();
  if (!text) return;

  const dest = destinations.find(d => d.id === destId);
  if (!dest) return;
  dest.items.push({ text, checked: true, type: typeSelect.value });
  input.value = '';
  saveData(true);
  showToast(`Đã thêm "${text}" vào ${dest.name}`);
}

function deleteSubItem(destId, itemIdx) {
  if (!isOwnerMode) return;
  const dest = destinations.find(d => d.id === destId);
  if (!dest) return;
  dest.items.splice(itemIdx, 1);
  saveData(true);
}

function changeDestinationWho(destId, newWho) {
  if (!isOwnerMode) return;
  const dest = destinations.find(d => d.id === destId);
  if (!dest) return;
  dest.who = newWho;
  saveData(true);
  showToast(`Đã cập nhật người đi cho ${dest.name}`);
}

// Thêm địa điểm mới
function initProvincePresets() {
  const select = document.getElementById('preset-province-select');
  if (!select) return;
  PROVINCE_PRESETS.forEach((p, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${p.name} (${p.region})`;
    select.appendChild(opt);
  });
}

// ---- Gợi ý địa điểm khi gõ (preset nội bộ + OpenStreetMap Nominatim) ----
let suggestTimer = null;
let suggestAbort = null;

function regionByLat(lat) {
  if (lat >= 20) return 'Miền Bắc';
  if (lat >= 11.5) return 'Miền Trung';
  return 'Miền Nam';
}

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

function hideSuggestions() {
  const ul = document.getElementById('dest-suggestions');
  if (ul) { ul.classList.add('hidden'); ul.innerHTML = ''; }
}

function renderSuggestions(list, loadingText) {
  const ul = document.getElementById('dest-suggestions');
  if (!ul) return;
  if (!list.length) {
    ul.innerHTML = loadingText ? `<li class="px-3 py-2 text-stone-400">${loadingText}</li>` : '';
    ul.classList.toggle('hidden', !loadingText);
    return;
  }
  ul.innerHTML = list.map((it, i) => `
    <li data-i="${i}" class="px-3 py-2 cursor-pointer hover:bg-terracotta-50 border-b border-stone-100 last:border-0">
      <div class="font-semibold text-stone-700">${it.icon || '📍'} ${it.name}</div>
      <div class="text-[11px] text-stone-400 truncate">${it.sub || ''}</div>
    </li>`).join('');
  ul.classList.remove('hidden');
  ul._items = list;
}

function pickSuggestion(it) {
  document.getElementById('new-dest-name').value = it.name;
  document.getElementById('new-dest-region').value = it.region;
  document.getElementById('new-dest-lat').value = Number(it.lat).toFixed(4);
  document.getElementById('new-dest-lng').value = Number(it.lng).toFixed(4);
  hideSuggestions();
}

function onDestNameInput() {
  const q = document.getElementById('new-dest-name').value.trim();
  clearTimeout(suggestTimer);
  if (suggestAbort) suggestAbort.abort();
  if (q.length < 2) { hideSuggestions(); return; }

  const qn = removeAccents(q);
  const local = PROVINCE_PRESETS
    .filter(p => removeAccents(p.name).includes(qn))
    .slice(0, 4)
    .map(p => ({ name: p.name, sub: `${p.region} · gợi ý có sẵn`, region: p.region, lat: p.lat, lng: p.lng, icon: '⭐' }));
  renderSuggestions(local, local.length ? '' : 'Đang tìm...');

  suggestTimer = setTimeout(async () => {
    suggestAbort = new AbortController();
    try {
      const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=vn&accept-language=vi&q=' + encodeURIComponent(q);
      const res = await fetch(url, { signal: suggestAbort.signal });
      const data = await res.json();
      const remote = data.map(r => {
        const parts = r.display_name.split(', ');
        const lat = parseFloat(r.lat), lng = parseFloat(r.lon);
        return { name: r.name || parts[0], sub: parts.slice(1, 4).join(', '), region: regionByLat(lat), lat, lng, icon: '📍' };
      }).filter(r => !local.some(l => removeAccents(l.name) === removeAccents(r.name)));
      const all = local.concat(remote);
      renderSuggestions(all, all.length ? '' : 'Không tìm thấy gợi ý');
    } catch (e) {
      if (e.name !== 'AbortError' && !local.length) renderSuggestions([], 'Không tải được gợi ý (kiểm tra mạng)');
    }
  }, 500);
}

function initDestSuggestions() {
  const input = document.getElementById('new-dest-name');
  const ul = document.getElementById('dest-suggestions');
  if (!input || !ul) return;
  input.addEventListener('input', onDestNameInput);
  ul.addEventListener('mousedown', e => {
    const li = e.target.closest('li[data-i]');
    if (li && ul._items) { e.preventDefault(); pickSuggestion(ul._items[Number(li.dataset.i)]); }
  });
  input.addEventListener('blur', () => setTimeout(hideSuggestions, 150));
  input.addEventListener('keydown', e => { if (e.key === 'Escape') hideSuggestions(); });
}

function applyProvincePreset(idx) {
  if (idx === '') return;
  const p = PROVINCE_PRESETS[Number(idx)];
  if (!p) return;
  document.getElementById('new-dest-name').value = p.name;
  document.getElementById('new-dest-region').value = p.region;
  document.getElementById('new-dest-lat').value = p.lat;
  document.getElementById('new-dest-lng').value = p.lng;
}

function openAddDestinationModal() {
  if (!isOwnerMode) {
    openPinModal();
    return;
  }
  const modal = document.getElementById('add-dest-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeAddDestinationModal() {
  const modal = document.getElementById('add-dest-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function createNewDestination() {
  const name = document.getElementById('new-dest-name').value.trim();
  const region = document.getElementById('new-dest-region').value;
  const who = document.getElementById('new-dest-who').value;
  const lat = parseFloat(document.getElementById('new-dest-lat').value) || 21.0285;
  const lng = parseFloat(document.getElementById('new-dest-lng').value) || 105.8542;
  const rawItems = document.getElementById('new-dest-items').value.trim();

  if (!name) {
    showToast('Vui lòng nhập tên địa điểm!');
    return;
  }

  const items = rawItems
    ? rawItems.split('\n').map(line => line.trim()).filter(Boolean).map(text => ({ text, checked: true, type: 'sight' }))
    : [{ text: `Khám phá ${name}`, checked: true, type: 'sight' }];

  const newDest = {
    id: 'dest-' + Date.now(),
    name,
    region,
    who,
    lat,
    lng,
    photos: [],
    items
  };

  destinations.unshift(newDest);
  document.getElementById('new-dest-name').value = '';
  document.getElementById('new-dest-items').value = '';
  document.getElementById('preset-province-select').value = '';
  closeAddDestinationModal();
  saveData(true);
  showToast(`Đã thêm địa điểm "${name}"!`);
}

// ==========================================
// 7. QUẢN LÝ ẢNH KỶ NIỆM & HOVER PREVIEW
// ==========================================
function showHoverPhoto(event, destId) {
  const dest = destinations.find(d => d.id === destId);
  if (!dest || !dest.photos || dest.photos.length === 0) return;

  const box = document.getElementById('hover-image-preview');
  const img = document.getElementById('hover-preview-img');
  const cap = document.getElementById('hover-preview-caption');

  img.referrerPolicy = 'no-referrer';
  img.src = dest.photos[0];
  cap.textContent = `${dest.name} (${dest.photos.length} ảnh kỷ niệm)`;
  box.classList.remove('hidden');

  const x = Math.min(event.clientX + 12, window.innerWidth - 270);
  const y = Math.min(event.clientY + 12, window.innerHeight - 210);
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
}

function hideHoverPhoto() {
  document.getElementById('hover-image-preview').classList.add('hidden');
}

function openPhotoModal(destId) {
  currentPhotoDestId = destId;
  const dest = destinations.find(d => d.id === destId);
  if (!dest) return;

  document.getElementById('photo-modal-title').textContent = `Ảnh Kỷ Niệm — ${dest.name}`;
  const addBox = document.getElementById('photo-add-box');
  if (isOwnerMode) addBox.classList.remove('hidden');
  else addBox.classList.add('hidden');

  renderPhotoGallery(dest);
  const modal = document.getElementById('photo-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closePhotoModal() {
  const modal = document.getElementById('photo-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  currentPhotoDestId = null;
}

function renderPhotoGallery(dest) {
  const grid = document.getElementById('photo-gallery-grid');
  const photos = dest.photos || [];
  if (photos.length === 0) {
    grid.innerHTML = `<p class="col-span-2 text-xs text-stone-400 text-center py-8">Chưa có ảnh kỷ niệm nào cho địa điểm này.</p>`;
    return;
  }

  grid.innerHTML = photos.map((url, idx) => `
            <div class="relative group rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 aspect-4/3">
                <img src="${url}" referrerpolicy="no-referrer" alt="Kỷ niệm" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/400x300/f5f5f4/78716c?text=Loi+Link+Anh'">
                ${isOwnerMode ? `
                    <button onclick="removePhotoFromDestination(${idx})" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/65 text-white hover:bg-red-600 text-xs flex items-center justify-center transition">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                ` : ''}
            </div>
        `).join('');
}

function addPhotoToDestination() {
  if (!isOwnerMode || !currentPhotoDestId) return;
  const input = document.getElementById('new-photo-url');
  const url = input.value.trim();
  if (!url) return;

  let parsed;
  try { parsed = new URL(url); } catch (e) { parsed = null; }
  if (!parsed || !/^https?:$/.test(parsed.protocol)) {
    showToast('Link ảnh không hợp lệ!');
    return;
  }
  // Link album chia sẻ không phải link ảnh trực tiếp -> không hiển thị được trong thẻ <img>
  if (/^photos\.app\.goo\.gl$/.test(parsed.hostname) || /^photos\.google\.com$/.test(parsed.hostname)) {
    alert('Đây là link ALBUM/trang Google Photos, không phải link ảnh trực tiếp nên không hiển thị được.\n\nCách lấy link ảnh: mở ảnh trong Google Photos → chuột phải vào ảnh → "Sao chép địa chỉ hình ảnh" (Copy image address) → link bắt đầu bằng https://lh3.googleusercontent.com/... hoặc https://photos.fife.usercontent.google.com/...');
    return;
  }

  const dest = destinations.find(d => d.id === currentPhotoDestId);
  if (!dest) return;
  if (!dest.photos) dest.photos = [];
  dest.photos.push(url);
  input.value = '';
  renderPhotoGallery(dest);
  saveData(true);
  showToast('Đã thêm ảnh kỷ niệm!');
}

function removePhotoFromDestination(idx) {
  if (!isOwnerMode || !currentPhotoDestId) return;
  const dest = destinations.find(d => d.id === currentPhotoDestId);
  if (!dest || !dest.photos) return;
  dest.photos.splice(idx, 1);
  renderPhotoGallery(dest);
  saveData(true);
}

// ==========================================
// 7b. BÌNH LUẬN CỦA KHÁCH (bong bóng truyện tranh)
// ==========================================
let currentCommentDestId = null;
const COMMENT_NAME_KEY = 'nhat-ky-comment-name';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatCommentTime(ts) {
  const d = new Date(ts);
  if (isNaN(d)) return '';
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
}

function commentBubbleHtml(c, withDelete, idx) {
  return `
    <div class="comic-bubble">
      <div class="comic-bubble-name">${escapeHtml(c.name)}</div>
      <div class="comic-bubble-text">${escapeHtml(c.text)}</div>
      <div class="comic-bubble-time">${formatCommentTime(c.time)}${withDelete ? ` <button onclick="deleteComment(${idx})" class="ml-2 px-2 py-0.5 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition" title="Xóa bình luận"><i class="fa-solid fa-trash-can"></i> Xóa</button>` : ''}</div>
    </div>`;
}

function showHoverComments(event, destId) {
  const dest = destinations.find(d => d.id === destId);
  const list = (dest && dest.comments) || [];
  if (!list.length) return;
  const btn = event.currentTarget;
  const box = document.getElementById('hover-comments');
  const MAX = 6;
  const shown = list.slice().sort((a, b) => new Date(a.time) - new Date(b.time)).slice(-MAX);
  const more = list.length - shown.length;

  box.innerHTML = '<svg class="comic-tails" width="100%" height="100%" style="position:absolute;left:0;top:0;overflow:visible"></svg>' +
    shown.map(c => `<div class="comic-pos" style="position:absolute;width:190px;visibility:hidden">${commentBubbleHtml(c, false)}</div>`).join('') +
    (more > 0 ? `<div class="comic-pos" style="position:absolute;visibility:hidden"><div class="comic-more">+${more} bình luận cũ hơn</div></div>` : '');
  box.classList.remove('hidden');

  // Các bong bóng rải quanh THẺ địa điểm, đuôi trỏ vào thẻ
  const card = document.getElementById('card-' + destId) || btn;
  const cr = card.getBoundingClientRect();
  const cc = { x: cr.left + cr.width / 2, y: cr.top + cr.height / 2 };
  const placed = [{ l: cr.left, t: cr.top, r: cr.right, b: cr.bottom }];
  const vw = window.innerWidth, vh = window.innerHeight, M = 8, PAD = 10;
  const ANGLES = [-90, -20, 200, 30, 150, 90, -55, -125, 0, 180, 60, 120];
  const GAPS = [14, 40, 80, 130];
  const hit = (a, b) => !(a.r + PAD <= b.l || a.l >= b.r + PAD || a.b + PAD <= b.t || a.t >= b.b + PAD);

  const els = Array.from(box.querySelectorAll('.comic-pos'));
  let polys = '';
  let order = 0;
  els.forEach((el, i) => {
    const w = el.offsetWidth, h = el.offsetHeight;
    let best = null;
    outer: for (const gap of GAPS) {
      for (let k = 0; k < ANGLES.length; k++) {
        const ang = ANGLES[(i + k) % ANGLES.length] * Math.PI / 180;
        const dx = Math.cos(ang), dy = Math.sin(ang);
        // đặt bong bóng sát viền thẻ theo hướng ang
        const cx = cc.x + dx * (cr.width / 2 + w / 2 + gap);
        const cy = cc.y + dy * (cr.height / 2 + h / 2 + gap);
        const rect = { l: cx - w / 2, t: cy - h / 2, r: cx + w / 2, b: cy + h / 2 };
        if (rect.l < M || rect.t < M || rect.r > vw - M || rect.b > vh - M) continue;
        if (placed.some(p => hit(rect, p))) continue;
        best = rect; break outer;
      }
    }
    if (!best) { // hết chỗ bên ngoài: đặt đè lên thẻ nhưng không đè bong bóng khác
      const cands = [];
      for (let yy = M; yy <= vh - h - M; yy += 24) for (let xx = M; xx <= vw - w - M; xx += 24) {
        const rc = { l: xx, t: yy, r: xx + w, b: yy + h };
        if (!placed.slice(1).some(p => hit(rc, p))) cands.push({ rc, d: Math.hypot(xx + w / 2 - cc.x, yy + h / 2 - cc.y) });
      }
      cands.sort((p, q) => p.d - q.d);
      best = cands.length ? cands[0].rc : { l: M, t: M, r: M + w, b: M + h };
    }
    const rect = best;
    placed.push(rect);
    el.style.left = `${rect.l}px`; el.style.top = `${rect.t}px`; el.style.visibility = 'visible';
    // Hiệu ứng xuất hiện lần lượt theo thời gian bình luận (cũ nhất trước)
    const hasBubble = !!el.querySelector('.comic-bubble');
    const delay = hasBubble ? (++order) * 300 : 0;
    el.classList.add('comic-pop');
    el.style.animationDelay = `${delay}ms`;

    if (el.querySelector('.comic-bubble')) {
      const bcx = (rect.l + rect.r) / 2, bcy = (rect.t + rect.b) / 2;
      // Điểm đích: điểm gần nhất nằm trong thẻ
      const tx = Math.max(cr.left + 6, Math.min(bcx, cr.right - 6));
      const ty = Math.max(cr.top + 6, Math.min(bcy, cr.bottom - 6));
      const bx = Math.max(rect.l + 16, Math.min(tx, rect.r - 16));
      const by = Math.max(rect.t + 16, Math.min(ty, rect.b - 16));
      let vx = tx - bx, vy = ty - by;
      const len = Math.hypot(vx, vy);
      if (len < 4) return; // bong bóng đã nằm trên thẻ, không cần đuôi
      vx /= len; vy /= len;
      const px = -vy * 9, py = vx * 9;
      polys += `<polygon class="comic-tail-fade" style="animation-delay:${delay}ms" points="${bx + px},${by + py} ${bx - px},${by - py} ${tx},${ty}" fill="#fff" stroke="#292524" stroke-width="2" stroke-linejoin="round"/>`;
    }
  });
  box.querySelector('svg').innerHTML = polys;
}

function hideHoverComments() {
  const box = document.getElementById('hover-comments');
  if (box) box.classList.add('hidden');
}

function openCommentModal(destId) {
  const dest = destinations.find(d => d.id === destId);
  if (!dest) return;
  hideHoverComments();
  currentCommentDestId = destId;
  document.getElementById('comment-modal-title').textContent = `Bình luận — ${dest.name}`;
  document.getElementById('comment-name').value = localStorage.getItem(COMMENT_NAME_KEY) || '';
  document.getElementById('comment-text').value = '';
  renderCommentList(dest);
  const modal = document.getElementById('comment-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCommentModal() {
  const modal = document.getElementById('comment-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  currentCommentDestId = null;
}

function renderCommentList(dest) {
  const box = document.getElementById('comment-list');
  const list = dest.comments || [];
  if (!list.length) {
    box.innerHTML = '<p class="text-xs text-stone-400 text-center py-6">Chưa có bình luận nào. Hãy là người đầu tiên!</p>';
    return;
  }
  box.innerHTML = list.map((c, i) => commentBubbleHtml(c, isOwnerMode, i)).join('');
  box.scrollTop = box.scrollHeight;
}

async function postCommentToCloud(destId, comment) {
  if (!GOOGLE_SHEET_API_URL) return;
  try {
    const body = new URLSearchParams();
    body.append('action', 'comment');
    body.append('id', comment.id);
    body.append('destId', destId);
    body.append('name', comment.name);
    body.append('text', comment.text);
    body.append('time', comment.time);
    await fetch(GOOGLE_SHEET_API_URL, { method: 'POST', mode: 'no-cors', body });
  } catch (e) { console.warn('Không gửi được bình luận lên cloud:', e.message); }
}

async function deleteCommentOnCloud(id) {
  if (!GOOGLE_SHEET_API_URL) return;
  try {
    const body = new URLSearchParams();
    body.append('action', 'deleteComment');
    body.append('pin', OWNER_PIN);
    body.append('id', id);
    await fetch(GOOGLE_SHEET_API_URL, { method: 'POST', mode: 'no-cors', body });
  } catch (e) { console.warn('Không xóa được bình luận trên cloud:', e.message); }
}

function addComment() {
  if (!currentCommentDestId) return;
  const dest = destinations.find(d => d.id === currentCommentDestId);
  if (!dest) return;
  const name = document.getElementById('comment-name').value.trim().slice(0, 40);
  const text = document.getElementById('comment-text').value.trim().slice(0, 500);
  if (!name) { showToast('Vui lòng nhập tên của bạn!'); document.getElementById('comment-name').focus(); return; }
  if (!text) { showToast('Vui lòng nhập nội dung bình luận!'); return; }

  const comment = { id: 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), name, text, time: new Date().toISOString(), pending: true };
  if (!dest.comments) dest.comments = [];
  dest.comments.push(comment);
  try { localStorage.setItem(COMMENT_NAME_KEY, name); } catch (e) { }
  document.getElementById('comment-text').value = '';
  renderCommentList(dest);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations)); } catch (e) { }
  updateAllUI();
  postCommentToCloud(dest.id, comment);
  showToast('Đã gửi bình luận!');
}

function deleteComment(idx) {
  if (!isOwnerMode || !currentCommentDestId) return;
  const dest = destinations.find(d => d.id === currentCommentDestId);
  if (!dest || !dest.comments) return;
  if (!confirm(`Xóa bình luận của "${dest.comments[idx].name}"?`)) return;
  const removed = dest.comments.splice(idx, 1)[0];
  renderCommentList(dest);
  saveData(true);
  deleteCommentOnCloud(removed.id);
}

// ==========================================
// 8. XUẤT CODE DỰ PHÒNG & KHÔI PHỤC GỐC
// ==========================================
function openExportModal() {
  const textarea = document.getElementById('export-code-textarea');
  textarea.value = `const PRELOADED_DATA = ${JSON.stringify(destinations, null, 4)};`;
  const modal = document.getElementById('export-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeExportModal() {
  const modal = document.getElementById('export-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function copyExportCode() {
  const textarea = document.getElementById('export-code-textarea');
  textarea.select();
  document.execCommand('copy');
  showToast('Đã sao chép mã dữ liệu!');
}

function openResetModal() {
  const modal = document.getElementById('reset-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeResetModal() {
  const modal = document.getElementById('reset-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function confirmResetData() {
  destinations = cloneDefaultData();
  closeResetModal();
  saveData(true);
  showToast('Đã khôi phục 22 địa điểm gốc!');
}

function showToast(msg) {
  const box = document.getElementById('toast-box');
  document.getElementById('toast-message').textContent = msg;
  box.classList.remove('hidden');
  box.classList.add('flex');
  setTimeout(() => {
    box.classList.add('hidden');
    box.classList.remove('flex');
  }, 3000);
}

// ==========================================
// 9. KHỞI CHẠY ỨNG DỤNG
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  initProvincePresets();
  initDestSuggestions();

  // 1. Nạp dữ liệu cục bộ & khởi tạo giao diện ngay lập tức
  destinations = loadLocalData();
  initMap();
  updateAllUI();

  // 2. Tự động đồng bộ bản mới nhất từ Google Sheets (hoặc khởi tạo nếu Sheet đang trống)
  const cloudStatus = await loadFromCloud();
  if (cloudStatus === 'loaded') {
    updateAllUI();
  } else if (cloudStatus === 'empty') {
    await syncToCloud(false);
  }
});

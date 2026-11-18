// ==========================================
// 1. DỮ LIỆU GỐC & KẾT NỐI GOOGLE SHEETS BACKEND
// ==========================================
const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbz5gbw6qb459gdjsqEhRnJXihi4N8sWjv3IPqBExsROcbE7mvuaacsVf9zxHMKojZIF/exec';
const STORAGE_KEY = 'couple_travel_journal_son_thuong_v1';
const DEFAULT_USER_ID = 'default';
const DEFAULT_USER_META = {
  id: DEFAULT_USER_ID,
  name: 'Ngọc Sơn & Huyền Thương',
  mode: 'couple',
  subtitle: 'Cùng nhau vẽ kín bản đồ Việt Nam'
};

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
let sessionPin = '';
let currentUserId = DEFAULT_USER_ID;
let currentUser = Object.assign({}, DEFAULT_USER_META);
const USERS_CACHE_KEY = 'nhat_ky_users_cache_v1';
function loadCachedUsers() {
  try {
    const raw = localStorage.getItem(USERS_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) { }
  return [Object.assign({ placesCount: 0 }, DEFAULT_USER_META)];
}
function saveCachedUsers() {
  try { localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(allUsers)); } catch (e) { }
}
let allUsers = loadCachedUsers();
let currentFilter = 'all';
let searchQuery = '';
let map = null;
let markersLayer = null;
let syncTimeout = null;
let currentPhotoDestId = null;

function isSoloMode() {
  return !!(currentUser && currentUser.mode === 'solo');
}

function getWhoLabels() {
  if (currentUserId === DEFAULT_USER_ID) {
    return {
      both: 'Cả hai cùng đi', bothShort: 'Cả hai', bothMap: 'Cả 2',
      husband: 'Chồng đã đi', husbandShort: 'Chồng đi', husbandMap: 'Chồng',
      wife: 'Vợ đã đi', wifeShort: 'Vợ đi', wifeMap: 'Vợ'
    };
  }
  return {
    both: 'Đi cùng nhau', bothShort: 'Đi cùng nhau', bothMap: 'Cùng đi',
    husband: 'Bạn trai đã đi', husbandShort: 'Bạn trai', husbandMap: 'Bạn trai',
    wife: 'Bạn gái đã đi', wifeShort: 'Bạn gái', wifeMap: 'Bạn gái'
  };
}

function getStorageKey(uid = currentUserId) {
  return uid === DEFAULT_USER_ID ? STORAGE_KEY : `${STORAGE_KEY}_u_${uid}`;
}

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(PRELOADED_DATA));
}

function loadLocalData(uid = currentUserId) {
  try {
    const raw = localStorage.getItem(getStorageKey(uid));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (uid !== DEFAULT_USER_ID || parsed.length > 0) return parsed;
      }
    }
  } catch (e) { }
  return uid === DEFAULT_USER_ID ? cloneDefaultData() : [];
}

function saveLocalCache() {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(destinations));
  } catch (e) { }
}

async function postCloudJson(payload) {
  if (!GOOGLE_SHEET_API_URL) return { status: 'error', message: 'Chưa cấu hình API URL' };
  const res = await fetch(GOOGLE_SHEET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow'
  });
  const text = await res.text();
  return JSON.parse(text);
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
  saveLocalCache();
  // Cập nhật nhanh số điểm của user hiện tại trên Switcher
  const me = allUsers.find(u => u.id === currentUserId);
  if (me) me.placesCount = destinations.length;
  renderUserSwitcher();
  updateAllUI();

  if (autoSync && isOwnerMode && sessionPin) {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncToCloud(false);
    }, 800);
  }
}

function mergeLocalPending(data) {
  const localById = {};
  destinations.forEach(d => { localById[d.id] = d; });
  data.forEach(d => {
    const local = localById[d.id];
    if (local && Array.isArray(local.comments) && local.comments.length) {
      const have = new Set((d.comments || []).map(c => c.id));
      const extra = local.comments.filter(c => !have.has(c.id) && c.pending && (Date.now() - new Date(c.time)) < 10 * 60 * 1000);
      if (extra.length) d.comments = (d.comments || []).concat(extra).sort((a, b) => new Date(a.time) - new Date(b.time));
    }
    if (!d.reactions && local && local.reactions) d.reactions = local.reactions;
  });
}

async function loadFromCloud(uid = currentUserId) {
  if (!GOOGLE_SHEET_API_URL) return 'error';
  try {
    const res = await fetch(`${GOOGLE_SHEET_API_URL}?action=read&v=2&user=${encodeURIComponent(uid)}&t=${Date.now()}`, {
      method: 'GET',
      redirect: 'follow'
    });
    const text = await res.text();
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      setSyncStatus('error', 'Chưa mở quyền Anyone');
      return 'error';
    }
    const parsed = JSON.parse(text);

    // Format mới v2: { status, user, users, destinations }
    if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.destinations)) {
      if (Array.isArray(parsed.users) && parsed.users.length) {
        allUsers = parsed.users;
        saveCachedUsers();
      }
      if (parsed.user) {
        currentUser = parsed.user;
        currentUserId = parsed.user.id;
      }
      const data = parsed.destinations;
      mergeLocalPending(data);
      destinations = data;
      saveLocalCache();
      applyUserProfileUI();
      setSyncStatus('ok', 'Đã đồng bộ');
      return 'loaded';
    }

    // Tương thích ngược với Apps Script cũ (trả về mảng trực tiếp)
    if (Array.isArray(parsed) && parsed.length > 0) {
      mergeLocalPending(parsed);
      destinations = parsed;
      saveLocalCache();
      setSyncStatus('ok', 'Đã đồng bộ');
      return 'loaded';
    }
    return 'empty';
  } catch (e) {
    console.warn('Đang dùng dữ liệu cục bộ:', e.message);
    return 'error';
  }
}

async function syncToCloud(showNotification = false) {
  if (!GOOGLE_SHEET_API_URL || !sessionPin) return;
  setSyncStatus('syncing', 'Đang lưu...');
  try {
    const res = await postCloudJson({
      action: 'save',
      user: currentUserId,
      pin: sessionPin,
      data: destinations
    });
    if (res && res.status === 'success') {
      setSyncStatus('ok', 'Đã đồng bộ');
      if (showNotification) showToast('Đã lưu thành công lên Google Sheets!');
    } else {
      setSyncStatus('error', (res && res.message) || 'Lưu thất bại');
      if (showNotification) showToast((res && res.message) || 'Không lưu được lên Google Sheets.');
    }
  } catch (e) {
    setSyncStatus('error', 'Lỗi kết nối Cloud');
    if (showNotification) showToast('Không kết nối được Google Sheets.');
  }
}

// ==========================================
// 2b. ĐA NGƯỜI DÙNG: SWITCH USER & TẠO CỦA RIÊNG TÔI
// ==========================================
function getInitials(name) {
  const parts = String(name || '?').trim().split(/\s+/);
  return (parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)).toUpperCase();
}

function applyUserProfileUI() {
  const name = (currentUser && currentUser.name) || DEFAULT_USER_META.name;
  const solo = isSoloMode();
  document.title = `Nhật Ký Hành Trình — ${name}`;

  const hdrName = document.getElementById('header-owner-name');
  if (hdrName) hdrName.textContent = name;
  const swName = document.getElementById('switcher-current-name');
  if (swName) swName.textContent = name;

  const coupleLegend = document.getElementById('header-couple-legend');
  const soloSub = document.getElementById('header-solo-subtitle');
  if (coupleLegend) coupleLegend.classList.toggle('hidden', solo);
  if (soloSub) {
    soloSub.classList.toggle('hidden', !solo);
    soloSub.textContent = (currentUser && currentUser.subtitle) || `Nhật ký xê dịch cá nhân của ${name}`;
  }

  const coupleBox = document.getElementById('couple-breakdown-box');
  const soloBox = document.getElementById('solo-summary-box');
  if (coupleBox) coupleBox.classList.toggle('hidden', solo);
  if (soloBox) soloBox.classList.toggle('hidden', !solo);

  document.querySelectorAll('.couple-only-ui').forEach(el => el.classList.toggle('hidden', solo));
  const whoWrap = document.getElementById('new-dest-who-wrap');
  if (whoWrap) whoWrap.classList.toggle('hidden', solo);

  if (!solo) {
    const lbl = getWhoLabels();
    const setTxt = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
    setTxt('lbl-hdr-both', lbl.both); setTxt('lbl-hdr-husband', lbl.husband); setTxt('lbl-hdr-wife', lbl.wife);
    setTxt('lbl-stat-both', lbl.both); setTxt('lbl-stat-husband', lbl.husband); setTxt('lbl-stat-wife', lbl.wife);
    setTxt('lbl-flt-both', lbl.bothShort); setTxt('lbl-flt-husband', lbl.husbandShort); setTxt('lbl-flt-wife', lbl.wifeShort);
    const sel = document.getElementById('new-dest-who');
    if (sel && sel.options.length >= 3) {
      sel.options[0].textContent = `❤️ ${lbl.both}`;
      sel.options[1].textContent = `💙 ${lbl.husband}`;
      sel.options[2].textContent = `🌸 ${lbl.wife}`;
    }
  }

  if (solo && (currentFilter === 'both' || currentFilter === 'husband' || currentFilter === 'wife')) {
    setFilter('all');
  }
  renderUserSwitcher();
}

function renderUserSwitcher() {
  const listEl = document.getElementById('user-switcher-list');
  const users = allUsers.length ? allUsers : [currentUser];
  const cntEl = document.getElementById('switcher-user-count');
  if (cntEl) cntEl.textContent = users.length;
  if (!listEl) return;
  listEl.innerHTML = users.map(u => {
    const active = u.id === currentUserId;
    const isSolo = u.mode === 'solo';
    return `
      <button onclick="switchUser('${escapeHtml(u.id)}')"
        class="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 hover:bg-amber-50/70 transition ${active ? 'bg-terracotta-50/70' : ''}">
        <div class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold text-white ${isSolo ? 'bg-gradient-to-br from-orange-400 to-amber-500' : 'bg-gradient-to-br from-rose-500 to-terracotta-600'}">
          ${escapeHtml(getInitials(u.name))}
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xs font-bold text-stone-800 truncate">${escapeHtml(u.name)}</div>
          <div class="text-[10px] text-stone-400 flex items-center gap-1.5">
            <span>${isSolo ? '👤 Cá nhân' : '💑 Cặp đôi'}</span>
            <span>•</span>
            <span>${u.placesCount || 0} điểm</span>
          </div>
        </div>
        ${active ? '<i class="fa-solid fa-check text-terracotta-600 text-xs"></i>' : ''}
      </button>`;
  }).join('');
}

async function refreshUsersList() {
  if (!GOOGLE_SHEET_API_URL) return;
  try {
    const res = await fetch(`${GOOGLE_SHEET_API_URL}?action=users&t=${Date.now()}`, { method: 'GET', redirect: 'follow' });
    const parsed = await res.json();
    if (parsed && Array.isArray(parsed.users) && parsed.users.length) {
      allUsers = parsed.users;
      saveCachedUsers();
      renderUserSwitcher();
    }
  } catch (e) { }
}

function toggleUserSwitcher() {
  const menu = document.getElementById('user-switcher-menu');
  if (!menu) return;
  menu.classList.toggle('hidden');
  if (!menu.classList.contains('hidden')) {
    renderUserSwitcher();
    refreshUsersList();
  }
}

function closeUserSwitcher() {
  const menu = document.getElementById('user-switcher-menu');
  if (menu) menu.classList.add('hidden');
}

function copyShareUserLink() {
  const url = new URL(window.location.href);
  if (currentUserId === DEFAULT_USER_ID) url.searchParams.delete('u');
  else url.searchParams.set('u', currentUserId);
  const link = url.toString();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => showToast('Đã sao chép link nhật ký!'));
  } else {
    prompt('Sao chép link chia sẻ:', link);
  }
  closeUserSwitcher();
}

async function switchUser(uid) {
  closeUserSwitcher();
  if (!uid || uid === currentUserId) return;

  // Chuyển người luôn khóa lại chế độ chỉnh sửa để bảo vệ nhật ký người khác
  isOwnerMode = false;
  sessionPin = '';
  currentUserId = uid;
  const found = allUsers.find(u => u.id === uid);
  currentUser = found ? Object.assign({}, found) : { id: uid, name: uid, mode: 'solo', subtitle: '' };

  // Cập nhật URL ?u=<uid>
  try {
    const url = new URL(window.location.href);
    if (uid === DEFAULT_USER_ID) url.searchParams.delete('u');
    else url.searchParams.set('u', uid);
    window.history.replaceState({}, '', url.toString());
  } catch (e) { }

  // Xóa cache tỉnh theo ID phòng trùng lặp và nạp dữ liệu mới
  Object.keys(provinceCache).forEach(k => delete provinceCache[k]);
  destinations = loadLocalData(uid);
  applyUserProfileUI();
  updateModeUI();
  showToast(`Đang xem nhật ký của ${currentUser.name}`);

  const st = await loadFromCloud(uid);
  if (st === 'loaded') updateAllUI();
}

let createUserMode = 'solo';

function setCreateUserMode(mode) {
  createUserMode = mode === 'couple' ? 'couple' : 'solo';
  document.querySelectorAll('.cmode-btn').forEach(btn => {
    const active = btn.dataset.cmode === createUserMode;
    btn.className = active
      ? 'cmode-btn px-3 py-2 rounded-xl border-2 border-terracotta-500 bg-terracotta-50 text-terracotta-800 font-bold text-left transition'
      : 'cmode-btn px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 font-semibold text-left hover:bg-stone-50 transition';
  });
  const lbl = document.getElementById('create-user-name-label');
  const inp = document.getElementById('create-user-name');
  if (lbl) lbl.textContent = createUserMode === 'couple' ? 'Tên cặp đôi của hai bạn *' : 'Tên hiển thị của bạn *';
  if (inp) inp.placeholder = createUserMode === 'couple' ? 'Ví dụ: Minh & Linh, Nam & Trang...' : 'Ví dụ: Minh Anh, Quốc Bảo...';
}

function openCreateUserModal() {
  closeUserSwitcher();
  const modal = document.getElementById('create-user-modal');
  if (!modal) return;
  setCreateUserMode('solo');
  document.getElementById('create-user-name').value = '';
  document.getElementById('create-user-subtitle').value = '';
  document.getElementById('create-user-pin').value = '';
  document.getElementById('create-user-pin2').value = '';
  const err = document.getElementById('create-user-error');
  err.textContent = '';
  err.classList.add('hidden');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => document.getElementById('create-user-name').focus(), 80);
}

function closeCreateUserModal() {
  const modal = document.getElementById('create-user-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function submitCreateUser() {
  const name = document.getElementById('create-user-name').value.trim();
  const subtitle = document.getElementById('create-user-subtitle').value.trim();
  const pin = document.getElementById('create-user-pin').value.trim();
  const pin2 = document.getElementById('create-user-pin2').value.trim();
  const err = document.getElementById('create-user-error');
  const btn = document.getElementById('create-user-submit-btn');

  const showErr = msg => { err.textContent = msg; err.classList.remove('hidden'); };
  if (name.length < 2) return showErr('Vui lòng nhập tên ít nhất 2 ký tự.');
  if (pin.length < 4 || pin.length > 20) return showErr('Mã PIN cần dài từ 4 đến 20 ký tự.');
  if (pin !== pin2) return showErr('Hai lần nhập mã PIN không khớp!');

  err.classList.add('hidden');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tạo...';
  try {
    const res = await postCloudJson({
      action: 'createUser',
      name,
      subtitle,
      pin,
      mode: createUserMode
    });
    if (!res || res.status !== 'success' || !res.user) {
      return showErr((res && res.message) || 'Không tạo được nhật ký. Hãy chắc chắn Apps Script đã deploy bản mới!');
    }
    if (Array.isArray(res.users)) {
      allUsers = res.users;
      saveCachedUsers();
    }
    currentUser = res.user;
    currentUserId = res.user.id;
    destinations = [];
    saveLocalCache();
    sessionPin = pin;
    isOwnerMode = true;

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('u', currentUserId);
      window.history.replaceState({}, '', url.toString());
    } catch (e) { }

    closeCreateUserModal();
    applyUserProfileUI();
    updateModeUI();
    if (map) map.setView([16.5, 106.8], 5, { animate: true });
    showToast(`🎉 Đã tạo nhật ký "${res.user.name}"! Hãy thêm địa điểm đầu tiên nhé.`);
  } catch (e) {
    showErr('Lỗi kết nối Google Sheets. Kiểm tra mạng hoặc deploy lại Apps Script!');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Tạo nhật ký ngay';
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
    sessionPin = '';
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
  const desc = document.getElementById('pin-modal-desc');
  if (desc) desc.textContent = `Nhập mã PIN của "${currentUser.name}" để thêm địa điểm, tích chọn hoặc chỉnh sửa nhật ký này.`;
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

async function submitPin() {
  const input = document.getElementById('pin-input');
  const err = document.getElementById('pin-error');
  const btn = document.getElementById('pin-submit-btn');
  const val = input.value.trim();
  if (!val) return;

  err.classList.add('hidden');
  if (btn) { btn.disabled = true; btn.textContent = 'Đang kiểm tra...'; }
  try {
    const res = await postCloudJson({ action: 'verifyPin', user: currentUserId, pin: val });
    if (res && res.status === 'success') {
      sessionPin = val;
      isOwnerMode = true;
      closePinModal();
      updateModeUI();
      showToast(`Đã mở khóa chỉnh sửa nhật ký "${currentUser.name}"!`);
    } else {
      err.textContent = (res && res.message) || 'Mã PIN không chính xác, vui lòng thử lại!';
      err.classList.remove('hidden');
    }
  } catch (e) {
    err.textContent = 'Không kết nối được server để xác thực PIN. Hãy kiểm tra mạng hoặc deploy lại Apps Script!';
    err.classList.remove('hidden');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Xác nhận'; }
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

  if (isSoloMode()) {
    const st = getBadgeStats();
    const totalProvs = typeof VN_PROVINCES_GEOJSON !== 'undefined' ? VN_PROVINCES_GEOJSON.features.length : 63;
    const sp = document.getElementById('stat-solo-provinces');
    const sf = document.getElementById('stat-solo-food');
    const sr = document.getElementById('stat-solo-reactions');
    if (sp) sp.textContent = `${st.provinces}/${totalProvs} tỉnh`;
    if (sf) sf.textContent = `${st.food} món`;
    if (sr) sr.textContent = `${st.reactions} lượt`;
  }
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
  if (isSoloMode()) {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">📍 Đã ghé thăm</span>`;
  }
  const lbl = getWhoLabels();
  if (isOwnerMode) {
    return `
                <select onchange="changeDestinationWho('${dest.id}', this.value)" class="text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${dest.who === 'both' ? 'bg-rose-50 text-rose-700 border-rose-200' :
        dest.who === 'husband' ? 'bg-sky-50 text-sky-700 border-sky-200' :
          'bg-purple-50 text-purple-700 border-purple-200'
      }">
                    <option value="both" ${dest.who === 'both' ? 'selected' : ''}>❤️ ${lbl.both}</option>
                    <option value="husband" ${dest.who === 'husband' ? 'selected' : ''}>💙 ${lbl.husband}</option>
                    <option value="wife" ${dest.who === 'wife' ? 'selected' : ''}>🌸 ${lbl.wife}</option>
                </select>
            `;
  }
  if (dest.who === 'both') {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">❤️ ${lbl.both}</span>`;
  } else if (dest.who === 'husband') {
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">💙 ${lbl.husband}</span>`;
  }
  return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">🌸 ${lbl.wife}</span>`;
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
    if (destinations.length === 0) {
      grid.innerHTML = `
                <div class="col-span-full bg-white rounded-3xl border border-dashed border-stone-300 p-10 text-center">
                    <div class="text-3xl mb-2">🗺️</div>
                    <p class="text-sm font-bold text-stone-800">Bản đồ của ${escapeHtml(currentUser.name)} đang trống!</p>
                    <p class="text-xs text-stone-500 mt-1">${isOwnerMode ? 'Bấm nút bên dưới để thêm địa điểm đầu tiên và bắt đầu tô màu bản đồ Việt Nam.' : 'Chủ nhân chưa thêm địa điểm nào. Nếu đây là nhật ký của bạn, hãy mở khóa bằng mã PIN để thêm địa điểm.'}</p>
                    <button onclick="openAddDestinationModal()" class="mt-4 px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5">
                        <i class="fa-solid fa-plus"></i> Thêm địa điểm đầu tiên
                    </button>
                </div>
            `;
      return;
    }
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
    const borderAccent = isSoloMode() ? 'border-amber-200/80' : dest.who === 'both' ? 'border-rose-200/80' : dest.who === 'husband' ? 'border-sky-200/80' : 'border-purple-200/80';

    return `
                <div id="card-${dest.id}" class="bg-white rounded-3xl border ${borderAccent} shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden">
                    <div class="p-5">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <span class="text-[11px] font-medium text-stone-400">${dest.region}</span>
                                <h3 class="font-bold text-stone-900 text-base leading-snug cursor-pointer hover:text-terracotta-600 transition inline-flex items-center gap-1" onclick="focusOnMap(${dest.lat}, ${dest.lng}, '${dest.id}')" onmouseenter="showNamePhotoPreview(event, '${dest.id}')" onmouseleave="hideNamePhotoPreview()">
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
                                    <div class="h-full rounded-full transition-all duration-300 ${isSoloMode() ? 'bg-terracotta-500' : dest.who === 'both' ? 'bg-rose-500' : dest.who === 'husband' ? 'bg-sky-500' : 'bg-purple-500'
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

                    <!-- Reaction của khách -->
                    <div class="px-4 pb-3 pt-2 flex items-center gap-1.5 border-t border-stone-50">
                        ${REACTIONS.map(em => {
        const ids = (dest.reactions && dest.reactions[em]) || [];
        const mine = ids.includes(getClientId());
        return `<button onclick="toggleReaction('${dest.id}', '${em}')" class="reaction-btn ${mine ? 'reaction-on' : ''}"><span class="reaction-emoji">${em}</span><span class="reaction-count">${ids.length || ''}</span></button>`;
      }).join('')}
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
  renderBadges();
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

  map.createPane('provincePane').style.zIndex = 350; // dưới marker, trên nền bản đồ
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

// ==========================================
// 5b. TÔ MÀU CÁC TỈNH ĐÃ ĐI
// ==========================================
let provinceLayer = null;
let provinceLegend = null;
const provinceCache = {}; // id địa điểm -> tên tỉnh

function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

function distToRing(x, y, ring) {
  let best = Infinity;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i], [x2, y2] = ring[i + 1];
    const dx = x2 - x1, dy = y2 - y1;
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / ((dx * dx + dy * dy) || 1e-12)));
    best = Math.min(best, Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)));
  }
  return best;
}

// Tìm tỉnh chứa toạ độ; nếu rơi ngoài (đảo, ven biển) thì lấy tỉnh gần nhất trong ~0.2°
function findProvince(lat, lng) {
  if (typeof VN_PROVINCES_GEOJSON === 'undefined') return null;
  let nearest = null, nearestD = 0.2;
  for (const f of VN_PROVINCES_GEOJSON.features) {
    for (const poly of f.geometry.coordinates) {
      const ring = poly[0];
      if (pointInRing(lng, lat, ring)) return f.properties.name;
      const d = distToRing(lng, lat, ring);
      if (d < nearestD) { nearestD = d; nearest = f.properties.name; }
    }
  }
  return nearest;
}

const PROVINCE_COLORS = {
  both:    { stroke: '#E11D48', fill: '#F43F5E', opacity: 0.46, label: '❤️ Cả hai cùng đi', icon: '❤️' },
  husband: { stroke: '#0284C7', fill: '#38BDF8', opacity: 0.46, label: '💙 Chồng đã đi',    icon: '💙' },
  wife:    { stroke: '#9333EA', fill: '#C084FC', opacity: 0.46, label: '🌸 Vợ đã đi',       icon: '🌸' },
  mixed:   { stroke: '#D97706', fill: '#FBBF24', opacity: 0.46, label: '✨ Cả 2 đi riêng',  icon: '✨' },
  solo:    { stroke: '#C2410C', fill: '#F97316', opacity: 0.48, label: '📍 Đã ghé thăm',    icon: '📍' }
};

function getVisitedProvincesMap() {
  const visited = {};
  if (typeof VN_PROVINCES_GEOJSON === 'undefined') return visited;
  destinations.forEach(d => {
    const lat = Number(d.lat), lng = Number(d.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const key = d.id + '|' + lat + '|' + lng;
    if (!(key in provinceCache)) provinceCache[key] = findProvince(lat, lng);
    const prov = provinceCache[key];
    if (!prov) return;
    if (!visited[prov]) visited[prov] = { places: [], hasBoth: false, hasHusband: false, hasWife: false, status: 'both' };
    const entry = visited[prov];
    entry.places.push({ name: d.name, who: d.who || 'both' });
    if (d.who === 'both') entry.hasBoth = true;
    else if (d.who === 'husband') entry.hasHusband = true;
    else if (d.who === 'wife') entry.hasWife = true;
  });
  Object.values(visited).forEach(entry => {
    if (isSoloMode()) { entry.status = 'solo'; return; }
    if (entry.hasBoth) entry.status = 'both';
    else if (entry.hasHusband && entry.hasWife) entry.status = 'mixed';
    else if (entry.hasHusband) entry.status = 'husband';
    else entry.status = 'wife';
  });
  return visited;
}

function getProvinceStyle(entry) {
  if (!entry) return { color: '#A8A29E', weight: 0.6, fillColor: '#ffffff', fillOpacity: 0.05 };
  const c = PROVINCE_COLORS[entry.status] || PROVINCE_COLORS.both;
  return { color: c.stroke, weight: 1.3, fillColor: c.fill, fillOpacity: c.opacity };
}

function updateProvinceLayer() {
  if (!map || typeof VN_PROVINCES_GEOJSON === 'undefined') return;
  const visited = getVisitedProvincesMap();

  if (provinceLayer) map.removeLayer(provinceLayer);
  provinceLayer = L.geoJSON(VN_PROVINCES_GEOJSON, {
    pane: 'provincePane',
    style: f => getProvinceStyle(visited[f.properties.name]),
    onEachFeature: (f, layer) => {
      const entry = visited[f.properties.name];
      if (entry) {
        const lbl = getWhoLabels();
        const statusLabel = isSoloMode() ? '📍 Đã ghé thăm'
          : entry.status === 'both' ? `❤️ ${lbl.both}`
          : entry.status === 'husband' ? `💙 ${lbl.husband}`
          : entry.status === 'wife' ? `🌸 ${lbl.wife}`
          : '✨ Cả 2 đi riêng';
        const lines = entry.places.map(p => {
          const ic = isSoloMode() ? '📍' : p.who === 'both' ? '❤️' : p.who === 'husband' ? '💙' : '🌸';
          return `${ic} ${escapeHtml(p.name)}`;
        }).join('<br>');
        layer.bindTooltip(
          `<b>${escapeHtml(f.properties.name)}</b> <span style="opacity:.75">(${statusLabel})</span><br>${lines}`,
          { sticky: true }
        );
        layer.on('mouseover', () => layer.setStyle({ weight: 2.2, fillOpacity: 0.68 }));
        layer.on('mouseout', () => provinceLayer && provinceLayer.resetStyle(layer));
      } else {
        layer.bindTooltip(escapeHtml(f.properties.name), { sticky: true });
      }
    }
  }).addTo(map);

  const total = VN_PROVINCES_GEOJSON.features.length;
  const entries = Object.values(visited);
  const count = entries.length;
  const cBoth = entries.filter(e => e.status === 'both').length;
  const cHusband = entries.filter(e => e.status === 'husband').length;
  const cWife = entries.filter(e => e.status === 'wife').length;
  const cMixed = entries.filter(e => e.status === 'mixed').length;

  if (!provinceLegend) {
    provinceLegend = L.control({ position: 'bottomleft' });
    provinceLegend.onAdd = () => {
      const div = L.DomUtil.create('div', 'province-legend');
      return div;
    };
    provinceLegend.addTo(map);
  }
  if (isSoloMode()) {
    provinceLegend.getContainer().innerHTML =
      `<div class="province-legend-title">🗺️ Đã đi <b>${count}/${total}</b> tỉnh thành</div>` +
      `<div class="province-legend-bar"><span style="width:${(count / total * 100).toFixed(1)}%;background:#F97316"></span></div>`;
  } else {
    provinceLegend.getContainer().innerHTML =
      `<div class="province-legend-title">🗺️ Đã đi <b>${count}/${total}</b> tỉnh thành</div>` +
      `<div class="province-legend-bar">` +
        `<span style="width:${(cBoth / total * 100).toFixed(1)}%;background:#F43F5E"></span>` +
        `<span style="width:${(cHusband / total * 100).toFixed(1)}%;background:#38BDF8"></span>` +
        `<span style="width:${(cWife / total * 100).toFixed(1)}%;background:#C084FC"></span>` +
        `<span style="width:${(cMixed / total * 100).toFixed(1)}%;background:#FBBF24"></span>` +
      `</div>` +
      `<div class="province-legend-dots">` +
        `<span><i style="background:#F43F5E"></i>${getWhoLabels().bothMap} (${cBoth})</span>` +
        `<span><i style="background:#38BDF8"></i>${getWhoLabels().husbandMap} (${cHusband})</span>` +
        `<span><i style="background:#C084FC"></i>${getWhoLabels().wifeMap} (${cWife})</span>` +
        (cMixed ? `<span><i style="background:#FBBF24"></i>Riêng (${cMixed})</span>` : '') +
      `</div>`;
  }
}

function renderMapMarkers() {
  if (!map || !markersLayer) return;
  markersLayer.clearLayers();
  updateProvinceLayer();

  destinations.forEach(dest => {
    const items = dest.items || [];
    const checkedCount = items.filter(i => i.checked).length;
    const pinClass = isSoloMode() ? 'pin-solo' : dest.who === 'both' ? 'pin-both' : dest.who === 'husband' ? 'pin-husband' : 'pin-wife';
    const lbl = getWhoLabels();
    const whoText = isSoloMode() ? '📍 Đã ghé thăm' : dest.who === 'both' ? `❤️ ${lbl.both}` : dest.who === 'husband' ? `💙 ${lbl.husband}` : `🌸 ${lbl.wife}`;

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
  const who = isSoloMode() ? 'solo' : document.getElementById('new-dest-who').value;
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

// ---- Hover tên địa danh: hiện 2 ảnh thắng cảnh ----
const scenicDynamicCache = {};
let namePhotoHoverToken = 0;

function lookupCuratedScenic(dest) {
  if (typeof SCENIC_PHOTOS === 'undefined' || !dest) return null;
  if (SCENIC_PHOTOS[dest.id]) return SCENIC_PHOTOS[dest.id];
  const norm = removeAccents(dest.name || '').replace(/[^a-z0-9]+/g, ' ').trim();
  for (const [key, urls] of Object.entries(SCENIC_PHOTOS)) {
    const kw = key.replace(/-/g, ' ');
    if (norm.includes(kw)) return urls;
  }
  return null;
}

async function fetchScenicPhotos(dest) {
  const cacheKey = dest.id;
  if (scenicDynamicCache[cacheKey]) return scenicDynamicCache[cacheKey];
  const baseName = (dest.name || '').split(/[-–(]/)[0].trim();
  const q = `${baseName} Vietnam filetype:bitmap`;
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=480&format=json&origin=*&gsrsearch=' + encodeURIComponent(q);
  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = Object.values((data.query && data.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    const bad = /map|flag|logo|seal|coat|icon|bản đồ|chart|diagram|portrait|document|insect|specimen|192\d|193\d/i;
    const urls = [];
    for (const p of pages) {
      if (bad.test(p.title || '')) continue;
      const ii = (p.imageinfo && p.imageinfo[0]) || {};
      if (ii.mime === 'image/jpeg' && ii.width >= 800 && ii.height > 0 && ii.width / ii.height >= 1.15 && ii.width / ii.height <= 2.2) {
        urls.push((ii.thumburl || ii.url).split('?')[0]);
        if (urls.length >= 2) break;
      }
    }
    scenicDynamicCache[cacheKey] = urls;
    return urls;
  } catch (e) {
    return [];
  }
}

function positionNamePhotoBox(box, targetEl) {
  const r = targetEl.getBoundingClientRect();
  const w = box.offsetWidth || 360;
  const h = box.offsetHeight || 160;
  const vw = window.innerWidth, vh = window.innerHeight;
  let left = Math.max(8, Math.min(r.left, vw - w - 8));
  let top = r.top - h - 10;
  if (top < 8) top = Math.min(r.bottom + 10, vh - h - 8);
  box.style.left = `${left}px`;
  box.style.top = `${top}px`;
}

function renderNamePhotoBox(box, dest, urls, loading) {
  const grid = document.getElementById('hover-name-photos-grid');
  const cap = document.getElementById('hover-name-photos-caption');
  if (loading) {
    grid.innerHTML = '<div class="scenic-thumb animate-pulse"></div><div class="scenic-thumb animate-pulse"></div>';
    cap.innerHTML = `<span>✨ ${escapeHtml(dest.name)}</span><span class="text-[10px] text-stone-400 font-normal">Đang tải ảnh...</span>`;
    return;
  }
  if (!urls || !urls.length) {
    box.classList.add('hidden');
    return;
  }
  grid.innerHTML = urls.slice(0, 2).map(u =>
    `<img src="${u}" referrerpolicy="no-referrer" alt="${escapeHtml(dest.name)}" class="scenic-thumb" onerror="this.style.display='none'">`
  ).join('');
  cap.innerHTML = `<span class="truncate">✨ ${escapeHtml(dest.name)}</span><span class="text-[10px] text-stone-400 font-normal shrink-0 ml-2">Bấm để xem trên bản đồ</span>`;
}

async function showNamePhotoPreview(event, destId) {
  const dest = destinations.find(d => d.id === destId);
  if (!dest) return;
  const box = document.getElementById('hover-name-photos');
  if (!box) return;
  const target = event.currentTarget;
  const token = ++namePhotoHoverToken;

  const curated = lookupCuratedScenic(dest) || scenicDynamicCache[dest.id];
  box.classList.remove('hidden', 'scenic-card-show');
  void box.offsetWidth;
  box.classList.add('scenic-card-show');

  if (curated) {
    renderNamePhotoBox(box, dest, curated, false);
    positionNamePhotoBox(box, target);
    return;
  }

  renderNamePhotoBox(box, dest, null, true);
  positionNamePhotoBox(box, target);
  const fetched = await fetchScenicPhotos(dest);
  if (token !== namePhotoHoverToken || box.classList.contains('hidden')) return;
  renderNamePhotoBox(box, dest, fetched, false);
  positionNamePhotoBox(box, target);
}

function hideNamePhotoPreview() {
  namePhotoHoverToken++;
  const box = document.getElementById('hover-name-photos');
  if (box) box.classList.add('hidden');
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
    await postCloudJson({
      action: 'comment',
      user: currentUserId,
      id: comment.id,
      destId,
      name: comment.name,
      text: comment.text,
      time: comment.time
    });
  } catch (e) { console.warn('Không gửi được bình luận lên cloud:', e.message); }
}

async function deleteCommentOnCloud(id) {
  if (!GOOGLE_SHEET_API_URL || !sessionPin) return;
  try {
    await postCloudJson({
      action: 'deleteComment',
      user: currentUserId,
      pin: sessionPin,
      id
    });
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
  saveLocalCache();
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
// 7c. REACTION (❤️ 😂 😮) TRÊN THẺ ĐỊA ĐIỂM
// ==========================================
const REACTIONS = ['❤️', '😂', '😮'];

function getClientId() {
  let id = null;
  try { id = localStorage.getItem('nhat-ky-client-id'); } catch (e) { }
  if (!id) {
    id = 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem('nhat-ky-client-id', id); } catch (e) { }
  }
  return id;
}

function toggleReaction(destId, emoji) {
  const dest = destinations.find(d => d.id === destId);
  if (!dest || !REACTIONS.includes(emoji)) return;
  const me = getClientId();
  if (!dest.reactions) dest.reactions = {};
  const arr = dest.reactions[emoji] || (dest.reactions[emoji] = []);
  const i = arr.indexOf(me);
  if (i >= 0) arr.splice(i, 1); else arr.push(me);

  saveLocalCache();
  renderCards();
  renderBadges();
  postReactionToCloud(destId, emoji, me);
}

async function postReactionToCloud(destId, emoji, clientId) {
  if (!GOOGLE_SHEET_API_URL) return;
  try {
    await postCloudJson({
      action: 'react',
      user: currentUserId,
      destId,
      emoji,
      clientId
    });
  } catch (e) { console.warn('Không gửi được reaction:', e.message); }
}

// ==========================================
// 7d. HUY HIỆU THÀNH TÍCH (32 huy hiệu gọn nhẹ)
// ==========================================
const BADGE_SEEN_KEY = 'nhat-ky-badges-earned';
let currentBadgeFilter = 'all';

function setBadgeFilter(f) {
  currentBadgeFilter = f;
  document.querySelectorAll('.bfilter-btn').forEach(btn => {
    const active = btn.dataset.bfilter === f;
    btn.className = active
      ? 'bfilter-btn px-2 py-0.5 rounded-lg font-semibold bg-stone-800 text-white transition'
      : 'bfilter-btn px-2 py-0.5 rounded-lg font-medium bg-stone-100 text-stone-600 hover:bg-stone-200 transition';
  });
  renderBadges();
}

function getBadgeStats() {
  const st = {
    places: destinations.length, provinces: 0, north: 0, central: 0, south: 0,
    both: 0, husband: 0, wife: 0, food: 0, exp: 0, sight: 0, checked: 0,
    photos: 0, comments: 0, reactions: 0, perfect: 0
  };
  destinations.forEach(d => {
    if (d.region === 'Miền Bắc') st.north++;
    else if (d.region === 'Miền Trung') st.central++;
    else if (d.region === 'Miền Nam') st.south++;
    if (d.who === 'both') st.both++;
    else if (d.who === 'husband') st.husband++;
    else if (d.who === 'wife') st.wife++;
    const items = d.items || [];
    items.forEach(i => {
      if (!i.checked) return;
      st.checked++;
      if (i.type === 'food') st.food++;
      else if (i.type === 'exp') st.exp++;
      else st.sight++;
    });
    if (items.length >= 1 && items.every(i => i.checked)) st.perfect++;
    st.photos += (d.photos || []).length;
    st.comments += (d.comments || []).length;
    Object.values(d.reactions || {}).forEach(a => { if (Array.isArray(a)) st.reactions += a.length; });
  });
  st.provinces = Object.keys(getVisitedProvincesMap()).length;
  st.regions = (st.north > 0) + (st.central > 0) + (st.south > 0);
  st.allWho = (st.both > 0) + (st.husband > 0) + (st.wife > 0);
  return st;
}

const BADGES = [
  // Số địa điểm
  { id: 'first', icon: '🌱', title: 'Khởi hành', desc: 'Có địa điểm đầu tiên', stat: 'places', target: 1 },
  { id: 'p5', icon: '🎒', title: 'Lữ hành', desc: 'Đi 5 địa điểm', stat: 'places', target: 5 },
  { id: 'p10', icon: '🧭', title: 'Thám hiểm', desc: 'Đi 10 địa điểm', stat: 'places', target: 10 },
  { id: 'p15', icon: '✈️', title: 'Mê xê dịch', desc: 'Đi 15 địa điểm', stat: 'places', target: 15 },
  { id: 'p20', icon: '🏆', title: 'Du ký gia', desc: 'Đi 20 địa điểm', stat: 'places', target: 20 },
  { id: 'p30', icon: '👑', title: 'Huyền thoại', desc: 'Đi 30 địa điểm', stat: 'places', target: 30 },
  // Tỉnh thành
  { id: 'prov5', icon: '🗺️', title: '5 tỉnh thành', desc: 'Chạm 5 tỉnh thành Việt Nam', stat: 'provinces', target: 5 },
  { id: 'prov10', icon: '📍', title: '10 tỉnh thành', desc: 'Chạm 10 tỉnh thành Việt Nam', stat: 'provinces', target: 10 },
  { id: 'prov15', icon: '🚗', title: '15 tỉnh thành', desc: 'Chạm 15 tỉnh thành Việt Nam', stat: 'provinces', target: 15 },
  { id: 'prov20', icon: '🚀', title: '20 tỉnh thành', desc: 'Chạm 20 tỉnh thành Việt Nam', stat: 'provinces', target: 20 },
  { id: 'prov32', icon: '🌏', title: 'Nửa Việt Nam', desc: 'Chạm 32/63 tỉnh thành', stat: 'provinces', target: 32 },
  // Miền
  { id: 'north5', icon: '🏔️', title: 'Mê miền Bắc', desc: '5 địa điểm miền Bắc', stat: 'north', target: 5 },
  { id: 'north10', icon: '❄️', title: 'Thổ địa Bắc', desc: '10 địa điểm miền Bắc', stat: 'north', target: 10 },
  { id: 'central5', icon: '🏖️', title: 'Nắng miền Trung', desc: '5 địa điểm miền Trung', stat: 'central', target: 5 },
  { id: 'central10', icon: '🌊', title: 'Duyên hải Trung', desc: '10 địa điểm miền Trung', stat: 'central', target: 10 },
  { id: 'south3', icon: '🌴', title: 'Phương Nam', desc: '3 địa điểm miền Nam', stat: 'south', target: 3 },
  { id: 'regions', icon: '🇻🇳', title: 'Xuyên Việt', desc: 'Đi đủ cả 3 miền Bắc - Trung - Nam', stat: 'regions', target: 3 },
  // Cặp đôi (chỉ hiện ở nhật ký cặp đôi)
  { id: 'both1', icon: '💕', title: 'Chuyến đi đôi', desc: '1 chuyến đi cùng nhau', stat: 'both', target: 1, coupleOnly: true },
  { id: 'both5', icon: '💑', title: 'Đôi uyên ương', desc: '5 chuyến đi cùng nhau', stat: 'both', target: 5, coupleOnly: true },
  { id: 'both10', icon: '💍', title: 'Bạn đồng hành', desc: '10 chuyến đi cùng nhau', stat: 'both', target: 10, coupleOnly: true },
  { id: 'allwho', icon: '🤝', title: 'Đủ mọi mảnh ghép', desc: 'Có điểm của chồng, vợ & cả hai', stat: 'allWho', target: 3, coupleOnly: true },
  // Trải nghiệm & Ẩm thực
  { id: 'food5', icon: '🍜', title: 'Sành ăn', desc: 'Thử 5 món đặc sản', stat: 'food', target: 5 },
  { id: 'food10', icon: '🍲', title: 'Tín đồ ẩm thực', desc: 'Thử 10 món đặc sản', stat: 'food', target: 10 },
  { id: 'food20', icon: '🍽️', title: 'Vua ẩm thực', desc: 'Thử 20 món đặc sản', stat: 'food', target: 20 },
  { id: 'exp10', icon: '✨', title: 'Mê trải nghiệm', desc: 'Hoàn thành 10 trải nghiệm', stat: 'exp', target: 10 },
  { id: 'sight25', icon: '🔭', title: 'Yêu danh thắng', desc: 'Check-in 25 danh thắng', stat: 'sight', target: 25 },
  { id: 'chk50', icon: '🔥', title: '50 dấu mốc', desc: 'Hoàn thành 50 mục trải nghiệm', stat: 'checked', target: 50 },
  { id: 'chk100', icon: '⚡', title: '100 dấu mốc', desc: 'Hoàn thành 100 mục trải nghiệm', stat: 'checked', target: 100 },
  // Hoàn hảo & Tương tác
  { id: 'perf1', icon: '✅', title: 'Trọn vẹn', desc: 'Hoàn thành 100% trải nghiệm ở 1 nơi', stat: 'perfect', target: 1 },
  { id: 'perf5', icon: '🌟', title: 'Cầu toàn', desc: 'Hoàn thành 100% ở 5 địa điểm', stat: 'perfect', target: 5 },
  { id: 'perf10', icon: '💎', title: 'Hoàn mỹ', desc: 'Hoàn thành 100% ở 10 địa điểm', stat: 'perfect', target: 10 },
  { id: 'photo5', icon: '📸', title: 'Nhiếp ảnh gia', desc: 'Lưu 5 ảnh kỷ niệm', stat: 'photos', target: 5 },
  { id: 'cmt5', icon: '💬', title: 'Được yêu mến', desc: 'Nhận 5 bình luận từ bạn bè', stat: 'comments', target: 5 },
  { id: 'react10', icon: '❤️', title: 'Nhiều tim', desc: 'Nhận 10 reaction trên các thẻ', stat: 'reactions', target: 10 }
];

function getActiveBadges() {
  return isSoloMode() ? BADGES.filter(b => !b.coupleOnly) : BADGES;
}

function renderBadges() {
  const box = document.getElementById('badges-grid');
  if (!box) return;
  const st = getBadgeStats();
  const activeBadges = getActiveBadges();
  const earnedNow = [];
  const rows = activeBadges.map(b => {
    const cur = st[b.stat] || 0;
    const done = cur >= b.target;
    if (done) earnedNow.push(b.id);
    return { b, cur, done };
  });

  const visible = rows.filter(r =>
    currentBadgeFilter === 'all' ? true : currentBadgeFilter === 'earned' ? r.done : !r.done
  );
  // Xếp huy hiệu đã đạt lên trước cho gọn mắt
  visible.sort((a, b) => Number(b.done) - Number(a.done));

  box.innerHTML = visible.length ? visible.map(({ b, cur, done }) => `
    <div class="badge-chip ${done ? 'badge-on' : 'badge-off'}" title="${escapeHtml(b.desc)} (${cur}/${b.target})">
      <span class="badge-icon">${b.icon}</span>
      <span class="badge-title">${escapeHtml(b.title)}</span>
      ${done ? '<span class="badge-check">✓</span>' : `<span class="badge-prog">${cur}/${b.target}</span>`}
    </div>`).join('')
    : '<span class="text-xs text-stone-400 py-1">Chưa có huy hiệu nào trong mục này.</span>';

  const totalBadges = activeBadges.length;
  const earnedCount = earnedNow.length;
  const lockedCount = totalBadges - earnedCount;
  const countEl = document.getElementById('badges-count');
  if (countEl) countEl.textContent = `${earnedCount}/${totalBadges}`;
  const ca = document.getElementById('bcount-all');
  const ce = document.getElementById('bcount-earned');
  const cl = document.getElementById('bcount-locked');
  if (ca) ca.textContent = totalBadges;
  if (ce) ce.textContent = earnedCount;
  if (cl) cl.textContent = lockedCount;

  try {
    const seenKey = `${BADGE_SEEN_KEY}_${currentUserId}`;
    const raw = localStorage.getItem(seenKey);
    if (raw) {
      const seen = JSON.parse(raw);
      const fresh = activeBadges.filter(b => earnedNow.includes(b.id) && !seen.includes(b.id));
      if (fresh.length) showToast(`🎉 Huy hiệu mới: ${fresh.map(b => b.icon + ' ' + b.title).join(', ')}`);
    }
    localStorage.setItem(seenKey, JSON.stringify(earnedNow));
  } catch (e) { }
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

  // Đọc ?u=<userId> từ URL nếu có
  const urlUid = new URLSearchParams(window.location.search).get('u');
  if (urlUid && urlUid.trim()) {
    currentUserId = urlUid.trim();
    if (currentUserId !== DEFAULT_USER_ID) {
      currentUser = { id: currentUserId, name: currentUserId, mode: 'solo', subtitle: '' };
    }
  }

  // 1. Nạp dữ liệu cục bộ & khởi tạo giao diện ngay lập tức
  destinations = loadLocalData(currentUserId);
  applyUserProfileUI();
  initMap();
  updateAllUI();

  // 2. Đồng bộ danh sách user + dữ liệu mới nhất từ Google Sheets
  const cloudStatus = await loadFromCloud(currentUserId);
  if (cloudStatus === 'loaded') {
    updateAllUI();
  }
});

// Đóng tất cả modal khi bấm ra vùng nền tối bên ngoài hoặc nhấn Esc
const ALL_MODALS = [
  ['comment-modal', closeCommentModal],
  ['photo-modal', closePhotoModal],
  ['add-dest-modal', closeAddDestinationModal],
  ['pin-modal', closePinModal],
  ['export-modal', closeExportModal],
  ['reset-modal', closeResetModal],
  ['passport-modal', () => typeof closePassportModal === 'function' && closePassportModal()],
  ['create-user-modal', closeCreateUserModal]
];

document.addEventListener('click', e => {
  const wrap = document.getElementById('user-switcher-wrap');
  if (wrap && !wrap.contains(e.target)) closeUserSwitcher();
});

document.addEventListener('mousedown', e => {
  for (const [id, closeFn] of ALL_MODALS) {
    const modal = document.getElementById(id);
    if (modal && e.target === modal) {
      closeFn();
      break;
    }
  }
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  for (const [id, closeFn] of ALL_MODALS) {
    const modal = document.getElementById(id);
    if (modal && !modal.classList.contains('hidden')) {
      closeFn();
      break;
    }
  }
});

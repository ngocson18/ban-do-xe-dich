// 2 ảnh thắng cảnh (Wikimedia Commons) cho mỗi địa danh khi hover vào tên
const SCENIC_PHOTOS = {
  "da-nang": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Dragon_Bridge%2C_Da_Nang%2C_2026_04_30_Reunification_Day_anniversary.jpg/500px-Dragon_Bridge%2C_Da_Nang%2C_2026_04_30_Reunification_Day_anniversary.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg/500px-Golden_Bridge_at_Ba_Na_Hills_20250718.jpg"
  ],
  "hoi-an": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/LANTERNS_OF_HOI_AN_02.jpg/500px-LANTERNS_OF_HOI_AN_02.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Hoi_An_%26_Thu_Bon_River_2024.jpg/500px-Hoi_An_%26_Thu_Bon_River_2024.jpg"
  ],
  "hue": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Gate_in_Imperial_City%2C_Hu%E1%BA%BF_%28III%29.jpg/500px-Gate_in_Imperial_City%2C_Hu%E1%BA%BF_%28III%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg/500px-Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg"
  ],
  "sapa": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Rice_terraces_in_Sapa%2C_Vietnam.jpg/500px-Rice_terraces_in_Sapa%2C_Vietnam.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Fansipan_summit_pagoda_stupa_sea_of_clouds_aerial_view_Sa_Pa_Vietnam.jpg/500px-Fansipan_summit_pagoda_stupa_sea_of_clouds_aerial_view_Sa_Pa_Vietnam.jpg"
  ],
  "cat-ba": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/View_of_the_sea_from_Cannon_Fort_Park_on_Cat_Ba_Island%2C_Vietnam%2C_20240130_1601_4441.jpg/500px-View_of_the_sea_from_Cannon_Fort_Park_on_Cat_Ba_Island%2C_Vietnam%2C_20240130_1601_4441.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Lan_Ha_Bay_and_Ha_Long_Bay.jpg/500px-Lan_Ha_Bay_and_Ha_Long_Bay.jpg"
  ],
  "vinpearl-qn": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Bai_Chay_beach%2C_Ha_Long%2C_Vietnam%2C_20240129_0915_3958.jpg/500px-Bai_Chay_beach%2C_Ha_Long%2C_Vietnam%2C_20240129_0915_3958.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Ha_Long_Bay%2C_Vietnam%2C_Sunset_in_Ha_Long_Bay.jpg/500px-Ha_Long_Bay%2C_Vietnam%2C_Sunset_in_Ha_Long_Bay.jpg"
  ],
  "da-lat": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Da_Lat_-_Xuan_Huong_Lake.jpg/500px-Da_Lat_-_Xuan_Huong_Lake.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Da_Lat_train_station_02.JPG/500px-Da_Lat_train_station_02.JPG"
  ],
  "trang-an": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1456_5313.jpg/500px-Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1456_5313.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Ninh_Binh_cave_river_boating.jpg/500px-Ninh_Binh_cave_river_boating.jpg"
  ],
  "ta-xua": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/N%C3%BAi_non_T%C3%A0_X%C3%B9a_1_-NKS.jpg/500px-N%C3%BAi_non_T%C3%A0_X%C3%B9a_1_-NKS.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/S%E1%BB%91ng_l%C6%B0ng_kh%E1%BB%A7ng_long_T%C3%A0_X%C3%B9a.jpg/500px-S%E1%BB%91ng_l%C6%B0ng_kh%E1%BB%A7ng_long_T%C3%A0_X%C3%B9a.jpg"
  ],
  "ha-long": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/View_of_sea_from_Titov_Island%2C_Ha_Long_Bay%2C_Vietnam%2C_20240128_1337_3732.jpg/500px-View_of_sea_from_Titov_Island%2C_Ha_Long_Bay%2C_Vietnam%2C_20240128_1337_3732.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Ha_Long_Bay_2019-09_01.jpg/500px-Ha_Long_Bay_2019-09_01.jpg"
  ],
  "do-son": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Khu_du_l%E1%BB%8Bch_%C4%90%E1%BB%93_S%C6%A1n%2C_%C4%90%E1%BB%93_S%C6%A1n%2C_H%E1%BA%A3i_Ph%C3%B2ng%2C_Vietnam_-_panoramio.jpg/500px-Khu_du_l%E1%BB%8Bch_%C4%90%E1%BB%93_S%C6%A1n%2C_%C4%90%E1%BB%93_S%C6%A1n%2C_H%E1%BA%A3i_Ph%C3%B2ng%2C_Vietnam_-_panoramio.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Casino-%C4%90%E1%BB%93_s%C6%A1n_H%E1%BA%A3i_ph%C3%B2ng_%2825824765384%29.jpg/500px-Casino-%C4%90%E1%BB%93_s%C6%A1n_H%E1%BA%A3i_ph%C3%B2ng_%2825824765384%29.jpg"
  ],
  "mai-chau": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/C%C3%A1nh_%C4%91%E1%BB%93ng_b%E1%BA%A3n_L%C3%A1c.jpg/500px-C%C3%A1nh_%C4%91%E1%BB%93ng_b%E1%BA%A3n_L%C3%A1c.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Stilt-House-construction-Mai-Chau%2C-Vietnam.jpg/500px-Stilt-House-construction-Mai-Chau%2C-Vietnam.jpg"
  ],
  "khoang-xanh": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/KhoangXanh_-_Be_khoang_nong_23.JPG/500px-KhoangXanh_-_Be_khoang_nong_23.JPG",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Ba_V%C3%AC_National_Park%2C_foggy_road.jpg/500px-Ba_V%C3%AC_National_Park%2C_foggy_road.jpg"
  ],
  "thien-son": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Ba_Vi_Mountain.jpg/500px-Ba_Vi_Mountain.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Ao_Vua_Lake%2C_Ba_Vi_National_Park_%2849357916241%29.jpg/500px-Ao_Vua_Lake%2C_Ba_Vi_National_Park_%2849357916241%29.jpg"
  ],
  "cuc-phuong": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Forest_in_Cuc_Phuong_National_Park_%2815706323528%29.jpg/500px-Forest_in_Cuc_Phuong_National_Park_%2815706323528%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/C%C3%BAc_ph%C6%B0%C6%A1ng3.jpg/500px-C%C3%BAc_ph%C6%B0%C6%A1ng3.jpg"
  ],
  "sam-son": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/B%C3%A3i_bi%E1%BB%83n_S%E1%BA%A7m_S%C6%A1n.JPG/500px-B%C3%A3i_bi%E1%BB%83n_S%E1%BA%A7m_S%C6%A1n.JPG",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Sam_Son_beach_2.JPG/500px-Sam_Son_beach_2.JPG"
  ],
  "ha-tinh": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/N%C3%BAi_H%E1%BB%93ng_L%C4%A9nh%2C_nh%C3%ACn_t%E1%BB%AB_x%C3%A3_V%C6%B0%E1%BB%A3ng_L%E1%BB%99c%2C_huy%E1%BB%87n_Can_L%E1%BB%99c%2C_t%E1%BB%89nh_H%C3%A0_T%C4%A9nh.jpg/500px-N%C3%BAi_H%E1%BB%93ng_L%C4%A9nh%2C_nh%C3%ACn_t%E1%BB%AB_x%C3%A3_V%C6%B0%E1%BB%A3ng_L%E1%BB%99c%2C_huy%E1%BB%87n_Can_L%E1%BB%99c%2C_t%E1%BB%89nh_H%C3%A0_T%C4%A9nh.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/H%E1%BA%A7m_%C4%90%C3%A8o_Ngang%2C_c%E1%BB%ADa_ph%C3%ADa_B%E1%BA%AFc.jpeg/500px-H%E1%BA%A7m_%C4%90%C3%A8o_Ngang%2C_c%E1%BB%ADa_ph%C3%ADa_B%E1%BA%AFc.jpeg"
  ],
  "quang-binh": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Phong_Nha-Ke_Bang_cave3.jpg/500px-Phong_Nha-Ke_Bang_cave3.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Son_Doong_Cave_DB_%281%29.jpg/500px-Son_Doong_Cave_DB_%281%29.jpg"
  ],
  "mang-den": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Th%E1%BB%8B_tr%E1%BA%A5n_M%C4%83ng_%C4%90en.jpg/500px-Th%E1%BB%8B_tr%E1%BA%A5n_M%C4%83ng_%C4%90en.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Pa_S%C4%A9_Waterfall%2C_Mang_Den_Vietnam.jpg/500px-Pa_S%C4%A9_Waterfall%2C_Mang_Den_Vietnam.jpg"
  ],
  "cao-bang": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Ban_Gioc_Waterfall_-_Trung_Kanh_District_-_Cao_Bang_Province_-_Vietnam_-_11_%2848119809353%29.jpg/500px-Ban_Gioc_Waterfall_-_Trung_Kanh_District_-_Cao_Bang_Province_-_Vietnam_-_11_%2848119809353%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Angels_Eye_Mountain_and_Suroundings.jpg/500px-Angels_Eye_Mountain_and_Suroundings.jpg"
  ],
  "moc-chau": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/MocChau.jpg/500px-MocChau.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Bach_Long_glassbridge_2022.jpg/500px-Bach_Long_glassbridge_2022.jpg"
  ],
  "quy-nhon": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Eo_Gi%C3%B3_-_Nh%C6%A1n_L%C3%BD.jpg/500px-Eo_Gi%C3%B3_-_Nh%C6%A1n_L%C3%BD.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Ky_Co_beach%2C_Quy_Nhon_city%2C_Binh_Dinh_province%2C_Vietnam.jpg/500px-Ky_Co_beach%2C_Quy_Nhon_city%2C_Binh_Dinh_province%2C_Vietnam.jpg"
  ],
  "den-hung": [
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/%C4%90%E1%BB%81n_H%C3%B9ng%2C_Ph%C3%BA_Th%E1%BB%8D_%281%29.jpg/500px-%C4%90%E1%BB%81n_H%C3%B9ng%2C_Ph%C3%BA_Th%E1%BB%8D_%281%29.jpg",
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/%C4%90%E1%BB%81n_H%C3%B9ng.JPG/500px-%C4%90%E1%BB%81n_H%C3%B9ng.JPG"
  ]
};

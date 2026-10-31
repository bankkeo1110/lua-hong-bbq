import type { Content } from "./types";

export const SITE = {
  name: "Lửa Hồng BBQ",
  tagline: "Nướng than hoa & bia hơi",
  hours: "16:00 – 00:00 mỗi ngày",
  branches: [
    { name: "Đà Nẵng", address: "88 Võ Nguyên Giáp, quận Sơn Trà", note: "Có chỗ để xe máy và ô tô", phone: "0900 000 001" },
    { name: "Hội An", address: "25 Cửa Đại, thành phố Hội An", note: "Có khu bàn ngoài trời", phone: "0900 000 002" },
  ],
  reviews: [
    { name: "Minh Anh, Đà Nẵng", text: "Ngồi ghế nhựa uống bia hơi, ăn ba chỉ than hoa. Đúng kiểu quán nướng mà dân văn phòng thích." },
    { name: "Quốc Bảo, Hội An", text: "Sườn mật ong thơm, mực sa tế cay vừa. Nhóm 10 người ngồi liền một dãy bàn." },
    { name: "Thu Hà, Đà Nẵng", text: "Quán đông nên đặt bàn trước, nhất là tối thứ Bảy. Nhân viên nhớ mặt khách quen." },
  ],
  partners: ["GrabFood", "ShopeeFood", "BeFood"],
  deliveryFee: 15000,
};

export const SEED: Content = {
  menu: [
    { id: "ba-chi-nuong", category: "thit", name: "Ba chỉ nướng than", desc: "Ba chỉ heo ướp sả, nướng than hoa", price: 89000, unit: "đĩa", available: true },
    { id: "bo-la-lot", category: "thit", name: "Bò lá lốt", desc: "Bò xay cuốn lá lốt, 6 cuốn", price: 79000, unit: "đĩa", available: true },
    { id: "suon-mat-ong", category: "thit", name: "Sườn nướng mật ong", desc: "Sườn non ướp mật ong, thơm và mềm", price: 119000, unit: "đĩa", available: true },
    { id: "nac-vai-sa", category: "thit", name: "Nạc vai nướng sả", desc: "Nạc vai thái dày, ướp sả ớt", price: 85000, unit: "đĩa", available: true },
    { id: "ga-muoi-ot", category: "thit", name: "Gà nướng muối ớt", desc: "Đùi gà rút xương, nướng muối ớt", price: 95000, unit: "đĩa", available: true },
    { id: "muc-sa-te", category: "haisan", name: "Mực nướng sa tế", desc: "Mực tươi nướng, phết sa tế", price: 139000, unit: "con", available: true },
    { id: "tom-muoi-ot", category: "haisan", name: "Tôm nướng muối ớt", desc: "Tôm sú 6 con, nướng muối ớt", price: 129000, unit: "đĩa", available: true },
    { id: "hau-mo-hanh", category: "haisan", name: "Hàu nướng mỡ hành", desc: "Hàu sữa nướng mỡ hành, đậu phộng", price: 25000, unit: "con", available: true },
    { id: "chan-ga", category: "haisan", name: "Chân gà rút xương", desc: "Chân gà nướng sa tế, ăn nhắm bia", price: 69000, unit: "đĩa", available: true },
    { id: "khoai-lang", category: "haisan", name: "Khoai lang nướng", desc: "Khoai lang mật nướng nguyên củ", price: 35000, unit: "phần", available: true },
    { id: "bia-hoi", category: "do-uong", name: "Bia hơi", desc: "Ly 330ml, uống lạnh", price: 15000, unit: "ly", available: true },
    { id: "bia-lon", category: "do-uong", name: "Bia lon", desc: "Bia lon các loại", price: 20000, unit: "lon", available: true },
    { id: "nuoc-ngot", category: "do-uong", name: "Nước ngọt", desc: "Coca, Pepsi, 7Up", price: 20000, unit: "lon", available: true },
  ],
  combos: [
    { id: "combo-hai-dua", name: "Combo Hai Đứa", forWho: "2 – 3 người", items: ["Ba chỉ nướng 300g", "Bò lá lốt 6 cuốn", "Tôm nướng 6 con"], price: 329000, featured: false, available: true },
    { id: "combo-ca-hoi", name: "Combo Cả Hội", forWho: "4 – 5 người", items: ["Ba chỉ nướng 500g", "Sườn nướng mật ong 400g", "Mực nướng sa tế 1 con", "Chân gà rút xương, khoai nướng"], price: 699000, featured: true, available: true },
    { id: "combo-lien-hoan", name: "Combo Liên Hoan", forWho: "8 – 10 người", items: ["Ba chỉ, sườn, nạc vai 1,5kg", "Hải sản nướng tổng hợp", "Hàu nướng 10 con", "Tặng 2 tháp bia hơi"], price: 1499000, featured: false, available: true },
  ],
  promos: [
    {
      slug: "bia-hoi-15k",
      title: "Bia hơi đồng giá 15.000đ mỗi ngày",
      excerpt: "Uống bia hơi lạnh với giá 15.000đ một ly, áp dụng cả ngày ở mọi chi nhánh.",
      body: "Từ nay, bia hơi tại Lửa Hồng BBQ đồng giá 15.000đ một ly 330ml.\n\nƯu đãi áp dụng cả ngày, mọi chi nhánh, không giới hạn số ly.\n\nNhóm từ 6 người được tặng thêm một đĩa mực nướng. Hãy đặt bàn trước để có chỗ ngồi tốt nhất.",
      date: "2026-10-01",
      published: true,
    },
    {
      slug: "combo-sinh-nhat",
      title: "Tổ chức sinh nhật tại quán, tặng bánh kem",
      excerpt: "Đặt combo từ 699.000đ để nhận bánh kem nhỏ và trang trí bàn miễn phí.",
      body: "Sinh nhật ở quán nướng thì vui hơn bạn nghĩ.\n\nKhi đặt Combo Cả Hội hoặc Combo Liên Hoan, bạn được tặng một bánh kem nhỏ và trang trí bàn miễn phí.\n\nVui lòng đặt bàn trước ít nhất 1 ngày và ghi chú \"sinh nhật\" khi đặt.",
      date: "2026-10-15",
      published: true,
    },
  ],
};

export const CATEGORY_LABEL: Record<string, string> = {
  thit: "Thịt nướng",
  haisan: "Hải sản và đồ nhắm",
  "do-uong": "Đồ uống",
};

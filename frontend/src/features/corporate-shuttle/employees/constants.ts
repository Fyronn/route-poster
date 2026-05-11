import type { CorporateEmployee } from "./types";

export const corporateEmployeesMockData: CorporateEmployee[] = [
  {
    id: 1001,
    fullName: "Ayşe Demir",
    department: "Finans",
    email: "ayse.demir@techcorp.com",
    phone: "+90 532 555 10 11",
    homeDistrict: "Kadıköy",
    preferredStop: "Kozyatağı Metro",
    status: "active",
  },
  {
    id: 1002,
    fullName: "Burak Çelik",
    department: "Operasyon",
    email: "burak.celik@techcorp.com",
    phone: "+90 533 555 20 22",
    homeDistrict: "Ümraniye",
    preferredStop: "Çakmak Köprüsü",
    status: "active",
  },
  {
    id: 1003,
    fullName: "Selin Aksoy",
    department: "İnsan Kaynakları",
    email: "selin.aksoy@techcorp.com",
    phone: "+90 534 555 30 33",
    homeDistrict: "Bahçelievler",
    preferredStop: "Yenibosna Metrobüs",
    status: "pending",
  },
  {
    id: 1004,
    fullName: "Emre Yıldız",
    department: "Yazılım",
    email: "emre.yildiz@techcorp.com",
    phone: "+90 535 555 40 44",
    homeDistrict: "Sarıyer",
    preferredStop: "Hacıosman Metro",
    status: "active",
  },
];

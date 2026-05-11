import {
  BriefcaseBusiness,
  Bus,
  CalendarDays,
  GraduationCap,
  Plane,
} from "lucide-react";

import type {
  Client,
  CreateClientFormValues,
  SetupChecklistItem,
} from "./types";
import type { SelectOption, SetupModel, TransportType } from "@/types/common";

export const defaultClientFormValues: CreateClientFormValues = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  taxNumber: "",
  transportType: "corporate-shuttle",
  setupModel: "company-managed",
};

export const transportTypeOptions: Array<
  SelectOption<TransportType> & {
    icon: typeof BriefcaseBusiness;
    modules: string[];
  }
> = [
  {
    label: "Şirket personel servisi",
    value: "corporate-shuttle",
    description: "Şirket çalışanları için servis planlama ve onay akışı",
    icon: BriefcaseBusiness,
    modules: ["employees", "stops", "route requests", "shuttle plan"],
  },
  {
    label: "Okul servisi",
    value: "school-shuttle",
    description: "Öğrenci, veli ve okul servis operasyonları",
    disabled: true,
    badge: "Yakında",
    icon: GraduationCap,
    modules: ["students", "parents", "classes"],
  },
  {
    label: "Şehirler arası otobüs",
    value: "intercity-bus",
    description: "Hat, terminal, bilet ve sefer yönetimi",
    disabled: true,
    badge: "Yakında",
    icon: Bus,
    modules: ["tickets", "seats", "terminals"],
  },
  {
    label: "Özel etkinlik taşımacılığı",
    value: "event-transport",
    description: "Etkinlik, belediye ve grup taşıma operasyonları",
    disabled: true,
    badge: "Yakında",
    icon: CalendarDays,
    modules: ["events", "capacity", "boarding"],
  },
  {
    label: "Özel transfer",
    value: "private-transfer",
    description: "Havalimanı, otel ve VIP transfer planları",
    disabled: true,
    badge: "Yakında",
    icon: Plane,
    modules: ["bookings", "groups", "pickup"],
  },
];

export const setupModelOptions: SelectOption<SetupModel>[] = [
  {
    label: "Kurulumu ABC Turizm yapsın",
    value: "abc-managed",
    description:
      "Çalışan, durak ve rota hazırlığını operasyon ekibi üstlenir.",
  },
  {
    label: "Kurulumu şirket yöneticisi yapsın",
    value: "company-managed",
    description:
      "Şirket yöneticisi çalışanları, durakları ve rota taleplerini girer.",
  },
  {
    label: "Karışık model",
    value: "hybrid",
    description:
      "Şirket veri girişini yapar, ABC Turizm operasyonel düzenlemeleri tamamlar.",
  },
];

export const setupChecklist: SetupChecklistItem[] = [
  {
    id: "client-info",
    title: "Client bilgileri tamamlandı",
    description: "Şirket, yetkili ve iletişim bilgileri oluşturuldu.",
    status: "completed",
    href: "/admin/clients/1",
  },
  {
    id: "invite-manager",
    title: "Şirket yöneticisi davet edilecek",
    description: "Kurulum akışını yürütecek şirket kullanıcısı davet bekliyor.",
    status: "pending",
  },
  {
    id: "employees",
    title: "Çalışanlar eklenecek",
    description: "Servis kullanacak çalışan listesi girilecek.",
    status: "pending",
    href: "/admin/corporate-shuttle/employees",
  },
  {
    id: "stops",
    title: "Durak talepleri girilecek",
    description: "Çalışan lokasyonlarına göre durak önerileri oluşturulacak.",
    status: "pending",
    href: "/admin/corporate-shuttle/stops",
  },
  {
    id: "route-requests",
    title: "Rota talepleri oluşturulacak",
    description: "Vardiya ve yön bilgilerine göre rota talepleri hazırlanacak.",
    status: "pending",
    href: "/admin/corporate-shuttle/route-requests",
  },
  {
    id: "shuttle-plan",
    title: "Servis planı gönderilecek",
    description: "Şirket yöneticisi hazırladığı planı ABC Turizm'e gönderecek.",
    status: "waiting",
    href: "/admin/corporate-shuttle/shuttle-plan",
  },
  {
    id: "abc-approval",
    title: "ABC Turizm onayı bekleniyor",
    description: "Admin planı onaylar, reddeder veya revizyon ister.",
    status: "waiting",
    href: "/admin/shuttle-plan-requests",
  },
  {
    id: "operations",
    title: "Rota ve seferler oluşturuldu",
    description: "Onay sonrası gerçek servis rotaları ve seferler açılır.",
    status: "pending",
    href: "/admin/service-routes",
  },
];

export const clientsMockData: Client[] = [
  {
    id: "CLT-001",
    numericId: 1,
    name: "TechCorp Inc.",
    contactName: "Jane Wilson",
    phone: "+90 212 555 10 20",
    email: "jane.wilson@techcorp.com",
    address: "Maslak Mah. Büyükdere Cad. No: 45",
    city: "İstanbul",
    district: "Sarıyer",
    taxNumber: "1234567890",
    transportType: "corporate-shuttle",
    transportTypeLabel: "Şirket personel servisi",
    setupModel: "company-managed",
    status: "active",
    setupStatus: "waiting",
    employeeCount: 184,
    stopCount: 36,
    routeRequestCount: 7,
  },
  {
    id: "CLT-002",
    numericId: 2,
    name: "Anka Finans",
    contactName: "Mert Kaya",
    phone: "+90 216 555 41 82",
    email: "mert.kaya@ankafinans.com",
    address: "Atatürk Mah. Ataşehir Bulvarı No: 18",
    city: "İstanbul",
    district: "Ataşehir",
    transportType: "corporate-shuttle",
    transportTypeLabel: "Şirket personel servisi",
    setupModel: "hybrid",
    status: "active",
    setupStatus: "revision_requested",
    employeeCount: 92,
    stopCount: 21,
    routeRequestCount: 4,
  },
  {
    id: "CLT-003",
    numericId: 3,
    name: "Nova Üretim A.Ş.",
    contactName: "Elif Arslan",
    phone: "+90 232 555 77 14",
    email: "elif.arslan@novauretim.com",
    address: "Kemalpaşa Organize Sanayi Bölgesi",
    city: "İzmir",
    district: "Kemalpaşa",
    transportType: "corporate-shuttle",
    transportTypeLabel: "Şirket personel servisi",
    setupModel: "abc-managed",
    status: "active",
    setupStatus: "approved",
    employeeCount: 248,
    stopCount: 44,
    routeRequestCount: 11,
  },
];

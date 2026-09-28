import type { TransportLine, University, Coordinates, FilterState } from "../types";

export const ADMIN_CODE = "ht8k";
export const DEFAULT_WHATSAPP = "9647801234567";
export const VIP_FEE = 5000;
export const BASRA_CENTER: Coordinates = { lat: 30.5085, lng: 47.7804 };

export const INITIAL_FILTERS: FilterState = {
  universityId: "all",
  areas: [],
  gender: "all",
  shift: "all",
  maxPrice: 50000,
  query: "",
  sort: "rating",
};

export const UNIVERSITIES: University[] = [
  { id: "uob-karmat", name: "جامعة البصرة - كرمة علي", short: "كرمة علي", location: { lat: 30.5723, lng: 47.7772 } },
  { id: "uob-bab", name: "جامعة البصرة - باب الزبير", short: "باب الزبير", location: { lat: 30.4792, lng: 47.7861 } },
  { id: "maqal", name: "جامعة المعقل", short: "المعقل", location: { lat: 30.5561, lng: 47.8042 } },
  { id: "bogu", name: "جامعة البصرة للنفط والغاز", short: "النفط والغاز", location: { lat: 30.4994, lng: 47.7063 } },
  { id: "stu", name: "الجامعة التقنية الجنوبية", short: "التقنية الجنوبية", location: { lat: 30.5301, lng: 47.8103 } }
];

export const AREAS: string[] = [
  "الزبير",
  "الجبيلة",
  "الجزائر",
  "الطوبة",
  "الهارثة",
  "المعقل",
  "العشار",
  "القبلة",
  "أبو الخصيب",
  "الموفقية",
  "البراضعية",
  "شط العرب"
];

export const AREA_COORDINATES: Record<string, Coordinates> = {
  "الزبير": { lat: 30.3897, lng: 47.708 },
  "الجبيلة": { lat: 30.509, lng: 47.752 },
  "الجزائر": { lat: 30.5562, lng: 47.8135 },
  "الطوبة": { lat: 30.4999, lng: 47.7104 },
  "الهارثة": { lat: 30.6348, lng: 47.7503 },
  "المعقل": { lat: 30.5564, lng: 47.8002 },
  "العشار": { lat: 30.5231, lng: 47.8184 },
  "القبلة": { lat: 30.4903, lng: 47.8006 },
  "أبو الخصيب": { lat: 30.4459, lng: 47.9803 },
  "الموفقية": { lat: 30.5411, lng: 47.8288 },
  "البراضعية": { lat: 30.5011, lng: 47.7742 },
  "شط العرب": { lat: 30.5896, lng: 47.8721 }
};

export const INITIAL_LINES: TransportLine[] = [
  {
    "id": "ln-001",
    "driverName": "أبو مصطفى الجابري",
    "driverPhone": "07701234567",
    "rating": 4.9,
    "ratingCount": 128,
    "universityId": "uob-karmat",
    "fromArea": "الزبير",
    "toArea": "كرمة علي",
    "vehicle": {
      "kind": "van",
      "model": "فان هيونداي H1",
      "seats": 14
    },
    "seatsAvailable": 3,
    "gender": "girls",
    "shift": "morning",
    "monthlyPrice": 45000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": true,
    "vipRequested": true,
    "vipFeePaid": true,
    "departTime": "06:30 ص",
    "returnTime": "02:00 م",
    "status": "active",
    "startPoint": {
      "lat": 30.3897,
      "lng": 47.708
    },
    "note": "نقطة الانطلاق من ساحة الزبير مع مرور على الطوبة.",
    "createdAt": "2026-05-31T05:24:08.614Z"
  },
  {
    "id": "ln-002",
    "driverName": "زينب علي الموسوي",
    "driverPhone": "07811239988",
    "rating": 5,
    "ratingCount": 74,
    "universityId": "maqal",
    "fromArea": "الطوبة",
    "toArea": "المعقل",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون كيا سيراتو",
      "seats": 4
    },
    "seatsAvailable": 4,
    "gender": "girls",
    "shift": "morning",
    "monthlyPrice": 35000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": true,
    "vipRequested": true,
    "vipFeePaid": true,
    "departTime": "07:00 ص",
    "returnTime": "01:30 م",
    "status": "active",
    "startPoint": {
      "lat": 30.4999,
      "lng": 47.7104
    },
    "note": "سائقة تنقل الطالبات فقط، التزام تام بالمواعيد.",
    "createdAt": "2026-06-24T05:24:08.614Z"
  },
  {
    "id": "ln-003",
    "driverName": "محمد رضا الحلفي",
    "driverPhone": "07709876543",
    "rating": 4.9,
    "ratingCount": 61,
    "universityId": "uob-bab",
    "fromArea": "الجبيلة",
    "toArea": "باب الزبير",
    "vehicle": {
      "kind": "sedan",
      "model": "هيونداي أكسنت",
      "seats": 4
    },
    "seatsAvailable": 3,
    "gender": "girls",
    "shift": "morning",
    "monthlyPrice": 30000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "06:45 ص",
    "returnTime": "02:15 م",
    "status": "active",
    "startPoint": {
      "lat": 30.509,
      "lng": 47.752
    },
    "createdAt": "2026-07-02T05:24:08.614Z"
  },
  {
    "id": "ln-004",
    "driverName": "حسن فالح السعدي",
    "driverPhone": "07501122334",
    "rating": 4.8,
    "ratingCount": 45,
    "universityId": "uob-karmat",
    "fromArea": "الجزائر",
    "toArea": "كرمة علي",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون تويوتا كورولا",
      "seats": 4
    },
    "seatsAvailable": 3,
    "gender": "girls",
    "shift": "full",
    "monthlyPrice": 36000,
    "hasAc": true,
    "isPunctual": false,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "07:15 ص",
    "returnTime": "03:00 م",
    "status": "active",
    "startPoint": {
      "lat": 30.5562,
      "lng": 47.8135
    },
    "createdAt": "2026-07-20T05:24:08.614Z"
  },
  {
    "id": "ln-005",
    "driverName": "سجاد كريم الدراجي",
    "driverPhone": "07803344556",
    "rating": 4.7,
    "ratingCount": 39,
    "universityId": "uob-karmat",
    "fromArea": "الهارثة",
    "toArea": "كرمة علي",
    "vehicle": {
      "kind": "van",
      "model": "فان هيونداي H1",
      "seats": 14
    },
    "seatsAvailable": 2,
    "gender": "girls",
    "shift": "morning",
    "monthlyPrice": 36000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "06:20 ص",
    "returnTime": "02:30 م",
    "status": "active",
    "startPoint": {
      "lat": 30.6348,
      "lng": 47.7503
    },
    "createdAt": "2026-07-26T05:24:08.614Z"
  },
  {
    "id": "ln-006",
    "driverName": "علي كاظم الفياض",
    "driverPhone": "07711445566",
    "rating": 4.6,
    "ratingCount": 52,
    "universityId": "uob-bab",
    "fromArea": "الهارثة",
    "toArea": "باب الزبير",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون كيا سيراتو",
      "seats": 4
    },
    "seatsAvailable": 1,
    "gender": "mixed",
    "shift": "evening",
    "monthlyPrice": 36000,
    "hasAc": true,
    "isPunctual": false,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "12:30 م",
    "returnTime": "07:00 م",
    "status": "active",
    "startPoint": {
      "lat": 30.6348,
      "lng": 47.7503
    },
    "createdAt": "2026-08-01T05:24:08.614Z"
  },
  {
    "id": "ln-007",
    "driverName": "كرار باسم الخفاجي",
    "driverPhone": "07721998877",
    "rating": 4.9,
    "ratingCount": 87,
    "universityId": "uob-karmat",
    "fromArea": "الطوبة",
    "toArea": "كرمة علي",
    "vehicle": {
      "kind": "sedan",
      "model": "هيونداي أكسنت",
      "seats": 4
    },
    "seatsAvailable": 3,
    "gender": "girls",
    "shift": "morning",
    "monthlyPrice": 36000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "06:50 ص",
    "returnTime": "02:00 م",
    "status": "active",
    "startPoint": {
      "lat": 30.4999,
      "lng": 47.7104
    },
    "createdAt": "2026-08-07T05:24:08.614Z"
  },
  {
    "id": "ln-008",
    "driverName": "حيدر عبد الأمير",
    "driverPhone": "07733221100",
    "rating": 4.7,
    "ratingCount": 33,
    "universityId": "uob-bab",
    "fromArea": "الجبيلة",
    "toArea": "باب الزبير",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون تويوتا كورولا",
      "seats": 4
    },
    "seatsAvailable": 4,
    "gender": "mixed",
    "shift": "morning",
    "monthlyPrice": 30000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "07:10 ص",
    "returnTime": "02:40 م",
    "status": "active",
    "startPoint": {
      "lat": 30.509,
      "lng": 47.752
    },
    "createdAt": "2026-08-15T05:24:08.614Z"
  },
  {
    "id": "ln-009",
    "driverName": "سجاد البصراوي",
    "driverPhone": "07744556677",
    "rating": 4.6,
    "ratingCount": 28,
    "universityId": "uob-karmat",
    "fromArea": "الجزائر",
    "toArea": "كرمة علي",
    "vehicle": {
      "kind": "van",
      "model": "فان كيا كرنفال",
      "seats": 10
    },
    "seatsAvailable": 4,
    "gender": "mixed",
    "shift": "full",
    "monthlyPrice": 35000,
    "hasAc": true,
    "isPunctual": false,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "07:00 ص",
    "returnTime": "03:30 م",
    "status": "active",
    "startPoint": {
      "lat": 30.5562,
      "lng": 47.8135
    },
    "createdAt": "2026-08-19T05:24:08.614Z"
  },
  {
    "id": "ln-010",
    "driverName": "علي الأسدي",
    "driverPhone": "07755667788",
    "rating": 4.8,
    "ratingCount": 56,
    "universityId": "uob-bab",
    "fromArea": "الطوبة",
    "toArea": "باب الزبير",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون هيونداي النترا",
      "seats": 4
    },
    "seatsAvailable": 3,
    "gender": "mixed",
    "shift": "morning",
    "monthlyPrice": 30000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "06:40 ص",
    "returnTime": "02:10 م",
    "status": "active",
    "startPoint": {
      "lat": 30.4999,
      "lng": 47.7104
    },
    "createdAt": "2026-08-23T05:24:08.614Z"
  },
  {
    "id": "ln-011",
    "driverName": "فاطمة حسن الشمري",
    "driverPhone": "07766778899",
    "rating": 4.9,
    "ratingCount": 41,
    "universityId": "bogu",
    "fromArea": "القبلة",
    "toArea": "النفط والغاز",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون كيا ريو",
      "seats": 4
    },
    "seatsAvailable": 2,
    "gender": "girls",
    "shift": "morning",
    "monthlyPrice": 40000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "07:05 ص",
    "returnTime": "02:20 م",
    "status": "active",
    "startPoint": {
      "lat": 30.4903,
      "lng": 47.8006
    },
    "createdAt": "2026-08-29T05:24:08.614Z"
  },
  {
    "id": "ln-012",
    "driverName": "مرتضى الغانم",
    "driverPhone": "07788990011",
    "rating": 4.5,
    "ratingCount": 22,
    "universityId": "stu",
    "fromArea": "أبو الخصيب",
    "toArea": "التقنية الجنوبية",
    "vehicle": {
      "kind": "bus",
      "model": "باص كوستر 24 راكب",
      "seats": 24
    },
    "seatsAvailable": 8,
    "gender": "mixed",
    "shift": "full",
    "monthlyPrice": 28000,
    "hasAc": true,
    "isPunctual": false,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "06:15 ص",
    "returnTime": "03:45 م",
    "status": "active",
    "startPoint": {
      "lat": 30.4459,
      "lng": 47.9803
    },
    "createdAt": "2026-09-04T05:24:08.614Z"
  },
  {
    "id": "ln-013",
    "driverName": "أحمد نعيم المالكي",
    "driverPhone": "07701239876",
    "rating": 4.4,
    "ratingCount": 18,
    "universityId": "maqal",
    "fromArea": "العشار",
    "toArea": "المعقل",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون تويوتا كامري",
      "seats": 4
    },
    "seatsAvailable": 2,
    "gender": "mixed",
    "shift": "evening",
    "monthlyPrice": 32000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "01:00 م",
    "returnTime": "07:30 م",
    "status": "active",
    "startPoint": {
      "lat": 30.5231,
      "lng": 47.8184
    },
    "createdAt": "2026-09-10T05:24:08.614Z"
  },
  {
    "id": "ln-014",
    "driverName": "رقية عبد الله",
    "driverPhone": "07822334455",
    "rating": 4.8,
    "ratingCount": 26,
    "universityId": "stu",
    "fromArea": "الموفقية",
    "toArea": "التقنية الجنوبية",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون كيا سيراتو",
      "seats": 4
    },
    "seatsAvailable": 3,
    "gender": "girls",
    "shift": "morning",
    "monthlyPrice": 33000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": false,
    "vipFeePaid": false,
    "departTime": "07:00 ص",
    "returnTime": "02:00 م",
    "status": "active",
    "startPoint": {
      "lat": 30.5411,
      "lng": 47.8288
    },
    "createdAt": "2026-09-16T05:24:08.614Z"
  },
  {
    "id": "ln-101",
    "driverName": "مهند سعد الخفاجي",
    "driverPhone": "07701234567",
    "rating": 0,
    "ratingCount": 0,
    "universityId": "bogu",
    "fromArea": "الجزائر",
    "toArea": "النفط والغاز",
    "vehicle": {
      "kind": "van",
      "model": "فان هيونداي H1",
      "seats": 14
    },
    "seatsAvailable": 10,
    "gender": "mixed",
    "shift": "morning",
    "monthlyPrice": 40000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": true,
    "vipFeePaid": true,
    "departTime": "06:30 ص",
    "returnTime": "02:00 م",
    "status": "pending",
    "startPoint": {
      "lat": 30.5562,
      "lng": 47.8135
    },
    "note": "أستطيع تغطية طريق الجزائر - المعقل أيضاً.",
    "createdAt": "2026-09-26T05:24:08.614Z"
  },
  {
    "id": "ln-102",
    "driverName": "نور الهدى جاسم",
    "driverPhone": "07803344556",
    "rating": 0,
    "ratingCount": 0,
    "universityId": "maqal",
    "fromArea": "الجزائر",
    "toArea": "المعقل",
    "vehicle": {
      "kind": "sedan",
      "model": "صالون كيا سيراتو",
      "seats": 4
    },
    "seatsAvailable": 4,
    "gender": "girls",
    "shift": "morning",
    "monthlyPrice": 40000,
    "hasAc": true,
    "isPunctual": true,
    "isVip": false,
    "vipRequested": true,
    "vipFeePaid": true,
    "departTime": "07:00 ص",
    "returnTime": "01:45 م",
    "status": "pending",
    "startPoint": {
      "lat": 30.5562,
      "lng": 47.8135
    },
    "createdAt": "2026-09-27T05:24:08.614Z"
  }
];

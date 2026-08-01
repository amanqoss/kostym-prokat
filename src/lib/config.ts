export const WHATSAPP_PHONE = "77781720418";

export const COMPANY = {
  name: "Prokat_kids",
  address: "проспект Султана Бейбарыса, 532а, 2 этаж",
  city: "Атырау",
  phone: "+7 778 172 04 18",
  hours: "с 10:00 до 19:00",
  twoGisUrl: "https://go.2gis.com/kDDH5",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

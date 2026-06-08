import { 
  Plus, 
  Trash2, 
  Cpu, 
  Sofa, 
  PenTool, 
  Wifi, 
  FolderOpen 
} from "lucide-react";

const ICON_MAP = {
  elektronik: <Cpu size={20} />,
  furnitur: <Sofa size={20} />,
  atk: <PenTool size={20} />,
  jaringan: <Wifi size={20} />
};

const INITIAL_CATEGORIES = [
  {
    id: "CAT-1",
    name: "Elektronik & Gadget",
    description: "Perangkat pintar, PC, laptop, monitor, dan aksesoris hardware.",
    skuCount: 2,
    iconStyle: "elektronik"
  },
  {
    id: "CAT-2",
    name: "Furnitur & Meja Kerja",
    description: "Kursi ergonomis, meja lipat, lemari arsip, dan tata ruang kerja.",
    skuCount: 2,
    iconStyle: "furnitur"
  },
  {
    id: "CAT-3",
    name: "Alat Tulis Kantor (ATK)",
    description: "Kertas A4, pena, tinta printer, map, dan peralatan cetak.",
    skuCount: 1,
    iconStyle: "atk"
  },
  {
    id: "CAT-4",
    name: "Perangkat Jaringan",
    description: "Router, network switch, kabel LAN, access point, dan server rack.",
    skuCount: 1,
    iconStyle: "jaringan"
  }
];
export { INITIAL_CATEGORIES, ICON_MAP };
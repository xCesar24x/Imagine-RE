export interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  sqft: number;
  suites: number;
  vibeTags: string[];
  description: string;
  image: string;
  panorama: string;
  type: string[] | string;
  segment: ("Luxury" | "Standard" | "Commercial")[] | "Luxury" | "Standard" | "Commercial";
  m2?: number;
  acres?: number;
  province: "San José" | "Alajuela" | "Cartago" | "Heredia" | "Guanacaste" | "Puntarenas" | "Limón";
  lifestyle: "Naturaleza" | "Ciudad";
  status: "Disponible" | "Opcionada" | "Vendida" | "Destacada";
  approxLocation: string;
  // Security-First Logistics & Style of Life Metrics
  elevationM: number;
  airportDistKm: number;
  airportTimeMin: number;
  closestCity: string;
  cityDistKm: number;
  medicalDistMin: number;
  hasFiberOptic: boolean;
  hasStarlink: boolean;
  gallery?: string[];
  nameEs?: string;
  descriptionEs?: string;
  refCode?: string;
  fincaRegistryNum?: string;
  catasterMapNum?: string;
  amenities?: string[];
  currency?: "USD" | "CRC";
  commissionType?: "percentage" | "fixed";
  commissionValue?: number;
  commissionAmount?: number;
  lotSizeM2?: number;
  constructionSizeM2?: number;
}

export interface PropertyType {
  id: string;
  nameEs: string;
  nameEn: string;
  visible: boolean;
}

export const DEFAULT_PROPERTY_TYPES: PropertyType[] = [
  { id: "Casa", nameEs: "Casa", nameEn: "House", visible: true },
  { id: "Apartamento", nameEs: "Apartamento", nameEn: "Apartment", visible: true },
  { id: "Condominio", nameEs: "Condominio", nameEn: "Condo", visible: true },
  { id: "Villa Exclusiva", nameEs: "Villa Exclusiva", nameEn: "Exclusive Villa", visible: true },
  { id: "Cabaña", nameEs: "Cabaña", nameEn: "Cabin", visible: true },
  { id: "Quinta", nameEs: "Quinta", nameEn: "Estate", visible: true },
  { id: "Quinta de Descanso", nameEs: "Quinta de Descanso", nameEn: "Rest Quinta", visible: true },
  { id: "Lote", nameEs: "Lote", nameEn: "Lot", visible: true },
  { id: "Terreno de Montaña", nameEs: "Terreno de Montaña", nameEn: "Mountain Land", visible: true },
  { id: "Finca", nameEs: "Finca / Finca Agrícola", nameEn: "Farm / Ranch", visible: true },
  { id: "Edificio", nameEs: "Edificio Comercial", nameEn: "Commercial Building", visible: true },
  { id: "Bodega", nameEs: "Bodega / Local", nameEn: "Warehouse / Retail Space", visible: true },
  { id: "Oficina", nameEs: "Oficina", nameEn: "Office", visible: true },
  { id: "Penthouse", nameEs: "Penthouse", nameEn: "Penthouse", visible: true },
  { id: "Hotel", nameEs: "Hotel / Hostal", nameEn: "Hotel / B&B", visible: true }
];

export interface Region {
  id: string;
  name: string;
  province: string;
  visible: boolean;
}

export const PROVINCE_REGIONS: Record<string, string[]> = {
  "San José": [
    "San José Centro", "Escazú", "Desamparados", "Puriscal", "Tarrazú", "Aserrí", "Mora", "Goicoechea", "Santa Ana", "Alajuelita", "Vázquez de Coronado", "Acosta", "Tibás", "Moravia", "Montes de Oca", "Turrubares", "Dota", "Curridabat", "Pérez Zeledón", "León Cortés Castro"
  ],
  "Alajuela": [
    "Alajuela Centro", "San Ramón", "Grecia", "San Mateo", "Atenas", "Naranjo", "Palmares", "Poás", "Orotina", "San Carlos", "Zarcero", "Valverde Vega (Sarchí)", "Upala", "Los Chiles", "Guatuso", "Río Cuarto"
  ],
  "Cartago": [
    "Cartago Centro", "Paraíso", "La Unión", "Jiménez", "Turrialba", "Alvarado", "Oreamuno", "El Guarco"
  ],
  "Heredia": [
    "Heredia Centro", "Barva", "Santo Domingo", "Santa Bárbara", "San Rafael", "San Isidro", "Belén", "Flores", "San Pablo", "Sarapiquí"
  ],
  "Guanacaste": [
    "Liberia", "Nicoya", "Santa Cruz", "Bagaces", "Carrillo", "Cañas", "Abangares", "Tilarán", "Nandayure", "La Cruz", "Hojancha"
  ],
  "Puntarenas": [
    "Puntarenas Centro", "Esparza", "Buenos Aires", "Montes de Oro", "Osa", "Quepos", "Golfito", "Coto Brus", "Parrita", "Corredores", "Garabito", "Monteverde", "Puerto Jiménez"
  ],
  "Limón": [
    "Limón Centro", "Pococí", "Siquirres", "Talamanca", "Matina", "Guácimo"
  ]
};

export const DEFAULT_REGIONS: Region[] = Object.entries(PROVINCE_REGIONS).flatMap(
  ([province, cantonList]) =>
    cantonList.map(canton => ({
      id: canton,
      name: canton,
      province: province,
      visible: true
    }))
);

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budgetRange: string;
  financing: string;
  horizon: string;
  motivation: string;
  wishlistPropertyIds: string[];
  status: "Lead Nuevo" | "En Contacto" | "Discovery Tour Programado" | "Propuesta/Negociación" | "Cierre Exitoso / Perdido";
  tourDates?: string;
  tourPeople?: number;
  tourLodging?: boolean;
  tourLodgingPref?: string;
  notes: string[];
  lastInteractionDate: string; // ISO String
  gdprConsent?: boolean;
  tourAgent?: string;
  tourVisitedProperties?: string[];
  requestedService?: string;
}

const SEEDED_PROPERTIES: Property[] = [];

export const PROPERTIES: Property[] = SEEDED_PROPERTIES.map((p, idx) => ({
  ...p,
  refCode: `REF-${String(idx + 1).padStart(2, "0")}`
}));

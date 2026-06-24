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
  type: string;
  segment: "Luxury" | "Standard" | "Commercial";
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

export const DEFAULT_REGIONS: Region[] = [
  // San José
  { id: "Barrio Escalante", name: "Barrio Escalante", province: "San José", visible: true },
  { id: "Escazú", name: "Escazú", province: "San José", visible: true },
  { id: "Santa Ana", name: "Santa Ana", province: "San José", visible: true },
  { id: "San José Centro", name: "San José Centro", province: "San José", visible: true },
  { id: "Curridabat", name: "Curridabat", province: "San José", visible: true },
  { id: "Pérez Zeledón", name: "Pérez Zeledón", province: "San José", visible: true },
  // Alajuela
  { id: "Atenas", name: "Atenas", province: "Alajuela", visible: true },
  { id: "Alajuela Centro", name: "Alajuela Centro", province: "Alajuela", visible: true },
  { id: "San Carlos", name: "San Carlos", province: "Alajuela", visible: true },
  { id: "Grecia", name: "Grecia", province: "Alajuela", visible: true },
  { id: "Orotina", name: "Orotina", province: "Alajuela", visible: true },
  // Cartago
  { id: "Cartago Centro", name: "Cartago Centro", province: "Cartago", visible: true },
  { id: "Tres Ríos", name: "Tres Ríos", province: "Cartago", visible: true },
  { id: "Turrialba", name: "Turrialba", province: "Cartago", visible: true },
  { id: "Paraíso", name: "Paraíso", province: "Cartago", visible: true },
  // Heredia
  { id: "Heredia Centro", name: "Heredia Centro", province: "Heredia", visible: true },
  { id: "Belén", name: "Belén", province: "Heredia", visible: true },
  { id: "Santo Domingo", name: "Santo Domingo", province: "Heredia", visible: true },
  { id: "San Isidro", name: "San Isidro", province: "Heredia", visible: true },
  // Guanacaste
  { id: "Papagayo Peninsula", name: "Papagayo Peninsula", province: "Guanacaste", visible: true },
  { id: "Nosara", name: "Nosara", province: "Guanacaste", visible: true },
  { id: "Tamarindo", name: "Tamarindo", province: "Guanacaste", visible: true },
  { id: "Liberia", name: "Liberia", province: "Guanacaste", visible: true },
  { id: "Flamingo", name: "Flamingo", province: "Guanacaste", visible: true },
  { id: "Playas del Coco", name: "Playas del Coco", province: "Guanacaste", visible: true },
  // Puntarenas
  { id: "Santa Teresa", name: "Santa Teresa", province: "Puntarenas", visible: true },
  { id: "Manuel Antonio", name: "Manuel Antonio", province: "Puntarenas", visible: true },
  { id: "Monteverde", name: "Monteverde", province: "Puntarenas", visible: true },
  { id: "Jacó", name: "Jacó", province: "Puntarenas", visible: true },
  { id: "Quepos", name: "Quepos", province: "Puntarenas", visible: true },
  { id: "Uvita", name: "Uvita", province: "Puntarenas", visible: true },
  { id: "Dominical", name: "Dominical", province: "Puntarenas", visible: true },
  // Limón
  { id: "Puerto Viejo", name: "Puerto Viejo", province: "Limón", visible: true },
  { id: "Limón Centro", name: "Limón Centro", province: "Limón", visible: true },
  { id: "Cahuita", name: "Cahuita", province: "Limón", visible: true },
  { id: "Tortuguero", name: "Tortuguero", province: "Limón", visible: true }
];

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

export const PROVINCE_REGIONS: Record<string, string[]> = {
  "San José": ["Barrio Escalante", "Escazú", "Santa Ana", "San José Centro", "Curridabat", "Pérez Zeledón"],
  "Alajuela": ["Atenas", "Alajuela Centro", "San Carlos", "Grecia", "Orotina"],
  "Cartago": ["Cartago Centro", "Tres Ríos", "Turrialba", "Paraíso"],
  "Heredia": ["Heredia Centro", "Belén", "Santo Domingo", "San Isidro"],
  "Guanacaste": ["Papagayo Peninsula", "Nosara", "Tamarindo", "Liberia", "Flamingo", "Playas del Coco"],
  "Puntarenas": ["Santa Teresa", "Manuel Antonio", "Monteverde", "Jacó", "Quepos", "Uvita", "Dominical"],
  "Limón": ["Puerto Viejo", "Limón Centro", "Cahuita", "Tortuguero"]
};

const SEEDED_PROPERTIES: Property[] = [];

export const PROPERTIES: Property[] = SEEDED_PROPERTIES.map((p, idx) => ({
  ...p,
  refCode: `REF-${String(idx + 1).padStart(2, "0")}`
}));

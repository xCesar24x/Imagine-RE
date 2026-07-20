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

const SEEDED_PROPERTIES: Property[] = [
  {
    id: "prop-san-ramon-cabana",
    name: "Cloud Forest Mountain Cabin",
    nameEs: "Cabaña de Montaña en Bosque Nuboso",
    location: "San Ramón, Alajuela",
    approxLocation: "Ángeles Norte (Cerca de Hotel Villa Blanca)",
    province: "Alajuela",
    price: 102000000,
    currency: "CRC",
    sqft: 1668,
    m2: 155,
    acres: 1.24,
    lotSizeM2: 5000,
    constructionSizeM2: 155,
    suites: 2,
    vibeTags: ["Bosque Nuboso", "Clima Fresco", "Proyecto Privado", "Acceso Controlado", "Vista Panorámica", "Tranquilidad"],
    description: "Beautiful 155 m² (1,668 sqft) mountain cabin set on a 5,000 m² (1.24 acre) private forest lot in Ángeles Norte, San Ramón, Alajuela. Located within a gated private estate project near the famous Villa Blanca Cloud Forest Hotel. At 1,100m elevation with spring-like weather year-round. Features 2 bedrooms, 2 full baths, bright living room, functional kitchen, laundry room, and a panoramic balcony with direct forest views. Only 12 km from downtown San Ramón and 1 hour from SJO International Airport.",
    descriptionEs: "Hermosa cabaña de montaña de 155 m² (1,668 sqft) construida sobre un impresionante terreno de 5,000 m² (1.24 acres) de bosque privado y zonas verdes en Ángeles Norte de San Ramón, Alajuela. Ubicada en un exclusivo proyecto de quintas privado con acceso controlado cerca del reconocido Hotel Villa Blanca Cloud Forest. Situada a 1,100 m de altitud con un clima fresco tipo primavera todo el año. Dispone de 2 dormitorios amplios, 2 baños completos, sala con gran iluminación natural, cocina, lavandería y un balcón panorámico con vistas directas al bosque nuboso. A solo 12 km del centro de San Ramón y a 1 hora del Aeropuerto Internacional SJO.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    panorama: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    type: ["Cabaña", "Quinta de Descanso", "Terreno de Montaña"],
    segment: ["Standard", "Luxury"],
    lifestyle: "Naturaleza",
    status: "Destacada",
    elevationM: 1100,
    airportDistKm: 60,
    airportTimeMin: 60,
    closestCity: "San Ramón",
    cityDistKm: 12,
    medicalDistMin: 20,
    hasFiberOptic: true,
    hasStarlink: true,
    amenities: [
      "Balcón Panorámico",
      "Cocina Funcional",
      "Cuarto de Lavandería",
      "Amplias Zonas Verdes",
      "Bosque Privado",
      "Excelente Iluminación Natural",
      "Acceso Controlado / Proyecto Privado"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80"
    ]
  }
];

export const PROPERTIES: Property[] = SEEDED_PROPERTIES.map((p, idx) => ({
  ...p,
  refCode: `REF-${String(idx + 1).padStart(2, "0")}`
}));

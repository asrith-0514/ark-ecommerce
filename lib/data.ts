// ARK Connect - B2B Wholesale Platform - Seed Data & Models

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  physicalStock: number;
  reservedStock: number;
  availableStock: number; // Available = Physical - Reserved
  priceA2: number; // Category A++
  priceA1: number; // Category A+
  priceA: number;  // Category A
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface Product {
  id: string;
  brand: string;
  title: string;
  skuCode: string;
  category: "Leggings" | "Inners" | "Nightdresses" | "Nighties" | "Loungewear";
  description: string;
  fabric: string;
  lotNumber: string;
  basePrice: number;
  mrp: number;
  cutType: string;
  images: { label: string; icon: string }[];
  colorways: { name: string; hex: string; available: boolean }[];
  variants: ProductVariant[];
  moq: number;
  packMultiplier: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  brand: string;
  variant: string;
  color: string;
  colorHex: string;
  size: string;
  orderedQty: number;
  approvedQty: number;
  dispatchedQty: number;
  availableStock: number;
  unitPrice: number;
}

export type OrderStatus =
  | "Submitted"
  | "Confirmed"
  | "Packing"
  | "Partially Dispatched"
  | "Dispatched"
  | "Delivered"
  | "Rejected"
  | "Cancelled";

export interface WholesaleOrder {
  id: string;
  orderNo: string;
  retailerId: string;
  retailerName: string;
  region: string;
  category: "A++" | "A+" | "A";
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  retailerNote?: string;
  dispatchNote?: string;
  transporterName?: string;
  lrNumber?: string;
  totalPieces: number;
  approvedPieces: number;
  dispatchedPieces: number;
  totalAmount: number;
  timeline: { stage: OrderStatus; timestamp?: string; completed: boolean }[];
}

export interface Retailer {
  id: string;
  name: string;
  region: string;
  category: "A++" | "A+" | "A";
  status: "active" | "pending" | "rejected" | "deactivated";
  contactPerson: string;
  phone: string;
  address: string;
  gstNumber: string;
}

export const INITIAL_RETAILERS: Retailer[] = [
  {
    id: "RET-01",
    name: "Retailer 01 - Siddipet",
    region: "Siddipet",
    category: "A++",
    status: "active",
    contactPerson: "Rajesh Kumar",
    phone: "+91 98490 12345",
    address: "Shop 12-14, Cloth Merchants Market, Siddipet 502103",
    gstNumber: "36AABCU9603R1ZM",
  },
  {
    id: "RET-02",
    name: "Retailer 02 - Karimnagar",
    region: "Karimnagar",
    category: "A+",
    status: "active",
    contactPerson: "Mohammed Farooq",
    phone: "+91 98491 87654",
    address: "Tower Circle, Karimnagar 505001",
    gstNumber: "36AAMCF1109P1Z8",
  },
  {
    id: "RET-04",
    name: "Retailer 04 - Nizamabad",
    region: "Nizamabad",
    category: "A+",
    status: "active",
    contactPerson: "Anand Rao",
    phone: "+91 98492 54321",
    address: "Gandhi Chowk, Wholesale Complex, Nizamabad 503001",
    gstNumber: "36AAECR4412K1Z4",
  },
  {
    id: "RET-07",
    name: "Retailer 07 - Warangal",
    region: "Warangal",
    category: "A",
    status: "active",
    contactPerson: "Venkatesh S.",
    phone: "+91 98480 98765",
    address: "Station Road, Grain & Textile Lane, Warangal 506002",
    gstNumber: "36AAGCS7718M1ZQ",
  },
  {
    id: "RET-09",
    name: "Retailer 09 - Khammam",
    region: "Khammam",
    category: "A",
    status: "pending",
    contactPerson: "Suresh Reddy",
    phone: "+91 98481 11223",
    address: "Main Bazaar, Khammam 507001",
    gstNumber: "36AAHCS9912A1Z1",
  },
  {
    id: "RET-11",
    name: "Retailer 11 - Mahbubnagar",
    region: "Mahbubnagar",
    category: "A+",
    status: "deactivated",
    contactPerson: "K. Ramesh",
    phone: "+91 98482 33445",
    address: "Station Road, Mahbubnagar 509001",
    gstNumber: "36AAKCR4421L1Z9",
  },
  {
    id: "RET-14",
    name: "Retailer 14 - Nalgonda",
    region: "Nalgonda",
    category: "A",
    status: "rejected",
    contactPerson: "P. Srinivas",
    phone: "+91 98483 55667",
    address: "Clock Tower Area, Nalgonda 508001",
    gstNumber: "36AALCP7731P1Z3",
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "PROD-01",
    brand: "Flybirds",
    title: "Ankle Fit Leggings",
    skuCode: "FB-LG-AF01",
    category: "Leggings",
    description: "Premium 4-way stretch cotton lycra leggings engineered for all-day comfort.",
    fabric: "95% Combed Cotton, 5% Spandex (220 GSM)",
    lotNumber: "Lot #24-AF",
    basePrice: 240,
    mrp: 280,
    cutType: "Ankle Fit",
    moq: 12,
    packMultiplier: 12,
    images: [
      { label: "Front View", icon: "checkroom" },
      { label: "Fabric Micro", icon: "texture" },
      { label: "Ankle Rib", icon: "straighten" },
    ],
    colorways: [
      { name: "Black", hex: "#111111", available: true },
      { name: "Navy", hex: "#1E293B", available: true },
      { name: "Maroon", hex: "#800020", available: true },
    ],
    variants: [
      { id: "V-01", sku: "FB-LG-AF01-BLK-S", size: "S", color: "Black", colorHex: "#111111", physicalStock: 50, reservedStock: 14, availableStock: 36, priceA2: 240, priceA1: 255, priceA: 270, status: "in_stock" },
      { id: "V-02", sku: "FB-LG-AF01-BLK-M", size: "M", color: "Black", colorHex: "#111111", physicalStock: 60, reservedStock: 18, availableStock: 42, priceA2: 240, priceA1: 255, priceA: 270, status: "in_stock" },
      { id: "V-03", sku: "FB-LG-AF01-BLK-L", size: "L", color: "Black", colorHex: "#111111", physicalStock: 40, reservedStock: 12, availableStock: 28, priceA2: 240, priceA1: 255, priceA: 270, status: "in_stock" },
      { id: "V-04", sku: "FB-LG-AF01-BLK-XL", size: "XL", color: "Black", colorHex: "#111111", physicalStock: 20, reservedStock: 6, availableStock: 14, priceA2: 240, priceA1: 255, priceA: 270, status: "low_stock" },
      { id: "V-05", sku: "FB-LG-AF01-BLK-XXL", size: "XXL", color: "Black", colorHex: "#111111", physicalStock: 10, reservedStock: 10, availableStock: 0, priceA2: 240, priceA1: 255, priceA: 270, status: "out_of_stock" },
      { id: "V-06", sku: "FB-LG-AF01-NVY-M", size: "M", color: "Navy", colorHex: "#1E293B", physicalStock: 45, reservedStock: 15, availableStock: 30, priceA2: 240, priceA1: 255, priceA: 270, status: "in_stock" },
      { id: "V-07", sku: "FB-LG-AF01-NVY-L", size: "L", color: "Navy", colorHex: "#1E293B", physicalStock: 35, reservedStock: 10, availableStock: 25, priceA2: 240, priceA1: 255, priceA: 270, status: "in_stock" },
    ],
  },
  {
    id: "PROD-02",
    brand: "Flycute",
    title: "Regular Fit Leggings",
    skuCode: "FC-LG-RG04",
    category: "Leggings",
    description: "Classic length with gather ankles, high durability double interlock stitching.",
    fabric: "100% Super Combed Bio-Washed Cotton (210 GSM)",
    lotNumber: "Lot #18-RG",
    basePrice: 225,
    mrp: 260,
    cutType: "Regular Fit",
    moq: 10,
    packMultiplier: 10,
    images: [
      { label: "Front View", icon: "checkroom" },
      { label: "Gathers", icon: "straighten" },
    ],
    colorways: [
      { name: "Navy", hex: "#1b2b4f", available: true },
      { name: "White", hex: "#ffffff", available: true },
      { name: "Black", hex: "#111111", available: true },
    ],
    variants: [
      { id: "V-08", sku: "FC-LG-RG04-NVY-M", size: "M", color: "Navy", colorHex: "#1b2b4f", physicalStock: 30, reservedStock: 10, availableStock: 20, priceA2: 225, priceA1: 238, priceA: 250, status: "in_stock" },
      { id: "V-09", sku: "FC-LG-RG04-NVY-L", size: "L", color: "Navy", colorHex: "#1b2b4f", physicalStock: 18, reservedStock: 10, availableStock: 8, priceA2: 225, priceA1: 238, priceA: 250, status: "low_stock" },
      { id: "V-10", sku: "FC-LG-RG04-NVY-XL", size: "XL", color: "Navy", colorHex: "#1b2b4f", physicalStock: 15, reservedStock: 5, availableStock: 10, priceA2: 225, priceA1: 238, priceA: 250, status: "in_stock" },
      { id: "V-11", sku: "FC-LG-RG04-WHT-M", size: "M", color: "White", colorHex: "#ffffff", physicalStock: 25, reservedStock: 5, availableStock: 20, priceA2: 225, priceA1: 238, priceA: 250, status: "in_stock" },
    ],
  },
  {
    id: "PROD-03",
    brand: "Exena",
    title: "Modal Slip Camisole",
    skuCode: "EX-IN-MS02",
    category: "Inners",
    description: "Ultra-soft micro-modal innerwear slip with seamless straps and antibacterial finish.",
    fabric: "92% Micro Modal, 8% Elastane (160 GSM)",
    lotNumber: "Lot #09-MS",
    basePrice: 180,
    mrp: 220,
    cutType: "Slip Fit",
    moq: 10,
    packMultiplier: 10,
    images: [
      { label: "Front View", icon: "checkroom" },
      { label: "Strap Detail", icon: "straighten" },
    ],
    colorways: [
      { name: "White", hex: "#ffffff", available: true },
      { name: "Beige", hex: "#f5e6d3", available: true },
      { name: "Black", hex: "#111111", available: true },
    ],
    variants: [
      { id: "V-12", sku: "EX-IN-MS02-WHT-M", size: "M", color: "White", colorHex: "#ffffff", physicalStock: 40, reservedStock: 10, availableStock: 30, priceA2: 180, priceA1: 190, priceA: 200, status: "in_stock" },
      { id: "V-13", sku: "EX-IN-MS02-WHT-L", size: "L", color: "White", colorHex: "#ffffff", physicalStock: 35, reservedStock: 10, availableStock: 25, priceA2: 180, priceA1: 190, priceA: 200, status: "in_stock" },
      { id: "V-14", sku: "EX-IN-MS02-BG-L", size: "L", color: "Beige", colorHex: "#f5e6d3", physicalStock: 22, reservedStock: 8, availableStock: 14, priceA2: 180, priceA1: 190, priceA: 200, status: "in_stock" },
    ],
  },
  {
    id: "PROD-04",
    brand: "Within",
    title: "Cotton Ribbed Bloomers",
    skuCode: "WN-IN-RB08",
    category: "Inners",
    description: "Fine ribbed breathable pure cotton bloomers with elasticated comfort waistband.",
    fabric: "100% Cotton Rib Knit (180 GSM)",
    lotNumber: "Lot #11-RB",
    basePrice: 165,
    mrp: 195,
    cutType: "Bloomer Cut",
    moq: 12,
    packMultiplier: 12,
    images: [{ label: "Front View", icon: "checkroom" }],
    colorways: [
      { name: "Grey", hex: "#94a3b8", available: false },
      { name: "White", hex: "#ffffff", available: true },
      { name: "Pink", hex: "#fbcfe8", available: true },
    ],
    variants: [
      { id: "V-15", sku: "WN-IN-RB08-GRY-M", size: "M", color: "Grey", colorHex: "#94a3b8", physicalStock: 6, reservedStock: 6, availableStock: 0, priceA2: 165, priceA1: 175, priceA: 185, status: "out_of_stock" },
      { id: "V-16", sku: "WN-IN-RB08-WHT-L", size: "L", color: "White", colorHex: "#ffffff", physicalStock: 24, reservedStock: 6, availableStock: 18, priceA2: 165, priceA1: 175, priceA: 185, status: "in_stock" },
    ],
  },
  {
    id: "PROD-05",
    brand: "Lichi",
    title: "Printed Nightdress",
    skuCode: "LC-ND-PR12",
    category: "Nightdresses",
    description: "Comfortable summer nightdress with botanical prints, round neck, and side pocket.",
    fabric: "100% Rayon Slub (140 GSM)",
    lotNumber: "Lot #33-ND",
    basePrice: 385,
    mrp: 450,
    cutType: "A-Line Maxi",
    moq: 6,
    packMultiplier: 6,
    images: [{ label: "Front View", icon: "checkroom" }],
    colorways: [
      { name: "Pink", hex: "#f472b6", available: true },
      { name: "Teal", hex: "#0f766e", available: true },
    ],
    variants: [
      { id: "V-17", sku: "LC-ND-PR12-PNK-L", size: "L", color: "Pink", colorHex: "#f472b6", physicalStock: 25, reservedStock: 5, availableStock: 20, priceA2: 385, priceA1: 400, priceA: 420, status: "in_stock" },
      { id: "V-18", sku: "LC-ND-PR12-PNK-XL", size: "XL", color: "Pink", colorHex: "#f472b6", physicalStock: 20, reservedStock: 4, availableStock: 16, priceA2: 385, priceA1: 400, priceA: 420, status: "in_stock" },
    ],
  },
  {
    id: "PROD-06",
    brand: "Loveit",
    title: "Printed Cotton Nightie",
    skuCode: "LV-NT-05",
    category: "Nighties",
    description: "Daily wear front open nightie with soft paisley all-over prints.",
    fabric: "100% Pure Cotton (190 GSM)",
    lotNumber: "Lot #05-NT",
    basePrice: 420,
    mrp: 499,
    cutType: "Loose Maxi",
    moq: 6,
    packMultiplier: 6,
    images: [{ label: "Front View", icon: "checkroom" }],
    colorways: [
      { name: "Maroon", hex: "#881337", available: true },
      { name: "Navy", hex: "#1e1b4b", available: true },
    ],
    variants: [
      { id: "V-19", sku: "LV-NT-05-MRN-XL", size: "XL", color: "Maroon", colorHex: "#881337", physicalStock: 30, reservedStock: 8, availableStock: 22, priceA2: 420, priceA1: 440, priceA: 460, status: "in_stock" },
    ],
  },
  {
    id: "PROD-07",
    brand: "Aswathi",
    title: "Cotton Everyday Slip",
    skuCode: "AS-IN-ES01",
    category: "Inners",
    description: "Everyday pure cotton inner slip with fine side seam and comfort armholes.",
    fabric: "100% Cotton (170 GSM)",
    lotNumber: "Lot #07-AS",
    basePrice: 150,
    mrp: 180,
    cutType: "Slip",
    moq: 12,
    packMultiplier: 12,
    images: [{ label: "Front View", icon: "checkroom" }],
    colorways: [{ name: "White", hex: "#ffffff", available: true }],
    variants: [
      { id: "V-20", sku: "AS-IN-ES01-WHT-L", size: "L", color: "White", colorHex: "#ffffff", physicalStock: 40, reservedStock: 5, availableStock: 35, priceA2: 150, priceA1: 160, priceA: 170, status: "in_stock" },
    ],
  },
  {
    id: "PROD-08",
    brand: "Belly Belly",
    title: "Lounge Capris",
    skuCode: "BB-LW-CP03",
    category: "Loungewear",
    description: "Relaxed fit knitted capris with side slash pockets and drawcord elastic waist.",
    fabric: "95% Cotton, 5% Elastane (200 GSM)",
    lotNumber: "Lot #03-BB",
    basePrice: 260,
    mrp: 320,
    cutType: "Capri",
    moq: 10,
    packMultiplier: 10,
    images: [{ label: "Front View", icon: "checkroom" }],
    colorways: [{ name: "Black", hex: "#111111", available: true }],
    variants: [
      { id: "V-21", sku: "BB-LW-CP03-BLK-XL", size: "XL", color: "Black", colorHex: "#111111", physicalStock: 25, reservedStock: 5, availableStock: 20, priceA2: 260, priceA1: 275, priceA: 290, status: "in_stock" },
    ],
  },
];

export const INITIAL_ORDERS: WholesaleOrder[] = [
  {
    id: "ORD-8830",
    orderNo: "ORD-8830",
    retailerId: "RET-01",
    retailerName: "Retailer 01 - Siddipet",
    region: "Siddipet",
    category: "A++",
    status: "Confirmed",
    createdAt: "28 Oct 2026, 09:15 IST",
    retailerNote: "Please pack carefully",
    dispatchNote: "Dispatched 27 pcs (12 Black-M, 5 Navy-L, 10 White-M); 3 pcs Navy-L remain reserved.",
    transporterName: "",
    lrNumber: "",
    totalPieces: 60, // Requested 60 pcs
    approvedPieces: 58, // Approved 58 pcs
    dispatchedPieces: 27, // 27 pcs dispatched in demo scenario
    totalAmount: 13500, // Requested Rs 13,500
    timeline: [
      { stage: "Submitted", timestamp: "28 Oct 09:15 IST", completed: true },
      { stage: "Confirmed", timestamp: "28 Oct 10:30 IST", completed: true },
      { stage: "Packing", completed: false },
      { stage: "Partially Dispatched", completed: false },
      { stage: "Dispatched", completed: false },
      { stage: "Delivered", completed: false },
    ],
    items: [
      {
        id: "ITEM-01",
        productId: "PROD-01",
        productTitle: "Flybirds Ankle Fit Leggings",
        sku: "FB-LG-AF01",
        brand: "Flybirds",
        variant: "Black • M",
        color: "Black",
        colorHex: "#111111",
        size: "M",
        orderedQty: 12,
        approvedQty: 12,
        dispatchedQty: 12,
        availableStock: 42,
        unitPrice: 240,
      },
      {
        id: "ITEM-02",
        productId: "PROD-02",
        productTitle: "Flycute Regular Fit Leggings",
        sku: "FC-LG-RG04",
        brand: "Flycute",
        variant: "Navy • L",
        color: "Navy",
        colorHex: "#1b2b4f",
        size: "L",
        orderedQty: 10,
        approvedQty: 8, // Short by 2 on approval
        dispatchedQty: 5, // 5 of 8 dispatched, 3 stay reserved
        availableStock: 8,
        unitPrice: 225,
      },
      {
        id: "ITEM-03",
        productId: "PROD-03",
        productTitle: "Exena Modal Slip Camisole",
        sku: "EX-IN-MS02",
        brand: "Exena",
        variant: "White • M",
        color: "White",
        colorHex: "#ffffff",
        size: "M",
        orderedQty: 10,
        approvedQty: 10,
        dispatchedQty: 10,
        availableStock: 30,
        unitPrice: 180,
      },
    ],
  },
  {
    id: "ORD-8826",
    orderNo: "ORD-8826",
    retailerId: "RET-04",
    retailerName: "Retailer 04 - Nizamabad",
    region: "Nizamabad",
    category: "A+",
    status: "Packing",
    createdAt: "27 Oct 2026, 16:45 IST",
    retailerNote: "",
    dispatchNote: "",
    transporterName: "",
    lrNumber: "",
    totalPieces: 120,
    approvedPieces: 120,
    dispatchedPieces: 0,
    totalAmount: 38400,
    timeline: [
      { stage: "Submitted", completed: true },
      { stage: "Confirmed", completed: true },
      { stage: "Packing", timestamp: "28 Oct 07:30 IST", completed: true },
      { stage: "Partially Dispatched", completed: false },
      { stage: "Dispatched", completed: false },
      { stage: "Delivered", completed: false },
    ],
    items: [
      {
        id: "ITEM-26-1",
        productId: "PROD-01",
        productTitle: "Flybirds Ankle Fit Leggings",
        sku: "FB-LG-AF01",
        brand: "Flybirds",
        variant: "Navy • M",
        color: "Navy",
        colorHex: "#1E293B",
        size: "M",
        orderedQty: 60,
        approvedQty: 60,
        dispatchedQty: 0,
        availableStock: 30,
        unitPrice: 255,
      },
      {
        id: "ITEM-26-2",
        productId: "PROD-02",
        productTitle: "Flycute Regular Fit Leggings",
        sku: "FC-LG-RG04",
        brand: "Flycute",
        variant: "White • M",
        color: "White",
        colorHex: "#ffffff",
        size: "M",
        orderedQty: 60,
        approvedQty: 60,
        dispatchedQty: 0,
        availableStock: 20,
        unitPrice: 238,
      },
    ],
  },
  {
    id: "ORD-8821",
    orderNo: "ORD-8821",
    retailerId: "RET-07",
    retailerName: "Retailer 07 - Warangal",
    region: "Warangal",
    category: "A",
    status: "Partially Dispatched",
    createdAt: "26 Oct 2026, 14:20 IST",
    retailerNote: "",
    dispatchNote: "60 pcs sent, remaining 30 pcs scheduled",
    transporterName: "",
    lrNumber: "",
    totalPieces: 90,
    approvedPieces: 90,
    dispatchedPieces: 60,
    totalAmount: 24300,
    timeline: [
      { stage: "Submitted", completed: true },
      { stage: "Confirmed", completed: true },
      { stage: "Packing", completed: true },
      { stage: "Partially Dispatched", timestamp: "27 Oct 18:00 IST", completed: true },
      { stage: "Dispatched", completed: false },
      { stage: "Delivered", completed: false },
    ],
    items: [
      {
        id: "ITEM-21-1",
        productId: "PROD-01",
        productTitle: "Flybirds Ankle Fit Leggings",
        sku: "FB-LG-AF01",
        brand: "Flybirds",
        variant: "Black • L",
        color: "Black",
        colorHex: "#111111",
        size: "L",
        orderedQty: 90,
        approvedQty: 90,
        dispatchedQty: 60,
        availableStock: 28,
        unitPrice: 270,
      },
    ],
  },
  {
    id: "ORD-8815",
    orderNo: "ORD-8815",
    retailerId: "RET-02",
    retailerName: "Retailer 02 - Karimnagar",
    region: "Karimnagar",
    category: "A+",
    status: "Dispatched",
    createdAt: "25 Oct 2026, 11:10 IST",
    retailerNote: "",
    dispatchNote: "Complete consignment dispatched",
    transporterName: "Safe Transport",
    lrNumber: "ST-8815",
    totalPieces: 45,
    approvedPieces: 45,
    dispatchedPieces: 45,
    totalAmount: 18900,
    timeline: [
      { stage: "Submitted", completed: true },
      { stage: "Confirmed", completed: true },
      { stage: "Packing", completed: true },
      { stage: "Partially Dispatched", completed: true },
      { stage: "Dispatched", timestamp: "26 Oct 17:30 IST", completed: true },
      { stage: "Delivered", completed: false },
    ],
    items: [
      {
        id: "ITEM-15-1",
        productId: "PROD-05",
        productTitle: "Lichi Printed Nightdress",
        sku: "LC-ND-PR12",
        brand: "Lichi",
        variant: "Pink • L",
        color: "Pink",
        colorHex: "#f472b6",
        size: "L",
        orderedQty: 45,
        approvedQty: 45,
        dispatchedQty: 45,
        availableStock: 20,
        unitPrice: 400,
      },
    ],
  },
  {
    id: "ORD-8812",
    orderNo: "ORD-8812",
    retailerId: "RET-01",
    retailerName: "Retailer 01 - Siddipet",
    region: "Siddipet",
    category: "A++",
    status: "Delivered",
    createdAt: "24 Oct 2026, 10:00 IST",
    retailerNote: "",
    dispatchNote: "Delivered successfully",
    transporterName: "Local Express",
    lrNumber: "LE-8812",
    totalPieces: 60,
    approvedPieces: 60,
    dispatchedPieces: 60,
    totalAmount: 14400,
    timeline: [
      { stage: "Submitted", completed: true },
      { stage: "Confirmed", completed: true },
      { stage: "Packing", completed: true },
      { stage: "Partially Dispatched", completed: true },
      { stage: "Dispatched", completed: true },
      { stage: "Delivered", timestamp: "26 Oct 12:00 IST", completed: true },
    ],
    items: [
      {
        id: "ITEM-12-1",
        productId: "PROD-01",
        productTitle: "Flybirds Ankle Fit Leggings",
        sku: "FB-LG-AF01",
        brand: "Flybirds",
        variant: "Black • S",
        color: "Black",
        colorHex: "#111111",
        size: "S",
        orderedQty: 60,
        approvedQty: 60,
        dispatchedQty: 60,
        availableStock: 36,
        unitPrice: 240,
      },
    ],
  },
];

// All 8 official brands for sales reporting
export interface BrandSalesRow {
  brand: string;
  orders: number;
  pieces: number;
  value: number;
  pendingPieces: number;
  vsLastWeek: string;
}

export const BRAND_SALES_REPORT: BrandSalesRow[] = [
  { brand: "Flybirds", orders: 14, pieces: 1420, value: 341600, pendingPieces: 260, vsLastWeek: "+6%" },
  { brand: "Flycute", orders: 11, pieces: 1080, value: 245800, pendingPieces: 190, vsLastWeek: "+4%" },
  { brand: "Loveit", orders: 9, pieces: 860, value: 198300, pendingPieces: 170, vsLastWeek: "-2%" },
  { brand: "Aswathi", orders: 8, pieces: 760, value: 164200, pendingPieces: 150, vsLastWeek: "+10%" },
  { brand: "Exena", orders: 7, pieces: 680, value: 122700, pendingPieces: 140, vsLastWeek: "+3%" },
  { brand: "Within", orders: 6, pieces: 450, value: 82100, pendingPieces: 120, vsLastWeek: "-8%" },
  { brand: "Lichi", orders: 6, pieces: 380, value: 141900, pendingPieces: 130, vsLastWeek: "+12%" },
  { brand: "Belly Belly", orders: 3, pieces: 190, value: 65800, pendingPieces: 80, vsLastWeek: "-5%" },
];

export type MapKind = "station" | "park" | "school";

export type MapPlace = {
  id: string;
  kind: MapKind;
  name: string;
  address: string;
  lat: number;
  lng: number;
  aka?: string;
  /** Put the name on the left so stacked California St parks don’t cover each other. */
  labelSide?: "left" | "right";
};

/**
 * Station + every mobile-home park that geocodes inside Calimesa city limits,
 * plus every K–12 campus with a Calimesa street address.
 *
 * City Housing Element: eight parks under the Mobile Home Rent Stabilization
 * Ordinance. MHVillage’s ninth (“South Mesa,” 763 W Avenue L) is Lancaster.
 * Las Palomas is the rebuilt Villa Calimesa (Sandalwood Fire, 2019).
 */
export const MAP_PLACES: MapPlace[] = [
  {
    id: "station",
    kind: "station",
    name: "Calimesa Fire Station",
    address: "906 Park Ave, Calimesa, CA 92320",
    lat: 34.003263,
    lng: -117.058532,
  },
  {
    id: "plantation",
    kind: "park",
    name: "Plantation on the Lake",
    address: "10961 Desert Lawn Dr",
    lat: 33.9643944,
    lng: -117.0299543,
  },
  {
    id: "rancho",
    kind: "park",
    name: "Rancho Calimesa MH Ranch",
    address: "10320 Calimesa Blvd",
    lat: 33.9725509,
    lng: -117.0404271,
  },
  {
    id: "palomas",
    kind: "park",
    name: "Las Palomas Estates",
    aka: "formerly Villa Calimesa",
    address: "1134 Villa Calimesa Ln",
    lat: 33.9967322,
    lng: -117.0638672,
    labelSide: "left",
  },
  {
    id: "californian",
    kind: "park",
    name: "Californian Mobile Estates",
    address: "950 California St",
    lat: 34.0019021,
    lng: -117.038942,
    labelSide: "left",
  },
  {
    id: "colony",
    kind: "park",
    name: "The Colony",
    address: "975 California St",
    lat: 34.0020808,
    lng: -117.0387447,
  },
  {
    id: "ponderosa",
    kind: "park",
    name: "Ponderosa Mobile Estates",
    address: "1001 3rd St",
    lat: 34.0015025,
    lng: -117.0474501,
    labelSide: "left",
  },
  {
    id: "bigoak",
    kind: "park",
    name: "Big Oak Gardens",
    address: "35080 Chandler Ave",
    lat: 33.9839062,
    lng: -117.0483993,
  },
  {
    id: "sharondale",
    kind: "park",
    name: "Sharondale",
    address: "9525 Sharondale Rd",
    lat: 33.9821874,
    lng: -117.0419795,
  },
  {
    id: "mesa-view",
    kind: "school",
    name: "Mesa View Middle School",
    address: "800 Mustang Way",
    lat: 33.9990765,
    lng: -117.0721326,
    labelSide: "left",
  },
  {
    id: "summerwind",
    kind: "school",
    name: "Summerwind Trails School",
    address: "1020 Poinsettia Cir",
    lat: 33.9669756,
    lng: -117.0401902,
  },
  {
    id: "mesa-grande",
    kind: "school",
    name: "Mesa Grande Academy",
    address: "975 Fremont St",
    lat: 34.0022104,
    lng: -117.024089,
  },
];

export const MAP_CENTER: [number, number] = [33.987, -117.048];

export const PARKS = MAP_PLACES.filter((p) => p.kind === "park");
export const SCHOOLS = MAP_PLACES.filter((p) => p.kind === "school");
export const STATION = MAP_PLACES.find((p) => p.kind === "station")!;

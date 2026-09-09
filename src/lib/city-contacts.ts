export type ContactPhone = {
  label: string;
  display: string;
  tel: string;
};

export type CityContact = {
  name: string;
  title: string;
  section: string;
  phones: ContactPhone[];
  email?: string;
  email2?: string;
  note?: string;
};

export const CONTACT_SECTIONS = [
  "Station",
  "City Council",
  "City Manager",
  "City Attorney",
  "Administrative staff",
  "Finance",
  "Planning",
  "Code enforcement",
  "Engineering & public works",
  "Building & safety",
  "Fire department",
  "Fire prevention",
  "Sheriff",
  "Senior center",
] as const;

function office(ext: string, extra?: string): ContactPhone {
  return {
    label: extra ?? "Office",
    display: `(909) 795-9801 ext. ${ext}`,
    tel: "+19097959801",
  };
}

function cell(display: string, tel: string, label = "Cell"): ContactPhone {
  return { label, display, tel };
}

export const CITY_CONTACTS: CityContact[] = [
  {
    name: "Station front desk",
    title: "City Hall / Fire",
    section: "Station",
    phones: [cell("(909) 795-9801", "+19097959801", "Main")],
  },
  {
    name: "Captains office",
    title: "On-duty captains",
    section: "Station",
    phones: [office("122")],
    note: "A-Shift Albaro Cortes · B-Shift Corey Bennin · C-Shift Matthew Vega",
  },
  {
    name: "Office assistant",
    title: "City Hall",
    section: "Station",
    phones: [office("236")],
  },
  {
    name: "PW on-call",
    title: "Public works after hours",
    section: "Station",
    phones: [cell("(909) 747-0299", "+19097470299")],
  },

  {
    name: "Linda Molina",
    title: "Mayor",
    section: "City Council",
    phones: [
      cell("(626) 731-2335", "+16267312335", "Personal"),
      cell("(909) 435-6320", "+19094356320", "City"),
    ],
    email: "lmolina@calimesa.gov",
    email2: "arcs8lady@gmail.com",
    note: "566 Ronda Court, Calimesa, CA 92320",
  },
  {
    name: "Jeff Cervantez",
    title: "Mayor Pro Tem",
    section: "City Council",
    phones: [cell("(562) 325-1757", "+15623251757", "Personal")],
    email: "icervantez@calimesa.gov",
    email2: "jeffcervantez@gmail.com",
    note: "714 Knoll Crest Court, Calimesa, CA 92320",
  },
  {
    name: "John Manly",
    title: "Council member",
    section: "City Council",
    phones: [cell("(909) 362-7085", "+19093627085", "Personal")],
    email: "imanly@calimesa.gov",
    email2: "johnimanly@gmail.com",
    note: "465 Myrtlewood Drive, Calimesa, CA 92320",
  },
  {
    name: "Eric Cundieff",
    title: "Council member",
    section: "City Council",
    phones: [
      cell("(909) 255-2652", "+19092552652", "City"),
      cell("(909) 936-9259", "+19099369259", "Personal"),
    ],
    email: "ecundieff@calimesa.gov",
    note: "133 Mesquite Court, Calimesa, CA 92320",
  },
  {
    name: "Edgar Garcia",
    title: "Council member",
    section: "City Council",
    phones: [
      cell("(909) 435-5843", "+19094355843", "City"),
      cell("(949) 689-9310", "+19496899310", "Personal"),
    ],
    email: "egarcia@calimesa.gov",
    note: "1076 Little Leaf Street, Calimesa, CA 92320",
  },

  {
    name: "Will Kolbow",
    title: "City Manager",
    section: "City Manager",
    phones: [office("231"), cell("(909) 243-4394", "+19092434394")],
    email: "wkolbow@calimesa.gov",
  },
  {
    name: "Darlene Gerdes",
    title: "Deputy City Manager / City Clerk / HR & Risk",
    section: "City Manager",
    phones: [office("233"), cell("(909) 841-8572", "+19098418572", "Personal")],
    email: "dgerdes@calimesa.gov",
  },

  {
    name: "Steven Flower",
    title: "City Attorney",
    section: "City Attorney",
    phones: [cell("(213) 626-8484", "+12136268484", "Office")],
    email: "sflower@rwglaw.com",
    note: "Richards, Watson and Gershon · 355 S. Grand Ave, 40th Floor, Los Angeles, CA 90071",
  },
  {
    name: "Katherine Read",
    title: "Assistant City Attorney",
    section: "City Attorney",
    phones: [cell("(213) 626-8484", "+12136268484", "Office")],
    email: "kread@rwglaw.com",
  },

  {
    name: "Yaiza Benson",
    title: "Exec. assistant / Deputy City Clerk",
    section: "Administrative staff",
    phones: [office("239")],
    email: "ybenson@calimesa.gov",
  },
  {
    name: "Chrissy Couture",
    title: "Admin assistant I",
    section: "Administrative staff",
    phones: [office("222")],
    email: "ccouture@calimesa.gov",
  },
  {
    name: "P. McGee",
    title: "Admin assistant",
    section: "Administrative staff",
    phones: [office("221")],
    email: "pmcgee@calimesa.gov",
  },

  {
    name: "Celeste Reid",
    title: "Finance Director",
    section: "Finance",
    phones: [office("227"), cell("(909) 747-8856", "+19097478856", "City")],
    email: "creid@calimesa.gov",
  },
  {
    name: "Alannah Figueroa",
    title: "Accountant",
    section: "Finance",
    phones: [office("249")],
    email: "afigueroa@calimesa.gov",
  },
  {
    name: "Heather Sturgeon",
    title: "Accounting Tech I",
    section: "Finance",
    phones: [office("105")],
    email: "hsturgeon@calimesa.gov",
  },

  {
    name: "Kelly Lucia",
    title: "Community Development Director",
    section: "Planning",
    phones: [office("229"), cell("(909) 809-8778", "+19098098778", "City")],
    email: "klucia@calimesa.gov",
  },
  {
    name: "Selenne Sevilla",
    title: "Senior Planner",
    section: "Planning",
    phones: [office("237")],
    email: "ssevilla@calimesa.gov",
  },
  {
    name: "John (contract)",
    title: "Contract Planner",
    section: "Planning",
    phones: [office("109")],
    email: "contractplanner@calimesa.gov",
  },

  {
    name: "Nick Fox",
    title: "Code Enforcement Officer",
    section: "Code enforcement",
    phones: [office("254"), cell("(909) 951-5330", "+19099515330", "City")],
    email: "nfox@calimesa.gov",
  },

  {
    name: "Mike Thornton",
    title: "City Engineer",
    section: "Engineering & public works",
    phones: [office("225"), cell("(909) 240-6284", "+19092406284", "Mike")],
    email: "mthornton@calimesa.gov",
  },
  {
    name: "Travis Bradshaw",
    title: "Associate Engineer",
    section: "Engineering & public works",
    phones: [office("225"), cell("(951) 836-2782", "+19518362782", "Travis")],
    email: "tbradshaw@calimesa.gov",
  },
  {
    name: "Mari Shakir",
    title: "Public Works Director",
    section: "Engineering & public works",
    phones: [office("235"), cell("(909) 848-6823", "+19098486823", "City")],
    email: "mshakir@calimesa.gov",
  },
  {
    name: "Kyle Coney",
    title: "Maintenance Superintendent",
    section: "Engineering & public works",
    phones: [office("234"), cell("(909) 732-7828", "+19097327828", "City")],
    email: "kconey@calimesa.gov",
  },
  {
    name: "Robert Hagan",
    title: "Lead Maintenance",
    section: "Engineering & public works",
    phones: [cell("(909) 712-0011", "+19097120011")],
    email: "rhagan@calimesa.gov",
  },
  {
    name: "Anthony Gaona",
    title: "Maintenance worker",
    section: "Engineering & public works",
    phones: [cell("(909) 809-2347", "+19098092347")],
    email: "agaona@calimesa.gov",
  },
  {
    name: "Adam Flores",
    title: "Maintenance worker",
    section: "Engineering & public works",
    phones: [cell("(909) 894-9043", "+19098949043")],
    email: "aflores@calimesa.gov",
  },
  {
    name: "Joey Avila",
    title: "Maintenance worker",
    section: "Engineering & public works",
    phones: [cell("(909) 809-8714", "+19098098714")],
    email: "javila@calimesa.gov",
  },
  {
    name: "Patrick Palafox",
    title: "Public Works Inspector",
    section: "Engineering & public works",
    phones: [cell("(909) 353-9534", "+19093539534", "TKE")],
  },

  {
    name: "Dave Fredborg",
    title: "Chief Inspector",
    section: "Building & safety",
    phones: [],
    email: "dfredborg@calimesa.gov",
  },
  {
    name: "S. Barton",
    title: "Building Inspector",
    section: "Building & safety",
    phones: [],
    email: "sbarton@calimesa.gov",
  },
  {
    name: "Building Inspector",
    title: "Building & Safety",
    section: "Building & safety",
    phones: [office("228")],
    email: "buildinginspector@calimesa.gov",
  },
  {
    name: "Virginia Figueroa",
    title: "Sr. Permit Tech",
    section: "Building & safety",
    phones: [office("226")],
    email: "vfigueroa@calimesa.gov",
    email2: "buildingtech@calimesa.gov",
  },

  {
    name: "Paul Lindley",
    title: "Fire Chief",
    section: "Fire department",
    phones: [office("243"), cell("(909) 848-1287", "+19098481287")],
    email: "plindley@calimesa.gov",
  },
  {
    name: "Steve Shaw",
    title: "Deputy Fire Chief",
    section: "Fire department",
    phones: [office("120"), cell("(909) 848-1292", "+19098481292")],
    email: "sshaw@calimesa.gov",
  },
  {
    name: "Alan Rapoza",
    title: "Battalion Chief",
    section: "Fire department",
    phones: [office("124"), cell("(909) 283-2490", "+19092832490")],
    email: "arapoza@calimesa.gov",
  },

  {
    name: "Craig Sanchez",
    title: "Fire Inspector",
    section: "Fire prevention",
    phones: [],
    email: "csanchez@calimesa.gov",
  },
  {
    name: "Fred Domingez",
    title: "Fire Inspector",
    section: "Fire prevention",
    phones: [office("107")],
    email: "fdomingez@calimesa.gov",
  },

  {
    name: "Ernie Esquibel",
    title: "Sheriff Captain",
    section: "Sheriff",
    phones: [
      cell("(951) 922-7273", "+19519227273", "Office"),
      cell("(760) 578-7885", "+17605787885"),
    ],
    email: "eesquibe@riversidesheriff.org",
    note: "Cabazon Station · 50290 Main Street, Cabazon, CA 92230",
  },
  {
    name: "Randy Vasquez",
    title: "Lieutenant",
    section: "Sheriff",
    phones: [
      cell("(951) 922-7153", "+19519227153", "Office"),
      cell("(951) 608-7190", "+19516087190"),
    ],
    email: "rvasquez@riversidesheriff.org",
  },
  {
    name: "Ricardo Torres",
    title: "POP Officer",
    section: "Sheriff",
    phones: [cell("(951) 712-3145", "+19517123145")],
    email: "rtorres3@riversidesheriff.org",
  },
  {
    name: "Jake Mabry",
    title: "Deputy / CSO",
    section: "Sheriff",
    phones: [cell("(951) 219-5684", "+19512195684")],
    email: "imabry@riversidesheriff.org",
  },

  {
    name: "Kristy Loufex",
    title: "Center manager — FSA",
    section: "Senior center",
    phones: [office("238")],
    email: "kristy.loufex@fsaca.org",
    note: "Calimesa Senior Center",
  },
];

export function searchContacts(query: string): CityContact[] {
  return filterContacts(CITY_CONTACTS, query);
}

export function contactsBySection(list: CityContact[]) {
  return groupContacts(list, CONTACT_SECTIONS);
}

export const VENDOR_SECTIONS = ["Apparatus", "Station", "Medical"] as const;

export const VENDOR_CONTACTS: CityContact[] = [
  {
    name: "Bit Pros",
    title: "Apparatus",
    section: "Apparatus",
    phones: [cell("(760) 839-2641", "+17608392641")],
    note: "670 Opper St, Escondido, CA 92029",
  },
  {
    name: "H&S Mobile",
    title: "Stu",
    section: "Apparatus",
    phones: [cell("(760) 795-6634", "+17607956634")],
  },
  {
    name: "Yaegers Diesel",
    title: "Diesel",
    section: "Apparatus",
    phones: [cell("(909) 795-8210", "+19097958210")],
    note: "13394 Calimesa Blvd, Yucaipa, CA 92399",
  },
  {
    name: "Goodyear Tire Mobile",
    title: "Tires",
    section: "Apparatus",
    phones: [cell("(909) 472-2516", "+19094722516")],
  },
  {
    name: "West Coast Fire Sales",
    title: "Fire equipment",
    section: "Apparatus",
    phones: [cell("(909) 218-9823", "+19092189823")],
  },
  {
    name: "Johnson Equipment",
    title: "Equipment",
    section: "Apparatus",
    phones: [cell("(951) 940-0606", "+19519400606")],
  },
  {
    name: "JTE Electrician",
    title: "JT",
    section: "Station",
    phones: [cell("(951) 536-2337", "+19515362337")],
  },
  {
    name: "Aloha Plumbing",
    title: "Plumbing",
    section: "Station",
    phones: [cell("(909) 570-4588", "+19095704588")],
  },
  {
    name: "2Hot Apparel",
    title: "Apparel",
    section: "Station",
    phones: [cell("(951) 304-0033", "+19513040033")],
  },
  {
    name: "BIO Medical",
    title: "Amanda Barard",
    section: "Medical",
    phones: [cell("(760) 317-5609", "+17603175609")],
  },
];

export function searchVendors(query: string): CityContact[] {
  return filterContacts(VENDOR_CONTACTS, query);
}

export function vendorsBySection(list: CityContact[]) {
  return groupContacts(list, VENDOR_SECTIONS);
}

function filterContacts(list: CityContact[], query: string): CityContact[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return list;
  return list.filter((c) => {
    const blob = [
      c.name,
      c.title,
      c.section,
      c.email,
      c.email2,
      c.note,
      ...c.phones.map((p) => `${p.label} ${p.display} ${p.tel}`),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return blob.includes(needle);
  });
}

function groupContacts(list: CityContact[], sections: readonly string[]) {
  return sections
    .map((section) => ({
      section,
      people: list.filter((c) => c.section === section),
    }))
    .filter((g) => g.people.length);
}
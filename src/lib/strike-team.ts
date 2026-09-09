export type StrikeLink = { label: string; href: string };

export type StrikeStep = { title: string; body: string };

export type IcsForm = {
  code: string;
  title: string;
  note: string;
  href: string;
  pack: "pocket" | "iap";
};

const FEMA =
  "https://training.fema.gov/emiweb/is/icsresource/assets/ICS%20Forms/";

export const STRIKE_RATES_AS_OF = "1 July 2026";

export const MEAL_RATES = [
  { id: "B", label: "Breakfast", amount: "$19" },
  { id: "L", label: "Lunch", amount: "$22" },
  { id: "D", label: "Dinner", amount: "$32" },
  { id: "I", label: "Incidentals", amount: "$5" },
] as const;

export const LODGING_RATE = { night: "$151", ceiling: "150%" } as const;

export const POV_MILE = "$0.725";

export const ADMIN_RATE = "15%";

export const PERSONNEL_BASE = [
  {
    who: "STEN / TF Leader and above (no agency survey on file)",
    st: "$42.72",
    ot: "$64.09",
  },
  {
    who: "Engine company and STEN(T) / below (no agency survey on file)",
    st: "$33.16",
    ot: "$49.74",
  },
] as const;

export const APPARATUS_RATES = [
  { type: "Type I engine", hourly: "$278.07" },
  { type: "Type II engine", hourly: "$145.36" },
  { type: "Type III engine", hourly: "$173.09" },
  { type: "Type IV engine", hourly: "$103.53" },
  { type: "Type V–VII", hourly: "$112.82" },
  { type: "Water tender tactical I", hourly: "$162.22" },
  { type: "Water tender tactical II", hourly: "$157.66" },
] as const;

export const SUPPORT_DAILY = [
  { type: "Sedan", daily: "$145" },
  { type: "Pickup", daily: "$178" },
  { type: "Van", daily: "$256" },
  { type: "SUV", daily: "$244" },
  { type: "Other ¾-ton and above", daily: "$200" },
] as const;

export const QUICK_START: StrikeStep[] = [
  {
    title: "Write the order number",
    body: "Comes through Calimesa / RRU dispatch. On a card before you roll — it goes on the F-42.",
  },
  {
    title: "96 hours is the floor",
    body: "Full tank, full water, extra oil, belts, change of clothes. If you cannot commit, say it now.",
  },
  {
    title: "STL brief before you leave the county",
    body: "Travel freq, designators, code-3 or not, fuel plan, who is ALT. STEN — usually the most experienced captain who is not the trainee.",
  },
  {
    title: "Tight formation",
    body: "Slowest engine in front. STL or ALT at the rear. Quarter-tank on the road. Half a tank before you deploy.",
  },
  {
    title: "Check in as a strike team",
    body: "Not five lost engines. Staging = three-minute roll. Stay together.",
  },
  {
    title: "214 every shift. F-42 is the money",
    body: "No F-42, no reimbursement. Official form is MARS / the AREP. The PDF on the internet is training only.",
  },
  {
    title: "Call the house every 24 hours",
    body: "People, apparatus, where you are, how long, messages for family.",
  },
  {
    title: "Demo when they release you",
    body: "Resources / STL. Don’t freelance a motel and dinner on the way home without the paper.",
  },
];

export const HOUSE_RULES: StrikeStep[] = [
  {
    title: "This is not a vacation",
    body: "Still on the clock for Calimesa and the California fire service. Your nametag is the department’s nametag.",
  },
  {
    title: "No alcohol. No illegal drugs",
    body: "Not in the cab, not at the motel, not “after hours.” Cal OES code of conduct is zero.",
  },
  {
    title: "No freelancing",
    body: "The STL takes the assignment. Captains don’t cut their own deal with a DIVS.",
  },
  {
    title: "Stay with the team",
    body: "Town, laundry, ice, the grocery — STL or the captain knows. One engine gone shopping is a strike team that can’t roll.",
  },
  {
    title: "Clear text. Named talk-groups",
    body: "No codes. Not “channel 4.” White 1 / White 2 / command / tac — say the name. Keep the chatter down.",
  },
  {
    title: "PPE, shelters, 100-gallon reserve",
    body: "LCES is not optional because you’re “just patrolling.” Shelters in the cab.",
  },
  {
    title: "Don’t walk into a house",
    body: "Unless you’re fighting fire in that house, or the owner asked you in.",
  },
  {
    title: "Issued gear goes back",
    body: "Before demo. Cutting a hose clamp or “borrowing” a nozzle is theft.",
  },
  {
    title: "Staging is not nap time",
    body: "Boots on, radio out of the bag. Unassigned still means ready.",
  },
  {
    title: "Don’t argue with Finance in the chow line",
    body: "STL handles Motel, Ground Support, Finance. You eat, you sleep, you go back to work.",
  },
  {
    title: "Personal kit",
    body: "Cash, p-card, ID, meds, extra socks, sleeping bag. Lost personal stuff is often not replaced.",
  },
  {
    title: "Mark the windshield",
    body: "Strike team upper right, engine / captain lower right. Shoe polish still works.",
  },
];

export const MARS_STEPS: StrikeStep[] = [
  {
    title: "What MARS is",
    body: "Cal OES Mutual Aid Reimbursement System. Replaced CFRIS. Local government strike teams get paid under the CFAA.",
  },
  {
    title: "You own the field paper",
    body: "F-42, 214s, receipts, meal/lodging roster, ICS-213s. City / fire admin owns the login. Garbage in the cab = garbage in MARS.",
  },
  {
    title: "Salary survey has to be signed",
    body: "Every year, in MARS. No survey = Cal OES has no rate. That’s a chief/admin job — a stale survey still kills the invoice later.",
  },
  {
    title: "F-42 is the timesheet",
    body: "Engine and people. Portal-to-portal, order number, request number, names, classifications. Get the requesting-agency signature. Ask the AREP for the current form.",
  },
  {
    title: "16-hour cap",
    body: "Apparatus: 16 hours max per 24 from initial dispatch. Don’t “make up” hours on the F-42.",
  },
  {
    title: "Personnel rates",
    body: "Agency survey, overtime at time-and-a-half. The $42.72 / $33.16 numbers are only if Calimesa has nothing on file.",
  },
  {
    title: "Admin is 15%",
    body: "De minimis on approved costs unless the city filed its own rate.",
  },
  {
    title: "When you get home",
    body: "214s, F-42, receipts, p-card log, meal/lodging roster to whoever files MARS. CFAAreimbursement@caloes.ca.gov / 916-845-8711. Don’t wait two weeks.",
  },
];

export const FUEL_NOTES: StrikeStep[] = [
  {
    title: "Engine fuel is inside the hourly rate",
    body: "Don’t also invoice the diesel you put in the engine as a separate line. Oil and wear too.",
  },
  {
    title: "Support / chase is a daily GOV rate",
    body: "Sedan $145, pickup $178, SUV $244, van $256, other ¾-ton+ $200. Keep the pump receipts for the p-card file.",
  },
  {
    title: "POV is $0.725 a mile",
    body: "Log start/stop miles. That mileage is the fuel. Don’t stack a p-card fill on top unless Finance said to.",
  },
  {
    title: "Rentals default compact",
    body: "Bigger needs an authorized position or an ICS-213. Trucks add $0.20/mile.",
  },
];

export const MEAL_NOTES: StrikeStep[] = [
  {
    title: "Camp food = you don’t also claim it",
    body: "Double-dipping is how invoices come back.",
  },
  {
    title: "Itemized receipt",
    body: "A credit-slip total with no food listed will get kicked.",
  },
  {
    title: "Odd rooms need a 213",
    body: "Over-ceiling, no-receipt, split crew: Cal OES meal/lodging roster plus ICS-213.",
  },
];

export const PCARD_STEPS: StrikeStep[] = [
  {
    title: "City of Calimesa card",
    body: "CFD policy and the city form still win. This is how you don’t sink the invoice.",
  },
  {
    title: "Photo the receipt the same day",
    body: "Itemized. Date, vendor, amount, who was there, what it was (fuel STL 51, dinner 4, lodging 2 rooms).",
  },
  {
    title: "Ask before you guess the coding",
    body: "Captain / STL. Wrong account is a Finance problem two months later.",
  },
  {
    title: "Usually allowed",
    body: "Fuel for the authorized vehicle, lodging, meals the incident did not provide, ice/water/batteries the STL signed for, parts to keep the engine in service.",
  },
  {
    title: "Not on the card",
    body: "Alcohol, personal snacks, souvenirs, cash back, family, “I’ll pay you back,” weapons, fuel for your off-duty truck.",
  },
  {
    title: "Lodging $151",
    body: "Over that, up to 150%, needs a paper trail (full, fire, no rooms). Get the 213.",
  },
  {
    title: "One receipt, one entry",
    body: "Split a restaurant check so each engine’s card matches its people. Hold the paper until the packet is signed.",
  },
];

export const ICS_FORMS: IcsForm[] = [
  {
    code: "214",
    title: "Activity Log",
    note: "Your timesheet in story form. Every shift.",
    pack: "pocket",
    href: `${FEMA}ICS%20Form%20214%2C%20Activity%20Log%20%28v3.1%29.pdf`,
  },
  {
    code: "213",
    title: "General Message",
    note: "Over-ceiling room, extra rental, anything Finance will argue.",
    pack: "pocket",
    href: `${FEMA}ICS%20Form%20213%2C%20General%20Message%20%28v3%29.pdf`,
  },
  {
    code: "211",
    title: "Incident Check-In List",
    note: "The list Staging uses on you.",
    pack: "pocket",
    href: `${FEMA}ICS%20Form%20211%2C%20Incident%20Check-In%20List%20%28v3.1%29.pdf`,
  },
  {
    code: "221",
    title: "Demobilization Check-Out",
    note: "The ticket home. Don’t leave without it.",
    pack: "pocket",
    href: `${FEMA}ICS%20Form%20221%2C%20Demobilization%20Check-Out%20%28v3%29.pdf`,
  },
  {
    code: "213RR",
    title: "Resource Request",
    note: "Asking for more people or kit.",
    pack: "pocket",
    href: `${FEMA}ICS%20Form%20213RR%2C%20Resource%20Request%20Message%20%28v3%29.pdf`,
  },
  {
    code: "201",
    title: "Incident Briefing",
    note: "What you walk into. STL / first-in.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20201%2C%20Incident%20Briefing%20%28v3%29.pdf`,
  },
  {
    code: "202",
    title: "Incident Objectives",
    note: "IAP cover. Read it before briefing.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20202%2C%20Incident%20Objectives%20%28v3.1%29.pdf`,
  },
  {
    code: "203",
    title: "Organization Assignment List",
    note: "Who is IC, OSC, DIVS, your STL.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20203%2C%20Organization%20Assignment%20List%20%28v3%29.pdf`,
  },
  {
    code: "204",
    title: "Assignment List",
    note: "Your division, radio, special instructions.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20204%2C%20Assignment%20List%20%28v3.1%29.pdf`,
  },
  {
    code: "205",
    title: "Incident Radio Communications Plan",
    note: "Command, tac, air. Program names, not channel numbers.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20205%2C%20Incident%20Radio%20Communications%20Plan%20%28v3.1%29.pdf`,
  },
  {
    code: "205A",
    title: "Communications List",
    note: "Phone / radio directory.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20205A%2C%20Communications%20List%20%28v3%29.pdf`,
  },
  {
    code: "206",
    title: "Medical Plan",
    note: "Where the medics and hospital are.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20206%2C%20Medical%20Plan%20%28v3%29.pdf`,
  },
  {
    code: "207",
    title: "Incident Organization Chart",
    note: "Picture of the org.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20207%2C%20Incident%20Organization%20Chart%20%28v3%29.pdf`,
  },
  {
    code: "208",
    title: "Safety Message / Plan",
    note: "Hazards this period.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20208%2C%20Safety%20Message-Plan%20%28v3.1%29.pdf`,
  },
  {
    code: "209",
    title: "Incident Status Summary",
    note: "Sit-stat. Overhead.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20209%2C%20Incident%20Status%20Summary%20%28v3%29.pdf`,
  },
  {
    code: "210",
    title: "Resource Status Change",
    note: "When your engine status changes.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20210%2C%20Resource%20Status%20Change%20%28v3%29.pdf`,
  },
  {
    code: "215",
    title: "Operational Planning Worksheet",
    note: "Planning P. Not a line form.",
    pack: "iap",
    href: `${FEMA}ICS%20Form%20215%2C%20Operational%20Planning%20Worksheet%20%28v3%29.pdf`,
  },
];

export const STRIKE_LINKS: StrikeLink[] = [
  {
    label: "CFAA rate letter — 1 July 2026",
    href: "https://www.caloes.ca.gov/wp-content/uploads/Fire-Rescue/Documents/Admin.2026.Docs/Rate-Letter-Effective-July-1-2026.pdf",
  },
  {
    label: "MARS — Cal OES",
    href: "https://www.caloes.ca.gov/office-of-the-director/operations/response-operations/fire-rescue/administration-reimbursement/mars/",
  },
  {
    label: "F-42 instructions",
    href: "https://www.caloes.ca.gov/wp-content/uploads/Fire-Rescue/Documents/MARS_F-42_Instructions.pdf",
  },
  {
    label: "MARS checklist — local fire",
    href: "https://www.caloes.ca.gov/wp-content/uploads/MARS-Check-List-Local-Fire-Agency.pdf",
  },
  {
    label: "Reimbursement timeline",
    href: "https://www.caloes.ca.gov/wp-content/uploads/Reimbursement-Timeline.pdf",
  },
  {
    label: "Exhibit H — incident expenses",
    href: "https://www.caloes.ca.gov/wp-content/uploads/Fire-Rescue/2023-Cal-OES-Exhibit-H-In-State-and-Incident-Related-Expenses-1.pdf",
  },
  {
    label: "Meal / lodging roster",
    href: "https://www.caloes.ca.gov/wp-content/uploads/Fire-Rescue/Documents/Cal_OES_Emergency_Meal_Lodging_Roster_%E2%80%93_FILLABLE.pdf",
  },
  {
    label: "Cal OES ICS-213 (fillable)",
    href: "https://www.caloes.ca.gov/wp-content/uploads/Fire-Rescue/1.2026-ICS-213.pdf",
  },
  {
    label: "Strike Team Leader manual",
    href: "https://www.caloes.ca.gov/wp-content/uploads/Fire-Rescue/Documents/Admin.2026.Docs/CalOES_-_Fire_and_Rescue_-_Strike_Team_Leader_Manual-2-.pdf",
  },
  {
    label: "FEMA ICS fillable forms",
    href: "https://training.fema.gov/icsresource/icsforms.aspx",
  },
];

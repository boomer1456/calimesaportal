import { BINDER_FILES } from "@/lib/binder";

export type SogGroupId = "survival" | "structure" | "wildland" | "calls" | "rescue";

export type SogVideo = {
  label: string;
  href: string;
};

export type SogTerm = {
  term: string;
  meaning: string;
};

export type SogCard = {
  id: string;
  group: SogGroupId;
  code: string;
  title: string;
  kicker: string;
  sog: string;
  page: number;
  why: string;
  lines: string[];
  terms: SogTerm[];
  video?: SogVideo;
};

export type SogGroup = {
  id: SogGroupId;
  title: string;
  kicker: string;
};

const PDF = BINDER_FILES.v6;

export const SOG_GROUPS: SogGroup[] = [
  { id: "survival", title: "Survival", kicker: "Tags · 2-out · Mayday" },
  { id: "structure", title: "Structure", kicker: "First-due · search · vent · irons" },
  { id: "wildland", title: "Wildland", kicker: "LCES · WUI · the pass" },
  { id: "calls", title: "Other calls", kicker: "Vehicle · TC · MCI · hazmat" },
  { id: "rescue", title: "Rescue", kicker: "Confined · trench · water" },
];

export const SOG_CARDS: SogCard[] = [
  {
    id: "acct",
    group: "survival",
    code: "600.05",
    title: "Accountability",
    kicker: "Pass Tags · PAR",
    sog: "600.05 Accountability System",
    page: 13,
    why: "We do not collect tags for a clipboard. We collect them so when a floor fails, Command already knows who is missing — in the first 30 seconds, not after someone says “I thought he was behind me.” Radio PARs lie when the channel is jammed. The tag on the dash is the last honest headcount.",
    lines: [
      "First-due officer names the Accountability Collection Point in the report on conditions — usually the first-arriving cab. Say it out loud so the next-due is not guessing.",
      "Pass Tags (name, helmet Velcro) ride on the Apparatus Tag. Helmet magnets match the rig you are on today, not the one you rode last tour.",
      "Drop Pass Tags at the collection point before you commit. If you cannot: radio location, assignment, and headcount before you disappear into the building.",
      "IC owns the system and can assign an Accountability Officer. No freelancing, no “we’ll catch tags later.” Later is when people are already lost.",
      "PAR every 10 minutes on interior. ECC runs a 15-minute clock on a working structure. Also PAR on a missing member, offensive to defensive, or collapse.",
      "Company officer cannot account for a member: MAYDAY. That is the trigger — not a search of the yard. Pick up your tags before you leave the scene.",
    ],
    terms: [
      { term: "Pass Tag", meaning: "Your name on Velcro. It lives on the apparatus board until you commit, then it lives at the collection point." },
      { term: "ACP", meaning: "Accountability Collection Point. Named in the first report on conditions so arriving companies know where to drop tags." },
      { term: "PAR", meaning: "Personnel Accountability Report. A roll call: who you have, where they are, and that they can answer. Not “we’re fine.”" },
      { term: "Riding assignment", meaning: "Seat you took this morning. Magnets and tags match this rig, this tour — not last shift." },
    ],
  },
  {
    id: "idlh",
    group: "survival",
    code: "600.06",
    title: "2-in / 2-out",
    kicker: "IDLH · Standby · RIC",
    sog: "600.06 IDLH 2 IN 2 OUT",
    page: 17,
    why: "An IDLH atmosphere kills you in breaths, not minutes. Two-in means you never hunt smoke alone. Two-out is not a union rule — it is the crew that can still reach you if the floor goes. The rescue exception exists so we do not stand in the yard while a civilian burns. It does not exist so we can “just take a look.”",
    lines: [
      "IC / officer decides if it is IDLH. An interior fire past the incipient stage is IDLH. Smoke that will not lift, a working kitchen, a bedroom with a closed door — treat it as IDLH until it proves otherwise.",
      "Teams of two or more in SCBA. Visual, voice, or physical contact — do not rely on radio alone. Radio is how you call for help, not how you keep a partner.",
      "Before anyone goes in: a two-person Standby Crew outside, in PPE / SCBA, tracking who is in, where, and entry time on the PAS Roster.",
      "Only exception: imminent life-threatening rescue. No exception when there is no life to save. Write it up to the Fire Chief.",
      "Fewer than four on scene = no interior IDLH except that rescue exception. Standby becomes RIC when IC orders resources beyond the first alarm.",
      "Every entry crew has a portable radio. Radio dies — the crew exits unless another working radio is with them. A silent crew is a missing crew.",
    ],
    terms: [
      { term: "IDLH", meaning: "Immediately Dangerous to Life or Health. Interior fire past incipient, or an atmosphere you cannot breathe without SCBA." },
      { term: "Incipient", meaning: "The fire you can still put out with a can or a small line, in the room of origin, with a viable exit. Past that, it is IDLH." },
      { term: "Standby / 2-out", meaning: "Two firefighters outside, in PPE and SCBA, whose only job is you. They are not throwing a ladder or stretching a second line." },
      { term: "RIC", meaning: "Rapid Intervention Crew. 2-out grows into RIC when the fire does. Same job, more people, a plan, and tools staged for a firefighter down." },
      { term: "PAS Roster", meaning: "Who went in, which door, what time. If it is not written, Command does not have it." },
    ],
  },
  {
    id: "mayday",
    group: "survival",
    code: "MAYDAY",
    title: "Firefighter Down",
    kicker: "Call it early",
    sog: "600.06 IDLH 2 IN 2 OUT — Firefighter Down",
    page: 29,
    why: "A Mayday is not a failure. Waiting is. The first minute after you know you are in trouble is when RIC can still find you on a hose line. After that you are a search problem in a building that is getting worse. We practice the words so they come out when the air is bad and the radio is loud.",
    lines: [
      "Call it as soon as you THINK you are in trouble. Lost, trapped, out of air, or separated. Do not wait until you are sure. “Mayday, Mayday, Mayday — Firefighter Down.”",
      "Emergency Traffic. ECC: three alert tones. Initial tac stays with RIC and the downed member. Everyone else moves to a secondary tac so the rescue channel stays clean.",
      "Lost or trapped: activate PASS, stay with the crew, follow the hose. Male coupling toward the pump — that is outside. If you have no hose, find a wall and a window.",
      "Cannot raise Command or tac — try another channel. Cannot get out: exterior wall, door, or hallway. Go horizontal. Light toward the ceiling so RIC can see you.",
      "IC assigns RIC immediately, starts a PAR, and stands up a second RIC as the first one goes in. One RIC committed is a RIC that cannot save the next one.",
      "Operational retreat: three tones plus air horn 10 seconds on / 10 off × 3. Do not stop for tools. Rally 1½ times the building height out. PAR. If you are the Mayday, you do not retreat — you stay put so they can find you.",
    ],
    terms: [
      { term: "Emergency Traffic", meaning: "The radio is now for the rescue. You stop talking unless you are Command, RIC, or the downed member." },
      { term: "PASS", meaning: "Personal Alert Safety System. Turn it on, or it will after you stop moving. RIC hunts the sound." },
      { term: "Male coupling", meaning: "On a charged line, the male end points toward the pump — and the door you came in. Follow couplings out." },
      { term: "Secondary tac", meaning: "The rest of the fire moves here so the original channel stays with the Mayday. Confirm the channel out loud." },
      { term: "Air-horn retreat", meaning: "Get out. Rally at 1½ times the building height so collapse and radiant heat do not eat the crew that just left." },
    ],
    video: {
      label: "Fire Engineering — Calling the Mayday",
      href: "https://www.youtube.com/watch?v=pRjVXLC-MW8",
    },
  },
  {
    id: "structure",
    group: "structure",
    code: "600.10",
    title: "Structure fires",
    kicker: "First-due sequence",
    sog: "600.10 Structure Fires",
    page: 59,
    why: "The first-due size-up is the last honest look the IC will get. After that, everyone is inside the problem. We name Alpha because Inland houses do not face the street the way the map thinks — flag lots, walk-outs on the canyon, and garages that are actually Charlie. Mixing offensive interior with defensive exterior on the same fire is how we push fire into the search and water onto our own people.",
    lines: [
      "First-due: curbside size-up, take command, name Alpha, 360 (stories, construction, fire location, path, hazards, more resources). On a hillside or a flag lot, the 360 is how you find the walk-out and the extra story.",
      "Declare strategy, mode, accountability, and water source. Hydrant, tank, or a drop tank from the next-due — say it so the engineer is not guessing. Set the fireground radio plan.",
      "Interior line: minimum two. Interior search: minimum two. RIC / 2-out in place before interior IDLH work. Rescue is the only exception, and you say that exception out loud.",
      "Declared rescue: ECC and the next-due or chief verbally acknowledge. Priorities: rescue → exposures → confine → extinguish. We do not skip rescue to save the building.",
      "Do not run an offensive interior and a defensive exterior on the same fire. Pick a mode. If Command switches, everyone switches — including the roof and the backup line.",
      "Utilities off so they do not feed the fire. SCE gas and electric both reclose. Overhaul on air until the space is clear — Inland smolder in a garage conversion will light off after you pull out.",
    ],
    terms: [
      { term: "ROC", meaning: "Report on conditions. What you see, what you are doing, what you need. First transmission that actually runs the fire." },
      { term: "Alpha", meaning: "The side that faces the street you named. Bravo is left, Charlie is the rear, Delta is right. Walk-outs and flag lots lie — confirm Charlie on the 360." },
      { term: "Offensive / defensive", meaning: "Offensive: we go in. Defensive: we do not. You cannot do both on the same fire without throwing water on your own crew." },
      { term: "RECEO-VS", meaning: "Rescue, Exposures, Confine, Extinguish, Overhaul — Ventilation and Salvage support those. Order of work, not a slogan." },
      { term: "Water source", meaning: "Hydrant, tank water, or a drop tank. Calimesa has dead-ends and hillside stretches. Say which one before the tank is empty." },
    ],
    video: {
      label: "UL FSRI — Coordinated fire attack",
      href: "https://www.youtube.com/watch?v=QjxCxLOtZCw",
    },
  },
  {
    id: "search",
    group: "structure",
    code: "SEARCH",
    title: "Search / VEIS",
    kicker: "Primary · isolate",
    sog: "600.10 Structure Fires — search",
    page: 59,
    why: "People die in the rooms the fire has not reached yet — from smoke and CO, not from flame. A closed bedroom on the Bravo side of a Calimesa ranch can still hold a viable patient while the living room is blowing. VEIS exists for that room. Isolation (closing the door) is the tactic. The window is just the door you made. Security bars, wrought iron, and garage conversions are why “go in the front” is not always search.",
    lines: [
      "Interior search is a two-person job. Primary for savable lives, while the fire is still the problem. Secondary after fire control, slower, for the person we walked past. Mark rooms as you clear them.",
      "Declared rescue: ECC and the next-due or chief acknowledge. Search does not wait for a perfect line if people are inside — but it also does not search past a fire you have not cut off.",
      "VEIS: vent the window, enter, isolate the room (close the door), then search. Isolation changes the tenability of that room. Break glass and leave the door open and you just made a chimney.",
      "Orient on walls, hose, and openings. If you lose the crew or the way out — MAYDAY. A TIC is a tool, not a map. Confirm what you think you see with a hand.",
      "Do not search past a fire you have not cut off. Coordinate with the nozzle so you are not pushing fire and steam into victims and into your own search.",
      "Victim found: package, tell Command, and get them to the window or the stairs. Do not freelance a second search while a civilian is still in your hands. Security bars: plan the way out before you commit in.",
    ],
    terms: [
      { term: "Primary / secondary", meaning: "Primary is for lives, fast, during the fire. Secondary is the slow pass after fire control so we do not leave someone." },
      { term: "VEIS", meaning: "Vent, Enter, Isolate, Search. The “I” is the point. Close the door or the room you just opened becomes the fire’s next room." },
      { term: "Oriented search", meaning: "One hand on a wall, a window, or a hose. If you cannot point to the way out, you are the next search." },
      { term: "Garage conversion", meaning: "Inland house trick: a bedroom that used to be a garage. One door, bars on the window, and it sits on Alpha. Size it on the 360." },
      { term: "Security bars", meaning: "Common on Bravo and Charlie bedrooms. VEIS without a way to beat the bars is a trap. Irons or a Halligan on the bars before you drop in." },
    ],
    video: {
      label: "UL FSRI — VEIS training short",
      href: "https://www.youtube.com/watch?v=n26mPCY5xEM",
    },
  },
  {
    id: "vent",
    group: "structure",
    code: "VENT",
    title: "Ventilation",
    kicker: "With the nozzle",
    sog: "600.10 Structure Fires — ventilation",
    page: 59,
    why: "Ventilation is a fire-attack tool, not a roof project. Every hole is an inlet or an outlet. On pass-wind and Santa Ana days the house is already being ventilated by the weather — your PPV can push fire into the unburned bedrooms and into the search. We vent when it serves victims and the nozzle. We stop when Command goes defensive, because a crew on a tile roof in a defensive fire is the next Mayday.",
    lines: [
      "Vent when it serves victims and the nozzle — not because the roof is there. If you cannot say who it helps, do not cut.",
      "Coordinate with attack. Uncoordinated holes make the fire bigger and the search worse. The nozzle owns the inlet. You own the outlet they asked for.",
      "Horizontal first on most Calimesa dwellings — window for window, with the wind in mind. Vertical is a roof operation with a charged line and a crew that can get off.",
      "Know inlet vs outlet. Do not make a new inlet behind the attack crew. On a wind-driven fire, the wind already picked the inlet. Work with it or get out of it.",
      "PPV / PPA only with a plan, a charged line, and control of the exhaust opening. A fan into a house with no exhaust is a blowtorch aimed at the search.",
      "If Command switches to defensive, stop cutting and get off the roof. Concrete tile on Inland roofs is heavy, slick, and slow — plan the way off before the first hole.",
    ],
    terms: [
      { term: "Air track", meaning: "Where the fire is breathing. Inlet in, outlet out. You either help that path or you become part of it." },
      { term: "Horizontal / vertical", meaning: "Horizontal is windows and doors. Vertical is the roof. Horizontal first on dwellings unless Command has a reason." },
      { term: "PPV / PPA", meaning: "Positive-pressure ventilation / attack. A fan is a tactic, not a default. Exhaust opening first, then the fan." },
      { term: "Pass wind / Santa Ana", meaning: "San Gorgonio Pass and Santa Ana events. Dry, fast, and they already ventilated the house. Size-up the wind before you size-up the saw." },
      { term: "Tile roof", meaning: "Concrete or clay tile, common here. Heavy, breaks, and it is a fall waiting if you rush. Charged line and a way off." },
    ],
    video: {
      label: "UL FSRI — Ventilation as a tactic",
      href: "https://training.fsri.org/resources/110/ventilation-as-a-firefighting-tactic",
    },
  },
  {
    id: "forcible",
    group: "structure",
    code: "IRONS",
    title: "Forcible entry",
    kicker: "Get in · control the door",
    sog: "600.10 Structure Fires — forcible entry",
    page: 59,
    why: "The door you force is now part of the fire’s breathing. We force to get in, then we control it so we do not gift the fire a three-foot vent hole. SoCal wrought iron, security screens, multi-point locks, and garage man-doors are why “just kick it” injures firefighters and makes the fire bigger. Try-before-you-pry is not laziness. It is 10 seconds that keeps the door a door.",
    lines: [
      "Force for search and attack — then control the door. A kicked-open door is a vent hole. Chock it where you want it, not where it swung.",
      "Try before you pry. Locked is not always barred. Through-the-lock beats conventional when the lock is the problem and you still want a door when you are done.",
      "Irons: one to gap, one to set. In tight quarters, bar-to-bar beats swinging a maul. A maul needs room you do not have on a patio with a screen cage.",
      "Size the door for inward vs outward, metal vs wood, and what is behind it before you commit. Outward commercial and some garage man-doors eat a bad set.",
      "After it opens: chock, control the air track, and tell Command you are in. If you just made the inlet, say that too.",
      "Garage, security, and wrought-iron doors are a different set. Size it before you swing. Bars on a bedroom window are a VEIS problem — take the irons with you.",
    ],
    terms: [
      { term: "Try before you pry", meaning: "The handle, the lock, the window next to it. Ten seconds. Then force." },
      { term: "Through-the-lock", meaning: "Beat the lock, keep the door. Faster on many residential locks and you still have a door to control." },
      { term: "Inward / outward", meaning: "Which way it swings. Outward needs a different purchase. Guessing is how you bounce a Halligan into your partner." },
      { term: "Chock", meaning: "Hold the door where you want the air track. A door that slams is a crew that just lost its outlet — or gained one." },
      { term: "Wrought iron / screen", meaning: "Common on Inland patios and Bravo doors. It is a second door. Plan the set. Do not waste the first swing on the screen." },
    ],
    video: {
      label: "Fire Engineering — Tight-quarters irons",
      href: "https://www.youtube.com/watch?v=9_nTYA8awTY",
    },
  },
  {
    id: "wildland",
    group: "wildland",
    code: "600.11",
    title: "Wildland",
    kicker: "LCES · WUI",
    sog: "600.11 Wildland – Vegetation Fire",
    page: 63,
    why: "Vegetation fire here is not a forest fire. It is grass, sage, chamise, and houses sitting in the fuel. LCES is why we still have a crew at lunch. San Gorgonio Pass winds and Santa Anas can turn a one-acre spot into a street of involved homes before second-due arrives. We attack from the black because the black already spent its fuel. We stay mobile because a house you “saved” with a parked engine is a house you die in front of when the wind clocks.",
    lines: [
      "LCES in place before you put a line in: lookouts, communications, escape routes, safety zones. Buddy system. Captain keeps the crew. If you cannot name all four, you are not in position — you are in the fuel.",
      "Wildland PPE — brush shirt / pants, leather boots — not structural turnouts. Turnouts cook you and they do not stop ember entry. Hydrate. Carry water. Inland RH in the teens is a medical problem wearing a pack.",
      "Ten Standard Fire Orders. Know the 18 Watch Outs. Fight fire aggressively, having provided for safety first. The orders are why we turn down a bad assignment — not why we write one after.",
      "Attack from the black when you can (“one foot in the black”). Do not frontal-assault from the unburned. The unburned is the next acre.",
      "Structure defense: walk the driveway, back the rig in, short hose, stay mobile. Water on burning material, not a bath of unburned fuel. Triage: defend, prep-and-go, or leave. Not every house is savable on a Red Flag.",
      "Red Flag: NWS wind ≥ 20 mph and RH ≤ 20%. First-due Command: LCES for people and apparatus, a CP that will not have to move. PSPS and downed SCE lines are part of the fire, not a separate call.",
    ],
    terms: [
      { term: "LCES", meaning: "Lookouts, Communications, Escape routes, Safety zones. In place before the line is charged. Missing one is how crews get caught." },
      { term: "WUI", meaning: "Wildland-urban interface. The house is in the fuel. Calimesa hillside, box canyons, and eucalyptus rows are WUI even when the lawn is green." },
      { term: "One foot in the black", meaning: "Work from what already burned. The black is your safety zone if it is picked down and wide enough." },
      { term: "The pass", meaning: "San Gorgonio Pass winds. Funnel through Banning / Beaumont / Calimesa. They do not need a statewide Santa Ana to wreck a shift." },
      { term: "Red Flag", meaning: "NWS: sustained wind ≥ 20 mph and RH ≤ 20%, or a forecast that will get there. It is a staffing and tactics problem, not a weather trivia card." },
      { term: "Prep-and-go", meaning: "Structure triage: we can buy a house a few minutes, then we leave. Not a martyr assignment. Stay mobile." },
    ],
    video: {
      label: "NWCG WFSTAR — LCES",
      href: "https://www.nwcg.gov/training-courses/rt-130/operations/op817",
    },
  },
  {
    id: "vehicle",
    group: "calls",
    code: "600.12",
    title: "Vehicle fire",
    kicker: "Upwind · tanks · bumpers",
    sog: "600.12 Vehicle Firefighting",
    page: 72,
    why: "A car fire is a hazmat fire with wheels. Bumpers, hood struts, and batteries store energy that launches. EVs and hybrids on I-10 do not “go out” the way gasoline does — they re-ignite. We park uphill and upwind so the next tank vent and the runoff are not your lungs. First water on people is why we stretch before we invent a tactic.",
    lines: [
      "Full PPE and SCBA. Minimum 1¾ attack line. Apparatus upwind and uphill, used as a barrier — you are in the lane with CHP, not in a parking stall.",
      "If people are trapped, first water is on them. If not, cool tanks, LPG, and LNG before you commit to the passenger cell. A tank that has not failed yet is still a tank.",
      "Bumpers, hood struts, and batteries are stored energy. Hybrid / EV: stay out of orange cabling and pooled runoff. Thermal runaway is a chemistry problem — soak, isolate, and do not stack other cars against it.",
      "360 for exposures, a second car, and what is in the bed or trunk. Catalytic converters, spare batteries, and a lawn mower in the bed change the fire.",
      "Do not reach into wheel wells or bumper cavities with your face. That is where struts and stored gas go when they fail.",
      "Overhaul on air. Assume the fuel system is still live until you prove it is not. EV: treat re-ignition as likely, not unlucky.",
    ],
    terms: [
      { term: "Upwind / uphill", meaning: "Smoke and fuel go the other way. On a grade, downhill is where the runoff and the next car are." },
      { term: "Bumper strut", meaning: "Stored gas. It launches. You do not put your face in a bumper or a hood well to “see if it’s out.”" },
      { term: "Orange cable", meaning: "High-voltage on hybrids and EVs. Do not cut it, do not peel it, do not stand in the puddle it is sitting in." },
      { term: "Thermal runaway", meaning: "The battery is making its own heat. Water buys time. It does not “put it out” the way gasoline does. Isolate the car." },
      { term: "First water on people", meaning: "If they are in it, the line is for them. The engine can wait 15 more seconds. They cannot." },
    ],
    video: {
      label: "LA County FD — Vehicle fire",
      href: "https://www.youtube.com/watch?v=HQ9-3lJNcTE",
    },
  },
  {
    id: "tc",
    group: "calls",
    code: "600.13",
    title: "Traffic collisions",
    kicker: "Block · stabilize · access",
    sog: "600.13 Traffic Collisions",
    page: 75,
    why: "The next car that did not stop is what kills firefighters on I-10 and the 60. Blocking is patient care. We stabilize before we cut because an uncribbed vehicle is a collapsing building that weighs two tons. Hybrids and EVs add a high-voltage problem on top of the crash — the patient is still the reason we are there, but the orange cable is why we do not crawl under an uncribbed load.",
    lines: [
      "Apparatus as protection: block, angle, lights. You are the barrier, not a parked car. Take the lane you need plus a buffer. On the freeway, that is a conversation with CHP — not a hope.",
      "Size-up: how many vehicles, how many patients, who is trapped, what is leaking. Say the trapped count early so the next-due brings irons and a medic, not another booster.",
      "Order: fire / hazard, stabilize, de-energize, airbags, then patient care and LZ. Cutting first on an uncribbed car is how the patient and the tool guy both move.",
      "Freeway extras: CHP, extra blocking, and the next lane that has not stopped yet. Someone is still doing 70 on the 10 until the cones and the CHP car make it a crime to try.",
      "Hybrids and EVs: high-voltage, stabilize, then access. Do not crawl under an uncribbed load. 12-volt disconnect is not the same as HV dead.",
      "One tool operator, one patient medic, one stabilizer — talk out loud. Extrication without a medic at the window is just metal work.",
    ],
    terms: [
      { term: "Block / angle / lights", meaning: "Park the rig so the next drunk hits steel, not you. Angle it so the bounce goes away from the work." },
      { term: "The lane that hasn’t stopped", meaning: "The one still live. On I-10 / 60 that is the kill zone. Cones, CHP, and another apparatus before you turn your back on it." },
      { term: "Cribbing", meaning: "Wood or plastic that makes the car a building. No crib, no crawl, no dash roll." },
      { term: "HV vs 12-volt", meaning: "12-volt runs airbags and locks. HV runs the car. Killing 12-volt does not make the orange cable safe." },
      { term: "LZ", meaning: "Landing zone for air ambulance. I-10 at Calimesa is a helicopter problem as often as it is an ambulance problem. Pick it early and keep it clean." },
    ],
    video: {
      label: "Fire Engineering — EV hazards",
      href: "https://www.youtube.com/watch?v=GtD5dn5CpzI",
    },
  },
  {
    id: "mci",
    group: "calls",
    code: "600.14",
    title: "MCI",
    kicker: "START · 2-1-M",
    sog: "600.14 Mass Casualty Incidents",
    page: 82,
    why: "One critical patient will eat the whole first-due, and the other twelve will wait. MCI is how we refuse that. 2-1-M is the trigger so we say it before we feel like heroes — a van on the 10, a fire in a packed garage conversion, a shooting. START is crude on purpose. It is a filter, not a diagnosis. REMSA still owns the medicine. This card owns the fireground so medicine can happen.",
    lines: [
      "Implement at 2-1-M or greater. Say it out loud so ECC and the next-due hear it. Once you say MCI, you stop being “the medic on the first patient.”",
      "Branches: triage, extrication, treatment, transport. Do not let one patient eat the whole first-due. Assign people out loud or they will all go to the screaming one.",
      "Triage Report to Command. All IMMEDIATES transported — that is the measure. If delayed patients are leaving first, you do not have a transport officer.",
      "START: walking wounded first (they self-select Minor), then RPM — respirations, perfusion, mental status. It is supposed to be fast and a little cold.",
      "Tags on, treatment area named, and a transport officer before the first ambulance leaves with a delayed. The treatment area is a place, not “over there by the rigs.”",
      "REMSA protocols still apply to the patients you treat. This card is the fireground MCI shell — not permission to skip airway and aspirin.",
    ],
    terms: [
      { term: "2-1-M", meaning: "Two Immediates and one Delayed (or the local trigger that means “this is an MCI”). Say the words. Resources will not guess." },
      { term: "START", meaning: "Simple Triage and Rapid Treatment. Walking, then RPM. Green / yellow / red / black. Not a full assessment." },
      { term: "RPM", meaning: "Respirations, Perfusion, Mental status. The three things START actually checks after the walking wounded walk." },
      { term: "Immediate", meaning: "Red. They leave first. If a yellow beats them to the ambulance, the transport officer failed." },
      { term: "Treatment area", meaning: "Named ground. Immediates here, delayed there. Ambulances come to it — patients do not wander to the highway." },
    ],
    video: {
      label: "DMS — MCI / START",
      href: "https://www.youtube.com/watch?v=leoVtgkLYR4",
    },
  },
  {
    id: "violent",
    group: "calls",
    code: "600.16",
    title: "Violent incidents",
    kicker: "Hot / warm / cold",
    sog: "600.16 Violent Incidents",
    page: 90,
    why: "Firefighters die on these because they treat them like a medical aid with extra police. Hot / warm / cold is how we do not add patients. The warm zone is Rescue Task Force with law — a medic sprint into the hot zone is how you become the next patient. We still run accountability because a shooting in a Calimesa parking lot can turn into three rooms of work, and “I thought he was with PD” is not a PAR.",
    lines: [
      "Violent incident = harm from a violent act: active shooter, ambush, assault. Treat it as that, not as a structure fire with extra police and not as a routine aid.",
      "Same strategic decision model as a structure: size-up, command, and a mode you can explain. Stage is a mode. “Driving up because we always do” is not.",
      "Law, fire, EMS. Stage until law says the approach is tenable. Do not freelance into the hot zone. If you cannot see a cover team, you are in the wrong place.",
      "Warm-zone work is Rescue Task Force with law — not a solo medic sprint. You treat and extract. You do not clear rooms and you do not hunt the shooter.",
      "Treat and extract. This is not a firefight and it is not a crime-scene hold. Patients leave. Evidence does not outrank a bleeding person you can still save.",
      "Accountability still runs. If you cannot see your partner, you are in the wrong place. PAR when you move zones.",
    ],
    terms: [
      { term: "Hot / warm / cold", meaning: "Hot: the threat is there. Warm: law is with you, threat is not gone. Cold: you can work like a normal scene. Do not upgrade yourself." },
      { term: "RTF", meaning: "Rescue Task Force. Fire/EMS plus law, moving through the warm zone to treat and extract. Not a SWAT team and not a lone medic." },
      { term: "Stage", meaning: "Park out of the problem until law says otherwise. A staged engine is not a coward engine. It is still a crew." },
      { term: "Extract", meaning: "Get the patient to cold and to a medic. You are not running a field hospital in a hallway with an active threat." },
    ],
  },
  {
    id: "hazmat",
    group: "calls",
    code: "600.17",
    title: "Hazmat",
    kicker: "Isolate · ERG · don’t commit",
    sog: "600.17 Hazardous Materials",
    page: 100,
    why: "You cannot outrun a plume you walked into. First-due’s job is people and a number (UN / ERG), not a suit. Inland warehouses, I-10 tankers, pool-chemical sheds, and lithium batteries in a garage are the products. Wind down the pass owns the plume. Isolation is the tactic that keeps the first-due from becoming patients.",
    lines: [
      "Do not commit the first-due into the product. People, then isolate, then identify. “Just looking” is how you buy a second ambulance.",
      "Wind and topography own the plume. Approach from upwind and uphill. In the pass, the wind you felt at the station may not be the wind in the wash.",
      "Level II staging for everything that is not immediate life rescue. Extra engines staged close enough to work, far enough to not sit in the product.",
      "ERG, NIOSH pocket guide, and SDS before you invent a tactic. UN number → orange guide. The book is faster than a guess, and it is what the hazmat team will ask you for.",
      "Isolate and evacuate to the distances in the book — not to a guess. “That fence line” is not a protective-action distance.",
      "Hazmat team before anyone suits and walks in. First-due job is isolation, information, and a good story for the team: product, wind, people, and what you already did.",
    ],
    terms: [
      { term: "ERG", meaning: "Emergency Response Guidebook. UN number to orange guide. First book, not last." },
      { term: "UN number", meaning: "Four-digit ID on the placard. That number is the product until a chemist says otherwise." },
      { term: "Orange guide", meaning: "The ERG page for that UN. Isolation distances, fire tactics, and what not to do. Read the “don’ts.”" },
      { term: "Level II staging", meaning: "Hold the extra companies out of the product and out of the way. You can always bring them in. You cannot un-expose them." },
      { term: "Upwind / uphill", meaning: "Same as a car fire, bigger consequence. The wash and the pass will move a plume farther than the yard looks." },
    ],
    video: {
      label: "Transport Canada — ERG 2024",
      href: "https://www.youtube.com/watch?v=iKjwpfTg7VU",
    },
  },
  {
    id: "lines",
    group: "calls",
    code: "600.22",
    title: "Lines down",
    kicker: "Assume energized",
    sog: "600.22 Lines Down / Energized Equipment",
    page: 119,
    why: "SCE lines reclose. “It’s dead” is how people get killed after the fire is out. Step potential is why you shuffle — the ground itself can be the circuit. The apparatus in the wires is a Faraday cage until you step off and complete it with one boot. We wait for the utility because we cannot tell dead from waiting-to-reclose with our eyes.",
    lines: [
      "Treat every downed line as energized. Reclose and backfeed make “it’s dead” a guess. Night, rain, and a grass fire under the pole do not change that.",
      "Step potential and touch potential. Shuffle your feet. Do not run, and do not touch the rig and the ground at once if it is in the circuit.",
      "Establish a danger zone and keep bystanders out. One span each way is not enough if the line is bouncing. Cones and a person with a loud voice.",
      "Fog at the pole base for grass fire — not a straight stream into the lines. Water is a conductor. You are buying the grass, not the wire.",
      "Utility confirms it is dead before you spray equipment or move a line. SCE / 911 utility is the “dead” you can trust. Your TIC is not.",
      "If the apparatus is energized, stay on it and wait for the utility. Do not step off. Tell Command. Keep people away from the rig.",
    ],
    terms: [
      { term: "Reclose", meaning: "The line tries to come back live on its own. “It arced and stopped” is not dead. It may try again." },
      { term: "Backfeed", meaning: "Power coming the other way — generator, solar, another circuit. Downed does not mean isolated." },
      { term: "Step potential", meaning: "Voltage across the ground between your feet. Shuffle. Do not hop. Do not run." },
      { term: "Touch potential", meaning: "You, the truck, and the ground making a circuit. Stay on or stay off — do not be in between." },
      { term: "SCE", meaning: "Southern California Edison. They say when it is dead. Until then, it is not." },
    ],
  },
  {
    id: "rehab",
    group: "calls",
    code: "600.24",
    title: "Rehab",
    kicker: "Rest · water · vitals",
    sog: "600.24 Rehabilitation",
    page: 124,
    why: "Rehab is not comfort. Heat, CO, and a second bottle is how cardiac events and Maydays get built. Inland summer, low RH, and turnouts are a medical problem even when the fire looks like a “quick knock.” Command implements rehab so ego does not skip it. A cooked crew is the next Mayday — and the next workers’-comp packet.",
    lines: [
      "IC implements REHAB. It is a function, not a vending table in the shade. Name it, staff it, and send people to it.",
      "Self-monitor. Say something when you are cooked — before you drop. Dizziness, nausea, cramps, and “I’m fine” after a second bottle are the same sentence.",
      "REHAB group: assessment, rest and hydration, medical eval, then reassignment or transport. That order is the point. Water without vitals is a snack break.",
      "Trigger: after the second 30-minute bottle, or 40 minutes of intense work, or whenever Command says. Red Flag and July do not wait for a second bottle.",
      "Shade, sit, drink, and a set of vitals before you go back in. Cool the body, then the ego.",
      "No one skips rehab to finish the job. The job will still be there. A downed firefighter will own the rest of the incident.",
    ],
    terms: [
      { term: "Second bottle", meaning: "The common trigger. Two 30-minute cylinders, or 40 minutes of hard work. You do not get a third until rehab says so." },
      { term: "REHAB group", meaning: "A named function: vitals, water, shade, and a person who can hold you out. Not “grab a bottle off the bumper.”" },
      { term: "Reassignment", meaning: "Back to work, or to the ambulance. Rehab decides. You do not." },
    ],
  },
  {
    id: "confined",
    group: "rescue",
    code: "600.07",
    title: "Confined space",
    kicker: "Don’t freelance",
    sog: "600.07 Confined Space",
    page: 36,
    why: "The atmosphere is the hazard. The well-meaning firefighter who “just looks” is the second victim — and often the dead one. Confined space is an OSHA problem that looks like a medical aid: a meter vault on a Calimesa street, a sewer, a wine tank, a crawl space under a house. First-due isolates and waits for TRT because courage does not add oxygen.",
    lines: [
      "Confined space: not designed for occupancy, limited egress — OSHA 1910.146. Tanks, vaults, sewers, crawl spaces. If you have to wiggle in and you cannot stand up and walk out, treat it as one.",
      "First-due: size-up, isolate energy, and do not enter to “just look.” The look is how we write the second fatality.",
      "Risk Management Profile before anyone goes in. Atmosphere is the hazard until a meter says otherwise. Assume low oxygen, assume toxic, assume it will change when you open it.",
      "Phases: Arrival → Pre-entry → Entry → Termination. Skip a phase and you skip a control. Pre-entry is lockout, air, attendant, and a retrieval plan.",
      "Technical Rescue Team for entry. Attendant outside, retrieval, and a backup team. No lone entries. No “I’ll just get a hand on him.”",
      "Your job until TRT arrives is isolation, information, and keeping well-meaning people out — family, PD, and the eager rookie.",
    ],
    terms: [
      { term: "OSHA 1910.146", meaning: "The confined-space rule. Limited in, limited out, not built for people. That is the definition, not a vibe." },
      { term: "Attendant", meaning: "The person who stays outside, keeps the count, and does not enter. If they enter, nobody is the attendant." },
      { term: "Retrieval", meaning: "Harness and a line so we can pull them out without sending a second body. Plan it before anyone goes in." },
      { term: "TRT", meaning: "Technical Rescue Team. They have meters, air, and a shoring / retrieval plan. First-due does not become TRT by wanting it." },
    ],
    video: {
      label: "Fire Engineering — confined space tripod",
      href: "https://www.youtube.com/watch?v=9nkqzvODdYo",
    },
  },
  {
    id: "trench",
    group: "rescue",
    code: "600.08",
    title: "Trench rescue",
    kicker: "Safe zone first",
    sog: "600.08 Trench Rescue",
    page: 51,
    why: "Soil wants to finish the job. A trench is a collapsing building made of dirt. Walking to the lip loads the wall. A second collapse is how rescuers die — not the first one, which already happened. First-due’s job is to stop that second collapse, not to dig. New housing pads and utility work in the Inland Empire make this a real call, not a textbook.",
    lines: [
      "Operate from a safe zone. Do not walk up to the lip of an open trench. Your weight is a load. The lip is not a viewing platform.",
      "Spoil pile, vibrating equipment, and extra people stay off the edge. The pile is a surcharge. A running pump is a surcharge. A crowd is a surcharge.",
      "If a victim is buried, uncover to below the diaphragm and manage C-spine as you can — from the safe zone. Dirt on the chest is the airway problem. You cannot fix it from inside an unshored hole.",
      "Do not enter a collapse to search. Shore before anyone commits. An unshored trench is still collapsing, even if it looks quiet.",
      "Call TRT early. First-due job is isolation, air, and keeping the hole from getting worse. Tape, cones, shut down the excavator, move the spoil back.",
      "A second collapse is how rescuers die. Treat the ground as the enemy. If you feel the need to “just hop in,” that is the moment you stay out.",
    ],
    terms: [
      { term: "Lip", meaning: "The edge. Stay off it. Looking in from the lip is how the wall takes a second victim." },
      { term: "Spoil pile", meaning: "The dirt they already dug. It is a load sitting next to a weak wall. Move it back. Do not stand on it." },
      { term: "Surcharge", meaning: "Extra weight on the wall: people, spoil, a running engine, a boom. Every surcharge is a collapse waiting." },
      { term: "Shore", meaning: "Wood or pneumatic protection that makes the walls hold. No shore, no entry." },
      { term: "Below the diaphragm", meaning: "Uncover the chest so they can breathe. That is the first medical act you can do from the safe zone." },
    ],
  },
  {
    id: "water",
    group: "rescue",
    code: "600.09",
    title: "Water rescue",
    kicker: "Downstream safety",
    sog: "600.09 Water Rescue",
    page: 54,
    why: "Moving water here is flood-control channels, washes, and rain on a burn scar — not a mountain river. Downstream safety exists because the first go-rescuer becomes the second victim. Turnouts in water are drowning PPE. We talk the victim to shore when we can because a live unrescued victim beats two drowning firefighters, and the channel will not wait for a hero.",
    lines: [
      "Command plus a Rescue Operations officer with a crew. Do not freelance a swimmer. The first person in the water without a plan is the next patient.",
      "Hazards, a plan, and a backup before anyone hits the water. Strainers, undercuts, fences across a wash, and the next drop structure are why people do not pop back up.",
      "Safety Officer. Downstream safety and a throw bag before a go-rescuer. If you cannot catch your own rescuer, you do not send one.",
      "Phases: Arrival → Pre-rescue → Rescue → Termination. Pre-rescue is where we put downstream people, a rope, and a way to get the go-rescuer back.",
      "PPE for the water — no structural turnouts in the drink. Turnouts fill, pull you down, and they do not make you a better swimmer.",
      "Talk the victim to shore if you can. Reach, throw, row, go — in that order. A live unrescued victim beats two drowning firefighters.",
    ],
    terms: [
      { term: "Downstream safety", meaning: "People below the problem with throw bags, because the victim and the rescuer both travel with the water." },
      { term: "Throw bag", meaning: "Rope in a bag. First tool. If you cannot throw, you are not ready to go." },
      { term: "Go-rescuer", meaning: "The person who actually enters. Last option, with a tender and a downstream catch. Not the eager swimmer in station shorts." },
      { term: "Wash / flood control", meaning: "Concrete and dirt channels that look shallow and run like a river after a storm. Fences and drop structures are strainers." },
      { term: "Reach / throw / row / go", meaning: "The order. We do not skip to “go” because it looks faster. It is how we double the patients." },
    ],
    video: {
      label: "Fire Engineering — water rescue throw bags",
      href: "https://www.youtube.com/watch?v=eX_39_6PTOE",
    },
  },
];

export const SOG_CARD_BY_ID = Object.fromEntries(SOG_CARDS.map((c) => [c.id, c])) as Record<
  string,
  SogCard
>;

export function sogCardsByGroup(): Array<SogGroup & { cards: SogCard[] }> {
  return SOG_GROUPS.map((group) => ({
    ...group,
    cards: SOG_CARDS.filter((card) => card.group === group.id),
  }));
}

export function sogPdfHref(card: SogCard): string {
  if (/^\d+\.\d+$/.test(card.code)) {
    return `/docs/policies/${card.code}.pdf`;
  }
  return `${PDF}#page=${card.page}`;
}

export type SkillGroup = "hands" | "know" | "eng";

export type SkillLinkKind = "standard" | "protocol" | "web" | "video" | "manual";

export type SkillLink = {
  kind: SkillLinkKind;
  label: string;
  href: string;
};

export type SkillGear = {
  name: string;
  blurb: string;
  specs: string[];
  links: SkillLink[];
};

export type Skill = {
  id: string;
  title: string;
  kicker: string;
  blurb: string;
  standard: string;
  tips: string[];
  links: SkillLink[];
  gear?: SkillGear;
  group?: SkillGroup;
};

/** CA SFT / CAL FIRE academy + REMSA. CFD SOPs still win on the drill ground. */
export const SKILLS: Skill[] = [
  {
    id: "ladders",
    title: "Ladder skills",
    kicker: "Ground ladders",
    blurb: "Throws, raises, and climbs to CA Fire Fighter 1A skill sheets. Placement and heel/fly discipline change by house — learn CFD’s throws, then keep the SFT standard as the floor. Maintenance is NFPA 1932, not a suggestion.",
    standard: "CA SFT Fire Fighter 1A (2024) · NFPA 1932 use, maintenance, and service testing",
    tips: [
      "Choose the ladder for the job: rescue, vent, roof, or hose work — then throw to that target.",
      "Spot for overhead wires, ground slope, and a 75° climbing angle before you commit.",
      "Heel it, lock the dogs, and announce “ladder dogs locked” before anyone climbs.",
      "After every fire: wash with soap and water, dry the beams (including inside), look at rungs, halyard, pawls, and heat sensors.",
      "Heat-sensor dots that turn black = out of service until a 1932 load test. Four sensors per section is the Duo-Safety / NFPA layout.",
      "Annual service test is the floor: center load, hardware, and roof-hook test. After overload, impact, or flame contact — test it now, not next year.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM Fire Fighter 1 skill sheets (2024)",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "standard",
        label: "NFPA 1932 — ground ladder maintenance & testing",
        href: "https://www.nfpa.org/codes-and-standards/nfpa-1932-standard-development/1932",
      },
      {
        kind: "web",
        label: "Duo-Safety — ladder care, testing, heat sensors",
        href: "https://www.duosafety.com/faq/",
      },
      {
        kind: "web",
        label: "Duo-Safety — heat sensor labels (300°F)",
        href: "https://www.duosafety.com/replacement-parts/labels/",
      },
      {
        kind: "web",
        label: "FireRescue1 — keeping ground ladders in shape",
        href: "https://www.firerescue1.com/fire-products/ladders/articles/how-to-keep-ground-ladders-in-top-shape-AbbWUDPUFRNcwJlN/",
      },
      {
        kind: "video",
        label: "Ground ladder inspection and cleaning",
        href: "https://www.youtube.com/watch?v=zNxLenyA9AU",
      },
      {
        kind: "video",
        label: "Mass. Fire Academy — ladders playlist",
        href: "https://www.youtube.com/playlist?list=PLF2_yYxLttQaIz1_CbafppBuV-qa71N-K",
      },
    ],
  },
  {
    id: "hose",
    title: "Hose deployments",
    kicker: "Attack and supply",
    blurb: "Preconnects, 2½, and deep stretches. CAL FIRE / SFT hose skills plus NFPA 1410-style company evolutions. Load the bed the way this engine is loaded.",
    standard: "CA SFT FF1A hose operations · NFPA 1410 company evolutions",
    tips: [
      "Know every preconnect on your assigned engine: length, diameter, nozzle, and what occupancy it is for.",
      "Flake for the path you will actually walk — apartments, hotels, and hillside houses eat hose.",
      "Bleed air, set the pattern, and keep a working loop before you commit through a door.",
      "2.5\" and bundles are a different animal. Practice the stretch you will use on a commercial or long driveway.",
      "If the preconnect comes up short, have a plan: bundle, wyed 2½, or a second preconnect. Do not hope.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM Fire Fighter 1 — hose & streams skills",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "standard",
        label: "NFPA 1410 — initial attack performance",
        href: "https://www.nfpa.org/codes-and-standards/nfpa-1410-standard-development/1410",
      },
      {
        kind: "web",
        label: "Fire Engineering — hose stretches",
        href: "https://www.fireengineering.com/firefighting-equipment/hose-stretches/",
      },
      {
        kind: "web",
        label: "Fire Engineering — anatomy of a hose stretch",
        href: "https://www.fireengineering.com/firefighting/anatomy-of-a-hose-stretch/",
      },
      {
        kind: "web",
        label: "Fire Engineering — when preconnects fall short",
        href: "https://www.fireengineering.com/firefighting-equipment/stretching-hoselines-when-preconnects-fall-short/",
      },
      {
        kind: "video",
        label: "IFSTA — hose loads and fire streams",
        href: "https://www.youtube.com/playlist?list=PLiyiizn-ScRqd-xs-pxFgeVhpo0Ek2DuI",
      },
    ],
  },
  {
    id: "hydrant",
    title: "Catching a hydrant",
    kicker: "Water supply",
    blurb: "Forward lay, reverse lay, and four-way valve work. Riverside County hydrants and rural draft points are not the same skill — train both.",
    standard: "CA SFT FF1A water supply · NFPA 1410 hydrant evolutions",
    tips: [
      "Spot the steamer, wrap, and charge the way this company does it. Do not invent a new dance on scene.",
      "Flush the hydrant before you connect if the SOG says so — grit kills pumps.",
      "Know your four-way / LDH appliances and which stem opens which port.",
      "Hand-tight plus a spanner is enough. Cross-threaded connections are a company problem.",
      "If the hydrant is dead, say it early and go to the next source. Pride is slower than a second lay.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM FF1A water-supply skill sheets",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "web",
        label: "Fire Engineering — catching a hydrant",
        href: "https://www.fireengineering.com/firefighter-training/firefighter-training-basics-catching-a-hydrant/",
      },
      {
        kind: "web",
        label: "TFT — forward lay with a four-way valve",
        href: "https://tft.com/forward-lay/",
      },
      {
        kind: "video",
        label: "Bend FD — taking a hydrant",
        href: "https://www.firerescue1.com/firefighter-training/videos/water-supply-taking-a-hydrant-h8BUEqEBt5uiVB31/",
      },
      {
        kind: "video",
        label: "Catch and dress a hydrant",
        href: "https://www.youtube.com/watch?v=5-eGfLK0uhk",
      },
    ],
  },
  {
    id: "turnout",
    title: "Turnout / PPE guide",
    kicker: "Don, doff, decon",
    blurb: "SFT times the don. CAL FIRE and cancer-prevention practice own the rest: clean cab, dirty gear out of the living quarters, shower within the hour.",
    standard: "CA SFT FF1A PPE don/doff · NFPA 1971 / 1851 care",
    tips: [
      "Don in the order your academy taught — pants/boots, hood, coat, SCBA, helmet, gloves — unless CFD says otherwise.",
      "Hood and gloves are the dirty pieces. They do not ride in the cab on your lap after a fire.",
      "Check suspenders, closures, wristlets, and reflective after every wash. Damaged PPE is out of service.",
      "Gross-decon on scene, then bag it. Dirty gear is not a trophy.",
      "Know where spare hoods and gloves live on the rig.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM FF1A — PPE skill sheets",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "standard",
        label: "NFPA 1851 — selection, care, and maintenance of PPE",
        href: "https://www.nfpa.org/codes-and-standards/nfpa-1851-standard-development/1851",
      },
      {
        kind: "web",
        label: "IAFF occupational cancer",
        href: "https://www.iaff.org/cancer/",
      },
      {
        kind: "web",
        label: "Firefighter Cancer Support Network",
        href: "https://www.firefightercancersupport.org/",
      },
      {
        kind: "web",
        label: "FireRescue1 — clean-cab concept",
        href: "https://www.firerescue1.com/fire-products/fire-apparatus/articles/cleanest-cab-concepts-a-realistic-approach-to-apparatus-design-and-firefighter-health-pmabeeZjTqTYof3F/",
      },
    ],
  },
  {
    id: "scba",
    title: "SCBA guide",
    kicker: "Scott X3 Pro",
    blurb: "Calimesa rides the 3M Scott Air-Pak X3 Pro. Don, leak check, HUD, PASS, cylinder change, and emergency procedures on this pack — not a generic academy demo. SFT sheets are the floor. The Scott manual is the pack.",
    standard: "3M Scott Air-Pak X3 Pro · CA SFT FF1A SCBA · NFPA 1981 / 1970",
    tips: [
      "Daily check: cylinder (full, locked), PASS console, donning straps, AV-3000 HT or Vision C5 facepiece, regulator, HUD lights, batteries.",
      "Hair, facial hair, and a twisted hood fail a seal. Fix it before you go on air.",
      "HUD: two green >75%, one green 50–75%, flashing amber 35–50%, flashing red <35% with Vibralert. Know it in the dark.",
      "First-breath on the E-Z Flo+ / C5. Air-saver switch engaged before you crack the bottle or it free-flows.",
      "Snap-Change vs CGA: know which bottles are on your engine. They are not interchangeable mid-fire.",
      "PASS auto-on when you open the cylinder. Shut down right: close the valve, purge, let the pack power down so you do not kill the batteries overnight.",
      "Buddy bottle / RIC-UAC is on the pack. Practice it on the X3 Pro, not on a picture.",
      "After a fire, decon the pack before it sits in the cab. Harness comes off the backframe for wash — that is a feature, use it.",
    ],
    gear: {
      name: "3M Scott Air-Pak X3 Pro",
      blurb: "House pack. Aluminum backframe, removable harness, Pak-Alert PASS console, RIC/UAC, HUD on the regulator. Facepiece is AV-3000 HT or Vision C5 — they take different regulators. Confirm yours at turnout.",
      specs: [
        "Pressures: 2.2 / 4.5 / 5.5 — match the reducer label to the bottle",
        "Cylinder: Snap-Change or CGA threaded — do not mix mid-change",
        "Facepiece: AV-3000 HT (E-Z Flo+) or Vision C5 (E-Z Flo C5)",
        "PASS / console LEDs + rear sensor module; Vibralert at 35%",
        "RIC / UAC for a downed firefighter or a bottle fill",
        "Drag rescue loop rated 1,000 lb",
      ],
      links: [
        {
          kind: "web",
          label: "3M Scott — Air-Pak X3 Pro product page",
          href: "https://www.3m.com/3M/en_US/p/d/b5005672007/",
        },
        {
          kind: "web",
          label: "3M Scott — AV-3000 HT facepiece",
          href: "https://www.3m.com/3M/en_US/p/d/b5005218022/",
        },
        {
          kind: "manual",
          label: "X3 Pro operating & maintenance (P/N 595373-01)",
          href: "https://www.manualslib.com/manual/1960923/3M-Scott-Air-Pak-X3-Pro.html",
        },
        {
          kind: "manual",
          label: "X3 Pro operator manual PDF",
          href: "https://fireequipmentmexico.com/pdf/equipo_de_Respiracion_ERA_3MScott_AirPakX3Pro_M_I.pdf",
        },
        {
          kind: "video",
          label: "Scott — X3 Pro donning",
          href: "https://www.youtube.com/watch?v=KJyzdnoG6lc",
        },
        {
          kind: "video",
          label: "Scott — X3 Pro operation and use",
          href: "https://www.youtube.com/watch?v=IvZEO9T0Tm4",
        },
        {
          kind: "video",
          label: "Scott — X3 Pro cylinder install",
          href: "https://www.youtube.com/watch?v=0KyUM_kc04w",
        },
        {
          kind: "video",
          label: "Scott — X3 Pro overview",
          href: "https://www.youtube.com/watch?v=nSkbra09nEU",
        },
        {
          kind: "web",
          label: "3M Learning — X3 Pro quick-start course",
          href: "https://learn.3m.com/courses/3m-scott-air-pak-x3-pro-scba-quick-start-video-guide",
        },
        {
          kind: "web",
          label: "San Diego FD — X3 Pro drill chapter (same pack)",
          href: "https://www.sandiego.gov/sites/default/files/2025-03/fire-rescue-drill-manual-chapter-06.pdf",
        },
      ],
    },
    links: [
      {
        kind: "standard",
        label: "OSFM FF1A — SCBA skill sheets",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "web",
        label: "FireRescue1 — back-to-basics SCBA training",
        href: "https://www.firerescue1.com/fire-products/fire-breathing-apparatus/fire-scba/articles/your-go-to-guide-for-back-to-basics-scba-training-vToMrZLNGkug9J6p/",
      },
    ],
  },
  {
    id: "medical",
    title: "Medical assessment",
    kicker: "REMSA protocols",
    blurb: "Calimesa runs under the Riverside County EMS Agency. Patient assessment starts with Policy 4101 Universal Patient Care — not a generic EMT textbook. Keep the REMSA app on the phone.",
    standard: "Riverside County EMS Agency (REMSA) treatment protocols",
    tips: [
      "Open 4101 first: scene, BSI, ABCs, mental status, chief complaint, then the protocol that matches.",
      "Adult and pediatric are different books. 4901 is peds general medical.",
      "Know the difference between your EMT standing orders and when you need a medic or base hospital.",
      "Stroke, ACS, trauma, and arrest have their own 4400 / 4300 / 4500 sheets. Do not mix them from memory on a bad call.",
      "Protocol updates drop on the REMSA education page. Mid-year changes count.",
    ],
    links: [
      {
        kind: "protocol",
        label: "REMSA home — Riverside County EMS",
        href: "https://rivcoready.org/remsa",
      },
      {
        kind: "protocol",
        label: "REMSA policy & protocol manual",
        href: "https://rivcoready.org/remsa/policy-manual",
      },
      {
        kind: "protocol",
        label: "4101 Universal Patient Care (PDF)",
        href: "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11/4101%20-%20Universal%20Patient%20Care.pdf",
      },
      {
        kind: "protocol",
        label: "4301 Adult trauma / shock / arrest (PDF)",
        href: "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11/4301%20-%20Adult%20Traumatic%20Shock_Injury_Arrest.pdf",
      },
      {
        kind: "protocol",
        label: "4405 Adult medical cardiac arrest (PDF)",
        href: "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11/4405%20-%20Adult%20Medical%20Cardiac%20Arrest.pdf",
      },
      {
        kind: "protocol",
        label: "4502 Suspected stroke (PDF)",
        href: "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Sep02/4502%20-%20Suspected%20Stroke.pdf",
      },
      {
        kind: "protocol",
        label: "4901 Pediatric general medical (PDF)",
        href: "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug13/4901%20-%20Pediatric%20General%20Medical.pdf",
      },
      {
        kind: "protocol",
        label: "REMSA protocols mobile app",
        href: "https://remsaapp.glide.page",
      },
      {
        kind: "web",
        label: "REMSA education & protocol updates",
        href: "https://rivcoready.org/remsa/education",
      },
    ],
  },
  {
    id: "ropes",
    title: "Ropes and knots",
    kicker: "Utility and rescue",
    blurb: "SFT still tests the working knots. CAL FIRE rope rescue (awareness/operations) is a separate course. Learn the eight you will actually tie on this job.",
    standard: "CA SFT FF1A ropes & knots · FSTEP Rope Rescue Awareness/Ops",
    tips: [
      "Clove hitch, figure-8 on a bight, becket/sheet bend, overhand safety, and a tool hitch will cover most company work.",
      "Dress it, set it, and tail it. A sloppy knot is not a knot.",
      "Utility rope and life-safety rope are not interchangeable. Know which bag is which on the rig.",
      "Practice on gloves. You will not tie these in a classroom with bare hands on a fire.",
      "Webbing and a simple harness are a different skill — train them before you need a window drop.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM FF1A skill sheets — ropes",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "standard",
        label: "CA FSTEP — rope rescue courses",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/fire-service-training-and-education-program",
      },
      {
        kind: "web",
        label: "Animated Knots — search & rescue set",
        href: "https://www.animatedknots.com/search-rescue-knots",
      },
      {
        kind: "web",
        label: "Animated Knots — clove hitch",
        href: "https://www.animatedknots.com/clove-hitch-knot-rope-end",
      },
      {
        kind: "web",
        label: "Firefighter Ambitions — knot videos",
        href: "https://firefighterambitions.com/rope-knot-videos",
      },
      {
        kind: "video",
        label: "8 essential firefighter knots (playlist)",
        href: "https://www.youtube.com/playlist?list=PLQbUmpOM8RPxdGG7FLwCMIsg02YkFTlpj",
      },
    ],
  },
  {
    id: "extrication",
    title: "Auto extrication",
    kicker: "TNT tools",
    blurb: "California moved this out of basic FF1 into FSTEP Common Passenger Vehicle Rescue. CFD runs TNT Rescue tools. Stabilize, glass, doors, dash — then heavy vehicles if you go further.",
    standard: "CA FSTEP Common Passenger Vehicle Rescue · NFPA 1936 · TNT Rescue",
    tips: [
      "Scene, hybrid/EV shut-down, and cribbing come before the first spread.",
      "Crib as you lift. Never work under a load that is only on a jack or a ram.",
      "Know which TNT in the compartment is cutter, spreader, combi, and ram — they are not interchangeable mid-cut.",
      "Glass management and SRS (airbags) will cut you or the patient if you skip the walk-around.",
      "This is a team skill. One tool operator, one patient medic, one stabilizer — talk out loud.",
    ],
    gear: {
      name: "TNT Rescue (house tools)",
      blurb: "TNT is USA-made with a forever warranty. Storm Surge is battery (Milwaukee M18, DeWalt 20V, or Makita LXT). Legacy hose tools run 10,500 PSI with COAX couplers. Confirm which set is on your engine — battery and hose are different checklists. TNT does not publish a public operator PDF; the catalog and the dealer packet that came with the tools are the manual.",
      specs: [
        "Storm Surge batteries: Milwaukee M18, DeWalt 20V, Makita 18V LXT (non-proprietary)",
        "Storm Surge cutters: ESLC-24, ESLC-29, ESLC-30, EBFC-320",
        "Storm Surge spreaders: ES-100-24, ES-100-28, ES-100-32",
        "Storm Surge rams: ER-45; ETLS-55 telescopic (24.4 in closed / 55 in open)",
        "Legacy hose tools: 10,500 PSI, COAX couplers, 100+ ft hose option",
        "Built to NFPA 1936 (powered rescue tools)",
      ],
      links: [
        {
          kind: "manual",
          label: "TNT Rescue — Storm Surge catalog (PDF)",
          href: "https://fireandsafety.com/wp-content/uploads/2025/06/TNT-STORM-SURGE-CATALOG.-RESCUE-EXTRICATION-TOOLS-Rev6.2.25.pdf.pdf",
        },
        {
          kind: "web",
          label: "TNT Rescue — Storm Surge products",
          href: "https://tntrescue.com/surge-products/",
        },
        {
          kind: "web",
          label: "TNT Rescue — Legacy 10,500 PSI hose tools",
          href: "https://tntrescue.com/legacy-products/",
        },
        {
          kind: "web",
          label: "TNT Rescue home",
          href: "https://tntrescue.com/",
        },
        {
          kind: "standard",
          label: "NFPA 1936 — powered rescue tools",
          href: "https://www.nfpa.org/codes-and-standards/nfpa-1936-standard-development/1936",
        },
        {
          kind: "web",
          label: "FireRescue1 — TNT Rescue spotlight",
          href: "https://www.firerescue1.com/fire-products/extrication-tools-cutters-and-spreaders/articles/spotlight-tnt-rescue-is-built-to-rescue-tIgVXBqhWKju2wSA/",
        },
      ],
    },
    links: [
      {
        kind: "standard",
        label: "CA FSTEP course list (vehicle rescue)",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/fire-service-training-and-education-program",
      },
      {
        kind: "video",
        label: "Fire Engineering — single-point lift with spreader",
        href: "https://www.youtube.com/watch?v=-8Xu5ClWZo0",
      },
    ],
  },
  {
    id: "chainsaw",
    title: "Chainsaws",
    kicker: "STIHL MS 462 C-M",
    blurb: "CFD’s working saw is the STIHL MS 462 C-M. Structure vent and wildland falling are different qualifications. CAL FIRE / NWCG S-212 owns chainsaw ops in the brush. CFD SOGs own the roof.",
    standard: "STIHL MS 462 C-M instruction manual · NWCG S-212 / PMS 212 · CA SFT FF1C",
    tips: [
      "PPE: chaps, eye, ear, gloves, and a running saw you started on the ground — not on a peak.",
      "MS 462 C-M is M-Tronic. There are no carb screws. Do not “tune” it. It compensates for dirty filter, elevation, and fuel.",
      "After every use: chain brake on, pull bar and chain, clean the groove and oil hole, brush the cooling fins, check the air filter.",
      "Fuel is mixed gas, max 10% ethanol. Wrong mix is how these saws die in the compartment.",
      "A dull chain is a dangerous chain. File it or tag it. Kickback still lives at the bar tip.",
    ],
    gear: {
      name: "STIHL MS 462 C-M",
      blurb: "Lightest STIHL in this fuel class. Use the official USA instruction manual for this saw — not a YouTube shortcut. Cleaning is in the STIHL guide and in the manual (bar, chain, air filter, cooling fins).",
      specs: [
        "Displacement 4.4 cu in (72.2 cc) · 5.9 bhp",
        "Weight 13.3–14.0 lb without bar and chain",
        "STIHL M-Tronic™ (M) — no carburetor adjustment screws",
        "Pre-separation air filtration; winter/summer shutter below 50°F",
        "Fuel: mix per manual, ethanol ≤ 10%",
      ],
      links: [
        {
          kind: "manual",
          label: "STIHL USA — MS 462 C-M instruction manuals",
          href: "https://www.stihlusa.com/en/support-events/owners-manuals?Search=MS+462+C-M",
        },
        {
          kind: "manual",
          label: "STIHL MS 462 C-M instruction manual (PDF)",
          href: "https://www.godfreys.co.uk/wp-content/uploads/2021/02/0458-790-0121-B_ZBA_01_01.pdf",
        },
        {
          kind: "web",
          label: "STIHL — MS 462 C-M product / specs",
          href: "https://www.stihlusa.com/en/p/chainsaws-ms-462-gasoline-chainsaw-1027147",
        },
        {
          kind: "web",
          label: "STIHL — how to clean a chainsaw",
          href: "https://www.stihlusa.com/en/guides-projects/maintenance-safety/how-to-clean-a-chainsaw",
        },
        {
          kind: "web",
          label: "STIHL — how to sharpen the chain",
          href: "https://www.stihlusa.com/en/guides-projects/maintenance-safety/how-to-sharpen-chainsaw",
        },
        {
          kind: "web",
          label: "STIHL — how to start a chainsaw",
          href: "https://www.stihlusa.com/en/guides-projects/how-to-use-start/how-to-start-chainsaw",
        },
      ],
    },
    links: [
      {
        kind: "standard",
        label: "NWCG PMS 212 — wildland chainsaw standards",
        href: "https://www.nwcg.gov/publications/pms212",
      },
      {
        kind: "standard",
        label: "NWCG S-212 Wildland Fire Chainsaws",
        href: "https://www.nwcg.gov/publications/training-courses/s-212",
      },
      {
        kind: "standard",
        label: "OSFM FF1C wildland skill sheets",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "web",
        label: "Firehouse — which saws firefighters use",
        href: "https://www.firehouse.com/operations-training/tools/article/21281075/which-saws-are-well-suited-for-use-by-firefighters",
      },
    ],
  },
  {
    id: "rotary",
    title: "Rotary saws",
    kicker: "K-12 / rescue cut",
    blurb: "Cutoff / rotary saws for metal, concrete, roll-up doors, and some vent work. Blade choice is the skill. Wrong blade on a roof or a car is a broken saw and a broken firefighter.",
    standard: "CA SFT FF1A power saws · manufacturer blade charts",
    tips: [
      "Match blade to material: carbide/vent, diamond/masonry, abrasive/metal. Read the blade.",
      "Start it on the ground, bring it to idle, then to the work. Never drop-start toward a leg.",
      "Two hands, straight cut, let the saw work. Forcing a rotary saw binds it.",
      "Watch sparks, fuel, and the firefighter on the other side of the door.",
      "After the cut: off, cool, inspect the guard and blade, fuel it, put it back in the compartment the same way.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM FF1A — power saw skill sheets",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "web",
        label: "TEAM / Husqvarna K12 rescue saw notes",
        href: "https://teamequipment.com/team-husqvarna-k12fd-rescue-saw/",
      },
      {
        kind: "web",
        label: "Firehouse — rotary vs chain for fire service",
        href: "https://www.firehouse.com/operations-training/tools/article/21281075/which-saws-are-well-suited-for-use-by-firefighters",
      },
      {
        kind: "web",
        label: "Husqvarna — K770 Rescue cutoff saw",
        href: "https://www.husqvarna.com/us/power-cutters/k-770-rescue/",
      },
    ],
  },
  {
    id: "forcible",
    title: "Forcible entry",
    kicker: "Doors and windows",
    blurb: "Irons, ram, and saw. Inland Empire residential and commercial doors are not the same as a New York halligan video. Train on the hardware you actually force.",
    standard: "CA SFT FF1A forcible entry",
    tips: [
      "Try before you pry. A lot of Calimesa doors are open or have a hide-a-key the occupant will give you.",
      "Inward vs outward swing changes the gap and the tool. Look at the hinges.",
      "Set the adz, gap, force — or go to the saw if the door is through-bolted.",
      "Size-up the whole opening. A window or garage may be faster than the front door.",
      "After the fire, make the building safe. Do not leave a forced door as a second incident.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM FF1A forcible-entry skills",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "web",
        label: "FireRescue1 — Halligan basics (inward / outward)",
        href: "https://www.firerescue1.com/firefighter-training/articles/halligan-basics-for-firefighter-forcible-entry-training-jrxq5mtPR6lNCAK2/",
      },
      {
        kind: "web",
        label: "FireRescue1 — shove knife / soft entry",
        href: "https://www.firerescue1.com/gear-gadgets/articles/take-the-door-soft-entry-and-the-application-of-the-shove-knife-on-scene-gnMhc12jBByAZrmq/",
      },
      {
        kind: "video",
        label: "IFSTA Essentials skills playlist",
        href: "https://www.youtube.com/playlist?list=PLiyiizn-ScRqd-xs-pxFgeVhpo0Ek2DuI",
      },
    ],
  },
  {
    id: "search",
    title: "Search",
    kicker: "Primary and VES",
    blurb: "Oriented search, VES, and wide-area. Your officer will set the method. The SFT sheet is the baseline, not the only way this company searches a garden apartment.",
    standard: "CA SFT FF1A search & rescue",
    tips: [
      "Know the difference between primary, secondary, and VES before you force a window.",
      "Stay on a wall or a search rope unless the officer sets a different pattern.",
      "Tools in your hands: irons or a hook, a light, and a radio you can talk on with a glove.",
      "Call what you find. “Nothing” is still a report.",
      "If you go through a window, control the door behind the victim so you do not feed the fire.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM FF1A search skill sheets",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "web",
        label: "Fire Engineering — VES, a brief history",
        href: "https://www.fireengineering.com/firefighter-training/vent-enter-search-a-brief-history/",
      },
      {
        kind: "web",
        label: "FireRescue1 — primary search training",
        href: "https://www.firerescue1.com/search-rescue/articles/how-to-conduct-firefighter-primary-search-training-BvtAdOlrGjGwOpUO/",
      },
      {
        kind: "video",
        label: "IFSTA search & rescue skills videos",
        href: "https://www.youtube.com/playlist?list=PLiyiizn-ScRqd-xs-pxFgeVhpo0Ek2DuI",
      },
    ],
  },
  {
    id: "vent",
    title: "Ventilation",
    kicker: "Vertical and horizontal",
    blurb: "Vertical, horizontal, and PPV. Coordination with the attack line is the skill. A hole without water is a chimney. UL FSRI research is the current science — read it.",
    standard: "CA SFT FF1A tactical ventilation · UL FSRI coordinated attack research",
    tips: [
      "Know what the attack crew is doing before you cut. Vent for fire or vent for life — pick one.",
      "Sound the roof. Lightweight truss in this county fails early.",
      "Saw, hook, and a second firefighter. One person on a peak with a running saw is a near-miss.",
      "PPV needs a controlled opening and a crew that knows the fan is coming.",
      "Horizontal vent: take the window that helps the line, not the one that looks cinematic.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM FF1A ventilation skills",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "web",
        label: "UL FSRI — coordinated fire attack research",
        href: "https://fsri.org/research/study-coordinated-fire-attack-utilizing-acquired-structures",
      },
      {
        kind: "web",
        label: "UL — science of suppression and ventilation",
        href: "https://ul.org/news/the-science-of-coordinated-fire-suppression-and-ventilation-tactics/",
      },
      {
        kind: "video",
        label: "IFSTA tactical ventilation skills",
        href: "https://www.youtube.com/playlist?list=PLiyiizn-ScRqd-xs-pxFgeVhpo0Ek2DuI",
      },
    ],
  },
  {
    id: "wildland",
    title: "Wildland & progressive hose",
    kicker: "FF1C / CAL FIRE",
    blurb: "Calimesa sits in the WUI. CAL FIRE FF1C, LCES, and progressive hose lays are the standard of training — then overlay CFD’s local brush response.",
    standard: "CA SFT Fire Fighter 1C Wildland (2022) · CAL FIRE / NWCG",
    tips: [
      "LCES before you commit a hose: lookouts, communications, escape routes, safety zones.",
      "Progressive lays, mobile attack, and structure defense are different. Know which one the IC just ordered.",
      "Pack test, nomex, and wildland PPE are not structure turnouts. Wear the right ensemble.",
      "Know the local wind, fuel, and access in the Pass / Calimesa benches.",
      "Hydrants run out. Drafting and portable tanks are a company skill here.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM FF1C wildland skill sheets",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        kind: "standard",
        label: "NWCG Incident Response Pocket Guide (IRPG)",
        href: "https://www.nwcg.gov/publications/pms461",
      },
      {
        kind: "standard",
        label: "NWCG publications",
        href: "https://www.nwcg.gov/publications",
      },
      {
        kind: "standard",
        label: "CAL FIRE",
        href: "https://www.fire.ca.gov/",
      },
    ],
  },
  {
    id: "ics",
    title: "ICS positions",
    kicker: "Command chart",
    group: "know",
    blurb: "Not a throw. This is who talks to who. Calimesa / RRU run FIRESCOPE ICS. First-due IC is still IC until they transfer it. Learn the chart so you know who you work for when the second alarm fills in.",
    standard: "FIRESCOPE FOG ICS 420-1 · NIMS / ICS-100 / ICS-200",
    tips: [
      "Command: IC. Command staff: Safety, Liaison, PIO. General staff: Operations, Planning, Logistics, Finance. That is the whole house.",
      "You work for one boss. Span of control is about 5. When it is more, they split a Division or a Group.",
      "Division is geography (Division A, Division Charlie). Group is function (Vent Group, Rescue Group).",
      "Strike Team = same type, same kind (five Type 1 engines). Task Force = mixed, with a leader.",
      "Transfer of command is a briefing, not a radio nickname. IC-to-IC, then tell ECC.",
      "On a Calimesa working fire the first-due officer is IC until a chief takes it. Say it out loud.",
    ],
    links: [
      {
        kind: "standard",
        label: "FIRESCOPE — Field Operations Guide (FOG) app / 420-1",
        href: "https://firescope.caloes.ca.gov/fog-manual",
      },
      {
        kind: "standard",
        label: "USFA — ICS 420-1 Field Operations Guide (PDF)",
        href: "https://www.usfa.fema.gov/downloads/pdf/publications/field_operations_guide.pdf",
      },
      {
        kind: "standard",
        label: "FEMA — ICS org structure (PDF)",
        href: "https://training.fema.gov/emiweb/is/icsresource/assets/ICS%20Organizational%20Structure%20and%20Elements.pdf",
      },
      {
        kind: "standard",
        label: "FEMA — ICS position titles (PDF)",
        href: "https://training.fema.gov/emiweb/is/icsresource/assets/Position%20Titles.pdf",
      },
      {
        kind: "standard",
        label: "FEMA — transfer of command (PDF)",
        href: "https://training.fema.gov/emiweb/is/icsresource/assets/Transfer%20of%20Command.pdf",
      },
      {
        kind: "standard",
        label: "FEMA — ICS forms (201, 207 org chart, 205 radio)",
        href: "https://training.fema.gov/icsresource/icsforms.aspx",
      },
      {
        kind: "web",
        label: "FEMA — IS-100.c Introduction to ICS (free)",
        href: "https://training.fema.gov/is/courseoverview.aspx?code=IS-100.c",
      },
      {
        kind: "web",
        label: "FEMA — IS-200.c Basic ICS for initial response",
        href: "https://training.fema.gov/is/courseoverview.aspx?code=IS-200.c",
      },
    ],
  },
  {
    id: "command",
    title: "Command & size-up",
    kicker: "RECEO-VS · SLICE-RS",
    group: "know",
    blurb: "The first-due size-up is the last honest look the IC will get. Strategy is offensive or defensive — not both. Tactics are how you get there. This is the thinking that sits on top of the hose throw.",
    standard: "CFD 600.10 Structure Fires · UL FSRI coordinated attack · FIRESCOPE",
    tips: [
      "Report on conditions: what you have, what you are doing, what you need. Name Alpha. 360 before you disappear.",
      "RECEO-VS: Rescue, Exposures, Confine, Extinguish, Overhaul — Ventilation and Salvage support those.",
      "SLICE-RS (UL): Size-up, Locate, Isolate, Cool from a safe location, Extinguish — Rescue and Salvage as needed.",
      "Do not mix offensive interior with defensive exterior on the same fire. Pick a mode.",
      "Water source, accountability, and the radio plan belong in the first two transmissions.",
      "If people are reported, say “declared rescue” so ECC and the next-due hear it.",
    ],
    links: [
      {
        kind: "standard",
        label: "CFD 600.10 — Structure fires (Binder)",
        href: "/docs/policies/600.10.pdf",
      },
      {
        kind: "web",
        label: "UL FSRI training academy",
        href: "https://training.fsri.org/",
      },
      {
        kind: "video",
        label: "UL FSRI — coordinated fire attack",
        href: "https://www.youtube.com/watch?v=QjxCxLOtZCw",
      },
      {
        kind: "web",
        label: "UL FSRI — ventilation as a tactic",
        href: "https://training.fsri.org/resources/110/ventilation-as-a-firefighting-tactic",
      },
      {
        kind: "standard",
        label: "FIRESCOPE FOG",
        href: "https://firescope.caloes.ca.gov/fog-manual",
      },
    ],
  },
  {
    id: "behavior",
    title: "Fire behavior",
    kicker: "Flow path · flashover",
    group: "know",
    blurb: "Why the hole you just made made the fire bigger. Flow path, ventilation-limited fire, and flashover are knowledge, not a Halligan skill. UL FSRI is the current book — not the 1990s video.",
    standard: "UL FSRI fire dynamics · NFPA 1700",
    tips: [
      "Modern furnishings go ventilation-limited fast. Opening a door or a window is a tactic, not a default.",
      "Flow path: inlet to outlet. You either help the nozzle or you become the inlet behind the crew.",
      "A closed bedroom door can still hold a viable patient. That is why VEIS isolates before it searches.",
      "Wind-driven (pass / Santa Ana) already picked the inlet. Work with it or get out of it.",
      "Flashover is a volume problem. If the smoke is banking and getting angry, cool it or leave.",
    ],
    links: [
      {
        kind: "web",
        label: "UL FSRI — Fire Safety Academy",
        href: "https://training.fsri.org/",
      },
      {
        kind: "web",
        label: "UL FSRI — resources (ventilation, search, WUI)",
        href: "https://training.fsri.org/resources",
      },
      {
        kind: "video",
        label: "UL FSRI — VEIS training short",
        href: "https://www.youtube.com/watch?v=n26mPCY5xEM",
      },
      {
        kind: "web",
        label: "UL — science of suppression and ventilation",
        href: "https://ul.org/news/the-science-of-coordinated-fire-suppression-and-ventilation-tactics/",
      },
    ],
  },
  {
    id: "construction",
    title: "Building construction",
    kicker: "How it fails",
    group: "know",
    blurb: "Calimesa is stucco, tile, truss, garage conversions, and hillside walk-outs. Construction tells you where the fire is going and when the floor will not hold. Size-up is a construction class you give yourself on the bumper.",
    standard: "Brannigan / Fire Engineering building construction · CFD 600.10",
    tips: [
      "Type I–V. Most of our dwellings are Type V wood frame. Lightweight truss fails early and without warning.",
      "Tile roof is heavy and slick. Plan the way off before the first hole.",
      "Garage conversion: a bedroom that used to be a garage. One door, often bars, sits on Alpha.",
      "Void spaces (attic, balloon, soffit) move fire past the room you are looking at.",
      "Collapse: 1½ times the building height is the rally. Lightweight and fire-cut joists do not give a courtesy creak.",
    ],
    links: [
      {
        kind: "web",
        label: "Fire Engineering — building construction",
        href: "https://www.fireengineering.com/firefighting/building-construction-for-the-fire-service/",
      },
      {
        kind: "web",
        label: "UL FSRI — Fire Safety Academy",
        href: "https://training.fsri.org/",
      },
      {
        kind: "standard",
        label: "CFD 600.10 — Structure fires (Binder)",
        href: "/docs/policies/600.10.pdf",
      },
    ],
  },
  {
    id: "start",
    title: "START / MCI",
    kicker: "Triage flow",
    group: "know",
    blurb: "One critical patient will eat the whole first-due. START is a filter, not a diagnosis. 2-1-M is when we say MCI out loud. REMSA still owns the medicine after the tag goes on.",
    standard: "CFD 600.14 MCI · START · REMSA",
    tips: [
      "Walking wounded first (Minor / green). Then RPM: respirations, perfusion, mental status.",
      "No breathing after a repositioned airway = Dead / black. Breathing >30, no pulse, or can't follow commands = Immediate / red.",
      "2-1-M (two Immediates + one Delayed) is the trigger. Say MCI so ECC and the next-due hear it.",
      "Tags on, treatment area named, transport officer before a Delayed leaves in the first ambulance.",
      "This is the fireground shell. REMSA protocols still apply to the patients you treat.",
    ],
    links: [
      {
        kind: "standard",
        label: "CFD 600.14 — Mass casualty (Binder)",
        href: "/docs/policies/600.14.pdf",
      },
      {
        kind: "web",
        label: "CHEMM — START adult algorithm",
        href: "https://chemm.hhs.gov/startadult.htm",
      },
      {
        kind: "web",
        label: "CHEMM — JumpSTART pediatric",
        href: "https://chemm.hhs.gov/startpediatric.htm",
      },
      {
        kind: "video",
        label: "DMS — MCI / START",
        href: "https://www.youtube.com/watch?v=leoVtgkLYR4",
      },
      {
        kind: "protocol",
        label: "REMSA protocols",
        href: "https://rivcoready.org/remsa/policy-manual",
      },
    ],
  },
  {
    id: "watchouts",
    title: "10 & 18 / LCES",
    kicker: "Wildland knowledge",
    group: "know",
    blurb: "The 10 Standard Fire Orders and 18 Watch Outs are not a poster. They are why we still have a crew at lunch. LCES is how you put them on the ground in the Pass.",
    standard: "NWCG IRPG PMS 461 · 10 Standard Fire Orders · 18 Watch Outs",
    tips: [
      "LCES in place before the line is charged: Lookouts, Communications, Escape routes, Safety zones.",
      "The 10 Orders are grouped: fire behavior (1–3), fireline safety (4–6), organizational control (7–9), and you (10).",
      "Watch Outs 1–18 are the list of how crews get caught. If you can check three of them, you are in trouble.",
      "Attack from the black. One foot in the black. Do not frontal-assault from the unburned.",
      "Red Flag here is NWS wind ≥ 20 and RH ≤ 20%, or a forecast that will get there. It is a tactics problem.",
    ],
    links: [
      {
        kind: "standard",
        label: "NWCG IRPG (PMS 461)",
        href: "https://www.nwcg.gov/publications/pms461",
      },
      {
        kind: "standard",
        label: "NWCG — 10 Standard Fire Orders / 18 Watch Outs",
        href: "https://www.nwcg.gov/publications/pms110",
      },
      {
        kind: "web",
        label: "NWCG WFSTAR — LCES",
        href: "https://www.nwcg.gov/training-courses/rt-130/operations/op817",
      },
      {
        kind: "web",
        label: "NWCG — 6 Minutes for Safety",
        href: "https://www.nwcg.gov/committee/6-minutes-for-safety-subcommittee#6mfscalendar",
      },
    ],
  },
  {
    id: "eng-drive",
    title: "Drive the rig",
    kicker: "FADO 1A · due regard",
    group: "eng",
    blurb: "In California the engineer is the driver/operator. You own the seat, the endorsement, and the due-regard standard. Getting there late is bad. Getting there wrecked is worse. Code 3 is a request, not a right.",
    standard: "CA SFT FADO 1A · NFPA 1002 / 1010 · CVC 21055 / 21056 · CVC 12804.11 firefighter endorsement",
    tips: [
      "CVC 21055 lets you run lights and siren through stops and speed. CVC 21056 still requires due regard. If you hit someone, 21055 will not save you.",
      "Firefighter endorsement (CVC 12804.11) is required to drive this apparatus on the public road. No endorsement, you do not drive.",
      "Intersections kill firefighters. Cover the brake, clear left-center-right, make eye contact. Uncontrolled and stale greens are the ones that get you.",
      "Backing is how we ding rigs. Go around the block if you can. If you have to back: spotter, high idle off, stop if you lose them. No spotter = 360 walk-around first.",
      "The rig is longer, heavier, and later than you think. Brake early on Calimesa grades. Do not ride the service brakes down the hill — use the engine / Jake.",
      "Know the district in the daylight so you can drive it at 02:00: dead-ends, weight-posted bridges, steep driveways, I-10 ramps, the Pass winds.",
      "Daily check before you put it in the street: fluids, belts, tires, lights, pump, primer, SCBA, inventory. A missed check is how you find an empty tank on the fire.",
      "Chocks and parking brake before you leave the seat. Every time. Medicals included.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM — Fire Apparatus Driver/Operator (Pump / 1A–1B)",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-apparatus-driver-or-operator-pump-apparatus",
      },
      {
        kind: "standard",
        label: "CVC 21055 — emergency vehicle exemptions",
        href: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=21055.&lawCode=VEH",
      },
      {
        kind: "standard",
        label: "CVC 21056 — due regard still applies",
        href: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=21056.&lawCode=VEH",
      },
      {
        kind: "standard",
        label: "CVC 12804.11 — firefighter endorsement",
        href: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=12804.11.&lawCode=VEH",
      },
      {
        kind: "web",
        label: "FireRescue1 — changing seats: firefighter to driver",
        href: "https://www.firerescue1.com/firefighter-training/changing-seats-managing-the-transition-from-firefighter-to-driver",
      },
      {
        kind: "video",
        label: "Safe operation of emergency vehicles (backing, speed, due regard)",
        href: "https://www.youtube.com/watch?v=NasmvrL0C0g",
      },
    ],
  },
  {
    id: "eng-spot",
    title: "Spot & cache",
    kicker: "Park the job · leave the tools",
    group: "eng",
    blurb: "A bad spot is a bad fire. You do not get a second first-due. Spot so the stretch is short, the hydrant is still catchable, and the truck still has the front. Then leave a cache the crew can live off so they are not walking back to you for a tool.",
    standard: "CA SFT FADO 1A / 1B · NFPA 1002 · first-due engine placement",
    tips: [
      "Spot for the job, not for the picture. Attack engine: stretch is short, hydrant is still catchable, aerial still has the address. Do not eat the whole street.",
      "360 the building and the wires before you set the brake. SCE, trees, a hillside, a wash — Calimesa will punish a lazy bumper.",
      "Parking brake, chocks, pump in gear, tank-to-pump open, trans in pump. Say it out loud so the officer hears you are in pump.",
      "Leave a cache at the corner or the front walk: spare bottles, irons, a spare length, lights, a radio, a TIC if it is not already going in. The crew should not walk back to the panel for a tool.",
      "Anticipate the next tool: attic ladder, 24, hooks, salvage. Pull them once and stage them. Do not disappear from the panel to do it.",
      "Wildland / brush: drop a tool cache at the tie-in or drop point — Pulaskis, McLeods, hose packs, fusees, water. The line crew should not hike back to the engine.",
      "Second-due needs a hydrant and a place to park. If you blocked both, you just made their job your problem.",
      "Collapse zone is 1½ times the building height. Do not spot the only way out inside it. Leave yourself a way to get the rig out.",
    ],
    links: [
      {
        kind: "web",
        label: "Fire Engineering — the first-due engineer (spot, pump, cache)",
        href: "https://www.fireengineering.com/firefighting/eric-j-hankins-the-first-due-engineer/",
      },
      {
        kind: "web",
        label: "Fire Engineering — first-due engine size-up / stretch",
        href: "https://www.fireengineering.com/firefighting/fire-attack/size-up-considerations-for-the-first-due-engine/",
      },
      {
        kind: "web",
        label: "Fire Engineering — first-due battalion: apparatus placement",
        href: "https://www.fireengineering.com/fire-apparatus/first-due-battalion-chief-apparatus-placement/",
      },
      {
        kind: "standard",
        label: "OSFM — Driver/Operator Pump Apparatus",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-apparatus-driver-or-operator-pump-apparatus",
      },
    ],
  },
  {
    id: "eng-pump",
    title: "Pump math",
    kicker: "FL = C × Q² × L",
    group: "eng",
    blurb: "Coefficient formula is what SFT and IFSTA teach. Q is hundreds of gpm. L is hundreds of feet. Flow is squared — doubling the gpm quadruples the loss. Know the chart, run the calculator, then do the example out loud until it is two-o’clock-in-the-morning math. The pump chart on this engine still wins.",
    standard: "CA SFT FADO 1B · IFSTA / NFA coefficient method · NFPA 1002",
    tips: [
      "FL = C × Q² × L. Q = gpm ÷ 100. L = feet ÷ 100. Answer is psi.",
      "PDP = NP + FL + AL ± EP. Nozzle pressure, friction, appliances, elevation. Account for all four even when one is zero.",
      "NP you should know cold: smooth-bore handline 50, fog/automatic 100, low-pressure fog 50–75, smooth-bore master 80, fog master 100.",
      "Elevation is 0.5 psi per foot, or about 5 psi per floor. Up is plus. Down is minus.",
      "Appliances: 10 psi each as a working number. 25 psi if the device is flowing more than about 350 gpm, or a master stream. Ladder pipe / aerial waterway is often 25–80 depending on the stick — read the placard.",
      "Worked: 200 ft of 1¾″ at 150 gpm, fog. FL = 15.5 × (1.5)² × 2 = 15.5 × 2.25 × 2 ≈ 70 psi. PDP = 100 + 70 = 170 psi.",
      "Worked: 300 ft of 2½″ at 250 gpm, smooth bore. FL = 2 × (2.5)² × 3 = 2 × 6.25 × 3 = 37.5 psi. PDP = 50 + 38 ≈ 88 psi.",
      "When two equal lines are wyed, use the FL of one line — not both. The water split. Two equal parallel lines ≈ ¼ the FL of one.",
      "Smooth-bore flow: gpm ≈ 29.7 × d² × √NP. A ⅞″ tip at 50 psi is about 160 gpm. A 1⅛″ tip at 50 is about 265. A 1¼″ master at 80 is about 500.",
      "Class A foam: know the inductor percentage (usually 0.1–1%) and do not starve the pickup. Foam is a stream, then a percentage — not a second math problem on the fire.",
      "The pump chart on the panel is this math, pre-done for this engine. If you do not have a chart yet, this formula is the chart.",
    ],
    gear: {
      name: "Coefficient chart (IFSTA / NFA)",
      blurb: "C is for that diameter of hose. Confirm CFD’s actual hose C if it has been flow-tested — new hose is often better than the book. Until then, these are the numbers SFT wants.",
      specs: [
        "FL = C × Q² × L     Q = gpm/100     L = ft/100",
        "PDP = NP + FL + AL ± EP",
        "1½″  C = 24       trash / wildland / small line",
        "1¾″  C = 15.5     attack handline",
        "2″    C = 8         high-flow handline",
        "2½″  C = 2         big line / supply",
        "3″    C = 0.8       (2½″ couplings) supply / relay",
        "4″    C = 0.2       LDH",
        "5″    C = 0.08      LDH",
        "EP = 0.5 psi per foot of elevation (≈ 5 psi/floor)",
        "AL ≈ 10 psi per appliance (25 if >350 gpm or master)",
        "Smooth bore gpm ≈ 29.7 × d² × √NP",
      ],
      links: [
        {
          kind: "web",
          label: "PumpForge — friction loss formula + chart",
          href: "https://pump-forge.com/guides/fire-hose-friction-loss-chart",
        },
        {
          kind: "web",
          label: "PumpForge — how the coefficient formula works",
          href: "https://pump-forge.com/blog/friction-loss-calculations-explained",
        },
        {
          kind: "web",
          label: "Fire Engineering — developing a fire stream (CQ²L)",
          href: "https://www.fireengineering.com/firefighting/paul-spurgeon-developing-a-fire-stream/",
        },
      ],
    },
    links: [
      {
        kind: "standard",
        label: "OSFM — Driver/Operator Pump Apparatus",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-apparatus-driver-or-operator-pump-apparatus",
      },
      {
        kind: "video",
        label: "PDP formula explained (NP + FL + devices + elevation)",
        href: "https://www.youtube.com/watch?v=-Rsfx8mU8qk",
      },
      {
        kind: "video",
        label: "Dallas Fire-Rescue — calculating pump discharge pressure",
        href: "https://www.youtube.com/watch?v=QkEKmn0JD0I",
      },
      {
        kind: "video",
        label: "Pump discharge pressure calculations",
        href: "https://www.youtube.com/watch?v=egKyhS3-UV4",
      },
      {
        kind: "video",
        label: "Chapter 13 lecture — determining PDP (simple & complex lays)",
        href: "https://www.youtube.com/watch?v=b4U_n2seZ-4",
      },
      {
        kind: "video",
        label: "Q² method for supply hose",
        href: "https://www.youtube.com/watch?v=6E8ziHgtrS0",
      },
      {
        kind: "video",
        label: "How to use a pump chart on the panel",
        href: "https://www.youtube.com/watch?v=XnPEjMis_yE",
      },
      {
        kind: "video",
        label: "FireRescue1 — calculate and overcome friction loss",
        href: "https://www.youtube.com/watch?v=MOswVpfWbF8",
      },
    ],
  },
  {
    id: "eng-supply",
    title: "Supply & relay",
    kicker: "Hydrant · LDH · FDC",
    group: "eng",
    blurb: "Tank water is a timer. Supply is the job. Catch the hydrant, read residual, feed the attack engine or the FDC, and do not starve the nozzle because you got greedy on a second line. Establishing the supply line is why they left you at the panel.",
    standard: "CA SFT FADO 1B · NFPA 1410 · CFD hydrant / hose SOGs",
    tips: [
      "Tank water first so the line is wet. Transition to hydrant before the tank is a panic. Tell the nozzle you are switching.",
      "Residual is the leftover pressure on the intake while you are flowing. If residual is dropping through 20 psi, you are taking more than the main will give. Slow down or add a second source.",
      "LDH to the steamer. 2½″ on the steamer is leaving water in the street. Know which adapter is in which well.",
      "Relay: supply engine pumps to 20–50 psi residual at the next intake, not to a wild PDP. The attack engine sets the nozzle pressure.",
      "Standpipe / FDC: pump what the building and CFD SOG say — often 150 psi to start, then adjust. Do not assume the sprinkler FDC wants a master-stream PDP.",
      "Calimesa has dead-ends and hillside mains. A hydrant that looks fat on the map can be a 4″ dead-end. Watch residual, not hope.",
      "Two incoming lines beat one. If you have time, lay two. If you do not, lay the one that will actually flow.",
      "Intake relief / dump: set it so a surge does not blow the hydrant or the supply hose. Know where that valve is before you need it.",
    ],
    links: [
      {
        kind: "standard",
        label: "NFPA 1410 — initial attack performance",
        href: "https://www.nfpa.org/codes-and-standards/nfpa-1410-standard-development/1410",
      },
      {
        kind: "web",
        label: "Fire Engineering — moving water: relay operations",
        href: "https://www.fireengineering.com/fire-apparatus/moving-water-relay-operations/",
      },
      {
        kind: "web",
        label: "Fire Engineering — hose relay operations",
        href: "https://www.fireengineering.com/firefighting-equipment/hose-relay-operations-part-1/",
      },
      {
        kind: "video",
        label: "Catch and dress a hydrant",
        href: "https://www.youtube.com/watch?v=5-eGfLK0uhk",
      },
    ],
  },
  {
    id: "eng-draft",
    title: "Drafting",
    kicker: "Static water · shuttle",
    group: "eng",
    blurb: "Drafting is atmosphere pushing water up the suction hose because you pulled a vacuum. Primer, tight fittings, a strainer off the bottom. Calimesa ponds, flood-control, and portable tanks are why this is not a textbook trick. Shuttle and dump tanks are the hydrant when there is not one.",
    standard: "CA SFT FADO 1B / 1F · NFPA 1901 / 1911 pump test · 10 ft lift",
    tips: [
      "1 inch of mercury on the compound gauge ≈ 1.13 feet of lift. Need 15 ft of lift? You need a little over 13″ Hg.",
      "Theoretical max is about 33.9 ft. Practical is about 20 ft. At 10 ft of lift you should make rated capacity. At 20 ft you are at roughly 60%.",
      "Hard suction, air-tight couplings, strainer 18–24″ off the bottom and off the bank so you do not suck mud. Chock the rig so it does not walk into the hole.",
      "Close tank-to-pump and tank fill. Drain the pump. Primer until you have a solid vacuum, then water. Open the discharge slowly or you dump the prime.",
      "Cavitation: vacuum climbing, pressure not, pump sounding like gravel. Throttle back, check lift, check air leaks, check the strainer.",
      "Portable tank: dump, draft from the next tank, keep a jet dump or a transfer going. The tank is the hydrant now.",
      "Shuttle: spot so tenders can dump without blocking the draft. One tank feeding, one being dumped, one on the road. Do not make them wait on your bumper.",
      "Tell the nozzle before you leave tank water for draft. A limp line is how people get mad and how fires get bigger.",
    ],
    gear: {
      name: "Draft numbers",
      blurb: "These are the lift numbers. Elevation above sea level and hot water both steal lift. Inland summer water is not lab water.",
      specs: [
        "1″ Hg ≈ 1.13 ft of water lift",
        "1″ Hg ≈ 0.5 psi vacuum",
        "Rated capacity at ~10 ft lift (NFPA pump test)",
        "~60% capacity at 20 ft lift",
        "Practical max ~20 ft; theoretical ~33.9 ft",
        "Vacuum should hold — NFPA primer test: lose ≤10″ Hg in 10 min (dry)",
      ],
      links: [
        {
          kind: "web",
          label: "Fire Engineering — fire service drafting operations",
          href: "https://www.fireengineering.com/firefighting/fire-service-drafting-operations/",
        },
      ],
    },
    links: [
      {
        kind: "video",
        label: "Running the pump — drafting fundamentals",
        href: "https://www.youtube.com/watch?v=2ssENwMOQyY",
      },
      {
        kind: "web",
        label: "Fire Engineering — hydraulics / lift and mercury",
        href: "https://www.fireengineering.com/firefighting/hydraulics/",
      },
      {
        kind: "standard",
        label: "OSFM — Driver/Operator Pump Apparatus",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-apparatus-driver-or-operator-pump-apparatus",
      },
      {
        kind: "standard",
        label: "OSFM — Driver/Operator Water Tender (FADO 1F)",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-apparatus-driver-or-operator-water-tender-apparatus",
      },
    ],
  },
  {
    id: "eng-aerial",
    title: "Truck & elevated streams",
    kicker: "Spot the turntable",
    group: "eng",
    blurb: "The truck engineer spots the turntable, not the bumper. Rescue, vent, or water — those three jobs want three different spots. Elevated streams are a collapse-zone problem with a waterway on top. Leave the front of the building for the stick if you are first-due engine.",
    standard: "CA SFT FADO 1C Aerial · NFPA 1002 / 1901 · FIRESCOPE",
    tips: [
      "Turntable to the target. Parallel to the building if you can. Corner spots give you two sides and a better collapse angle.",
      "Rescue first: turntable closest to the victims, upwind if fire is pushing across the face. Then you can think about water.",
      "Elevated stream: 1½ times the building height out. You cannot put the stick in the collapse zone and call it defensive.",
      "Outriggers on something that will hold the rig. Short-jacking limits the short side — know which side you just gave away. Soft dirt, lids, and slopes are not a pad.",
      "Overhead wires own the stick. SCE does not care that you have a waterway. If you cannot see sky, you cannot throw the ladder there.",
      "People or water, often not both. Tip load drops when the waterway is charged. Read the placard on this truck.",
      "Do not flow until the waterway is full, the tip is on the fire, and someone has warned the roof and the street. Brick and tile come down with the stream.",
      "Feed: one LDH is a start, two is a master stream. Smooth-bore master NP is 80, fog master is 100, plus the pipe. Start around 150 at the pump and adjust to the tip.",
      "First-due engine: leave the address for the truck. You can stretch hose. You cannot stretch a stick.",
    ],
    links: [
      {
        kind: "standard",
        label: "OSFM — Driver/Operator Aerial Apparatus (FADO 1C)",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-apparatus-driver-or-operator-aerial-apparatus",
      },
      {
        kind: "web",
        label: "Firehouse — positioning the first-due ladder truck",
        href: "https://www.firehouse.com/apparatus/article/10710954/positioning-the-first-due-ladder-truck-on-the-fireground",
      },
      {
        kind: "web",
        label: "Fire Engineering — methodical aerial positioning",
        href: "https://www.fireengineering.com/magazine/methodical-approach-to-achieving-a-productive-aerial-apparatus-position/",
      },
      {
        kind: "web",
        label: "Firehouse — aerial apparatus fireground operations",
        href: "https://www.firehouse.com/operations-training/training-drills/article/10463454/aerial-apparatus-fireground-operations",
      },
      {
        kind: "web",
        label: "FireRescue1 — aerial positioning (collapse zone)",
        href: "https://www.firerescue1.com/fireground-operations/video-fireground-conditions-dictate-aerial-positioning",
      },
      {
        kind: "web",
        label: "Fire Engineering — overhead / elevated master streams",
        href: "https://www.fireengineering.com/firefighter-training/firefighter-drills/view-to-a-drill-overhead-master-streams/",
      },
      {
        kind: "video",
        label: "Truck company — spotting the turntable and ladder-pipe ops",
        href: "https://www.youtube.com/watch?v=OPacyPw3J90",
      },
      {
        kind: "web",
        label: "FIRESCOPE FOG",
        href: "https://firescope.caloes.ca.gov/fog-manual",
      },
    ],
  },
];


export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

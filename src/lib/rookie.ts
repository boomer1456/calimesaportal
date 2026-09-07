export type RookieLink = { label: string; href: string };

export type RookieSection = {
  id: string;
  title: string;
  kicker: string;
  intro: string;
  steps: string[];
  notes?: string[];
  links: RookieLink[];
};

export const ROOKIE_SECTIONS: RookieSection[] = [
  {
    id: "role",
    title: "What it is to be a rookie",
    kicker: "The first year",
    intro:
      "You are a working firefighter from day one — a safe beginner, not a guest. Probation is an evaluation of skill, judgment, and whether the crew can trust you at 3 a.m. Station work is part of the job, not a punishment.",
    steps: [
      "Be first up and last down. Have coffee started, the kitchen presentable, and your gear checked before the off-going crew is gone.",
      "Keep your mouth shut and your eyes open. You have not earned opinions yet. Listen, write it down, then do the thing.",
      "Stay busy without being showy. If you are standing still, look for a floor, a dish, a compartment, or a skill to practice.",
      "Ask specific questions: “How do you want the 1¾ flaked for a garden apartment?” not “What should I do?”",
      "Touch base with your officer before bed and before you go off duty: “Anything else you need?”",
      "Attitude after probation should look the same as during it. The house remembers.",
    ],
    notes: [
      "Customs change by shift. A-Shift, B-Shift, and C-Shift may run the house differently. Ask on day one. Follow this crew, this officer.",
      "This page is station-life coaching. Official SOPs, safety, and the training calendar still win.",
    ],
    links: [
      {
        label: "Firehouse — first-to-wake station tips",
        href: "https://www.firehouse.com/careers-education/article/10499355/tips-for-new-firefighters-who-get-assigned-to-the-fire-station",
      },
      {
        label: "Firefighter Nation — surviving as a probie",
        href: "https://www.firefighternation.com/fire-leadership/surviving-and-thriving-as-a-probie/",
      },
      {
        label: "Firefighter Close Calls — 50 tips for probies",
        href: "https://www.firefighterclosecalls.com/the-50-tips-for-probies-shut-up-train-list-the-secret-list/",
      },
    ],
  },
  {
    id: "school",
    title: "Station school",
    kicker: "You teach the crew",
    intro:
      "The officer will assign you a topic. You look it up, build a short class, and teach the house. That is not busywork. You learn the subject for real. The crew gets a refresh. The officer sees whether you can research, talk, and take a question without folding. A good station school is 15–20 minutes, one objective, and something in their hands — not a 40-slide lecture you read off the wall.",
    steps: [
      "Get the assignment in writing in your notebook: topic, date, how long, classroom or bay, and whether they want a handout, slides, or both. Ask who the audience is — this crew, or A/B/C.",
      "Start here, not Google. CFD SOG (Binder), REMSA, the SFT skill sheet, and the Fireground card in this app. Local policy wins. If the internet and Volume 6 disagree, Volume 6 wins.",
      "Write one sentence at the top of the page: “When we are done, this crew can ___.” If a slide does not serve that sentence, cut it.",
      "Build the class in this order: why it matters on our ground (Calimesa, the pass, I-10, WUI), how we do it here, two or three ways people get hurt doing it wrong, then a demo or a tabletop.",
      "Slides: pictures, one line of text, our apparatus and our streets if you can. Do not read bullets. A one-page handout they can stick on the fridge is worth more than 20 slides. Print two extras.",
      "If it is a skill, the tool leaves your hands. You coach from behind the firefighter — Halligan, nozzle, radio, meter. Showing off how good you are is not teaching.",
      "Ask the seniors the war-story questions. You bring the current standard. They bring the call on 3rd Street. Together that is the class. If you do not know, say so and look it up in front of them. Bluffing is how bad tactics get blessed.",
      "Have a 5-minute version. A call will drop. Know the one why, the one how, and the one mistake. Finish after you get back, or log what you did and pick it up next tour.",
      "After: leave the handout, put the file on the station computer if the officer wants it, and log the hours in ISA. That is training, not a book report.",
    ],
    notes: [
      "What to include every time: the CFD / REMSA / SFT reference (number and page), why we do it, how Calimesa actually does it, 2–3 common mistakes, one scenario (“first-due, hillside ranch, bars on Bravo”), three questions for the crew, and your sources.",
      "Time: 15–20 minutes talk, 30–40 if you go to the bay. Break before anyone is staring at their phone. No death-by-PowerPoint.",
      "Starter topics the house actually uses: VEIS with security bars, pass winds and LCES, I-10 blocking, SCE lines down, Station PAR / 3303, gross decon, Zone 31 radio, dead-end hydrants, MAYDAY words, EV / lithium in the garage.",
    ],
    links: [
      {
        label: "Fire Engineering — delivering a drill presentation",
        href: "https://www.fireengineering.com/firefighter-training/delivering-a-successful-training-drill-presentation/",
      },
      {
        label: "FireRescue1 — how to teach firefighters (not just present)",
        href: "https://www.firerescue1.com/fire-products/training-products/articles/beyond-1041-how-to-elevate-your-instruction-style-to-best-engage-firefighters-9xgJN3ZdZG1JRDPW/",
      },
      {
        label: "UL FSRI — research-based fire training",
        href: "https://training.fsri.org/",
      },
      {
        label: "OSFM — California State Fire Training",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training",
      },
      {
        label: "OSFM — Fire Fighter 1 skill sheets and course plans",
        href: "https://osfm.fire.ca.gov/what-we-do/state-fire-training/professional-certifications/fire-fighter-1",
      },
      {
        label: "NWCG — 6 Minutes for Safety",
        href: "https://www.nwcg.gov/committee/6-minutes-for-safety-subcommittee#6mfscalendar",
      },
      {
        label: "REMSA — education and protocols",
        href: "https://rivcoready.org/remsa/education",
      },
      {
        label: "IAFC / VCOS — company training guide (PDF)",
        href: "https://www.iafc.org/docs/default-source/1vcos/operational-training-guide.pdf",
      },
    ],
  },
  {
    id: "shift-start",
    title: "First 30 minutes of the shift",
    kicker: "Turnover",
    intro:
      "A 48/96 day starts before you sit down. The oncoming rookie makes the house ready so the crew can take a report, check the rigs, and go in service.",
    steps: [
      "Walk in in uniform, bag stowed, phone on silent. Greet the off-going crew. Do not sit in “someone’s” chair until you know the house.",
      "Start coffee the way this shift drinks it. Ask before you guess.",
      "Check your assigned riding position: SCBA, mask, bottle, gloves, light, tools, radio, map book, medical gloves.",
      "Walk the apparatus with the engineer or senior. Look, touch, ask what changed overnight.",
      "Kitchen: empty the dishwasher if it is clean, start it if it is full, wipe the counters, take overflowing trash.",
      "Bathrooms and floors get a once-over after rig checks — not instead of them.",
    ],
    links: [
      {
        label: "Ann Arbor FD station duties (example SOG)",
        href: "https://www.a2gov.org/media/lzijcrum/114-station-duties.pdf",
      },
    ],
  },
  {
    id: "coffee",
    title: "How to make the coffee",
    kicker: "Do this first",
    intro:
      "Bad coffee is a reputation. Great coffee is still not a personality. Ask, then make a full pot that is ready when people walk in the kitchen.",
    steps: [
      "Day one: What brand? Regular or decaf? How strong? Who even drinks it? Cream, sugar, oat milk? Write it in your notebook.",
      "Dump old grounds. New filter every pot. Rinse the carafe. Fill the reservoir with cold water to the cup line — station “cups” are usually 5–6 oz, not a mug.",
      "Drip machine starting point: 1 rounded tablespoon of medium grind per machine cup, or about 10–12 tablespoons for a 12-cup pot. Taste, then adjust for this crew.",
      "Percolator: coarse grind, about 1 tablespoon per 8 oz of water. Let it perk, do not boil it into tar.",
      "Hit brew. When it finishes, put the carafe on a trivet, not a hot burner all morning. Start the next pot before the last cup dies.",
      "Wash the carafe, basket, and spoon. Wipe the warmer. Once a week, run a 1:1 vinegar-and-water clean cycle, then two rinses of fresh water.",
    ],
    notes: [
      "Never assume B-Shift drinks what A-Shift drinks.",
      "If nobody drinks coffee, do not make a pot to look busy. Ask what they do want — water, tea, a cold brew pitcher.",
    ],
    links: [
      {
        label: "Fire Dept Coffee — brew ratio",
        href: "https://www.firedeptcoffee.com/blogs/news/understanding-coffee-to-water-ratio",
      },
      {
        label: "The Kitchn — clean a drip coffee maker",
        href: "https://www.thekitchn.com/how-to-clean-a-coffee-maker-cleaning-lessons-from-the-kitchn-200908",
      },
      {
        label: "Video — electric percolator",
        href: "https://www.youtube.com/watch?v=7lxGeZEtVCc",
      },
    ],
  },
  {
    id: "mop",
    title: "How to mop the floors",
    kicker: "Kitchen, day room, halls",
    intro:
      "Mopping is not pushing dirty water in a circle. Sweep first, use clean solution, and leave a floor people can walk on without skating.",
    steps: [
      "Clear chairs and trash. Dry-sweep or vacuum grit so you are not painting sand across the tile.",
      "Read the bottle. Neutral cleaner for sealed tile and vinyl. Degreaser after cooking in the kitchen. Hot water. Mix to the label — more soap is not cleaner, it is sticky.",
      "Two-bucket method if you have it: one with solution, one with rinse water. Change water when it looks like soup.",
      "Wring the mop until it is damp, not dripping. Flooding a station floor is a slip hazard and wrecks finish.",
      "Start at the far corner. Figure-eight strokes. Work toward the door so you are not walking on the wet path.",
      "Edges and baseboards with the mop heel or a deck brush. Kick plates and under the table get dirt first.",
      "Put a wet-floor sign out. Hang the mop to dry, dump the buckets, rinse them, restock the bottle.",
    ],
    notes: [
      "After dinner: dishes, counters, stove, then mop the kitchen. Do not leave grease overnight.",
      "Bay floors and shop areas may take a different soap. Ask the engineer before you hit diamond plate with kitchen cleaner.",
    ],
    links: [
      {
        label: "Unger — commercial mop technique",
        href: "https://usa.ungerglobal.com/blog/commercial-floor-mop-techniques-what-works-and-what-doesnt/",
      },
      {
        label: "Instructables — mop a floor, step by step",
        href: "https://www.instructables.com/How-to-mop-a-floor/",
      },
    ],
  },
  {
    id: "clean",
    title: "How to clean the house",
    kicker: "Toilets to tiller",
    intro:
      "A clean station is respect for the crew that lives here 48 hours at a time. If you can see it, you can wipe it. If you used it, you put it back.",
    steps: [
      "Bathrooms: empty trash, wipe sink and mirror, restock paper and soap, sweep, mop. Clean the toilet — bowl, seat, base, behind it.",
      "Old-school signal some houses still use: leave clean soapy water in the bowl instead of flushing, so the next person can see it was done. Follow this house.",
      "Kitchen: dishes in or run, counters, stove, microwave, table, coffee area, fridge spills, take the trash and recycling.",
      "Day room: couches wiped, remote and charger cords honest, floors vacuumed, blankets folded.",
      "Dorms: your bunk made, your gear not exploding across the floor, hallway quiet after lights.",
      "Apparatus: windows, cab, compartments used yesterday, tools wiped, rims if that is the house standard, trash out of the cab.",
      "Police the house on the way to bed and before you leave: lights you do not need, doors, flag if assigned, dishwasher set.",
    ],
    links: [
      {
        label: "Firehouse — evening and morning house list",
        href: "https://www.firehouse.com/careers-education/article/10499355/tips-for-new-firefighters-who-get-assigned-to-the-fire-station",
      },
    ],
  },
  {
    id: "hygiene",
    title: "Personal hygiene and cancer prevention",
    kicker: "Shower within the hour",
    intro:
      "Dirty gear is not a badge of honor. Soot on skin and hoods is a carcinogen problem. Clean firefighter, clean cab, clean house.",
    steps: [
      "On scene after a fire: wet soap gross-decon of gear and tools before they go back on the rig. This knocks off most of the junk.",
      "Wipe neck, jaw, throat, hands, and wrists with fire wipes before you ride home. Hoods and gloves are hot spots.",
      "Dirty turnouts stay out of the living quarters and out of the cab if your department runs clean-cab. Bag them. Do not sit on the couch in a dirty hood.",
      "Shower within the hour of leaving the fire. Start cooler to keep pores from pulling stuff in, then wash hair, skin, and nails with soap. Clean uniform after.",
      "Do not take contaminated clothes home to the family laundry. Follow CFD’s extractor / bag / wash SOP.",
      "Daily, off-fire: shower, deodorant, clean uniform, nails short, hair that fits a hood, spare T-shirt on the rig. Wash your hands before you cook for the crew.",
      "Stay fit enough to work. You cannot puke in a mask and you cannot hide from a second-due 2½ stretch.",
    ],
    notes: [
      "Follow Calimesa / county decon SOP if it is stricter than this list.",
    ],
    links: [
      {
        label: "IAFF — occupational cancer",
        href: "https://www.iaff.org/cancer/",
      },
      {
        label: "Firefighter Cancer Support Network",
        href: "https://www.firefightercancersupport.org/",
      },
      {
        label: "FCSN training briefs (clean cab, hygiene)",
        href: "https://www.firefightercancersupport.org/firefighter-cancer-awareness-month/training-briefs",
      },
    ],
  },
  {
    id: "meals",
    title: "Cooking for the crew (5–6 people)",
    kicker: "Kitchen duty",
    intro:
      "Meals are the house. You will shop, cook, and clean for five or six adults, with a timer running in case a call drops. Cook extra. Someone always comes in hungry.",
    steps: [
      "Before you buy: allergies, spice tolerance, budget, who is eating, who is chipping in. Write names and amounts.",
      "Plan a one-pan or one-pot meal that can sit on warm or reheat after a run. Casseroles, chili, pasta bakes, taco bars, and breakfast skillets travel well.",
      "Shop once. Get a salad or fruit so it is not only beige. Confirm the station has oil, salt, foil, and a 9×13 pan before you leave.",
      "Start earlier than you think. A 17:00 meal means prep by 15:00. Oven on, trash empty, cutting board clean.",
      "Last one to fill a plate. First one to the sink. Trash out, counters wiped, stove dead, floor mopped.",
      "Label leftovers. Do not leave a science experiment for C-Shift.",
    ],
    notes: [
      "If you cannot cook yet, peel, chop, stir, and own the dishes. Then learn one recipe a month from the list below.",
    ],
    links: [
      {
        label: "Firefighter Close Calls — meals and dishes",
        href: "https://www.firefighterclosecalls.com/the-50-tips-for-probies-shut-up-train-list-the-secret-list/",
      },
    ],
  },
];

export const ROOKIE_RECIPES: Array<{
  title: string;
  serves: string;
  why: string;
  href: string;
}> = [
  {
    title: "Tater tot bake",
    serves: "6",
    why: "Ground beef, tots, soup, cheese. Hard to mess up. Oven-friendly if a call drops.",
    href: "https://www.allrecipes.com/recipe/16884/tater-tot-bake/",
  },
  {
    title: "Baked spaghetti",
    serves: "6",
    why: "Classic firehouse pasta in a 9×13. Cheap, feeds late arrivals.",
    href: "https://www.allrecipes.com/recipe/18440/basic-baked-spaghetti/",
  },
  {
    title: "Baked ziti",
    serves: "8 — extra for seconds",
    why: "Make it once, eat it twice. Use the 9×13 on the middle rack.",
    href: "https://www.allrecipes.com/recipe/11758/baked-ziti-i/",
  },
  {
    title: "Sloppy Joes",
    serves: "6 sandwiches",
    why: "Fast stove-top. Buns, salad, done. Double the meat if the whole house is in.",
    href: "https://www.allrecipes.com/recipe/24264/sloppy-joes-ii/",
  },
  {
    title: "Firehouse chili and cornbread casserole",
    serves: "8–10",
    why: "Chef John’s chili with a cornbread lid. Scale spices down until you know the crew.",
    href: "https://www.allrecipes.com/recipe/278905/firehouse-chili-and-cornbread-casserole/",
  },
  {
    title: "Boilermaker tailgate chili",
    serves: "10–12 — freeze extra",
    why: "Beef, sausage, beans. Simmer all afternoon. Works in a slow cooker on duty.",
    href: "https://www.allrecipes.com/recipe/78299/boilermaker-tailgate-chili/",
  },
  {
    title: "Weeknight chili (budget)",
    serves: "6",
    why: "Faster, cheaper chili if you do not have four hours.",
    href: "https://www.budgetbytes.com/basic-chili/",
  },
  {
    title: "Black bean chili",
    serves: "6",
    why: "A meat-light option when someone on the crew does not eat beef.",
    href: "https://www.budgetbytes.com/weeknight-black-bean-chili/",
  },
  {
    title: "Easy homemade lasagna",
    serves: "9",
    why: "Feeds 5–6 with lunch leftovers. Assemble, bake, rest 10 minutes.",
    href: "https://www.budgetbytes.com/easy-homemade-lasagna/",
  },
  {
    title: "Mountain man breakfast",
    serves: "scale to 6 from 12",
    why: "Sausage, hash browns, eggs, cheese. Dutch oven or 9×13. Morning after a night run.",
    href: "https://www.allrecipes.com/recipe/216742/dutch-oven-mountain-man-breakfast/",
  },
  {
    title: "Lodge mountain man breakfast",
    serves: "6–8",
    why: "Same idea, cast-iron version with a short ingredient list.",
    href: "https://www.lodgecastiron.com/blogs/recipe/mountain-man-breakfast",
  },
];

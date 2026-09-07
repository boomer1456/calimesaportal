export type Guide = {
  how: string[];
  standard: string[];
  coaching: string[];
};

const DEFAULT: Guide = {
  how: [
    "Read today's assignment out loud so every member hears the same objective.",
    "Walk the props, name the hazards, and assign engine, truck, and command roles.",
    "Demonstrate the correct task once, slowly, with the company watching.",
    "Practice in parts, then put it together as a company evolution.",
    "Time one clean run. Stop, coach, then run it again.",
    "Close with a two-minute AAR: what worked, what failed, who is assigned the make-up.",
  ],
  standard: [
    "Every member can state the objective without looking at the card.",
    "The company completes the assigned task without unsafe freelancing.",
    "Deficiencies are named and scheduled — not ignored.",
  ],
  coaching: [
    "Technique first, then speed. Do not let a sloppy fast run count as a pass.",
    "If the drill is canceled for a call, reschedule it. Do not drop it.",
  ],
};

const GUIDES: Record<string, Guide> = {
  nfpa1410: {
    how: [
      "This is a company-standard evolution, not a classroom talk. Treat it like a first-due fire.",
      "Set a realistic address, occupancy, and fire location. Give a 360 and a water-supply plan.",
      "Engine: establish a supply (hydrant or tank-to-pump), stretch the assigned line, charge, flow, and advance to the objective.",
      "Truck / second due: throw the assigned ladder, force the assigned door, and start a coordinated search or vent — only when command calls for it.",
      "Command: one officer tracks PAR, assignment, and water. Nobody works without an assignment.",
      "Run it once for technique. Reset. Run it a second time on the clock. Hold the line until the nozzle is flowing and the search team is through the door.",
      "If a member is lost, entangled, or off the hose, freeze the drill and run Mayday / RIC from that moment.",
    ],
    standard: [
      "Supply is established before the nozzle commits to the interior.",
      "The attack line is stretched, charged, and flowing without kinks that starve the nozzle.",
      "Ladders are butted, tied, and climbed only after the tip is in the intended window or roof edge.",
      "Search is oriented (hose, wall, or thermal) and reports findings on the radio.",
      "A PAR is completed at the end of the evolution. Missing people is a fail, even if the stretch was fast.",
    ],
    coaching: [
      "NFPA 1410-style drills exist to prove the company can put water on the fire and get a ladder up as a team — not as six people doing solo skills.",
      "Use the same props every month so times mean something. Change only one variable at a time.",
      "Typical company target: a clean hydrant stretch, charged 1¾-inch line, and a ground ladder working together in a few minutes. CFD records actual time — do not invent a pass time.",
      "If the nozzle firefighter is waiting on water, the evolution is already late. Fix the supply, not the stopwatch.",
    ],
  },
  search: {
    how: [
      "Give a real occupancy: bedroom, apartment, or motel. Name the fire location and the last-known victim.",
      "Enter oriented — left-hand or right-hand wall, or hose as a lifeline. Thermal camera is a tool, not a substitute for a search pattern.",
      "Maintain voice, radio, and hose contact. Call the layout: room, door, window, victim.",
      "Package and remove the victim the same way you would on the fireground. Do not drag past a charged line that has no water.",
      "If a searcher is lost, that is now a Mayday drill. Convert immediately.",
    ],
    standard: [
      "The team can complete a primary of the assigned area without getting turned around.",
      "Victim location is radioed before removal starts.",
      "Air is managed. Nobody works into low-air on a training search.",
    ],
    coaching: [
      "Slow and oriented beats fast and lost. The first five minutes of a search are about surviving the floor, not setting a record.",
      "Pair this with Saturday 1410 when the calendar stacks both.",
    ],
  },
  sizeup: {
    how: [
      "Drive or walk a real occupancy in first-due: apartment, motel, house, or commercial.",
      "From the cab: construction, occupancy, apparatus placement, life hazard, water, and the 360.",
      "Give a radio size-up as if you are first-due: unit, address, nothing showing / working fire, actions, strategy.",
      "Walk hydrants, FDC, PIV, power, and rear access. Mark anything that will surprise a night crew.",
      "Finish with first-due vs second-due tactics for that building.",
    ],
    standard: [
      "Every member can give a 15-second size-up for the occupancy you stood in front of.",
      "Water supply and access problems are written down, not just talked about.",
    ],
    coaching: [
      "Pick one building and train it deeply. A different building every Sunday is fine; a vague 'district familiarization' is not.",
    ],
  },
  scba: {
    how: [
      "Every member inspects their assigned pack: straps, cylinder, PASS, facepiece, and regulator.",
      "Don gloves-on. Time a work-ready mask-up. Coach anyone over the company standard until they are consistent.",
      "Work a perishable add-on: emergency procedures, air-sharing, reduced-profile, or a dark-room mask change.",
      "Monday is for building the skill, not a lecture. Get on air.",
    ],
    standard: [
      "Work-ready donning with gloves, no skin showing, PASS armed.",
      "Member can clear a facepiece and go back on air without removing the pack.",
    ],
    coaching: [
      "Skills decay in 30 to 45 days. This is why mask-up is every Monday.",
      "Do not skip gloves. A bare-hand don is not the job.",
    ],
  },
  tactics: {
    how: [
      "Name the occupancy and the problem: fire, WUI, MCI, hotel, or LODD lesson.",
      "Walk the FOGs / SOGs that apply. Assign IAP, radio, and accountability.",
      "Talk first-due actions only: where the engine sits, where the first line goes, who searches, who vents.",
      "If the card says LODD or close-call, read the actual report and extract two behaviors this company will copy or refuse.",
    ],
    standard: [
      "The officer can give an IAP in one radio transmission.",
      "Every firefighter can repeat their assignment and the water plan.",
    ],
    coaching: [
      "Tactics Tuesday is decisions, not war stories. End with one action this crew will do differently on the next fire.",
    ],
  },
  hose: {
    how: [
      "Estimate the stretch before you flake: floors, hallway, stairs, or yard.",
      "Flake for the occupancy — not a parking-lot pretty load. Load the hallway or stairwell the way you will fight.",
      "Charge, set the nozzle, and flow. Work kinks, couplings, and a moving advance.",
      "If the card says progressive hose lay, start at the engine and extend toward the objective with a working nozzle, not a dry drag.",
    ],
    standard: [
      "The line reaches the objective with enough hose to work the room.",
      "Nozzle pressure and pattern are set before the door is forced.",
      "Advance is coordinated: nozzle, backup, and control.",
    ],
    coaching: [
      "A short stretch that does not reach is a fail. Pull more hose than you think.",
    ],
  },
  ladders: {
    how: [
      "Select the ladder for the objective: rescue window, roof access, or VES.",
      "Spot the apparatus. Throw, butt, and tie. Tip to the correct landing, not the middle of a wall.",
      "If aerial is assigned, set jacks on solid ground, fly to the objective, and practice an emergency lower.",
      "Climb with tools. Work off the ladder as you would for vent or victim removal.",
    ],
    standard: [
      "The tip is in the intended opening. A missed window is a miss.",
      "Heels are butted and the ladder is stable before anyone climbs.",
      "Spotter is used any time the aerial moves.",
    ],
    coaching: [
      "Throwing fast into the wrong window does not count. Placement is the skill.",
    ],
  },
  forcible: {
    how: [
      "Size up the door: inward / outward, metal / wood, through-the-lock vs conventional.",
      "Control the door. Irons, saw, or ram as assigned. Do not destroy a door you can open.",
      "On 'stretch, force, mask up' days: line at the door, force, then go on air and make the push together.",
      "Call the layout: life, fire, layout. That is the radio report after you take the door.",
    ],
    standard: [
      "The door is controlled through the entire evolution.",
      "Tools stay in hand. A dropped halligan on the porch is a fail.",
    ],
    coaching: [
      "Force is a company skill. The nozzle should already be at the door when it comes open.",
    ],
  },
  mayday: {
    how: [
      "Brief the trigger: lost, trapped, low air, or collapsed floor.",
      "The distressed member transmits a Mayday with LUNAR: location, unit, name, assignment, resources, and air.",
      "Command acknowledges, deploys RIC, and keeps the firefight assigned — do not let the whole company chase the Mayday.",
      "RIC supplies air, packages, and removes. Interior companies hold or support as assigned.",
      "Reset and swap roles so every member both calls a Mayday and works RIC.",
    ],
    standard: [
      "The Mayday is clear, complete, and on the correct channel.",
      "RIC arrives with air and tools, not empty hands.",
      "A PAR is completed for every company on scene.",
    ],
    coaching: [
      "A quiet Mayday is a failed Mayday. Practice the words until they come out under work.",
    ],
  },
  wui: {
    how: [
      "Walk LCES: lookouts, communications, escape routes, safety zones.",
      "Triage structures: defend, prep-and-go, or leave. Say why.",
      "Position apparatus for a way out. Never block your own escape.",
      "If progressive hose or RT-130 is on the card, complete that skill in PPE with a working nozzle or shelter as assigned.",
    ],
    standard: [
      "Every member can point to the escape route and the safety zone from the work area.",
      "Structure triage is recorded, not guessed after the fact.",
    ],
    coaching: [
      "WUI kills companies that stay too long. Trigger points are the drill.",
    ],
  },
  vent: {
    how: [
      "Coordinate with attack. Do not vent until the line is ready.",
      "Choose vertical vs horizontal based on fire location and flow path.",
      "Make the opening, control it, and report. Watch for fire below the roof crew.",
    ],
    standard: [
      "Ventilation is timed to support the nozzle, not to feed the fire.",
      "Roof crew has a second means off the roof.",
    ],
    coaching: [
      "Uncoordinated vent is an attack on your own company. Radio first.",
    ],
  },
  first5: {
    how: [
      "Run the first five minutes as a scenario: size-up, radio, IAP, water, first line, search, accountability.",
      "For hotels: locate PIV, standpipe, stairs, and utilities before you talk strategy.",
      "Do not skip the windshield survey. Occupancy, life, fire, and collapse potential belong in the first transmission.",
    ],
    standard: [
      "Command is established and a water plan is named in the first radio report.",
      "The first line and the first search have assignments, not suggestions.",
    ],
    coaching: [
      "The first five minutes set the next five hours. Slow the radio down enough to be understood.",
    ],
  },
  evoc: {
    how: [
      "Walk-around inspection, then the cone course: serpentine, alley dock, diminishing clearance, and backing.",
      "Spotter is mandatory for backing. Night ops use headlights, scene lighting, and a ground guide.",
    ],
    standard: [
      "Zero cone strikes on the scored run, or the run is repeated.",
      "Backing never happens without a spotter in view of the mirror.",
    ],
    coaching: [
      "If you would not do it at 0200 on a narrow street, it is not a pass here.",
    ],
  },
  hazmat: {
    how: [
      "Recognize, isolate, and deny entry. Identify from a distance with ERG / placard / 4-gas.",
      "Establish zones and a decon corridor before anyone makes contact.",
      "Stay defensive unless CFD capability and PPE clearly cover the product.",
    ],
    standard: [
      "Hot / warm / cold zones are marked.",
      "Gross decon is demonstrated, not described.",
    ],
    coaching: [
      "Curiosity is not a tactic. If you cannot name the product and the PPE, you do not go in.",
    ],
  },
  ems: {
    how: [
      "Run the MCI or medical problem on the card: triage, tags, communications, and resource ordering.",
      "Windshield survey first. Then START / jumpSTART or current REMSA protocol.",
      "One person owns the radio. One person owns the treatment area.",
    ],
    standard: [
      "Patients are tagged and counted.",
      "The first-due engine can give a complete MCI size-up.",
    ],
    coaching: [
      "An earthquake / evac tabletop still needs assignments. Put names on roles.",
    ],
  },
  tech: {
    how: [
      "Stay inside CFD capability: knots, harnesses, hoisting, and rescue-assist — not a technician rope job you are not staffed for.",
      "Build the knot, inspect the harness, and move a patient only with a backup.",
      "For aerial rescue, the aerial is a platform with a spotter and a lowering plan.",
    ],
    standard: [
      "Every knot is dressed and set before it holds weight.",
      "A safety is in place before the load is applied.",
    ],
    coaching: [
      "No timed evolution. Get the system right. Speed is not the standard on special rescue days.",
    ],
  },
  officer: {
    how: [
      "Run a step-up scenario: you are the acting captain, engineer, or battalion.",
      "Give the radio report, the IAP, and the water plan. Manage one problem at a time.",
      "Transfer command cleanly when the next officer arrives.",
    ],
    standard: [
      "The acting officer can run a PAR and a water supply without prompting.",
    ],
    coaching: [
      "Step-up days are for the person who will sit in the seat at 0300, not for the person who already has the bugles.",
    ],
  },
  pump: {
    how: [
      "Engineer mental math: GPM, friction loss, elevation, and nozzle pressure for today's line.",
      "Set the pump, transition from tank to hydrant, and talk through a cavitation or overheat fault.",
    ],
    standard: [
      "The engineer can set the correct pressure without a phone calculator.",
      "A second member can dump the same problem and get the same number.",
    ],
    coaching: [
      "Write the formula on the whiteboard, then put it on the panel. Paper math that never hits the pump is not training.",
    ],
  },
  water: {
    how: [
      "Establish the supply the occupancy actually needs: hydrant, draft, or relay.",
      "If drafting is on the card, set the strainer, prime, and flow. Talk through a lost prime.",
    ],
    standard: [
      "Required fire flow is named and met, or the limitation is reported to command.",
    ],
    coaching: [
      "A pretty hydrant hookup that does not feed the nozzle is a fail.",
    ],
  },
  auto: {
    how: [
      "Stabilize first. Then glass, battery, and a planned cut path.",
      "One tool, one job. Crib as you cut. Patient first, not a parts contest.",
    ],
    standard: [
      "The vehicle does not move after cribbing is set.",
      "A patient-removal path exists before the first cut.",
    ],
    coaching: [
      "Auto X is slow on purpose. If it looks like a demo derby, stop the drill.",
    ],
  },
  pack: {
    how: [
      "This is a work-capacity day. Brief the course, heat plan, and medical stop rules before anyone walks.",
      "Complete the assigned PACK / arduous test only if medically cleared. Hydrate and cool on a schedule.",
    ],
    standard: [
      "Members who cannot complete it are documented and given a make-up path — not embarrassed on the ramp.",
    ],
    coaching: [
      "Heat emergencies live on the same card for a reason. Watch each other.",
    ],
  },
  night: {
    how: [
      "Run the day's fireground or EVOC objective after dark, with lighting and a spotter.",
      "Accountability is stricter at night. PAR more often. Nobody walks off the pad alone.",
      "AAR before you leave. Night hides sloppy habits.",
    ],
    standard: [
      "Scene lighting is up before tool work starts.",
      "Backing and aerial movement use a ground guide.",
    ],
    coaching: [
      "If you cannot see the coupling, you should not be dragging it. Light the work.",
    ],
  },
  ics: {
    how: [
      "Establish command, assign companies, run a PAR, and transfer command.",
      "Use the radio the way you will on the fire: short, plain, and assigned.",
    ],
    standard: [
      "Every company can repeat its assignment.",
      "A PAR is completed without losing a name.",
    ],
    coaching: DEFAULT.coaching,
  },
};

export function guideFor(topicKey: string): Guide {
  return GUIDES[topicKey] ?? DEFAULT;
}

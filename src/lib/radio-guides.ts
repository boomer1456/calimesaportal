export type RadioGuideLink = {
  kind: "manual" | "video" | "web";
  label: string;
  href: string;
};

export type RadioGuide = {
  id: "bkr5000" | "kng" | "kng2";
  title: string;
  kicker: string;
  teaser: string;
  blurb: string;
  why: string;
  tips: string[];
  links: RadioGuideLink[];
};

/** Manufacturer + FD training. The radio in your pocket and RRU Zone 31 still win. */
export const RADIO_GUIDES: RadioGuide[] = [
  {
    id: "bkr5000",
    title: "BKR 5000",
    kicker: "BK 5000 series",
    teaser: "Current BK portable. Scan and priority live on the soft keys, not the top toggles.",
    blurb:
      "BK Technologies BKR 5000 (often called the BK 5000). VHF 136–174 MHz, P25 analog/digital, glove knobs, color display, loud speaker. Same family as the KNG2 — menus feel familiar, the top of the radio does not.",
    why: "If the radio in your pocket has no scan/priority rockers on top, and a four-position collar under the channel knob, this is the one. What each button does is RRU / house programming — not the brochure.",
    tips: [
      "On/off is the volume knob, clockwise. Beep = it’s up. Set volume around half, then talk-test it.",
      "Mic 1–2 inches off your mouth. PTT down, LED red, TXD (digital) or TXA (analog) on the screen. Let go to listen.",
      "Busy tone / no red LED = receive-only, busy-channel lockout, or a dead battery. Don’t keep mashing PTT.",
      "Time-out timer will dump you mid-sentence. Hear the warning, release, key again.",
      "Channel knob is the channel in this zone. The A/B/C/D collar under it is often the first four zones. ZONE soft key or # is the full list.",
      "Collar under the volume knob locks the keypad. Lock it in the cab so a seatbelt doesn’t change your channel.",
      "Orange button is programmed. On a lot of fire BKs it is Home, not emergency. Confirm on YOUR radio before you mash it on a fire.",
      "Command zone is a scratch pad for this incident: CHAN+ copies the channel you’re on into a command zone; CHAN− takes it back out. It does not rewrite Zone 31.",
      "CAL FIRE OST / tones: TXCG (or the tone pick list) is how you pick the repeater tone. Confirm against the tone card in this tab — the radio will send whatever you leave it on.",
      "Scan is a soft key on this radio, not a top toggle. Build the list (SCN+), then turn scan on. Nuisance-delete the channel that will not shut up; cycling power or leaving the zone puts it back.",
      "Approved battery and antenna only. TX with no antenna will cook the PA. Li-ion in the charger; alkaline clamshell is a wildland spare, not a daily driver if the house issued lithium.",
      "Keypad programming exists. Only punch frequencies you are authorized to use. Default password on a virgin radio is often six zeros — that does not mean you get to play radio tech.",
    ],
    links: [
      {
        kind: "manual",
        label: "BKR 5000 user manual (BK Technologies, Jul 2020)",
        href: "https://www.bktechnologies.com/wp-content/uploads/2020/08/BKR5000_User_Manual_0720.pdf",
      },
      {
        kind: "web",
        label: "BKR 5000 spec sheet (BK, Dec 2025)",
        href: "https://www.bktechnologies.com/wp-content/uploads/2025/12/BKR5000_brochure.pdf",
      },
      {
        kind: "web",
        label: "Getting started — controls, TX/RX, command zone (King Radios)",
        href: "https://kingradios.net/how-to-get-started-with-the-bkr-5000-portable-radio/",
      },
      {
        kind: "video",
        label: "BKR 5000 VHF basics — Rancho Santa Fe Fire (zones, TXCG, command)",
        href: "https://www.youtube.com/watch?v=oDiFBGs12Ag",
      },
      {
        kind: "video",
        label: "BKR 5000 basic user functions — Reno Fire (soft keys, home, top deck)",
        href: "https://www.youtube.com/watch?v=Fas_u1Okp_c",
      },
      {
        kind: "video",
        label: "BKR 5000 walkaround — RANT Strategies (wildland / Bendix King 5000)",
        href: "https://www.youtube.com/watch?v=53TI7E3s68Y",
      },
      {
        kind: "video",
        label: "Keypad programming the BKR 5000 — 49er / BK Technologies",
        href: "https://www.youtube.com/watch?v=GrxxbmU2yfg",
      },
      {
        kind: "video",
        label: "Getting started with the BKR 5000",
        href: "https://www.youtube.com/watch?v=IzzGEu8DrnI",
      },
    ],
  },
  {
    id: "kng",
    title: "KNG-P",
    kicker: "BK KNG series",
    teaser: "The older King portable. Scan and priority are usually the rockers on top.",
    blurb:
      "BK Radio / RELM KNG-P150 (VHF), P400, P500, P800. The radio a lot of engines still issue. P25 conventional, optional trunking. Command version (KNG-P150CMD) has a free-spin channel knob — no 16-position stops.",
    why: "If the top of the radio has scan and priority toggles, and it says KNG-P on the boot screen, this is your book. Same idea as the 5000 — zones, command groups, code guards — different hands.",
    tips: [
      "Volume knob on, beep, display shows the zone and channel. Channel selector is 16 positions on the standard model; CMD models free-spin through the zone.",
      "Top rockers: scan on/off and priority scan on/off. That is the fastest tell you are not on a BKR 5000.",
      "Collar under the volume knob locks the keypad. Leave it locked in the seat.",
      "PTT on the left, talk 1–2 inches off the mic. Red LED + TX on the display. No LED + tone = busy, receive-only, or low battery (LOBATT).",
      "High / low power is often the up-arrow soft key. High to hit a distant repeater; low on the fireground when you can already hear them.",
      "Orange button is programmed. Some houses leave it unused. Do not assume it is emergency.",
      "Build a scan list for this assignment (command, tac, air-to-ground), then flip the scan rocker. Priority channel is the one you cannot afford to miss.",
      "Command zone: same CHAN+ / CHAN− idea as the 5000. Park the incident’s channels in one group so you are not spinning through Zone 31 on the fire.",
      "Monitor opens squelch so you can set volume with no traffic. Don’t leave monitor on or the radio chatters all shift.",
      "Battery tabs into the holes, click. Approved pack only. Backlight-on-all-shift will dump a battery before dinner.",
      "Cloning (KAA0700 cable) copies a programmed radio to another KNG. That is a radio-tech job, not a kitchen-table project.",
      "Do not keypad-program a frequency you are not licensed for. The KNG will happily TX wherever you tell it.",
    ],
    links: [
      {
        kind: "manual",
        label: "KNG-P series user manual (BK Technologies)",
        href: "https://www.bktechnologies.com/service-portal/assets/images/KNG_Owner(REV0210).pdf",
      },
      {
        kind: "manual",
        label: "KNG portable cloning cable KAA0700",
        href: "https://www.bktechnologies.com/service-portal/assets/images/KAA0700_User2.pdf",
      },
      {
        kind: "web",
        label: "All BK Radio manuals (service portal)",
        href: "https://www.bktechnologies.com/service-portal/Manuals/BK-Manuals",
      },
      {
        kind: "video",
        label: "KNG-P150 overview — battery, knobs, scan list",
        href: "https://www.youtube.com/watch?v=i47stYI1qjU",
      },
      {
        kind: "video",
        label: "KNG-P150 basic functions — top deck, lock, power, zone",
        href: "https://www.youtube.com/watch?v=01OX_eXRYos",
      },
      {
        kind: "video",
        label: "KNG-P150 CMD basic operations — NVADG training",
        href: "https://www.youtube.com/watch?v=DWVGUhyL48I",
      },
      {
        kind: "video",
        label: "Field programming the KNG (BKR is similar)",
        href: "https://www.youtube.com/watch?v=qPFiqKmaT00",
      },
    ],
  },
  {
    id: "kng2",
    title: "KNG2",
    kicker: "BK KNG2 series",
    teaser: "Middle generation. Menus like the 5000, body like the KNG. P150 / P400 / P500 / P800.",
    blurb:
      "BK Radio KNG2-P150, P400, P500, P800 (and CMD variants). RELM / BK Technologies. Up to 5,000–8,192 channels, analog + P25, optional trunking (option KZA0579 on the tag under the battery). The radio Reno Fire called “the old BK” when they issued the 5000.",
    why: "If it boots “KNG2-P150” (or P400/P800) this is the book. Hands from the KNG, screen and menus closer to the BKR 5000. Don’t mix the manuals — cloning and option tags are different.",
    tips: [
      "Same daily path as the KNG: volume on, channel knob in the zone, PTT, 1–2 inches off the mic. TXD = digital, TXA = analog.",
      "Options tag is under the battery, near the top of the radio. KZA0579 = P25 trunking. Intrinsically safe and encryption have their own codes. Read the tag before you assume.",
      "Zones can be standard or command. Command zones are the incident scratch pad — CHAN+ in, CHAN− out. Do not add/delete command-zone channels from keypad programming; use CHAN+ / CHAN−.",
      "Channel or zone from the knob, a programmed button, the menu, or punching the number. Zones past 16 are keypad / menu, not the 16-stop knob.",
      "Mixed mode: the radio can hear analog and digital on the same channel. Mixed-mode talkback TX’s in whatever mode just came in while the RX icon is up.",
      "Orange / emergency is programmed. Hold until it beeps and the screen flashes EMERGENCY only if that is how YOUR radio is set. Cycle power or hold again to clear — then tell your officer.",
      "Scan, priority, vote scan, and zone scan are menu / button assignments. They are not always on the top rockers like the original KNG.",
      "User tones / NACs / TGIDs can be a pick list (TXCG, NAC, TGID). On a CAL FIRE assignment that is how you hit the right repeater. Leave it on the tone you were given.",
      "Busy-channel lockout and receive-only channels will refuse PTT with a tone. Switch to a channel you are allowed to talk on.",
      "Approved antenna only (KAA0810G2 / KAA0818 for VHF P150, and the rest in the manual). Bent antenna = replace it, don’t tape it.",
      "Firmware and Radio Editor (RES) are a shop job. Field cloning is a cable and a known-good radio, not a USB stick from the internet.",
    ],
    links: [
      {
        kind: "manual",
        label: "KNG2-P series user manual (BK Technologies, Oct 2018)",
        href: "https://www.bktechnologies.com/service-portal/assets/images/KNG2-P_User_Manual_10-18.pdf",
      },
      {
        kind: "web",
        label: "All BK Radio manuals (service portal)",
        href: "https://www.bktechnologies.com/service-portal/Manuals/BK-Manuals",
      },
      {
        kind: "video",
        label: "BKR 5000 vs KNG2 — Reno Fire (what changed on the 5000)",
        href: "https://www.youtube.com/watch?v=Fas_u1Okp_c",
      },
      {
        kind: "video",
        label: "Keypad programming — applies to KNG, KNG2, and BKR 5000",
        href: "https://www.youtube.com/watch?v=GrxxbmU2yfg",
      },
      {
        kind: "video",
        label: "Field programming the KNG family",
        href: "https://www.youtube.com/watch?v=qPFiqKmaT00",
      },
    ],
  },
];

export const RADIO_GUIDE_BY_ID = Object.fromEntries(
  RADIO_GUIDES.map((g) => [g.id, g]),
) as Record<RadioGuide["id"], RadioGuide>;

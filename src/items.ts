export type ItemKind = "claw" | "pit" | "token";

export type CounterItem = {
  id: string;
  kind: ItemKind;
  name: string;
  cost: number;
  talk: string;
  grip?: number;
  prong?: number;
  valueBonus?: number;
};

export const COUNTER: CounterItem[] = [
  { id: "rubber-tips", kind: "claw", name: "rubber tips", cost: 18, talk: "Stops the glass sliding out.", grip: 0.08 },
  { id: "bent-tine", kind: "claw", name: "bent tine", cost: 22, talk: "Looks worse. Holds better.", grip: 0.1 },
  { id: "second-prong", kind: "claw", name: "second prong", cost: 35, talk: "She ran three tines in '98.", prong: 1 },
  { id: "plush-dump", kind: "pit", name: "plush dump", cost: 16, talk: "Softer pit. Kids like it.", valueBonus: 2 },
  { id: "capsule-rain", kind: "pit", name: "capsule rain", cost: 14, talk: "Cheap and rattly.", valueBonus: 1 },
  { id: "glass-tray", kind: "pit", name: "glass tray", cost: 20, talk: "Pretty. Slippery.", valueBonus: 3 },
  { id: "tin-box", kind: "pit", name: "tin box", cost: 18, talk: "Heavy little cars.", valueBonus: 2 },
  { id: "lucky-token", kind: "token", name: "lucky token", cost: 12, talk: "One round of decent luck.", grip: 0.06 },
  { id: "grease-wipe", kind: "token", name: "grease wipe", cost: 10, talk: "I wiped the tines. Once.", grip: 0.05 },
  { id: "extra-drop", kind: "token", name: "spare drop", cost: 24, talk: "The machine will owe you one." },
  { id: "magnet-chip", kind: "claw", name: "magnet chip", cost: 28, talk: "Helps with the tins.", grip: 0.07 },
  { id: "chalk-mark", kind: "token", name: "chalk mark", cost: 8, talk: "Aim where I marked the glass.", grip: 0.03 },
];

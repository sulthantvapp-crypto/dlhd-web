export type LiveEvent = {
  id: string | number;
  name: string;
  category: string;
  streamUrl?: string;
};

// ഇവിടെ ഫെച്ച് ചെയ്യാതെ തന്നെ നമുക്ക് ആവശ്യമുള്ള ലൈവ് ഇവന്റുകൾ നേരിട്ട് ചേർക്കാം
export const STATIC_LIVE_EVENTS: LiveEvent[] = [
  {
    id: "stream-1",
    name: "Live Match 1 (Example)",
    category: "Live Events"
  },
  {
    id: "stream-2",
    name: "Live Match 2 (Example)",
    category: "Live Events"
  }
];

export function getStaticLiveEvents(): LiveEvent[] {
  return STATIC_LIVE_EVENTS;
}

/**
 * EXAMPLE DATA ONLY — not a source of truth.
 * Cities, hosts, places, hours, needs and moments in this file are invented
 * so the redesign can be clicked through. Do not import this module into
 * life-lived-network. Do not publish these names, photos or hours as real.
 * Discovery stays on src/lib/supply-engine.ts in the canonical app.
 */

export type Tone = "sage" | "sand" | "ink";
export type Category = "Work" | "Experiences" | "Music" | "Food" | "Nature" | "Community";
export type Spend = "free" | "low" | "paid";
export type Company = "solo" | "few" | "lively";

export const FILTERS = ["All", "Work", "Experiences", "Music", "Food", "Nature", "Community", "Stays"] as const;
export type FilterName = (typeof FILTERS)[number];
export type Feel = Category | "Stays";

export type Way = {
  kind: "dropin" | "stay";
  label: string;
  terms: string;
};

export type Listing = {
  id: string;
  cityId: string;
  title: string;
  category: Category;
  image: string;
  neighborhood: string;
  x: number;
  y: number;
  summary: string;
  story: string;
  asked: string;
  when: string;
  hours: number;
  spend: Spend;
  company: Company;
  outdoors: boolean;
  dropIn: boolean;
  featured?: boolean;
  host: { name: string; initials: string; role: string; tone: Tone };
  ways: Way[];
  goodToKnow: string[];
  note: { by: string; text: string };
};

export type City = {
  id: string;
  name: string;
  country: string;
  blurb: string;
  hero: string;
  coords: string;
  terrain: string;
  openIdeas: string[];
};

export type Moment = {
  id: string;
  cityId: string;
  author: string;
  initials: string;
  tone: Tone;
  image: string;
  caption: string;
  place: string;
  when: string;
  listingId: string;
  reply: string;
};

export type SampleNeed = {
  id: string;
  cityId: string;
  title: string;
  when: string;
  from: string;
  detail: string;
};

export const cities: City[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    blurb: "Tiles, river light, rooms that still need hands.",
    hero: "/media/lisbon-view.jpg",
    coords: "38.72° N · 9.14° W",
    terrain: "terrain-lisbon",
    openIdeas: [
      "Take the hill in Alfama with nowhere to be.",
      "One coffee, then the river until the light goes.",
      "Get lost on purpose between two tram bells.",
    ],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    blurb: "Quiet work, tea, and mornings with a rake.",
    hero: "/media/kyoto-moss.jpg",
    coords: "35.01° N · 135.77° E",
    terrain: "terrain-kyoto",
    openIdeas: [
      "Walk a street with no shrine on it.",
      "Sit with tea you bought yourself. That's allowed.",
      "Stop when the city gets quiet. Don't fill the hour.",
    ],
  },
  {
    id: "oaxaca",
    name: "Oaxaca",
    country: "Mexico",
    blurb: "Kitchens, looms, and a ridge before the heat.",
    hero: "/media/oaxaca-kitchen.jpg",
    coords: "17.07° N · 96.72° W",
    terrain: "terrain-oaxaca",
    openIdeas: [
      "Eat one thing standing up. Then nothing else planned.",
      "Find shade and stay there through the hot hour.",
      "Look at the valley without turning it into a task.",
    ],
  },
  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    blurb: "A stoep, a mountain, and room for what comes next.",
    hero: "/media/cape-stoep.jpg",
    coords: "33.93° S · 18.42° E",
    terrain: "terrain-cape",
    openIdeas: [
      "Watch the mountain change color and don't narrate it.",
      "Walk until you can hear the water, then turn around.",
      "Leave the afternoon empty on purpose.",
    ],
  },
];

export const listings: Listing[] = [
  {
    id: "lisbon-view",
    cityId: "lisbon",
    title: "The ridge above the river",
    category: "Nature",
    image: "/media/lisbon-view.jpg",
    neighborhood: "Santa Catarina",
    x: 72,
    y: 30,
    summary: "A walk along the ridge above the Tagus. No script, no group photo.",
    story:
      "Helena starts at the miradouro and walks until the river turns silver. She'll tell you what the ferries actually do, and which hill is worth the extra climb. Then she goes home. You can keep going.",
    asked: "Comfortable shoes. The pace is a conversation, not a workout.",
    when: "Late afternoons",
    hours: 2,
    spend: "free",
    company: "few",
    outdoors: true,
    dropIn: true,
    featured: true,
    host: { name: "Helena Duarte", initials: "HD", role: "Walks the river when she can", tone: "sage" },
    ways: [{ kind: "dropin", label: "Two hours on the ridge", terms: "Free · show up before the light goes" }],
    goodToKnow: ["The meeting corner is shared only after you keep the place.", "It ends while there's still light."],
    note: { by: "Rafael M.", text: "I thought it would be a tour. It was a walk with someone who lives up the hill." },
  },
  {
    id: "lisbon-tiles",
    cityId: "lisbon",
    title: "A cracked panel in Alfama",
    category: "Community",
    image: "/media/lisbon-tiles.jpg",
    neighborhood: "Alfama",
    x: 32,
    y: 44,
    summary: "Help reset a broken azulejo panel. You learn the grout. The wall stays.",
    story:
      "Inês has been repairing this courtyard in pieces for years. Saturday is for one panel, not a renovation. If you stay the week, there's a real bed above the studio and breakfast before the work.",
    asked: "Knees that can be on stone. Clothes you can get lime on.",
    when: "Saturday mornings",
    hours: 2,
    spend: "free",
    company: "few",
    outdoors: false,
    dropIn: true,
    host: { name: "Inês Carvalho", initials: "IC", role: "Keeps a cracked wall honest", tone: "sand" },
    ways: [
      { kind: "dropin", label: "Saturday repair", terms: "Free · materials are already there" },
      { kind: "stay", label: "A week above the studio", terms: "Bed and breakfast · about 4 hours a day" },
    ],
    goodToKnow: ["Nothing is scored. You either come or you don't.", "The exact stair is shared once you both agree."],
    note: { by: "Sofia L.", text: "I came for one panel and stayed for lunch. Nobody performed hospitality." },
  },
  {
    id: "lisbon-fado",
    cityId: "lisbon",
    title: "Four songs, then the door",
    category: "Music",
    image: "/media/lisbon-fado.jpg",
    neighborhood: "Mouraria",
    x: 54,
    y: 58,
    summary: "A living room that becomes a room for four songs. No tickets.",
    story:
      "Tomás opens his door on Thursdays. There is no stage and no set list anywhere online. People stand, someone sings, and it ends before midnight so the street can have itself back.",
    asked: "Arrive quietly. Leave when the last song does.",
    when: "Thursday, after nine",
    hours: 2,
    spend: "free",
    company: "lively",
    outdoors: false,
    dropIn: true,
    host: { name: "Tomás Ribeiro", initials: "TR", role: "Opens his door, not a venue", tone: "ink" },
    ways: [{ kind: "dropin", label: "Thursday room", terms: "Nothing owed · a hat is by the door if you want it" }],
    goodToKnow: ["This is a home. Phones stay in pockets.", "If the room is full, that's the answer."],
    note: { by: "Marta P.", text: "Four songs. I knew none of them. I didn't need to." },
  },
  {
    id: "kyoto-moss",
    cityId: "kyoto",
    title: "Gravel, moss, and a rake",
    category: "Nature",
    image: "/media/kyoto-moss.jpg",
    neighborhood: "Northern hills",
    x: 34,
    y: 36,
    summary: "An hour with a rake in a moss garden. Quiet is the whole point.",
    story:
      "Kenji sweeps at dawn, before anyone is performing a visit. You can take a morning, or stay the week in the machiya and help with the first hour plus one bowl of tea for whoever comes later.",
    asked: "Soft shoes. Very little talking. That's the work.",
    when: "Dawn, a few mornings a week",
    hours: 2,
    spend: "free",
    company: "solo",
    outdoors: true,
    dropIn: true,
    featured: true,
    host: { name: "Kenji Mori", initials: "KM", role: "Sweeps the gravel at dawn", tone: "sage" },
    ways: [
      { kind: "dropin", label: "A dawn hour", terms: "Free · quiet required" },
      { kind: "stay", label: "A week in the machiya", terms: "Room and meals · morning sweep and one bowl of tea" },
    ],
    goodToKnow: ["This is not a class and not a tour.", "The gate code is shared the evening before, or not at all."],
    note: { by: "Hana S.", text: "We barely spoke. The gravel looked the same afterwards. That was the compliment." },
  },
  {
    id: "kyoto-tea",
    cityId: "kyoto",
    title: "One bowl, shoes off",
    category: "Experiences",
    image: "/media/kyoto-tea.jpg",
    neighborhood: "Gion back street",
    x: 60,
    y: 56,
    summary: "One guest, one bowl. Over before noon.",
    story:
      "Aoi doesn't run a counter. Wednesday is a single sitting in the room behind the shop. You learn the order of things by doing them once, not by collecting a certificate.",
    asked: "Be on time. The hour is short on purpose.",
    when: "Wednesday",
    hours: 1,
    spend: "low",
    company: "few",
    outdoors: false,
    dropIn: true,
    host: { name: "Aoi Nishimura", initials: "AN", role: "Makes one bowl at a time", tone: "sand" },
    ways: [{ kind: "dropin", label: "Wednesday sitting", terms: "¥1,500 for the tea · the hour is hers" }],
    goodToKnow: ["The fee is for leaves, not a ticket.", "If you need to leave early, this isn't the hour."],
    note: { by: "Leo K.", text: "I stopped trying to remember the steps and just held the bowl." },
  },
  {
    id: "kyoto-bamboo",
    cityId: "kyoto",
    title: "The path he actually uses",
    category: "Work",
    image: "/media/kyoto-bamboo.jpg",
    neighborhood: "Arashiyama",
    x: 70,
    y: 28,
    summary: "Two hours on the grove path Haruto walks to cut bamboo for whisks.",
    story:
      "The postcard path is crowded by ten. Haruto starts earlier, takes what he needs for the week, and will take one person who wants to carry, not to pose. You finish with dirty hands and a clearer sense of the place.",
    asked: "An early start. A bag you don't mind scratching.",
    when: "Early, by arrangement",
    hours: 2,
    spend: "free",
    company: "few",
    outdoors: true,
    dropIn: true,
    host: { name: "Haruto Sato", initials: "HS", role: "Cuts bamboo for tea whisks", tone: "ink" },
    ways: [{ kind: "dropin", label: "A working walk", terms: "Free · you carry, he cuts" }],
    goodToKnow: ["Not a guided hike. The work sets the pace.", "Closed when the grove is too wet to cut."],
    note: { by: "Naomi T.", text: "We didn't go near the photo spot. I liked the morning more for that." },
  },
  {
    id: "oaxaca-kitchen",
    cityId: "oaxaca",
    title: "Sunday mole, the long way",
    category: "Food",
    image: "/media/oaxaca-kitchen.jpg",
    neighborhood: "Jalatlaco",
    x: 42,
    y: 54,
    summary: "You stir. You eat. You don't get a recipe card.",
    story:
      "Luz cooks mole the way her aunt did: all morning, one pot, people who are willing to toast chilies without narrating it. Stay the week and the bed is real — the exchange is hours in that kitchen, not a performance for guests.",
    asked: "Hands in the work. Appetite at the end. That's the trade.",
    when: "Sundays",
    hours: 3,
    spend: "free",
    company: "few",
    outdoors: false,
    dropIn: true,
    featured: true,
    host: { name: "Luz Hernández", initials: "LH", role: "Cooks mole the long way", tone: "sand" },
    ways: [
      { kind: "dropin", label: "Sunday in the kitchen", terms: "Free · you cook, then you eat" },
      { kind: "stay", label: "A week at the table", terms: "Bed and meals · about 5 hours in the kitchen" },
    ],
    goodToKnow: ["The recipe stays in the room.", "Tell her about allergies before you arrive, not after the pot is on."],
    note: { by: "Andrés G.", text: "I burned one chili and nobody made it a lesson. We just kept going." },
  },
  {
    id: "oaxaca-loom",
    cityId: "oaxaca",
    title: "Red thread, then indigo",
    category: "Work",
    image: "/media/oaxaca-loom.jpg",
    neighborhood: "Teotitlán",
    x: 64,
    y: 36,
    summary: "An afternoon on the loom. Your hands do the repeating part.",
    story:
      "Mateo dyes before he weaves. The afternoon is not a souvenir workshop — it's the slow middle of a textile that already has an owner. You can pay a little for the wool you waste, or trade an hour of something you actually know.",
    asked: "Patience. The interesting part looks like repetition.",
    when: "Weekday afternoons",
    hours: 3,
    spend: "low",
    company: "few",
    outdoors: false,
    dropIn: true,
    host: { name: "Mateo Cruz", initials: "MC", role: "Dyes the thread before he weaves", tone: "ink" },
    ways: [{ kind: "dropin", label: "An afternoon on the loom", terms: "A small wool fee · or an hour of your own skill" }],
    goodToKnow: ["You won't finish a rug. You'll understand one row.", "The road out is shared when the day is set."],
    note: { by: "Camila R.", text: "My hands knew more by evening than any explanation would have done." },
  },
  {
    id: "oaxaca-ridge",
    cityId: "oaxaca",
    title: "Up before the heat",
    category: "Nature",
    image: "/media/oaxaca-ridge.jpg",
    neighborhood: "Monte Albán side",
    x: 28,
    y: 28,
    summary: "The ridge before the buses. Two hours, then back down.",
    story:
      "Itzel leaves while the valley is still blue. She isn't a guide with a flag. If you can keep a quiet pace, she'll take you to the turn she actually uses, and you'll be down again before the stone gets cruel.",
    asked: "Water. A start that feels too early. That's the point.",
    when: "Early mornings",
    hours: 2,
    spend: "free",
    company: "solo",
    outdoors: true,
    dropIn: true,
    host: { name: "Itzel Ramírez", initials: "IR", role: "Walks up before the heat", tone: "sage" },
    ways: [{ kind: "dropin", label: "A dawn ridge", terms: "Free · back before the day gets loud" }],
    goodToKnow: ["This is not the archaeological site entrance.", "If the wind is up, she cancels. The hill will still be there."],
    note: { by: "Diego V.", text: "We barely met anyone else. I could hear my own breath. Rare, here." },
  },
  {
    id: "cape-stoep",
    cityId: "cape-town",
    title: "An hour facing the mountain",
    category: "Nature",
    image: "/media/cape-stoep.jpg",
    neighborhood: "Woodstock",
    x: 58,
    y: 42,
    summary: "Nothing is performed. Kettle, chair, mountain, sea.",
    story:
      "Amina puts the kettle on and sits where the stoep sees both the water and the flat top of the mountain. You can take the hour, or stay the week in the room behind it — mornings shared, afternoons yours. Cape Town doesn't have much else recorded yet. This is the true start, not a placeholder city of inventions.",
    asked: "Show up awake. Don't turn it into content.",
    when: "Most dawns",
    hours: 1,
    spend: "free",
    company: "solo",
    outdoors: true,
    dropIn: true,
    featured: true,
    host: { name: "Amina Jacobs", initials: "AJ", role: "Puts the kettle on, then sits", tone: "sand" },
    ways: [
      { kind: "dropin", label: "Dawn on the stoep", terms: "Free · an hour, then the day is yours" },
      { kind: "stay", label: "A week behind the stoep", terms: "A real room · mornings shared, afternoons yours" },
    ],
    goodToKnow: ["The street is shared after you keep the place.", "If you need a schedule, this will disappoint you in a useful way."],
    note: { by: "Lindiwe K.", text: "I stayed longer than an hour and nobody tried to sell me the rest of the day." },
  },
];

export const moments: Moment[] = [
  {
    id: "m-tiles",
    cityId: "lisbon",
    author: "Inês Carvalho",
    initials: "IC",
    tone: "sand",
    image: "/media/lisbon-tiles.jpg",
    caption: "Reset three cracked panels before lunch. The wall looks like it always did, which is the point.",
    place: "Alfama",
    when: "Saturday",
    listingId: "lisbon-tiles",
    reply: "Sofia L. · Came for one, stayed for the grout under my nails.",
  },
  {
    id: "m-fado",
    cityId: "lisbon",
    author: "Tomás Ribeiro",
    initials: "TR",
    tone: "ink",
    image: "/media/lisbon-fado.jpg",
    caption: "Four songs, the hat, then everyone left through the same blue door.",
    place: "Mouraria",
    when: "Thursday",
    listingId: "lisbon-fado",
    reply: "Marta P. · I knew none of them. I didn't need to.",
  },
  {
    id: "m-moss",
    cityId: "kyoto",
    author: "Kenji Mori",
    initials: "KM",
    tone: "sage",
    image: "/media/kyoto-moss.jpg",
    caption: "Swept the gravel and didn't talk. That was the whole visit.",
    place: "Northern hills",
    when: "Dawn",
    listingId: "kyoto-moss",
    reply: "Hana S. · The garden looked untouched. Good.",
  },
  {
    id: "m-tea",
    cityId: "kyoto",
    author: "Aoi Nishimura",
    initials: "AN",
    tone: "sand",
    image: "/media/kyoto-tea.jpg",
    caption: "One guest, one bowl, shoes off. Finished before noon.",
    place: "Gion back street",
    when: "Wednesday",
    listingId: "kyoto-tea",
    reply: "Leo K. · I stopped trying to memorize it.",
  },
  {
    id: "m-mole",
    cityId: "oaxaca",
    author: "Luz Hernández",
    initials: "LH",
    tone: "sand",
    image: "/media/oaxaca-kitchen.jpg",
    caption: "The mole took all morning. Nobody photographed the recipe.",
    place: "Jalatlaco",
    when: "Sunday",
    listingId: "oaxaca-kitchen",
    reply: "Andrés G. · Burned one chili. We kept going.",
  },
  {
    id: "m-loom",
    cityId: "oaxaca",
    author: "Mateo Cruz",
    initials: "MC",
    tone: "ink",
    image: "/media/oaxaca-loom.jpg",
    caption: "Red thread, then indigo. Hands know more than they did yesterday.",
    place: "Teotitlán",
    when: "Afternoon",
    listingId: "oaxaca-loom",
    reply: "Camila R. · One row. Enough.",
  },
  {
    id: "m-stoep",
    cityId: "cape-town",
    author: "Amina Jacobs",
    initials: "AJ",
    tone: "sand",
    image: "/media/cape-stoep.jpg",
    caption: "Sat until the light hit the water. Didn't open anything else.",
    place: "Woodstock",
    when: "Dawn",
    listingId: "cape-stoep",
    reply: "Lindiwe K. · Stayed longer. Nobody tried to fill it.",
  },
  {
    id: "m-ridge",
    cityId: "oaxaca",
    author: "Itzel Ramírez",
    initials: "IR",
    tone: "sage",
    image: "/media/oaxaca-ridge.jpg",
    caption: "Up and down before the stone got hot. The valley can keep the rest of the day.",
    place: "Monte Albán side",
    when: "Morning",
    listingId: "oaxaca-ridge",
    reply: "Diego V. · Heard my own breath. That was new.",
  },
];

export const sampleNeeds: SampleNeed[] = [
  {
    id: "n-lisbon",
    cityId: "lisbon",
    title: "Someone to look at a leaking terrace door",
    when: "This Thursday",
    from: "Rui Almeida",
    detail: "A small terrace in Graça. I can do the lifting. I need someone who has done a door before.",
  },
  {
    id: "n-kyoto",
    cityId: "kyoto",
    title: "A second pair of hands for a morning of weeding",
    when: "One morning this week",
    from: "Yumiko Abe",
    detail: "Not a tour. A bed of herbs behind the house that got ahead of me.",
  },
  {
    id: "n-oaxaca",
    cityId: "oaxaca",
    title: "Help carrying chairs for a courtyard meal",
    when: "Sunday afternoon",
    from: "Elena Vásquez",
    detail: "An hour of carrying, then you eat if you want. Centro, not a venue.",
  },
  {
    id: "n-cape",
    cityId: "cape-town",
    title: "A person good with a paint roller for two hours",
    when: "Saturday",
    from: "Johan April",
    detail: "One wall in Woodstock. Clothes you can ruin. I'll have the paint.",
  },
];

export function getCity(id: string) {
  return cities.find((city) => city.id === id) ?? cities[0];
}

export function getListing(id: string) {
  return listings.find((listing) => listing.id === id);
}

export function cityListings(cityId: string) {
  return listings.filter((listing) => listing.cityId === cityId);
}

export function matchesFilter(listing: Listing, filter: FilterName) {
  if (filter === "All") return true;
  if (filter === "Stays") return listing.ways.some((way) => way.kind === "stay");
  return listing.category === filter;
}

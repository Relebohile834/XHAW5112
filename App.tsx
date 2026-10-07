import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

/* ---------- THEME ---------- */
const C = {
  green: "#2E7D32",
  blue: "#4FC3F7",
  white: "#FFFFFF",
  dark: "#212121",
  grey: "#F5F7F6",
  line: "#DDE3DF",
};

/* ---------- IMAGES ----------
   Export photos + logo from Figma into /assets, then replace each {} with
   require('./assets/xxx.jpg'). Empty entries show a green block. */
const IMG: Record<string, any> = {
  logo: require("./assets/logo.png"),
  hero: require("./assets/hero.jpg"),
  hiking: require("./assets/guided-hiking.jpg"),
  mountain: require("./assets/mountain-adventure.jpg"),
  outdoor: require("./assets/outdoor-experience.jpg"),
};

/* ---------- DATA ---------- */
type Activity = {
  id: string;
  name: string;
  price: number;
  duration: string;
  level: string;
  tag: string;
  desc: string;
  bring: string[];
  img: string;
};
const ACTIVITIES: Activity[] = [
  {
    id: "hiking",
    name: "Guided Hiking",
    price: 450,
    duration: "4–5 hrs",
    level: "Beginner friendly",
    tag: "Hiking",
    desc: "Follow a guide through fynbos-lined Western Cape trails, with time to pause at viewpoints and enjoy the landscape at an easy, steady pace.",
    bring: [
      "Comfortable walking shoes",
      "1–2 L of water",
      "Sun hat and sunscreen",
    ],
    img: "hiking",
  },
  {
    id: "mountain",
    name: "Mountain Adventure",
    price: 850,
    duration: "Full day",
    level: "Intermediate",
    tag: "Mountain",
    desc: "Take on a full-day route across mountain terrain, combining sustained climbs, open ridgelines and rewarding viewpoints for active hikers.",
    bring: [
      "Grippy hiking shoes",
      "2 L of water and lunch",
      "Warm, windproof layer",
    ],
    img: "mountain",
  },
  {
    id: "outdoor",
    name: "Outdoor Experience",
    price: 550,
    duration: "Half day",
    level: "All levels",
    tag: "Family",
    desc: "Enjoy a relaxed half-day escape through forest and open landscapes, designed for families, first-time explorers and anyone reconnecting with nature.",
    bring: [
      "Closed walking shoes",
      "Water and a light snack",
      "Weather-ready layers",
    ],
    img: "outdoor",
  },
];
const ADDONS = [
  {
    id: "photo",
    name: "Photography pack",
    note: "One digital photo pack",
    price: 250,
    perPerson: false,
  },
  {
    id: "lunch",
    name: "Picnic lunch",
    note: "R180 pp",
    price: 180,
    perPerson: true,
  },
  {
    id: "transport",
    name: "Transport",
    note: "Return shared transfer",
    price: 300,
    perPerson: false,
  },
];
const PACKAGES = [
  {
    name: "Family Trail Duo",
    save: "SAVE 5%",
    desc: "Two easy-going escapes",
    items: ["Guided Hiking", "Outdoor Experience"],
    price: 950,
    img: "hiking",
  },
  {
    name: "Cape Explorer Trio",
    save: "SAVE 10%",
    desc: "The complete adventure set",
    items: ["Guided Hiking", "Mountain Adventure", "Outdoor Experience"],
    price: 1665,
    img: "mountain",
  },
];

/* ---------- FEE LOGIC (same rule as the website: discount on full subtotal) ---------- */
const rateFor = (n: number) =>
  n >= 4 ? 0.15 : n === 3 ? 0.1 : n === 2 ? 0.05 : 0;
const money = (n: number) =>
  "R" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
type Quote = {
  lines: { label: string; amount: number }[];
  subtotal: number;
  rate: number;
  discount: number;
  total: number;
  people: number;
  activities: string[];
};
function buildQuote(actIds: string[], people: number, addIds: string[]): Quote {
  const lines: Quote["lines"] = [];
  ACTIVITIES.filter((a) => actIds.includes(a.id)).forEach((a) =>
    lines.push({
      label: `${a.name} (${people} × R${a.price})`,
      amount: a.price * people,
    }),
  );
  ADDONS.filter((a) => addIds.includes(a.id)).forEach((a) =>
    lines.push({
      label: a.perPerson ? `${a.name} × ${people}` : a.name,
      amount: a.perPerson ? a.price * people : a.price,
    }),
  );
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const rate = rateFor(actIds.length);
  const discount = subtotal * rate;
  return {
    lines,
    subtotal,
    rate,
    discount,
    total: subtotal - discount,
    people,
    activities: ACTIVITIES.filter((a) => actIds.includes(a.id)).map(
      (a) => a.name,
    ),
  };
}

/* ---------- SMALL COMPONENTS ---------- */
const Photo = ({ k, style }: { k: string; style: any }) =>
  IMG[k] ? (
    <Image source={IMG[k]} style={style} resizeMode="cover" />
  ) : (
    <View style={[style, { backgroundColor: C.green }]} />
  );

const Btn = ({
  label,
  onPress,
  outline,
  disabled,
}: {
  label: string;
  onPress: () => void;
  outline?: boolean;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={[s.btn, outline && s.btnOutline, disabled && { opacity: 0.5 }]}
  >
    <Text style={[s.btnText, outline && { color: C.green }]}>{label}</Text>
  </TouchableOpacity>
);

const Field = ({
  label,
  ...p
}: { label: string } & React.ComponentProps<typeof TextInput>) => (
  <View style={{ marginTop: 12 }}>
    <Text style={s.label}>{label}</Text>
    <TextInput
      style={[s.input, p.multiline && { height: 90, textAlignVertical: "top" }]}
      placeholderTextColor="#8a948d"
      {...p}
    />
  </View>
);

const Header = ({
  title,
  sub,
  onBack,
}: {
  title: string;
  sub?: string;
  onBack?: () => void;
}) => (
  <View style={s.header}>
    {onBack && (
      <TouchableOpacity
        onPress={onBack}
        accessibilityLabel="Go back"
        style={s.backBtn}
      >
        <Ionicons name="arrow-back" size={20} color={C.dark} />
      </TouchableOpacity>
    )}
    <View style={{ flex: 1 }}>
      <Text style={s.headerTitle}>{title}</Text>
      {sub ? <Text style={s.small}>{sub}</Text> : null}
    </View>
    {IMG.logo ? (
      <Image
        source={IMG.logo}
        style={{ width: 44, height: 44 }}
        resizeMode="contain"
      />
    ) : null}
  </View>
);

/* ---------- NAVIGATION ---------- */
type Route = { name: string; id?: string };
const TABS = [
  { name: "home", label: "Home", icon: "home-outline" },
  { name: "activities", label: "Activities", icon: "triangle-outline" },
  { name: "fees", label: "Fees", icon: "calculator-outline" },
  { name: "contact", label: "Contact", icon: "mail-outline" },
] as const;
const tabFor = (n: string) =>
  n === "home" || n === "about"
    ? "home"
    : n === "fees" || n === "quotation" || n === "booking"
      ? "fees"
      : n === "contact"
        ? "contact"
        : "activities";

/* ---------- SCREENS ---------- */
type Nav = { go: (r: Route) => void; back: () => void };

function Splash() {
  return (
    <LinearGradient colors={[C.green, C.blue]} style={[s.center, { flex: 1 }]}>
      <View style={s.splashCard}>
        {IMG.logo ? (
          <Image
            source={IMG.logo}
            style={{ width: 220, height: 220 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={[s.h1, { textAlign: "center" }]}>
            Adventure Escape SA
          </Text>
        )}
      </View>
      <Text style={{ color: C.white, marginTop: 16 }}>
        Explore • Discover • Experience
      </Text>
    </LinearGradient>
  );
}

const ActivityCard = ({ a, nav }: { a: Activity; nav: Nav }) => (
  <View style={s.card}>
    <Photo k={a.img} style={{ height: 130 }} />
    <View style={{ padding: 16 }}>
      <Text style={s.h3}>{a.name}</Text>
      <Text style={s.price}>R{a.price} pp</Text>
      <Text style={s.small}>
        {a.duration} • {a.level}
      </Text>
      <Btn
        outline
        label="View Details"
        onPress={() => nav.go({ name: "detail", id: a.id })}
      />
    </View>
  </View>
);

function Home({ nav }: { nav: Nav }) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <View
        style={{ alignItems: "center", padding: 12, backgroundColor: C.white }}
      >
        {IMG.logo ? (
          <Image
            source={IMG.logo}
            style={{ width: 110, height: 90 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={s.h3}>Adventure Escape SA</Text>
        )}
      </View>
      <View>
        <Photo k="hero" style={{ height: 190 }} />
        <View style={s.heroOverlay}>
          <Text style={{ color: C.blue, fontSize: 12 }}>
            WESTERN CAPE • SOUTH AFRICA
          </Text>
          <Text style={s.heroTitle}>Explore the outdoors</Text>
          <View style={{ width: 140 }}>
            <Btn
              label="Explore"
              onPress={() => nav.go({ name: "activities" })}
            />
          </View>
        </View>
      </View>
      <View style={s.pad}>
        <Text style={s.h2}>Featured Activities</Text>
        {ACTIVITIES.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={s.rowCard}
            onPress={() => nav.go({ name: "detail", id: a.id })}
          >
            <Text style={s.h3}>{a.name}</Text>
            <Text style={s.small}>
              {a.duration} • {a.level}
            </Text>
            <Text style={s.price}>R{a.price} pp</Text>
          </TouchableOpacity>
        ))}
        <Btn
          outline
          label="Packages & specials"
          onPress={() => nav.go({ name: "packages" })}
        />
        <Btn
          outline
          label="About us"
          onPress={() => nav.go({ name: "about" })}
        />
      </View>
    </ScrollView>
  );
}

function About({ nav }: { nav: Nav }) {
  const team = [
    { r: "Trail guiding", k: "hiking" },
    { r: "Adventure planning", k: "mountain" },
    { r: "Guest support", k: "outdoor" },
  ];
  return (
    <View style={{ flex: 1 }}>
      <Header title="About us" onBack={nav.back} />
      <ScrollView contentContainerStyle={s.pad}>
        <Photo k="hero" style={{ height: 130, borderRadius: 12 }} />
        <Text style={[s.h2, { marginTop: 16 }]}>Rooted in adventure</Text>
        <Text style={s.body}>
          Founded in 2024 by Liam Daniels, Adventure Escape SA grew from a
          passion for outdoor adventure and eco-tourism. We offer guided
          experiences in the Western Cape for all ages and ability levels.
        </Text>
        <View style={s.mission}>
          <Text style={s.h3}>Our mission</Text>
          <Text style={s.body}>
            Make adventure accessible, encourage responsible eco-tourism and
            help people connect with nature.
          </Text>
        </View>
        <Text style={s.h2}>The people behind the journey</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {team.map((t) => (
            <View key={t.r} style={[s.card, { flex: 1 }]}>
              <Photo k={t.k} style={{ height: 70 }} />
              <Text
                style={[
                  s.small,
                  { padding: 8, color: C.green, fontWeight: "600" },
                ]}
              >
                {t.r}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Activities({ nav }: { nav: Nav }) {
  const [f, setF] = useState("All");
  const list = ACTIVITIES.filter((a) => f === "All" || a.tag === f);
  return (
    <View style={{ flex: 1 }}>
      <Header title="Activities" />
      <ScrollView contentContainerStyle={s.pad}>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {["All", "Hiking", "Mountain", "Family"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setF(t)}
              style={[s.chip, f === t && { backgroundColor: C.green }]}
            >
              <Text
                style={{ color: f === t ? C.white : C.dark, fontWeight: "600" }}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {list.map((a) => (
          <ActivityCard key={a.id} a={a} nav={nav} />
        ))}
      </ScrollView>
    </View>
  );
}

function Detail({ id, nav }: { id?: string; nav: Nav }) {
  const a = ACTIVITIES.find((x) => x.id === id) ?? ACTIVITIES[0];
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <Photo k={a.img} style={{ height: 200 }} />
          <TouchableOpacity
            onPress={nav.back}
            accessibilityLabel="Go back"
            style={[
              s.backBtn,
              {
                position: "absolute",
                top: 12,
                left: 12,
                backgroundColor: C.white,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={20} color={C.dark} />
          </TouchableOpacity>
          <View style={s.badge}>
            <Text style={s.badgeText}>{a.level.toUpperCase()}</Text>
          </View>
        </View>
        <View style={s.pad}>
          <View style={s.spread}>
            <Text style={s.h2}>{a.name}</Text>
            <Text style={s.priceBig}>R{a.price} pp</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginVertical: 8 }}>
            {[
              ["Duration", a.duration],
              ["Difficulty", a.level],
              ["Group size", "Max 12"],
            ].map(([k, v]) => (
              <View key={k} style={s.info}>
                <Text style={{ fontWeight: "600", fontSize: 12 }}>{v}</Text>
                <Text style={s.small}>{k}</Text>
              </View>
            ))}
          </View>
          <Text style={s.h3}>About this adventure</Text>
          <Text style={s.body}>{a.desc}</Text>
          <Text style={[s.h3, { marginTop: 12 }]}>What to bring</Text>
          {a.bring.map((b) => (
            <View
              key={b}
              style={{ flexDirection: "row", gap: 8, marginTop: 6 }}
            >
              <Ionicons name="checkmark-circle" size={18} color={C.green} />
              <Text>{b}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={s.stickyBar}>
        <Btn label="Book Now" onPress={() => nav.go({ name: "fees" })} />
      </View>
    </View>
  );
}

function Packages({ nav }: { nav: Nav }) {
  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Packages & specials"
        sub="Bundle more. Explore for less."
        onBack={nav.back}
      />
      <ScrollView contentContainerStyle={s.pad}>
        <View style={s.banner}>
          <Text style={s.seasonTag}>SEASONAL SPECIAL</Text>
          <Text style={s.heroTitle}>Summer Family Escape</Text>
          <Text style={{ color: C.white, fontWeight: "600" }}>
            Up to 15% off multi-activity bookings
          </Text>
        </View>
        <Text style={[s.h2, { marginTop: 16 }]}>Choose your escape</Text>
        {PACKAGES.map((p) => (
          <View key={p.name} style={[s.card, { flexDirection: "row" }]}>
            <Photo k={p.img} style={{ width: 100 }} />
            <View style={{ flex: 1, padding: 12 }}>
              <View style={s.spread}>
                <Text style={[s.h3, { flex: 1 }]}>{p.name}</Text>
                <Text style={s.seasonTag}>{p.save}</Text>
              </View>
              <Text style={s.small}>{p.desc}</Text>
              {p.items.map((i) => (
                <Text key={i} style={{ fontSize: 13, marginTop: 2 }}>
                  ✓ {i}
                </Text>
              ))}
              <Text style={[s.price, { textAlign: "right" }]}>
                {money(p.price).replace(".00", "")} pp
              </Text>
            </View>
          </View>
        ))}
        <Btn label="Calculate Fees" onPress={() => nav.go({ name: "fees" })} />
      </ScrollView>
    </View>
  );
}

function Fees({ nav, onQuote }: { nav: Nav; onQuote: (q: Quote) => void }) {
  const [acts, setActs] = useState<string[]>(["hiking", "outdoor"]);
  const [people, setPeople] = useState(2);
  const [adds, setAdds] = useState<string[]>(["photo", "lunch", "transport"]);
  const toggle = (arr: string[], set: (v: string[]) => void, id: string) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  const q = buildQuote(acts, people, adds);
  return (
    <View style={{ flex: 1 }}>
      <Header title="Calculate fees" sub="Build a live trip estimate" />
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.h3}>Activities</Text>
        {ACTIVITIES.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={s.option}
            onPress={() => toggle(acts, setActs, a.id)}
          >
            <Ionicons
              name={acts.includes(a.id) ? "checkbox" : "square-outline"}
              size={22}
              color={C.green}
            />
            <Text style={{ flex: 1 }}>{a.name}</Text>
            <Text style={s.small}>R{a.price} pp</Text>
          </TouchableOpacity>
        ))}
        <Text style={s.small}>
          {acts.length} activit{acts.length === 1 ? "y" : "ies"} selected •{" "}
          {Math.round(q.rate * 100)}% multi-activity discount
        </Text>
        <View style={[s.spread, s.option, { marginTop: 12 }]}>
          <View>
            <Text style={{ fontWeight: "600" }}>Participants</Text>
            <Text style={s.small}>Pricing is per person</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <TouchableOpacity
              accessibilityLabel="Fewer participants"
              style={s.step}
              onPress={() => setPeople(Math.max(1, people - 1))}
            >
              <Text style={s.stepText}>−</Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: "700", fontSize: 16 }}>{people}</Text>
            <TouchableOpacity
              accessibilityLabel="More participants"
              style={s.step}
              onPress={() => setPeople(Math.min(12, people + 1))}
            >
              <Text style={s.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[s.h3, { marginTop: 12 }]}>Add-ons</Text>
        {ADDONS.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={s.option}
            onPress={() => toggle(adds, setAdds, a.id)}
          >
            <Ionicons
              name={adds.includes(a.id) ? "checkbox" : "square-outline"}
              size={22}
              color={C.green}
            />
            <View style={{ flex: 1 }}>
              <Text>{a.name}</Text>
              <Text style={s.small}>{a.note}</Text>
            </View>
            <Text style={s.small}>
              {money(a.perPerson ? a.price * people : a.price)}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={s.totalCard}>
          <View style={s.spread}>
            <Text style={{ color: C.white }}>Subtotal</Text>
            <Text style={{ color: C.white }}>{money(q.subtotal)}</Text>
          </View>
          <View style={s.spread}>
            <Text style={{ color: C.white }}>
              Discount ({Math.round(q.rate * 100)}%)
            </Text>
            <Text style={{ color: C.white }}>− {money(q.discount)}</Text>
          </View>
          <View style={[s.spread, { marginTop: 6 }]}>
            <Text style={s.totalLabel}>Estimated total</Text>
            <Text style={s.totalLabel}>{money(q.total)}</Text>
          </View>
        </View>
        <Btn
          label="Get Quotation"
          disabled={acts.length === 0}
          onPress={() => {
            onQuote(q);
            nav.go({ name: "quotation" });
          }}
        />
      </ScrollView>
    </View>
  );
}

function Quotation({ q, nav }: { q: Quote | null; nav: Nav }) {
  if (!q)
    return (
      <View style={{ flex: 1 }}>
        <Header title="Quotation summary" onBack={nav.back} />
        <View style={s.pad}>
          <Text style={s.body}>
            No quotation yet. Use Calculate Fees to build one.
          </Text>
          <Btn
            label="Calculate Fees"
            onPress={() => nav.go({ name: "fees" })}
          />
        </View>
      </View>
    );
  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Quotation summary"
        sub="Review your adventure estimate"
        onBack={nav.back}
      />
      <ScrollView contentContainerStyle={s.pad}>
        <View style={s.quoteTag}>
          <Text style={s.small}>QUOTATION AES-1024</Text>
          <Text style={s.small}>Valid for 7 days</Text>
        </View>
        <View style={s.card}>
          <View style={{ padding: 16 }}>
            {q.lines.map((l) => (
              <View key={l.label} style={[s.spread, { paddingVertical: 5 }]}>
                <Text style={{ flex: 1 }}>{l.label}</Text>
                <Text style={{ fontWeight: "600" }}>{money(l.amount)}</Text>
              </View>
            ))}
            <View style={[s.spread, s.divider]}>
              <Text>Subtotal</Text>
              <Text>{money(q.subtotal)}</Text>
            </View>
            <View style={s.spread}>
              <Text style={{ color: C.green }}>
                Multi-activity discount ({Math.round(q.rate * 100)}%)
              </Text>
              <Text style={{ color: C.green }}>− {money(q.discount)}</Text>
            </View>
            <View style={[s.spread, { marginTop: 8 }]}>
              <Text style={s.h3}>Total</Text>
              <Text style={s.priceBig}>{money(q.total)}</Text>
            </View>
          </View>
        </View>
        <Btn
          label="Request Booking"
          onPress={() => nav.go({ name: "booking" })}
        />
      </ScrollView>
    </View>
  );
}

function Booking({ q, nav }: { q: Quote | null; nav: Nav }) {
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    notes: "",
  });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const submit = () => {
    if (
      !f.name.trim() ||
      !/\S+@\S+\.\S+/.test(f.email) ||
      !f.phone.trim() ||
      !f.date.trim()
    ) {
      setErr(
        "Please fill in your name, a valid email, phone number and preferred date.",
      );
      return;
    }
    setErr("");
    setSent(true);
  };
  if (sent)
    return (
      <View style={{ flex: 1 }}>
        <Header title="Booking request" sub="Request received" />
        <ScrollView contentContainerStyle={s.pad}>
          <View style={[s.card, { padding: 20, alignItems: "center" }]}>
            <Ionicons name="checkmark-circle" size={64} color={C.green} />
            <Text style={[s.h1, { color: C.green }]}>Request sent!</Text>
            <Text style={[s.body, { textAlign: "center" }]}>
              Thanks for choosing Adventure Escape SA. We'll review your
              preferred date and reply within one business day.
            </Text>
            <View style={s.quoteTag}>
              <Text style={s.small}>Booking reference</Text>
              <Text style={{ fontWeight: "700" }}>AE-2026-0142</Text>
            </View>
          </View>
          <Btn
            label="View Activities"
            onPress={() => nav.go({ name: "activities" })}
          />
          <Btn
            outline
            label="Back to Home"
            onPress={() => nav.go({ name: "home" })}
          />
        </ScrollView>
      </View>
    );
  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Booking request"
        sub="Confirm your adventure details"
        onBack={nav.back}
      />
      <ScrollView
        contentContainerStyle={s.pad}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.quoteTag}>
          <Text style={s.small}>AES-1024</Text>
          <Text style={{ color: C.green, fontWeight: "700" }}>
            {q ? money(q.total) : "No quotation"} estimate
          </Text>
        </View>
        <Field
          label="Full name *"
          placeholder="e.g. Alex Daniels"
          value={f.name}
          onChangeText={(v) => setF({ ...f, name: v })}
        />
        <Field
          label="Email address *"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={f.email}
          onChangeText={(v) => setF({ ...f, email: v })}
        />
        <Field
          label="Phone number *"
          placeholder="+27 82 123 4567"
          keyboardType="phone-pad"
          value={f.phone}
          onChangeText={(v) => setF({ ...f, phone: v })}
        />
        <Field
          label="Preferred date *"
          placeholder="DD / MM / YYYY"
          value={f.date}
          onChangeText={(v) => setF({ ...f, date: v })}
        />
        <Field
          label="Notes"
          multiline
          placeholder="Tell us about your activity choice, ability level or special requirements."
          value={f.notes}
          onChangeText={(v) => setF({ ...f, notes: v })}
        />
        {err ? (
          <Text style={{ color: "#C62828", marginTop: 8 }}>{err}</Text>
        ) : null}
        <Btn label="Submit Request" onPress={submit} />
      </ScrollView>
    </View>
  );
}

function Contact() {
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const send = () => {
    if (!f.name.trim() || !/\S+@\S+\.\S+/.test(f.email) || !f.msg.trim()) {
      setErr("Enter your name, a valid email and a message.");
      return;
    }
    setErr("");
    setDone(true);
  };
  return (
    <View style={{ flex: 1 }}>
      <Header title="Contact us" sub="We're here to help you plan" />
      <ScrollView
        contentContainerStyle={s.pad}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.h2}>Let's talk adventure</Text>
        <TouchableOpacity
          style={[
            s.btn,
            { flexDirection: "row", gap: 10, justifyContent: "flex-start" },
          ]}
          onPress={() => Linking.openURL("tel:+27215550100")}
        >
          <Ionicons name="call-outline" size={20} color={C.white} />
          <Text style={s.btnText}>Tap to call +27 21 555 0100</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            s.btn,
            s.btnOutline,
            { flexDirection: "row", gap: 10, justifyContent: "flex-start" },
          ]}
          onPress={() => Linking.openURL("mailto:info@adventureescape.co.za")}
        >
          <Ionicons name="mail-outline" size={20} color={C.green} />
          <Text style={[s.btnText, { color: C.green }]}>
            info@adventureescape.co.za
          </Text>
        </TouchableOpacity>
        <View style={s.mission}>
          <Text style={s.h3}>Find us</Text>
          <Text style={s.body}>Western Cape, South Africa</Text>
        </View>
        <Text style={s.h3}>Send a message</Text>
        <Field
          label="Name *"
          placeholder="Your full name"
          value={f.name}
          onChangeText={(v) => setF({ ...f, name: v })}
        />
        <Field
          label="Email *"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={f.email}
          onChangeText={(v) => setF({ ...f, email: v })}
        />
        <Field
          label="Message *"
          multiline
          placeholder="How can we help with your next adventure?"
          value={f.msg}
          onChangeText={(v) => setF({ ...f, msg: v })}
        />
        {err ? (
          <Text style={{ color: "#C62828", marginTop: 8 }}>{err}</Text>
        ) : null}
        {done ? (
          <View style={s.mission}>
            <Text style={s.body}>
              Thanks, your message was received. We usually reply within one
              business day.
            </Text>
          </View>
        ) : null}
        <Btn label="Send Message" onPress={send} />
      </ScrollView>
    </View>
  );
}

/* ---------- APP ---------- */
export default function App() {
  const [stack, setStack] = useState<Route[]>([{ name: "splash" }]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const route = stack[stack.length - 1];

  useEffect(() => {
    const t = setTimeout(() => setStack([{ name: "home" }]), 1800);
    return () => clearTimeout(t);
  }, []);

  const nav: Nav = {
    go: (r) =>
      setStack(TABS.some((t) => t.name === r.name) ? [r] : [...stack, r]),
    back: () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)),
  };

  let screen: React.ReactNode;
  switch (route.name) {
    case "splash":
      return <Splash />;
    case "home":
      screen = <Home nav={nav} />;
      break;
    case "about":
      screen = <About nav={nav} />;
      break;
    case "activities":
      screen = <Activities nav={nav} />;
      break;
    case "detail":
      screen = <Detail id={route.id} nav={nav} />;
      break;
    case "packages":
      screen = <Packages nav={nav} />;
      break;
    case "fees":
      screen = <Fees nav={nav} onQuote={setQuote} />;
      break;
    case "quotation":
      screen = <Quotation q={quote} nav={nav} />;
      break;
    case "booking":
      screen = <Booking q={quote} nav={nav} />;
      break;
    default:
      screen = <Contact />;
  }
  const active = tabFor(route.name);

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>{screen}</View>
      <View style={s.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.name}
            accessibilityRole="button"
            accessibilityLabel={t.label}
            style={s.tab}
            onPress={() => nav.go({ name: t.name })}
          >
            <View
              style={[
                s.tabIcon,
                active === t.name && { backgroundColor: "#E3F1E4" },
              ]}
            >
              <Ionicons
                name={t.icon}
                size={22}
                color={active === t.name ? C.green : C.dark}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                color: active === t.name ? C.green : C.dark,
                fontWeight: active === t.name ? "700" : "400",
              }}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.grey,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  center: { alignItems: "center", justifyContent: "center" },
  pad: { padding: 16, gap: 12 },
  spread: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  h1: { fontSize: 24, fontWeight: "700", color: C.green, marginTop: 8 },
  h2: { fontSize: 20, fontWeight: "700", color: C.green },
  h3: { fontSize: 16, fontWeight: "700", color: C.green },
  body: { fontSize: 14, lineHeight: 21, color: C.dark },
  small: { fontSize: 12, color: "#5f6b63" },
  price: { fontSize: 16, fontWeight: "700", color: C.green, marginVertical: 4 },
  priceBig: { fontSize: 20, fontWeight: "700", color: C.green },
  btn: {
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.green,
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnOutline: { backgroundColor: C.white },
  btnText: { color: C.white, fontWeight: "600", fontSize: 14 },
  label: { fontWeight: "600", fontSize: 14, marginBottom: 4, color: C.dark },
  input: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: "#b8c0ba",
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 12,
    color: C.dark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.white,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: C.green },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: C.grey,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#212121",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  rowCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
  },
  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "rgba(10,40,20,0.55)",
  },
  heroTitle: {
    color: C.white,
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 6,
  },
  mission: {
    backgroundColor: C.white,
    borderLeftWidth: 4,
    borderLeftColor: C.blue,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  info: {
    flex: 1,
    backgroundColor: C.grey,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.line,
  },
  badge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: C.blue,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: C.dark },
  stickyBar: {
    padding: 12,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  banner: { backgroundColor: "#1d4a25", borderRadius: 12, padding: 16 },
  seasonTag: {
    alignSelf: "flex-start",
    backgroundColor: C.blue,
    color: C.dark,
    fontSize: 11,
    fontWeight: "700",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.line,
    padding: 12,
    marginTop: 8,
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E3F1E4",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { fontSize: 20, color: C.green, fontWeight: "700" },
  totalCard: {
    backgroundColor: C.green,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  totalLabel: { color: C.white, fontSize: 18, fontWeight: "700" },
  quoteTag: {
    backgroundColor: "#E6F4FB",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: C.line,
    marginTop: 8,
    paddingTop: 8,
  },
  splashCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingVertical: 6,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  tabIcon: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 14 },
});

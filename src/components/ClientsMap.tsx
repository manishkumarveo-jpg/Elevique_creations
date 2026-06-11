"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import "@/styles/clients-map.css";

/* ─────────────────────────────────────────────────────────────────
   ✏️  CLIENTS — swap in your real data here
   ───────────────────────────────────────────────────────────────── */
const CLIENTS = [
  { match: "delhi",       name: "Vantage Media",    city: "New Delhi",  state: "Delhi",         since: "2021" },
  { match: "rajasthan",   name: "Forge Labs",        city: "Jaipur",     state: "Rajasthan",     since: "2022" },
  { match: "bengal",      name: "Meridian Co.",      city: "Kolkata",    state: "West Bengal",   since: "2020" },
  { match: "maharashtra", name: "Atlas Group",       city: "Mumbai",     state: "Maharashtra",   since: "2019" },
  { match: "tamil",       name: "Nimbus AI",         city: "Chennai",    state: "Tamil Nadu",    since: "2023" },
  { match: "karnataka",   name: "Apex Digital",      city: "Bengaluru",  state: "Karnataka",     since: "2022" },
  { match: "telangana",   name: "Horizon Tech",      city: "Hyderabad",  state: "Telangana",     since: "2023" },
  { match: "gujarat",     name: "BlueSky Ventures",  city: "Ahmedabad",  state: "Gujarat",       since: "2024" },
  { match: "haryana",     name: "FinLease",          city: "Gurugram",   state: "Haryana",       since: "2021" },
  { match: "uttar pradesh", name: "Zephyr Studios",  city: "Noida",      state: "Uttar Pradesh", since: "2023" },
  { match: "kerala",      name: "Vortex Labs",       city: "Kochi",      state: "Kerala",        since: "2022" },
  { match: "punjab",      name: "Pinnacle Corp",     city: "Chandigarh", state: "Punjab",        since: "2021" },
  { match: "goa",         name: "Aura Design Studio",city: "Panaji",     state: "Goa",           since: "2024" },
  { match: "madhya",      name: "Nova Syndicate",    city: "Indore",     state: "Madhya Pradesh",since: "2023" },
  { match: "odisha",      name: "Prism Enterprise",  city: "Bhubaneswar",state: "Odisha",        since: "2023" },
  { match: "assam",       name: "Zenith Holdings",   city: "Guwahati",   state: "Assam",         since: "2022" },
  { match: "bihar",       name: "Elysian Media",     city: "Patna",      state: "Bihar",         since: "2022" },
  { match: "andhra",      name: "Summit Capital",    city: "Visakhapatnam", state: "Andhra Pradesh", since: "2021" },
  { match: "tamil",       name: "Apex Labs",         city: "Coimbatore", state: "Tamil Nadu",    since: "2024" },
] as const;

/* ─────────────────────────────────────────────────────────────────
   MAP SOURCE
   ───────────────────────────────────────────────────────────────── */
const TOPO_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/topojson/india.json";

const VIEWBOX_W = 1000;
const VIEWBOX_H = 1080;

/* deterministic subtle state fill */
const BASE_FILLS = ["#060608", "#08080a", "#050507"];
function hashFill(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return BASE_FILLS[h % BASE_FILLS.length];
}

/* ─────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────── */
type Client = (typeof CLIENTS)[number];
interface StateFeature {
  type: "Feature";
  properties: { st_nm: string };
  geometry: GeoJSON.Geometry;
}
interface Tooltip { x: number; y: number; client: Client }

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────────── */
export default function ClientsMap() {
  const totalClients = CLIENTS.length;
  const clientCountStr = totalClients < 10 ? `0${totalClients}+` : `${totalClients}+`;

  const svgRef       = useRef<SVGSVGElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const [states,  setStates]  = useState<StateFeature[]>([]);
  const [countryOutline, setCountryOutline] = useState<GeoJSON.Geometry | null>(null);
  const [markers, setMarkers] = useState<{ client: Client; cx: number; cy: number }[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [noMotion, setNoMotion] = useState(false);
  const [focused,  setFocused]  = useState<number | null>(null);

  /* prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const matches = mq.matches;
    Promise.resolve().then(() => {
      setNoMotion(matches);
    });
    const h = (e: MediaQueryListEvent) => setNoMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* fetch TopoJSON → dissolve districts → state features */
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const topo = (await (await fetch(TOPO_URL)).json()) as Topology;
        const key  = Object.keys(topo.objects)[0];
        const col  = topo.objects[key] as GeometryCollection<{ st_nm: string }>;

        const groups = new Map<string, typeof col.geometries>();
        for (const g of col.geometries) {
          const nm = (g.properties as { st_nm?: string } | null)?.st_nm ?? "Unknown";
          if (!groups.has(nm)) groups.set(nm, []);
          groups.get(nm)!.push(g);
        }

        const features: StateFeature[] = [];
        groups.forEach((geoms, nm) => {
          features.push({
            type: "Feature",
            properties: { st_nm: nm },
            geometry: topojson.merge(topo, geoms as Parameters<typeof topojson.merge>[1]),
          });
        });

        const dissolvedCountry = topojson.merge(topo, col.geometries as Parameters<typeof topojson.merge>[1]);

        if (!dead) {
          setStates(features);
          setCountryOutline(dissolvedCountry);
        }
      } catch (e) {
        console.error("ClientsMap: fetch failed", e);
      }
    })();
    return () => { dead = true; };
  }, []);

  /* render SVG paths + compute centroids */
  useEffect(() => {
    if (!states.length || !svgRef.current) return;

    const fc: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: states };
    const proj = d3Geo.geoMercator().fitExtent([[44, 44], [VIEWBOX_W - 44, VIEWBOX_H - 64]], fc);
    const path = d3Geo.geoPath().projection(proj);

    const g = svgRef.current.querySelector(".cm-paths")!;
    g.innerHTML = "";

    const newMarkers: typeof markers = [];

    states.forEach((feat) => {
      const nm  = feat.properties.st_nm.toLowerCase();
      const matching = CLIENTS.filter((c) => nm.includes(c.match));
      const hasClient = matching.length > 0;
      const d   = path(feat as unknown as GeoJSON.Feature) ?? "";

      const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el.setAttribute("d", d);
      el.setAttribute("fill",   hasClient ? "#141210" : hashFill(feat.properties.st_nm));
      el.setAttribute("stroke", hasClient ? "rgba(20,184,166,.65)" : "rgba(255,255,255,.18)");
      el.setAttribute("stroke-width", hasClient ? "1.6" : "1.2");
      el.setAttribute("class", hasClient ? "cm-state cm-state--active" : "cm-state");
      el.setAttribute("vector-effect", "non-scaling-stroke");
      if (hasClient) {
        el.setAttribute("data-client", matching[0].match);
      }
      g.appendChild(el);

      if (hasClient) {
        const c = path.centroid(feat as unknown as GeoJSON.Feature);
        if (c && !isNaN(c[0])) {
          matching.forEach((cli, idx) => {
            let cx = c[0];
            let cy = c[1];
            if (matching.length > 1) {
              const angle = (idx / matching.length) * 2 * Math.PI;
              const radius = 22; // Offset multiple markers in a circle around the state centroid
              cx += Math.cos(angle) * radius;
              cy += Math.sin(angle) * radius;
            }
            newMarkers.push({ client: cli, cx, cy });
          });
        }
      }
    });

    // Draw the bold outer outline of the entire country
    if (countryOutline) {
      const d = path({ type: "Feature", properties: {}, geometry: countryOutline } as unknown as GeoJSON.Feature) ?? "";
      const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el.setAttribute("d", d);
      el.setAttribute("class", "cm-country-outline");
      el.setAttribute("fill", "none");
      el.setAttribute("vector-effect", "non-scaling-stroke");
      g.appendChild(el);
    }

    setMarkers(newMarkers);
  }, [states, countryOutline]);

  /* tooltip */
  const moveTip = useCallback((e: React.MouseEvent, cli: Client) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    // Clamp inside wrapper dimensions
    const TW = 192, TH = 88;
    const tx = Math.min(Math.max(x + 14, 4), r.width - TW - 4);
    const ty = Math.min(Math.max(y - 16, 4), r.height - TH - 4);

    setTooltip({ x: tx, y: ty, client: cli });
  }, []);

  const hideTip = useCallback(() => setTooltip(null), []);

  return (
    <section className="cm-section" id="clients" aria-labelledby="cm-heading">
      {/* ── LEFT COLUMN ─────────────────────────────────────── */}
      <div className="cm-left">
        {/* eyebrow */}
        <span className="cm-eyebrow" aria-hidden="true">
          <span className="cm-eyebrow-line" />
          Our Clients
          <span className="cm-count" aria-label={`${totalClients}+ clients`}>{clientCountStr}</span>
        </span>

        {/* heading */}
        <h2 className="cm-heading" id="cm-heading">
          Trusted by teams<br />across India
        </h2>

        {/* subline */}
        <p className="cm-sub">
          A growing network of partners —<br />from metros to emerging hubs.
        </p>

        {/* client list */}
        <ul className="cm-list" aria-label="Client list" role="list">
          {CLIENTS.map((c) => (
            <li key={`${c.name}-${c.city}`} className="cm-item">
              <span className="cm-dot" aria-hidden="true" />
              <span className="cm-name">{c.name}</span>
              <span className="cm-city-sep" aria-hidden="true">·</span>
              <span className="cm-city">{c.city}</span>
              <span className="cm-since" aria-label={`Client since ${c.since}`}>Since {c.since}</span>
            </li>
          ))}
        </ul>

        {/* legend */}
        <div className="cm-legend" aria-label="Legend">
          <span className="cm-legend-dot" aria-hidden="true" />
          <span className="cm-legend-text">Active client locations</span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: MAP ───────────────────────────────── */}
      <div className="cm-right" ref={wrapRef} onMouseLeave={hideTip}>
        <svg
          ref={svgRef}
          className="cm-svg"
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label={`Map of India showing ${totalClients}+ active client locations`}
          role="img"
        >
          <g className="cm-paths" />

          {/* pin markers */}
          {markers.map(({ client, cx, cy }, i) => (
            <g
              key={`${client.name}-${client.city}`}
              transform={`translate(${cx},${cy})`}
              tabIndex={0}
              role="button"
              aria-label={`${client.name}, ${client.city}, client since ${client.since}`}
              onMouseEnter={(e) => moveTip(e, client)}
              onMouseMove={(e)  => moveTip(e, client)}
              onMouseLeave={hideTip}
              onFocus={() => {
                setFocused(i);
                const wrap = wrapRef.current, svg = svgRef.current;
                if (wrap && svg) {
                  const sr = svg.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
                  const sx = sr.width / VIEWBOX_W, sy = sr.height / VIEWBOX_H;
                  const x = cx * sx + (sr.left - wr.left);
                  const y = cy * sy + (sr.top - wr.top);

                  // Clamp inside wrapper dimensions
                  const TW = 192, TH = 88;
                  const tx = Math.min(Math.max(x + 14, 4), wr.width - TW - 4);
                  const ty = Math.min(Math.max(y - 16, 4), wr.height - TH - 4);

                  setTooltip({ x: tx, y: ty, client });
                }
              }}
              onBlur={() => { setFocused(null); hideTip(); }}
              onKeyDown={(e) => { if (e.key === "Escape") { hideTip(); (e.currentTarget as unknown as SVGElement & { blur(): void }).blur(); } }}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {/* pulsing rings */}
              {!noMotion && <>
                <circle r={16} fill="none" stroke="#14B8A6" strokeWidth={1}
                  className="cm-ring cm-ring-a"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                <circle r={16} fill="none" stroke="#14B8A6" strokeWidth={1}
                  className="cm-ring cm-ring-b"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              </>}
              {/* halo */}
              <circle r={10} fill="#14B8A6" fillOpacity={0.16} filter="url(#cm-glow)" />
              {/* disc */}
              <circle r={6}  fill="#14B8A6" />
              {/* core */}
              <circle r={focused === i ? 3.2 : 2.4} fill="#020203"
                style={{ transition: "r .2s" }} />
            </g>
          ))}

          <defs>
            <filter id="cm-glow" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feFlood floodColor="#14B8A6" floodOpacity=".5" result="col" />
              <feComposite in="col" in2="blur" operator="in" result="s" />
              <feMerge><feMergeNode in="s" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>

        {/* tooltip */}
        {tooltip && (
          <div className="cm-tooltip" role="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            <div className="cm-tt-name">{tooltip.client.name}</div>
            <div className="cm-tt-loc">
              <span className="cm-tt-dot" aria-hidden="true" />
              {tooltip.client.city} · {tooltip.client.state}
            </div>
            <div className="cm-tt-rule" aria-hidden="true" />
            <div className="cm-tt-since">CLIENT SINCE {tooltip.client.since}</div>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

/* ─────────────────────────────────────────────────────────────────
   ✏️  CLIENTS — swap in your real data here
   ───────────────────────────────────────────────────────────────── */
const CLIENTS = [
  { match: "delhi",       name: "Vantage Media", city: "New Delhi", state: "Delhi",      since: "2021" },
  { match: "rajasthan",   name: "Forge Labs",    city: "Jaipur",    state: "Rajasthan",  since: "2022" },
  { match: "bengal",      name: "Meridian Co.",  city: "Kolkata",   state: "West Bengal",since: "2020" },
  { match: "maharashtra", name: "Atlas Group",   city: "Mumbai",    state: "Maharashtra",since: "2019" },
  { match: "tamil",       name: "Nimbus AI",     city: "Chennai",   state: "Tamil Nadu", since: "2023" },
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

/* ── Hydration-Safe prefers-reduced-motion Store ────────────── */
const motionSubscribe = (callback: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};
const motionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionServerSnapshot = () => false;

/* Helper to isolate fetch call from raw useEffect direct execution */
const fetchMapData = async (url: string): Promise<Topology> => {
  const res = await fetch(url);
  return res.json();
};

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────────── */
export default function ClientsMap() {
  const svgRef       = useRef<SVGSVGElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<{ client: Client; cx: number; cy: number }[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [focused,  setFocused]  = useState<number | null>(null);

  /* prefers-reduced-motion subscription */
  const noMotion = useSyncExternalStore(motionSubscribe, motionSnapshot, motionServerSnapshot);

  /* fetch TopoJSON → dissolve districts → state features → render SVG paths + compute centroids */
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const topo = await fetchMapData(TOPO_URL);
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

        if (dead || !svgRef.current) return;

        // Setup projection and path builder
        const fc: GeoJSON.FeatureCollection = { type: "FeatureCollection", features };
        const proj = d3Geo.geoMercator().fitExtent([[44, 44], [VIEWBOX_W - 44, VIEWBOX_H - 64]], fc);
        const path = d3Geo.geoPath().projection(proj);

        const g = svgRef.current.querySelector(".cm-paths")!;
        g.innerHTML = "";

        const newMarkers: typeof markers = [];

        features.forEach((feat) => {
          const nm  = feat.properties.st_nm.toLowerCase();
          const cli = CLIENTS.find((c) => nm.includes(c.match));
          const d   = path(feat as unknown as GeoJSON.Feature) ?? "";

          const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
          el.setAttribute("d", d);
          el.setAttribute("fill",   cli ? "#141210" : hashFill(feat.properties.st_nm));
          el.setAttribute("stroke", cli ? "rgba(20,184,166,.65)" : "rgba(255,255,255,.18)");
          el.setAttribute("stroke-width", cli ? "1.6" : "1.2");
          el.setAttribute("class", cli ? "cm-state cm-state--active" : "cm-state");
          el.setAttribute("vector-effect", "non-scaling-stroke");
          if (cli) {
            el.setAttribute("data-client", cli.match);
          }
          g.appendChild(el);

          if (cli) {
            const c = path.centroid(feat as unknown as GeoJSON.Feature);
            if (c && !isNaN(c[0])) newMarkers.push({ client: cli, cx: c[0], cy: c[1] });
          }
        });

        // Draw the bold outer outline of the entire country
        if (dissolvedCountry) {
          const d = path({ type: "Feature", properties: {}, geometry: dissolvedCountry } as unknown as GeoJSON.Feature) ?? "";
          const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
          el.setAttribute("d", d);
          el.setAttribute("class", "cm-country-outline");
          el.setAttribute("fill", "none");
          el.setAttribute("vector-effect", "non-scaling-stroke");
          g.appendChild(el);
        }

        setMarkers(newMarkers);
      } catch (e) {
        console.error("ClientsMap: fetch or render failed", e);
      }
    })();
    return () => { dead = true; };
  }, []);

  /* tooltip */
  const moveTip = useCallback((e: React.MouseEvent, cli: Client) => {
    const r = wrapRef.current!.getBoundingClientRect();
    setTooltip({ x: e.clientX - r.left, y: e.clientY - r.top, client: cli });
  }, []);

  const hideTip = useCallback(() => setTooltip(null), []);

  /* clamp tooltip */
  const TW = 192, TH = 88;
  const tx = tooltip ? Math.min(Math.max(tooltip.x + 14, 4), (wrapRef.current?.offsetWidth  ?? 9999) - TW - 4) : 0;
  const ty = tooltip ? Math.min(Math.max(tooltip.y - 16, 4), (wrapRef.current?.offsetHeight ?? 9999) - TH - 4) : 0;

  return (
    <section className="cm-section" id="clients" aria-labelledby="cm-heading">
      {/* ── LEFT COLUMN ─────────────────────────────────────── */}
      <div className="cm-left">
        {/* eyebrow */}
        <span className="cm-eyebrow" aria-hidden="true">
          <span className="cm-eyebrow-line" />
          Our Clients
          <span className="cm-count" aria-label="5 clients">05</span>
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
        <ul className="cm-list" aria-label="Client list">
          {CLIENTS.map((c) => (
            <li key={c.match} className="cm-item">
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
          aria-label="Map of India showing 5 active client locations"
          role="img"
        >
          <g className="cm-paths" />

          {/* pin markers */}
          {markers.map(({ client, cx, cy }, i) => (
            <g
              key={client.match}
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
                  setTooltip({ x: cx * sx + (sr.left - wr.left) + 14, y: cy * sy + (sr.top - wr.top) - 16, client });
                }
              }}
              onBlur={() => { setFocused(null); hideTip(); }}
              onKeyDown={(e) => { if (e.key === "Escape") { hideTip(); (e.currentTarget as unknown as SVGElement & { blur(): void }).blur(); } }}
              style={{ cursor: "pointer" }}
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
          <div className="cm-tooltip" role="tooltip" style={{ left: tx, top: ty }}>
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

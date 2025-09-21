// app/api/geo-check/route.js (Next.js App Router)
import { NextResponse } from "next/server";

const restrictedStates = [
  "andhra pradesh",
  "telangana",
  "tamil nadu",
  "karnataka",
  "kerala",
  "meghalaya",
  "nagaland",
  "sikkim",
];

// helper to normalize names
const norm = s => (s || "").toLowerCase().trim();

export async function POST(req) {
  try {
    const body = await req.json();
    const { lat, lng } = body || {};

    // Get client's IP from headers (works when deployed behind proxy/load balancer)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")?.[0] ||
      req.headers.get("x-real-ip") ||
      req.socket?.remoteAddress ||
      null;

    // 1) Reverse geocode lat/lng using OpenCage
    const key = "2a77c44790d04f1da23d98d99d3c4b3b";
    // const key = process.env.OPENCAGE_KEY;
    if (!key) {
      return NextResponse.json({ error: "Server missing OPENCAGE_KEY" }, { status: 500 });
    }
    const q = encodeURIComponent(`${lat},${lng}`);
    const geoRes = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${q}&key=${key}&no_annotations=1&language=en`
    );
    const geoJson = await geoRes.json();
    const components = geoJson.results?.[0]?.components || {};

    const gpsState =
      components.state ||
      components.region ||
      components.county ||
      components.state_district ||
      null;
    const city =
      components.city ||
      components.town ||
      components.village ||
      components.county ||
      null;
    const country = components.country || null;

    // 2) IP-based geo fallback (we'll call ipapi.co with the ip if available)
    let ipState = null;
    if (ip) {
      try {
        // ipapi.co allows lookup by ip: https://ipapi.co/{ip}/json/
        const ipRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const ipJson = await ipRes.json();
        ipState = ipJson.region || ipJson.region_code || null;
      } catch (e) {
        // ignore ip lookup failures
      }
    }

    // 3) Decision logic: allowed or not
    const allowed = !restrictedStates.includes(norm(gpsState));

    // If gpsState missing fall back to IP state check
    const fallbackAllowed = gpsState ? allowed : !restrictedStates.includes(norm(ipState));

    // detect mismatch
    const mismatch = gpsState && ipState && norm(gpsState) !== norm(ipState);

    return NextResponse.json({
      ok: true,
      gps: { state: gpsState, city, country, lat, lng },
      ip: { ip, state: ipState },
      allowed: gpsState ? allowed : fallbackAllowed,
      mismatch,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Geo-check failed" }, { status: 500 });
  }
}

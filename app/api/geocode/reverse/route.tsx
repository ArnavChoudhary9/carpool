import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const latlng = req.nextUrl.searchParams.get("latlng");
  if (!latlng) {
    return NextResponse.json({ predictions: [] });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(
    latlng
  )}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}

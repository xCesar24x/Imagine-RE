import { NextResponse } from "next/server";
import { PROPERTIES, Property } from "@/constants/properties";

// Serverless fallback store
let globalPropertiesStore: Property[] = [...PROPERTIES];

export async function GET() {
  return NextResponse.json(globalPropertiesStore);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (Array.isArray(data) && data.length > 0) {
      globalPropertiesStore = data;
      return NextResponse.json({ success: true, count: globalPropertiesStore.length });
    }
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

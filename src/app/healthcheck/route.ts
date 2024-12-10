import { NextResponse } from "next/server";

import packageData from "../../../package.json";

export function GET() {
  const data = {
    status: "Running",
    app_version: packageData.version || "",
  };
  return NextResponse.json(data, { status: 200 });
}

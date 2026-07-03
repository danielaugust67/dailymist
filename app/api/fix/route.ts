import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const faviconPath = path.join(process.cwd(), "app", "favicon.ico");
  try {
    if (fs.existsSync(faviconPath)) {
      fs.unlinkSync(faviconPath);
      return NextResponse.json({ success: true, message: "Deleted favicon.ico" });
    }
    return NextResponse.json({ success: true, message: "favicon.ico not found" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

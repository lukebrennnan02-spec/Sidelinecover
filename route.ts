import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function safeName(len=10) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i=0;i<len;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const role = String(form.get("role") || "physio");
  const name = String(form.get("name"));
  const email = String(form.get("email"));
  const password = String(form.get("password"));
  if (!name || !email || !password) return new NextResponse("Missing fields", { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email, hashedPassword: hashed, role: role === "club" ? "CLUB" : "PHYSIO" }
    });

    if (role === "physio") {
      const coruNumber = String(form.get("coruNumber") || "");
      const idDoc = form.get("idDoc") as File | null;
      const photo = form.get("photo") as File | null;
      if (!coruNumber || !idDoc || !photo) return new NextResponse("Missing CORU/ID/photo", { status: 400 });

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const idExt = path.extname(idDoc.name || "") || ".bin";
      const photoExt = path.extname(photo.name || "") || ".jpg";
      const idPath = path.join(uploadDir, safeName() + idExt);
      const photoPath = path.join(uploadDir, safeName() + photoExt);
      await fs.writeFile(idPath, Buffer.from(await idDoc.arrayBuffer()));
      await fs.writeFile(photoPath, Buffer.from(await photo.arrayBuffer()));

      await prisma.physioProfile.create({
        data: { userId: user.id, coruNumber, idDocPath: "/uploads/" + path.basename(idPath), photoPath: "/uploads/" + path.basename(photoPath) }
      });
    } else {
      const clubName = String(form.get("clubName") || "");
      const county = String(form.get("county") || "");
      const phone = String(form.get("phone") || "");
      const officialEmail = String(form.get("officialEmail") || "");
      if (!clubName || !county || !phone || !officialEmail) return new NextResponse("Missing club fields", { status: 400 });
      await prisma.clubProfile.create({
        data: { userId: user.id, clubName, county, phone, officialEmail }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.code === "P2002") return new NextResponse("Email already in use", { status: 409 });
    console.error(e);
    return new NextResponse("Server error", { status: 500 });
  }
}

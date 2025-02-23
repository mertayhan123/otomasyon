import { connectDB } from "../../lib/mongodb";
import Motor from "../../models/Motor";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// app/api/motor/route.ts

export async function POST(request: Request) {
  try {
    // Oturum kontrolü (kullanıcı giriş yapmış mı)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    await connectDB();

    // İstekten verileri al
    const body = await request.json();
    const { id, güç, verimlilik } = body; 
    // "id" burada front-end'den gelen kart ID'si olabilir (örnek)

    const userId = session.user.id;

    // Eski kayıt varsa silelim diyorsanız (opsiyonel)
    // await Motor.deleteOne({ userId });

    // Yeni motor oluştur
    const newMotor = await Motor.create({
      userId,
      güç,
      verimlilik,
      cardId: id, // opsiyonel, veritabanında saklayacaksanız
    });

    return NextResponse.json(newMotor, { status: 201 });
  } catch (error) {
    console.error("Motor kayıt hatası:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

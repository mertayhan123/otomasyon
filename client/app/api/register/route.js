import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/user";

// Post fonksiyonu
export async function POST(request) {
  try {
    // JSON formatındaki veriyi al
    const { name, email, password } = await request.json();

    // Veritabanına bağlan
    await connectDB();

    // Yeni kullanıcı oluştur (şifreyi hashlemeden kaydediyor)
    await User.create({ name, email, password });

    // Başarılı yanıt döndür
    return NextResponse.json(
      { message: `User ${name} registered successfully` },
      { status: 201 }
    );
  } catch (error) {
    // Hata durumunda yanıt döndür
    return NextResponse.json(error);
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import bcrypt from "bcryptjs";

// Post fonksiyonu
export async function POST(request) {
  try {
    // JSON formatındaki veriyi al
    const { name, email, password } = await request.json();

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Veritabanına bağlan
    await connectDB();

    // Yeni kullanıcı oluştur
    await User.create({ name, email, password: hashedPassword });

    // Başarılı yanıt döndür
    return NextResponse.json(
      { message: `User ${name} registered successfully` },
      { status: 201 }
    );
  } catch (error) {
    // Hata durumunda yanıt döndür
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}





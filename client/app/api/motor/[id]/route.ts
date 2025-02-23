// app/api/motor/[id]/route.ts
import { connectDB } from "../../../lib/mongodb";
import Motor from "../../../models/Motor";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    await connectDB();

    // URL'deki [id] parametresi:
    const motorId = params.id;

    // Body'den yeni güç/verimlilik değerlerini al
    const body = await request.json();
    const { güç, verimlilik } = body;

    // Oturumu açan kullanıcının kaydı olup olmadığını da kontrol edebilirsiniz
    const userId = session.user.id;

    // Belirtilen motor kaydını bulup güncelle
    // (Aynı userId'ye mi ait olduğuna da bakabilirsiniz)
    const updatedMotor = await Motor.findOneAndUpdate(
      { _id: motorId, userId },
      { güç, verimlilik },
      { new: true } // new: true => güncellenmiş kaydı döndür
    );

    if (!updatedMotor) {
      // Kayıt bulunamadıysa 404 döndürüyoruz
      return NextResponse.json({ error: "Motor bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedMotor, { status: 200 });
  } catch (error) {
    console.error("Motor güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Güncelleme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

import { connectDB } from "../../lib/mongodb";
import Button from "../../models/Button";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("GET /api/toggle çağrıldı");
        await connectDB();
        console.log("MongoDB bağlantısı kuruldu");

        let button = await Button.findOne({ name: "esp" });
        console.log("Bulunan buton:", button);
        
        if (!button) {
            console.log("Buton bulunamadı, yeni buton oluşturuluyor");
            button = await Button.create({ name: "esp", status: false });
            console.log("Yeni buton oluşturuldu:", button);
        }

        return NextResponse.json(button);
    } catch (error) {
        console.error("GET /api/toggle hatası:", error);
        return NextResponse.json(
            { error: "Bir hata oluştu", message: error.message },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        console.log("POST /api/toggle çağrıldı");
        await connectDB();
        console.log("MongoDB bağlantısı kuruldu");

        let button = await Button.findOne({ name: "esp" });
        console.log("Bulunan buton:", button);
        
        if (!button) {
            console.log("Buton bulunamadı, yeni buton oluşturuluyor");
            button = await Button.create({ name: "esp", status: false });
            console.log("Yeni buton oluşturuldu:", button);
        }

        // status alanını tersine çevir (true -> false, false -> true)
        button.status = !button.status;
        button.updatedAt = new Date();
        await button.save();
        console.log("Buton durumu güncellendi:", button);

        // Socket.IO sunucusuna bildirim gönder
        try {
            const response = await fetch('http://localhost:3000/api/button/set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: button.status }),
            });
            
            if (response.ok) {
                console.log("Socket.IO sunucusuna buton durumu bildirildi:", button.status);
            } else {
                console.error("Socket.IO sunucusuna bildirim gönderilemedi:", response.status);
            }
        } catch (socketError) {
            console.error("Socket.IO sunucusuna erişim hatası:", socketError);
            // Ana işlemi etkilememesi için bu hatayı yutuyoruz
        }

        return NextResponse.json(button);
    } catch (error) {
        console.error("POST /api/toggle hatası:", error);
        return NextResponse.json(
            { error: "Bir hata oluştu", message: error.message },
            { status: 500 }
        );
    }
}

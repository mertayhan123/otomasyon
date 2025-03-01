import connectDB from "../../lib/mongodb";
import Button from "../../models/Button";

export async function GET() {
  try {
    await connectDB();

    let button = await Button.findOne();
    if (!button) {
      button = await Button.create({ state: "Kapalı" });
    }

    return new Response(JSON.stringify(button), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function POST() {
    await connectDB();

    let buton = await Button.findOne();
    if (!buton) return new Response("Buton not found", { status: 404 });

    buton.state = buton.state === "Açık" ? "Kapalı" : "Açık";
    await buton.save();

    return new Response(JSON.stringify(buton), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

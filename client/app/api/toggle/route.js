import connectMongo from "../../../lib/mongodb";
import Button from "../../models/Button";

export async function GET() {
    await connectMongo();

    let button = await Button.findOne();
    if (!button) {
        button = await Button.create({ state: "Kapalı" });
    }

    return new Response(JSON.stringify(button), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST() {
    await connectMongo();

    let button = await Button.findOne();
    if (!button) return new Response("Button not found", { status: 404 });

    button.state = button.state === "Açık" ? "Kapalı" : "Açık";
    await button.save();

    return new Response(JSON.stringify(button), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

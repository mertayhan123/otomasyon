import mongoose from "mongoose";

const ButonSchema = new mongoose.Schema({
    state: { type: String, enum: ["Açık", "Kapalı"], default: "Kapalı" }
});

const Buton = mongoose.models.Buton || mongoose.model("Buton", ButonSchema);

export default Buton;

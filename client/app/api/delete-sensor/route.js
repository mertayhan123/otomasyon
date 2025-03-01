import { NextResponse } from 'next/server';
import connectDB from "../../lib/mongodb";
import Sensor from "../../models/Sensor";

export async function DELETE(request) {
  try {
    await connectDB();

    const { id } = await request.json();

    const sensor = await Sensor.findByIdAndDelete(id);
    if (!sensor) {
      return NextResponse.json(
        { success: false, message: "Sensor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Sensor deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
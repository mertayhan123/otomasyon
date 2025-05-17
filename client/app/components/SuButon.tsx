"use client";
import React, { useState, useEffect } from "react";
import LiquidFillGauge from "react-liquid-gauge";

export default function LiquidGauge() {
  const [value, setValue] = useState(65);

  // Opsiyonel: Seviye dalgalansın diye simülasyon
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = Math.random() * 10 - 5; // -5 ile +5 arasında
      setValue((prev) => Math.max(0, Math.min(100, prev + fluctuation)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <LiquidFillGauge
        value={value}
        width={200}
        height={200}
        textSize={1}
        waveFrequency={2} // Dalgaların sıklığı
        waveAmplitude={3} // Dalga yüksekliği
        waveAnimation={true} // Dalga animasyonu aktif
        riseAnimation={true} // Yükselme animasyonu aktif
        gradient={true} // Renk geçişi efekti
        textStyle={{
          fill: "#fff",
          fontSize: "1.5em",
        }}
        waveTextStyle={{
          fill: "#fff",
        }}
      />
    </div>
  );
}

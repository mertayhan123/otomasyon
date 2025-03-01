"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [buttonState, setButtonState] = useState(null);

  useEffect(() => {
    fetch("/api/toggle")
      .then((res) => res.json())
      .then((data) => setButtonState(data.state))
      .catch((error) => console.error("GET Error:", error));
  }, []);

  const toggleButton = async () => {
    try {
      const res = await fetch("/api/toggle", { method: "POST" });
      const data = await res.json();
      setButtonState(data.state);
    } catch (error) {
      console.error("POST Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Düğme Durumu: {buttonState || "Yükleniyor..."}
      </h1>
      <button
        onClick={toggleButton}
        className={`px-6 py-3 text-lg font-semibold text-white rounded-lg ${
          buttonState === "Açık" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {buttonState === "Açık" ? "Kapat" : "Aç"}
      </button>
    </div>
  );
}

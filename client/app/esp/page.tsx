"use client";

import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
  const [buttonState, setButtonState] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [socketStatus, setSocketStatus] = useState("");
  const [socketMessage, setSocketMessage] = useState("");

  // API ile buton durumunu al ve değiştir
  useEffect(() => {
    const fetchButtonState = async () => {
      try {
        setIsLoading(true);
        console.log("Buton durumu alınıyor...");
        const res = await fetch("/api/toggle");
        console.log("API yanıtı:", res.status);

        if (!res.ok) {
          throw new Error(`Buton durumu alınamadı: ${res.status}`);
        }

        const data = await res.json();
        console.log("Alınan veri:", data);
        setButtonState(data.status);
        setError("");
      } catch (error) {
        console.error("Buton durumu alınamadı:", error);
        setError(`Buton durumu alınamadı: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchButtonState();
  }, []);

  // Socket.IO bağlantısı
  useEffect(() => {
    // Socket.IO client'ı dinamik olarak import et
    const loadSocketIO = async () => {
      try {
        const socketIOModule = await import("socket.io-client");
        const io = socketIOModule.io;

        setSocketMessage("Socket.IO bağlantısı başlatılıyor...");
        console.log("Socket.IO bağlantısı başlatılıyor...");

        // Socket.IO bağlantısı
        const socket = io("http://localhost:3000", {
          transports: ["polling", "websocket"],
          withCredentials: true,
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          timeout: 20000,
        });

        // Bağlantı olayları
        socket.on("connect", () => {
          setSocketStatus("Bağlandı");
          setSocketMessage("Socket.IO sunucusuna bağlandı");
          console.log("Socket.IO bağlantısı kuruldu, ID:", socket.id);

          // Bağlantı bilgilerini gönder
          socket.emit("clientInfo", {
            device: "Browser",
            page: "ESP Page",
            time: new Date().toISOString(),
          });
        });

        socket.on("disconnect", () => {
          setSocketStatus("Bağlantı kesildi");
          setSocketMessage("Socket.IO sunucusu ile bağlantı kesildi");
          console.log("Socket.IO bağlantısı kesildi");
        });

        socket.on("connect_error", (err: Error) => {
          setSocketStatus("Bağlantı hatası");
          setSocketMessage(`Bağlantı hatası: ${err.message}`);
          console.error("Socket.IO bağlantı hatası:", err);
        });

        // Buton durumu olayı
        socket.on("buttonState", (state: number) => {
          console.log("Socket.IO buton durumu alındı:", state);
          setButtonState(state === 1);
          setSocketMessage(
            `ESP buton durumu: ${state === 1 ? "Açık" : "Kapalı"}`
          );
        });

        // Temizleme fonksiyonu
        return () => {
          console.log("Socket.IO bağlantısı kapatılıyor");
          socket.disconnect();
        };
      } catch (error) {
        console.error("Socket.IO yüklenirken hata:", error);
        setSocketMessage(
          `Socket.IO yüklenirken hata: ${(error as Error).message}`
        );
      }
    };

    loadSocketIO();
  }, []);

  const toggleButton = async () => {
    try {
      setIsLoading(true);
      console.log("Buton durumu değiştiriliyor...");
      const res = await fetch("/api/toggle", { method: "POST" });
      console.log("API yanıtı:", res.status);

      if (!res.ok) {
        throw new Error(`Buton durumu değiştirilemedi: ${res.status}`);
      }

      const data = await res.json();
      console.log("Alınan veri:", data);
      setButtonState(data.status);
      setError("");
    } catch (error) {
      console.error("Buton durumu değiştirilemedi:", error);
      setError(`Buton durumu değiştirilemedi: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <h1 className="text-3xl font-bold mb-4">
        Düğme Durumu:{" "}
        {isLoading
          ? "Yükleniyor..."
          : buttonState === null
          ? "Bilinmiyor"
          : buttonState
          ? "Açık"
          : "Kapalı"}
      </h1>

      {socketStatus && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg ${
            socketStatus === "Bağlandı"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          <p>
            <strong>Socket.IO:</strong> {socketStatus}
          </p>
          {socketMessage && <p className="text-sm">{socketMessage}</p>}
        </div>
      )}

      <button
        onClick={toggleButton}
        disabled={isLoading}
        className={`px-6 py-3 text-lg font-semibold text-white rounded-lg ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : buttonState
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {isLoading ? "Yükleniyor..." : buttonState ? "Kapat" : "Aç"}
      </button>
    </div>
  );
}

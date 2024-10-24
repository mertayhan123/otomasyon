"use client";

import MotorCard from "@/app/components/motor-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Motorlar() {
  const [cards, setCards] = useState<Card[]>([]); 

  const { data: session, status } = useSession(); // useSession ile oturum durumunu al
  const router = useRouter(); // Yönlendirme için useRouter

  // Oturum durumu değiştiğinde kontrol et
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Oturum yoksa login sayfasına yönlendir
    }
  }, [status, router]);

  // Eğer oturum durumu "loading" ise yükleniyor göstergesi
  if (status === "loading") {
    return <div>Loading...</div>; // Yüklenirken bir şey render et
  }

  interface Card {
    id: number;
  }
  console.log(cards);


  const addCard = () => {
    setCards((prevCards) => [...prevCards, { id: prevCards.length }]);
  };

  const removeCard = (id: number) => {
    setCards((prevCards) => prevCards.filter(card => card.id !== id));
  };

  return (
    <div className="flex flex-col items-center h-5/6">
      <button 
        className="btn btn-primary mb-4" 
        onClick={addCard}
      >
        Ekle
      </button>
      <div
        data-theme
        className="flex flex-row flex-wrap items-center justify-between p-5 m-5"
      >
        {cards.map((card) => (
          <div key={card.id} className="relative">
            <MotorCard 
              onRemove={() => removeCard(card.id)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Motorlar;

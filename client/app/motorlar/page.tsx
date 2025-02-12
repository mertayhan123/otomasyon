"use client";

import MotorCard from "@/app/components/motor-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Motorlar() {
  const [cards, setCards] = useState<Card[]>([]);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  interface Card {
    id: number;
  }
  console.log(cards);

  const addCard = () => {
    setCards((prevCards) => [...prevCards, { id: prevCards.length }]);
  };

  const removeCard = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  return (
    <div className="flex flex-col items-center h-5/6 px-4 lg:px-16">
      <button
        className="btn btn-primary mt-16" 
        onClick={addCard}
      >
        Ekle
      </button>
      <div
        data-theme
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {cards.map((card) => (
          <div key={card.id} className="relative">
            <MotorCard onRemove={() => removeCard(card.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Motorlar;

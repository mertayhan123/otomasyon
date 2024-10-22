"use client";

import MotorCard from "@/app/components/motor-card";
import React, { useState } from "react";

function Motorlar() {

  interface Card {
    id: number;
  }

  const [cards, setCards] = useState<Card[]>([]); 

  const addCard = () => {
    setCards((prevCards) => [...prevCards, { id: prevCards.length }]);
  };

  console.log(cards);

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

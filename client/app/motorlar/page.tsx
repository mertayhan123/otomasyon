"use client";
import React, { useEffect, useState } from "react";
import MotorCard from "@/app/components/motor-card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Motorlar: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleOpenPopup = (): void => {
    setShowPopup(true);
  };

  const handleClosePopup = (): void => {
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col items-center h-full px-4 lg:px-16 pt-20">
      <button className="btn btn-primary mt-16" onClick={handleOpenPopup}>
        Ekle
      </button>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Arka plan karartması, tıklandığında popup'ı kapatır */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={handleClosePopup}
          ></div>
          <div className="relative bg-base-100 rounded-2xl shadow-2xl p-6 z-10">
            <MotorCard onRemove={handleClosePopup} cardId={0} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Motorlar;

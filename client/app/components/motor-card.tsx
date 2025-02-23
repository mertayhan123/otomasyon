"use client";

import React, { useState } from "react";
import Degerler from "./degerler";
import RangeOne from "./rangeone";
import Component from "./speed";

interface MotorCardProps {
  onRemove: () => void;
  cardId: number | string; // Kartın ID'si (string veya number olabilir)
}

const MotorCard: React.FC<MotorCardProps> = ({ onRemove, cardId }) => {
  // Varsayılan alanlar
  const [motorName, setMotorName] = useState("Motor Adı");
  const [rangeValue, setRangeValue] = useState<number>(40); // "güç" mantığı
  const [voltage, setVoltage] = useState<number>(0);        // "verimlilik" mantığı

  // Kayıt/Güncelleme için gerekli ek state'ler:
  const [isEditMode, setIsEditMode] = useState(false); // false => "Kaydet", true => "Güncelle"
  const [docId, setDocId] = useState<string | null>(null); // Veritabanında oluşan _id

  const [checked, setChecked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [firstcheck, setFirstCheck] = useState(true);
  const [secondcheck, setSecondCheck] = useState(true);

  // Kaydet tıklandığında açılacak onay popup için state
  const [showPopup, setShowPopup] = useState(false);

  // Range ve voltage değişimleri
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(event.target.value));
  };

  const handleVoltageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoltage(Number(event.target.value));
  };

  // Güç Değişikliği toggle
  const degis = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } else {
      setShowAlert(false);
    }
  };

  // "Kaydet" veya "Güncelle" butonuna basıldığında onay penceresini aç
  const handleSave = () => {
    setShowPopup(true);
  };

  // Kullanıcı "Evet" dediğinde verileri POST veya PUT ile kaydet/güncelle
  const confirmSave = async () => {
    setShowPopup(false);

    try {
      let response;

      // Eğer henüz kaydedilmemişse (isEditMode=false), POST isteği gönder
      if (!isEditMode) {
        response = await fetch("/api/motor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: cardId,       // Kartın kendi ID'si (opsiyonel)
            güç: rangeValue,
            verimlilik: voltage,
          }),
        });

        if (!response.ok) {
          throw new Error("Motor kaydedilirken hata oluştu (POST)");
        }

        // Sunucunun döndürdüğü yeni kayıt
        const newMotor = await response.json();
        console.log("Motor kaydı başarılı (yeni):", newMotor);

        // Artık bu karta ait docId belli oldu
        setDocId(newMotor._id);   // Mongoose `_id`
        setIsEditMode(true);      // Artık "Güncelle" moduna geçiyoruz

      } else {
        // isEditMode=true => daha önce kaydedilmiş motoru güncelle (PUT)
        if (!docId) {
          throw new Error("docId mevcut değil, güncelleme yapılamaz.");
        }

        response = await fetch(`/api/motor/${docId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            güç: rangeValue,
            verimlilik: voltage,
          }),
        });

        if (!response.ok) {
          throw new Error("Motor güncellenirken hata oluştu (PUT)");
        }

        const updatedMotor = await response.json();
        console.log("Motor güncellendi:", updatedMotor);
      }

      // Kayıt veya güncelleme sonrası 5 saniyelik uyarı
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);

    } catch (error) {
      console.error(error);
      // Hata durumuna göre kullanıcıya bilgi verebilirsiniz
    }
  };

  // Kullanıcı "Hayır" dediğinde onay penceresini kapat
  const cancelSave = () => {
    setShowPopup(false);
  };

  // Motor adını tıklayınca prompt ile değiştirme
  const handleMotorNameClick = () => {
    const newName = prompt("Motorun yeni adını girin:", motorName);
    if (newName) {
      setMotorName(newName);
    }
  };

  return (
    <div className="flex flex-col p-3 bg-green-600 rounded-3xl shadow-xl">
      {/* Motor adı (tıklanınca prompt açılır) */}
      <div
        className="text-center text-xl font-bold mb-3 cursor-pointer"
        onClick={handleMotorNameClick}
      >
        {motorName}
      </div>

      {/* Kısa süreli uyarı */}
      {showAlert && (
        <div role="alert" className="alert alert-error mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2
                 m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            DİKKAT! GELİŞTİRME MODU AKTİF EDİLDİ. RangeValue: {rangeValue}, Voltage: {voltage}
          </span>
        </div>
      )}

      {/* Kaydet onay penceresi */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>
              {isEditMode
                ? "Değişiklikleri güncellemek istediğinize emin misiniz?"
                : "Değişiklikleri kaydetmek istediğinize emin misiniz?"}
            </p>
            <div className="flex justify-end space-x-3">
              <button className="btn btn-success" onClick={confirmSave}>
                Evet
              </button>
              <button className="btn btn-danger" onClick={cancelSave}>
                Hayır
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle ve diğer check kutuları */}
      <div className="flex justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="toggle mb-5 mr-2"
            checked={checked}
            onChange={degis}
          />
          <span className="mb-5">Güç Değişikliği</span>
        </div>
        <div className="flex justify-between">
          <input
            type="checkbox"
            checked={firstcheck}
            onChange={() => setFirstCheck(!firstcheck)}
            className="checkbox mr-3 border-orange-400"
          />
          <input
            type="checkbox"
            checked={secondcheck}
            onChange={() => setSecondCheck(!secondcheck)}
            className="checkbox"
          />
        </div>
      </div>

      {/* Değerleri gösteren bileşen */}
      <Degerler rangeValue={rangeValue} voltageValue={voltage} />

      {/* İlk checkbox açıksa (örneğin güç ayarı) RangeOne */}
      {firstcheck && (
        <RangeOne
          rangeValue={rangeValue}
          checked={checked}
          handleRangeChange={handleRangeChange}
        />
      )}
      <div className="h-2"></div>

      {/* İkinci RangeOne (sabitleştirilmiş, voltage ayarlıyor) */}
      <RangeOne
        checked={true}
        rangeValue={voltage}
        handleRangeChange={handleVoltageChange}
      />

      {/* secondcheck açıksa speed component’i */}
      {secondcheck && (
        <div className="flex justify-center">
          <Component
            rangevalue={rangeValue}
            setvalue={setRangeValue}
            checked={checked}
          />
        </div>
      )}

      {/* Kaydet / Güncelle ve Sil butonları */}
      <div className="flex justify-between mt-4">
        <button className="btn btn-primary" onClick={handleSave}>
          {isEditMode ? "Güncelle" : "Kaydet"}
        </button>
        <button className="btn btn-danger" onClick={onRemove}>
          Sil
        </button>
      </div>
    </div>
  );
};

export default MotorCard;

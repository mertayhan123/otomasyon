"use client";
import React, { useState } from "react";

interface Vana {
  _id: string;
  name: string;
  location: string;
  openness: number;
  createdAt: string;
}

interface Props {
  vanas: Vana[];
  onRefresh: () => void;
}

const VanaDetails: React.FC<Props> = ({ vanas, onRefresh }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<Record<string, number>>({});

  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/vana?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.message || "Silme hatası");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      setLoadingId(id);
      const vana = vanas.find((v) => v._id === id);
      if (!vana) return;
      const newValue = editStates[id] ?? vana.openness;

      const res = await fetch("/api/vana", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: vana.name,
          location: vana.location,
          openness: newValue,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.message || "Güncelleme hatası");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {vanas.map((vana) => (
        <div
          key={vana._id}
          className="bg-blue-100 dark:bg-gray-700 p-4 rounded-lg shadow space-y-2"
        >
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {vana.name}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Konum: {vana.location}
          </p>

          <div className="flex flex-col">
            <input
              type="range"
              min={0}
              max={100}
              value={editStates[vana._id] ?? vana.openness}
              onChange={(e) =>
                setEditStates({
                  ...editStates,
                  [vana._id]: Number(e.target.value),
                })
              }
              className="range range-primary"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 text-center">
              Açıklık: {editStates[vana._id] ?? vana.openness}%
            </span>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => handleUpdate(vana._id)}
              className="btn btn-sm btn-success"
              disabled={loadingId === vana._id}
            >
              {loadingId === vana._id ? "Kaydediliyor..." : "Güncelle"}
            </button>
            <button
              onClick={() => handleDelete(vana._id)}
              className="btn btn-sm btn-error"
              disabled={loadingId === vana._id}
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VanaDetails;

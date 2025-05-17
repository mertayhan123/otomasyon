"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Vana {
  _id: string;
  name: string;
  location: string;
  openness: number;
  createdAt: string;
}

const VanalarPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vanas, setVanas] = useState<Vana[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    openness: 50,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  const fetchVanas = async () => {
    try {
      const res = await fetch("/api/vana");
      const data = await res.json();
      if (data.success) setVanas(data.vanas);
      else setError(data.message || "Vanalar getirilemedi.");
    } catch {
      setError("Sunucu hatas\u0131.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchVanas();
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/vanakayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ name: "", location: "", openness: 50 });
        fetchVanas();
      } else setError(data.message || "Vana eklenemedi");
    } catch {
      setError("Sunucu hatas\u0131.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Vanalar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Oransal vanalar\u0131 y\u00f6netin ve kontrol edin
          </p>
        </header>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vana Ekleme Formu */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Yeni Vana Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Vana Ad\u0131"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Konum"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <input
                type="range"
                name="openness"
                min={0}
                max={100}
                value={formData.openness}
                onChange={handleChange}
                className="range range-primary w-full"
              />
              <div className="text-center text-sm text-gray-500">A\u00e7\u0131kl\u0131k: {formData.openness}%</div>
              <button type="submit" className="btn btn-primary w-full">
                Vana Ekle
              </button>
            </form>
          </div>

          {/* Mevcut Vanalar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Mevcut Vanalar</h2>
            {vanas.length > 0 ? (
              <div className="space-y-4">
                {vanas.map((vana) => (
                  <div key={vana._id} className="bg-blue-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{vana.name}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Konum: {vana.location}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">A\u00e7\u0131kl\u0131k: {vana.openness}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Hen\u00fcz vana eklenmedi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VanalarPage;

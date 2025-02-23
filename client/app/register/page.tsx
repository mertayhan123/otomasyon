"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Lütfen tüm alanları doldurunuz");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const resUser = await fetch("/api/userExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUser.json();
      if (user) {
        setError("Bu e-posta adresi zaten kullanılmakta");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        setError("Kayıt başarısız, lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-semibold mb-4">Kayıt Ol</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />
          {error && (
            <div className="mt-3 p-2 text-red-700 bg-red-200 border border-red-500 rounded-md">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Kayıt Ol
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Zaten bir hesabınız var mı?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

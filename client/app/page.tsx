"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { motion } from "framer-motion";
import PageTransition from "./components/PageTransition";

export default function Home() {
  const { data: session } = useSession();

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex items-center justify-center px-6">
        <motion.div
          className="max-w-4xl w-full p-10 rounded-3xl shadow-2xl bg-black/60 backdrop-blur-md border border-gray-700"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div className="text-center mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-5xl font-extrabold text-indigo-400 tracking-wide">Otomasyon Sistemi</h1>
            <p className="text-gray-300 mt-3 text-lg">Akıllı Kontrol & Gerçek Zamanlı İzleme</p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Özellikler */}
            <motion.div
              className="space-y-4"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-indigo-300">🚀 Özellikler</h2>
              <ul className="space-y-2 text-gray-300 list-disc list-inside">
                <li>Gerçek zamanlı sensör verisi</li>
                <li>Motor ve cihaz kontrolü</li>
                <li>Kullanıcı dostu arayüz</li>
                <li>Uzaktan erişim imkânı</li>
              </ul>
            </motion.div>

            {/* Teknolojiler */}
            <motion.div
              className="space-y-4"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-indigo-300">🛠️ Kullanılan Teknolojiler</h2>
              <ul className="space-y-2 text-gray-300 list-disc list-inside">
                <li>Next.js & React</li>
                <li>TailwindCSS & DaisyUI</li>
                <li>Node.js & Express</li>
                <li>Arduino & ESP8266</li>
              </ul>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href={session ? "/main" : "/login"}
              className="btn btn-wide btn-primary text-white text-lg transition hover:scale-105"
            >
              {session ? `${session.user?.name} ile Devam Et` : "Giriş Yap"}
            </a>
            <p className="text-sm text-gray-400 mt-2 italic">
              Geleceğin otomasyon çözümlerine bir adım daha yakınsınız.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

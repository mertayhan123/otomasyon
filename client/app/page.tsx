"use client";
import { useSession } from "next-auth/react";
import React from "react";





function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">
          Otomasyon Sistemi
        </h1>

        <p className="text-lg text-gray-700 mb-4">
          Bu sistem, sensörlerden gelen verileri analiz ederek, motor ve diğer
          cihazları uzaktan kontrol etmenizi sağlar. Veriler anlık olarak takip
          edilir ve sistem üzerinde kolayca değişiklik yapılabilir.
        </p>

        <div className="text-left mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Özellikler:
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Gerçek zamanlı sensör verilerini izleme</li>
            <li>Motor değerlerini anlık olarak değiştirme</li>
            <li>Kullanıcı dostu ve dinamik arayüz</li>
          </ul>
        </div>

        <div className="text-left">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Kullanılan Teknolojiler:
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>ReactJS</li>
            <li>DaisyUI & TailwindCSS</li>
            <li>Node.js & Express.js</li>
            <li>Arduino & ESP8266</li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="text-gray-600">
            Bu sistem, geleceğin otomasyon çözümlerine öncülük eder.
          </p>
        </div>

        <div>
          {session ? (
            <a href="/main" className="btn btn-ghost">
              {session.user?.name}
            </a>
          ) : (
            <a href="/login" className="btn btn-ghost">
              Login
            </a>
          )}
        </div>
      </div>
     
    </div>
  );
}

export default Home;

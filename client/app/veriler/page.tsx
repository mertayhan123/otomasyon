"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { motion } from "framer-motion";

type SensorData = {
  time: string;
  debi: number;
  seviye: number;
  sicaklik: number;
  pH: number;
};

const SensorChartsOnly = () => {
  const [data, setData] = useState<SensorData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      setData((prev) => [
        ...prev.slice(-9),
        {
          time: now,
          debi: Math.floor(Math.random() * 100),
          seviye: Math.floor(Math.random() * 3) + 1,
          sicaklik: Math.floor(Math.random() * 20) + 10,
          pH: Math.random() * 2 + 6,
        },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="p-6 space-y-10 bg-gray-900 min-h-screen text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold text-center">Gerçek Zamanlı Sensör Grafik Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-4 shadow-md text-black">
          <h2 className="text-xl font-semibold mb-2">Debi ve Seviye</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" label={{ value: "Debi", angle: -90, position: "insideLeft" }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: "Seviye", angle: -90, position: "insideRight" }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="debi" stroke="#3b82f6" />
              <Line yAxisId="right" type="monotone" dataKey="seviye" stroke="#f97316" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-black">
          <h2 className="text-xl font-semibold mb-2">Sıcaklık Zaman Grafiği</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="sicaklik" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-black">
          <h2 className="text-xl font-semibold mb-2">pH Değeri</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[5, 9]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="pH" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-black">
          <h2 className="text-xl font-semibold mb-2">Debi Anlık Gösterge</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={data.slice(-1).map((d) => ({ name: "Debi", value: d.debi, fill: "#6366f1" }))}
              barSize={20}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background  dataKey="value" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default SensorChartsOnly;
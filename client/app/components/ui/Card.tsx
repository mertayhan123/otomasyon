// components/ui/Card.tsx
import React from "react";

export const Card = ({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-xl border shadow p-4 bg-white ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className}>
    {children}
  </div>
);

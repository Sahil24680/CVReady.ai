"use client";

import React from "react";

export default function SectionCard({
  title,
  icon,
  children,
  className = "",
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg shadow-blue-100/50 p-6 border border-blue-50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/70 ${className}`}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-blue-50">
          {icon && <div className="text-blue-600">{icon}</div>}
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
}

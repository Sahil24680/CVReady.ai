"use client";

import React from "react";

// GhostButton
export function GhostButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
  }
) {
  const { children, icon, className = "", ...rest } = props;
  return (
    <button
      className={`px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

// PrimaryButton
export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: React.ReactNode;
    loading?: boolean;
    className?: string;
    children: React.ReactNode;
  }
) {
  const { children, icon, loading, className = "", ...rest } = props;
  return (
    <button
      className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
      {...rest}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

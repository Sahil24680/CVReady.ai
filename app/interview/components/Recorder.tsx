"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Mic, RefreshCw, Square } from "lucide-react";
import {  GhostButton } from "./Buttons";

export default function Recorder({
  onRecordingComplete,
  hasRecording,
}: {
  onRecordingComplete: (duration: number) => void;
  hasRecording: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      onRecordingComplete(seconds);
    } else {
      setSeconds(0);
      setIsRecording(true);
    }
  };

  const handleReRecord = () => {
    setSeconds(0);
    setIsRecording(false);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleToggleRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200"
              : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-200 hover:scale-110"
          } active:scale-95`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <Square className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
        </button>

        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 font-mono">{formatTime(seconds)}</div>
          <p className="text-sm text-gray-500 mt-1">{isRecording ? "Recording..." : "Ready to record"}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 h-16 bg-blue-50 rounded-xl px-4">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-blue-400 rounded-full transition-all duration-300 ${isRecording ? "animate-pulse" : ""}`}
            style={{
              height: isRecording ? `${Math.random() * 100}%` : `${20 + (i % 30)}%`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {hasRecording && !isRecording && (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Recording Complete</p>
              <p className="text-xs text-gray-500">Duration: {formatTime(seconds)}</p>
            </div>
          </div>
          <GhostButton icon={<RefreshCw className="w-4 h-4" />} onClick={handleReRecord} className="text-sm">
            Re-record
          </GhostButton>
        </div>
      )}
    </div>
  );
}

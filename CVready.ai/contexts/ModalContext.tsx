"use client";
import { createContext, useContext, useState } from "react";

type ModalContextType = {
  showEvaluation: boolean;
  openEvaluation: () => void;
  closeEvaluation: () => void;
};

const ModalContext = createContext<ModalContextType>({
  showEvaluation: false,
  openEvaluation: () => {},
  closeEvaluation: () => {},
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [showEvaluation, setShowEvaluation] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        showEvaluation,
        openEvaluation: () => setShowEvaluation(true),
        closeEvaluation: () => setShowEvaluation(false),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

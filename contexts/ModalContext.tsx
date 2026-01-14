"use client";
import { createContext, useContext, useState } from "react";

/**
 * Context for managing global modal visibility state.
 * Currently handles the evaluation modal shown after resume upload.
 */
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

/** Provider component that manages modal open/close state */
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

/** Hook to access modal state and controls from any component */
export const useModal = () => useContext(ModalContext);

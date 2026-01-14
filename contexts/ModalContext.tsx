"use client";
import { createContext, useContext, useState } from "react";

/**
 * ModalContext - Global state for managing modal visibility.
 *
 * Features:
 * - Controls the evaluation modal visibility across the app
 * - Provides open/close functions to toggle modal state
 * - Must be wrapped with ModalProvider at the app root level
 */

type ModalContextType = {
  isEvaluationModalOpen: boolean;
  openEvaluationModal: () => void;
  closeEvaluationModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  isEvaluationModalOpen: false,
  openEvaluationModal: () => {},
  closeEvaluationModal: () => {},
});

/**
 * Provider component that wraps the app to enable modal state management
 */
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isEvaluationModalOpen,
        openEvaluationModal: () => setIsEvaluationModalOpen(true),
        closeEvaluationModal: () => setIsEvaluationModalOpen(false),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Hook to access modal state and controls from any component
 */
export const useModal = () => useContext(ModalContext);

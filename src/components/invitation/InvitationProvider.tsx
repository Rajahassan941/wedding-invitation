"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface InvitationState {
  /**
   * True once the guest has scrolled through the envelope opening
   * (or immediately when the cover is disabled). Drives the hero and navbar entrance.
   */
  isOpen: boolean;
  open: () => void;
}

const InvitationContext = createContext<InvitationState>({ isOpen: true, open: () => {} });

export function useInvitation() {
  return useContext(InvitationContext);
}

interface InvitationProviderProps {
  coverEnabled: boolean;
  children: ReactNode;
}

export function InvitationProvider({ coverEnabled, children }: InvitationProviderProps) {
  const [isOpen, setIsOpen] = useState(!coverEnabled);
  const open = useCallback(() => setIsOpen(true), []);
  const value = useMemo(() => ({ isOpen, open }), [isOpen, open]);

  return (
    <InvitationContext.Provider value={value}>
      {/* Honour the OS "reduce motion" setting: transforms are skipped, fades remain. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </InvitationContext.Provider>
  );
}

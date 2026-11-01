import { createContext, useContext, useState, type ReactNode } from "react";

const EnvContext = createContext<{ live: boolean; setLive: (v: boolean) => void }>({ live: true, setLive: () => {} });

export function EnvProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState(true);
  return <EnvContext.Provider value={{ live, setLive }}>{children}</EnvContext.Provider>;
}

export const useEnv = () => useContext(EnvContext);

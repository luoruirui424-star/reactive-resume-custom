import type { WritableDraft } from "immer";

import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand/react";

export type AIProvider = "vercel-ai-gateway" | "openai" | "gemini" | "anthropic" | "ollama" | "qwen" | "deepseek";

type TestStatus = "unverified" | "success" | "failure";

type AIStoreState = {
  enabled: boolean;
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseURL: string;
  testStatus: TestStatus;
};

type AIStoreActions = {
  canEnable: () => boolean;
  setEnabled: (value: boolean) => void;
  set: (fn: (draft: WritableDraft<AIStoreState>) => void) => void;
  reset: () => void;
  exportConfig: () => AIStoreState;
  importConfig: (config: Partial<AIStoreState>) => void;
};

type AIStore = AIStoreState & AIStoreActions;

const initialState: AIStoreState = {
  enabled: false,
  provider: "openai",
  model: "",
  apiKey: "",
  baseURL: "",
  testStatus: "unverified",
};

export const useAIStore = create<AIStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      set: (fn) => {
        set((draft) => {
          const prev = {
            provider: draft.provider,
            model: draft.model,
            apiKey: draft.apiKey,
            baseURL: draft.baseURL,
          };

          fn(draft);

          if (
            draft.provider !== prev.provider ||
            draft.model !== prev.model ||
            draft.apiKey !== prev.apiKey ||
            draft.baseURL !== prev.baseURL
          ) {
            draft.testStatus = "unverified";
            draft.enabled = false;
          }
        });
      },
      reset: () => set(() => initialState),
      canEnable: () => {
        const { testStatus } = get();
        return testStatus === "success";
      },
      setEnabled: (value: boolean) => {
        const canEnable = get().canEnable();
        if (value && !canEnable) return;
        set((draft) => {
          draft.enabled = value;
        });
      },
      exportConfig: () => {
        const state = get();
        return {
          enabled: state.enabled,
          provider: state.provider,
          model: state.model,
          apiKey: state.apiKey,
          baseURL: state.baseURL,
          testStatus: state.testStatus,
        };
      },
      importConfig: (config: Partial<AIStoreState>) => {
        set((draft) => {
          if (config.enabled !== undefined) draft.enabled = config.enabled;
          if (config.provider !== undefined) draft.provider = config.provider;
          if (config.model !== undefined) draft.model = config.model;
          if (config.apiKey !== undefined) draft.apiKey = config.apiKey;
          if (config.baseURL !== undefined) draft.baseURL = config.baseURL;
          if (config.testStatus !== undefined) draft.testStatus = config.testStatus;

          // 导入配置后重置测试状态，确保安全性
          draft.testStatus = "unverified";
          draft.enabled = false;
        });
      },
    })),
    {
      name: "ai-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        enabled: state.enabled,
        provider: state.provider,
        model: state.model,
        apiKey: state.apiKey,
        baseURL: state.baseURL,
        testStatus: state.testStatus,
      }),
    },
  ),
);

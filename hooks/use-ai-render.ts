export function useAIRender() {
  return {
    state: 'idle' as const,
    stagedLabel: '',
    resultImage: null,
    isFallback: false,
    fallbackBadgeText: null,
    toast: null,
    setToast: () => {},
    sessionLimitReached: false,
    renderWithAI: async () => {},
    resetToIdle: () => {},
    abortInFlight: () => {},
  };
}

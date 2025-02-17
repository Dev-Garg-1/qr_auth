import { create } from "zustand";

const useStore = create((set) => ({
  count: "0x8cfe8c975399eda47242cf020e7db4b042fc50afeca4de08bb41a271b3d6ad0a",
  inc: () => set((state) => ({ count: state.count })),
}));

export default useStore;

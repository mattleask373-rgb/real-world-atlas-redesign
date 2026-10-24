/**
 * PROTOTYPE STATE ONLY. Browser memory for the redesign preview.
 * Do not add this store beside the canonical app. Saves, offers, needs and
 * profile name in production stay on the existing auth and data paths.
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserOffer = {
  id: string;
  cityId: string;
  kind: "skill" | "hour";
  title: string;
  note: string;
  when: string;
};

export type UserNeed = {
  id: string;
  cityId: string;
  title: string;
  note: string;
  when: string;
};

export type UserMoment = {
  id: string;
  cityId: string;
  caption: string;
};

type AtlasState = {
  cityId: string;
  query: string;
  saved: string[];
  yourName: string;
  offers: UserOffer[];
  needs: UserNeed[];
  moments: UserMoment[];
  liked: string[];
  setCity: (cityId: string) => void;
  setQuery: (query: string) => void;
  setYourName: (yourName: string) => void;
  toggleSaved: (id: string) => void;
  addOffer: (offer: UserOffer) => void;
  addNeed: (need: UserNeed) => void;
  addMoment: (moment: UserMoment) => void;
  toggleLike: (id: string) => void;
};

const memory = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useAtlas = create<AtlasState>()(
  persist(
    (set, get) => ({
      cityId: "lisbon",
      query: "",
      saved: [],
      yourName: "",
      offers: [],
      needs: [],
      moments: [],
      liked: [],
      setCity: (cityId) => set({ cityId }),
      setQuery: (query) => set({ query }),
      setYourName: (yourName) => set({ yourName }),
      toggleSaved: (id) =>
        set({
          saved: get().saved.includes(id) ? get().saved.filter((item) => item !== id) : [...get().saved, id],
        }),
      addOffer: (offer) => set({ offers: [offer, ...get().offers] }),
      addNeed: (need) => set({ needs: [need, ...get().needs] }),
      addMoment: (moment) => set({ moments: [moment, ...get().moments] }),
      toggleLike: (id) =>
        set({
          liked: get().liked.includes(id) ? get().liked.filter((item) => item !== id) : [...get().liked, id],
        }),
    }),
    {
      name: "real-world-atlas",
      storage: createJSONStorage(() => (typeof window === "undefined" ? memory : window.localStorage)),
      skipHydration: true,
      partialize: (state) => ({
        cityId: state.cityId,
        saved: state.saved,
        yourName: state.yourName,
        offers: state.offers,
        needs: state.needs,
        moments: state.moments,
        liked: state.liked,
      }),
    },
  ),
);

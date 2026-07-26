
import { create } from "zustand";

import { IdentityProfile }
from "../types/identity";

interface IdentityState {
profile:
IdentityProfile | null;

setProfile: (
profile: IdentityProfile
) => void;
}

export const useIdentityStore =
create<IdentityState>((set) => ({
profile: null,

setProfile: (profile) =>
  set({
    profile,
  }),

}));


import { createContext, useContext } from "react";
import AuthStore from "./authStore";
import AssetStore from "./assetStore";

interface Store {
    authStore: AuthStore;
    assetStore: AssetStore;
}

export const store: Store = {
    authStore: new AuthStore(),
    assetStore: new AssetStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
import { makeAutoObservable, runInAction } from "mobx";
import type { Asset } from "../models/asset";
import agent from "../api/agent";

export default class AssetStore {
    assets: Asset[] = [];
    loading = false;
    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    constructor() {
        makeAutoObservable(this);
    }

    loadAssets = async () => {
        this.loading = true;

        const cachedData = localStorage.getItem('assets_cache');
        if (cachedData && this.currentPage === 1) {
            runInAction(() => {
                this.assets = JSON.parse(cachedData);
            });
        }

        try {            const data: any = await agent.Assets.list(this.currentPage, this.pageSize);
            
            runInAction(() => {
                this.assets = data.items;
                this.totalCount = data.totalCount;
                this.loading = false;
                
                if (this.currentPage === 1) {
                    localStorage.setItem('assets_cache', JSON.stringify(data.items));
                }
            });
        } catch (error) {
            runInAction(() => this.loading = false);
            console.error(error);
        }
    }

    createAsset = async (asset: Asset) => {
        try {
            const newAsset = await agent.Assets.create(asset);
            runInAction(() => {
                this.assets.push(newAsset);
                this.totalCount++;
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    setPage = (page: number) => {
        this.currentPage = page;
        this.loadAssets();
    }
}
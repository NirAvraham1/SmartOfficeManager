import { makeAutoObservable, runInAction } from "mobx";
import type { Asset } from "../models/asset";
import agent from "../api/agent";

export default class AssetStore {
    assets: Asset[] = [];
    loading = false;
    // שדות חדשים עבור ה-Pagination
    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    constructor() {
        makeAutoObservable(this);
    }

    // מימוש ה-Pagination וה-Caching (Stale-While-Revalidate)
    loadAssets = async () => {
        this.loading = true;

        // שלב 1: טעינה מהירה מה-Cache (רק בדף הראשון)
        const cachedData = localStorage.getItem('assets_cache');
        if (cachedData && this.currentPage === 1) {
            runInAction(() => {
                this.assets = JSON.parse(cachedData);
            });
        }

        try {
            // שלב 2: פנייה ל-API עם פרמטרי הדף והגודל
            const data: any = await agent.Assets.list(this.currentPage, this.pageSize);
            
            runInAction(() => {
                this.assets = data.items;
                this.totalCount = data.totalCount;
                this.loading = false;
                
                // שלב 3: עדכון ה-Cache עבור הדף הראשון
                if (this.currentPage === 1) {
                    localStorage.setItem('assets_cache', JSON.stringify(data.items));
                }
            });
        } catch (error) {
            runInAction(() => this.loading = false);
            console.error(error);
        }
    }

    // הפונקציה שהייתה חסרה - יצירת Asset חדש
    createAsset = async (asset: Asset) => {
        try {
            const newAsset = await agent.Assets.create(asset);
            runInAction(() => {
                // הוספת הנכס החדש לרשימה המקומית
                this.assets.push(newAsset);
                // עדכון ה-TotalCount כדי שהדפדוף יישאר מסונכרן
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
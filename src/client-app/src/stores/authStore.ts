import { makeAutoObservable, runInAction } from "mobx";
import type { User, UserFormValues } from "../models/user";
import agent from "../api/agent";

export default class AuthStore {
    user: User | null = null;
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() { return !!this.user; }
    get isAdmin() { return this.user?.role === 'Admin'; }

    login = async (creds: UserFormValues) => {
    this.loading = true;
    try {
        const user = await agent.Auth.login(creds);
        
        runInAction(() => {
            this.user = user; 
            this.loading = false;
        });
        
    } catch (error) {
        runInAction(() => this.loading = false);
        throw error;
    }
    };

    logout = async () => {
        try {
            runInAction(() => {
                this.user = null;
                window.location.href = '/';
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
}
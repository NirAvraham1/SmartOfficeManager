import { makeAutoObservable, runInAction } from "mobx";
import type { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { jwtDecode } from "jwt-decode";

export default class AuthStore {
    user: User | null = null;
    loading = false;

    constructor() {
        makeAutoObservable(this);
        const token = window.localStorage.getItem('jwt');
        if (token) this.setSimpleUser(token);
    }

    private setSimpleUser = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            
            const roleKey = Object.keys(decoded).find(k => k.toLowerCase().endsWith('role'));
            const rawRole = roleKey ? decoded[roleKey] : null;
            
            const role = Array.isArray(rawRole) 
                ? (rawRole.some(r => r.toLowerCase() === 'admin') ? 'Admin' : 'Member')
                : (rawRole?.toLowerCase() === 'admin' ? 'Admin' : 'Member');

            const username = decoded["unique_name"] || decoded["sub"] || "User";

            runInAction(() => {
                this.user = { username, token, role };
            });
        } catch (error) {
            window.localStorage.removeItem('jwt');
        }
    }

    get isLoggedIn() { return !!this.user; }
    get isAdmin() { return this.user?.role === 'Admin'; }

    login = async (creds: UserFormValues) => {
        this.loading = true;
        try {
            const response = await agent.Auth.login(creds);
            const token = (response as any).token;
            runInAction(() => {
                this.setSimpleUser(token);
                this.loading = false;
            });
            window.localStorage.setItem('jwt', token);
        } catch (error) {
            runInAction(() => this.loading = false);
            throw error;
        }
    };

    logout = () => {
        window.localStorage.removeItem('jwt');
        runInAction(() => { this.user = null; });
    };
}
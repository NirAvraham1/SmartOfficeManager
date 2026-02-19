import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { User, UserFormValues } from '../models/user';
import type { Asset } from '../models/asset';

// משיכת הכתובות מקובץ ה-ENV
const IDENTITY_URL = import.meta.env.VITE_IDENTITY_URL;
const RESOURCE_URL = import.meta.env.VITE_RESOURCE_URL;

// הגדרה קריטית למשלוח Cookies באופן אוטומטי
axios.defaults.withCredentials = true;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
};

const Auth = {
    login: (user: UserFormValues) => requests.post<User>(`${IDENTITY_URL}/auth/login`, user),
    register: (user: UserFormValues) => requests.post<void>(`${IDENTITY_URL}/auth/register`, user),
};

const Assets = {
    list: (page: number, pageSize: number) => 
        axios.get(`${RESOURCE_URL}/assets?page=${page}&pageSize=${pageSize}`).then(responseBody),
    create: (asset: Asset) => requests.post<Asset>(`${RESOURCE_URL}/assets`, asset),
};

const agent = {
    Auth,
    Assets
};

export default agent;
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { User, UserFormValues } from '../models/user';
import type { Asset } from '../models/asset';

const IDENTITY_URL = 'http://localhost:5197';
const RESOURCE_URL = 'http://localhost:5259';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = window.localStorage.getItem('jwt');
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

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
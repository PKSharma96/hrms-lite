import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Event bus for global loading state
export const loadingEmitter = {
    listeners: [],
    subscribe(fn) { this.listeners.push(fn); },
    emit(val) { this.listeners.forEach(fn => fn(val)); }
};

let requestCount = 0;

api.interceptors.request.use((config) => {
    requestCount++;
    loadingEmitter.emit(true);
    return config;
});

api.interceptors.response.use(
    (response) => {
        requestCount--;
        if (requestCount === 0) loadingEmitter.emit(false);
        return response;
    },
    (error) => {
        requestCount--;
        if (requestCount === 0) loadingEmitter.emit(false);
        return Promise.reject(error);
    }
);

export const staffRegistry = {
    getAll: () => api.get('/staff/registry'),
    enroll: (data) => api.post('/staff/registry', data),
    terminate: (id) => api.delete(`/staff/registry/${id}`),
};

export const activityMonitor = {
    logEntry: (data) => api.post('/presence/logs', data),
    getMemberLogs: (id) => api.get(`/presence/logs/${id}`),
    getGlobalLogs: () => api.get('/presence/registry'),
};

export const dataInsights = {
    getOverview: (date) => api.get('/analytics/overview', { params: { target_date: date } }),
};

// Keep-Alive Heartbeat for Render deployments
export const systemGate = {
    heartbeat: () => api.get('/'),
};

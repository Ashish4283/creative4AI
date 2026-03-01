const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'http://localhost/api';

const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('saas_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

// --- AUTHENTICATION API ---
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    } catch (e) {
        throw e;
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return await response.json();
    } catch (e) {
        throw e;
    }
};

export const googleLogin = async (credential) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/google.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential })
        });
        return await response.json();
    } catch (e) {
        throw e;
    }
};

// --- WORKFLOW API ---

export const getWorkflows = async (page = 1, limit = 50) => {
    try {
        // Uses the authenticated fetch mapping to current user
        return await fetchWithAuth(`/get-workflows.php?page=${page}&limit=${limit}`);
    } catch (error) {
        console.error("Error fetching workflows:", error);
        throw error;
    }
};

export const saveWorkflow = async (workflowData) => {
    try {
        return await fetchWithAuth(`/save-workflow.php`, {
            method: 'POST',
            body: JSON.stringify(workflowData),
        });
    } catch (error) {
        console.error("Error saving workflow:", error);
        throw error;
    }
};

// --- DASHBOARD API ---
export const getAdminDashboardStats = async () => {
    return await fetchWithAuth(`/admin/dashboard.php`);
};

export const getUserDashboardStats = async () => {
    return await fetchWithAuth(`/user/dashboard.php`);
};

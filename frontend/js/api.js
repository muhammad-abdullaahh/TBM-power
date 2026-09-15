// In local development, use localhost:8000. In production, use your deployed Vercel backend URL.
const PRODUCTION_API_URL = 'https://tbm-power-backend.vercel.app'; // Replace with your actual backend Vercel URL once deployed
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : PRODUCTION_API_URL;

// ==========================================
// Session Management (Cart)
// ==========================================
function getSessionId() {
    let sessionId = localStorage.getItem('tbm_session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('tbm_session_id', sessionId);
    }
    return sessionId;
}

// ==========================================
// Admin Token Management
// ==========================================
function getAdminToken() {
    return localStorage.getItem('tbm_admin_token');
}

function setAdminToken(token) {
    localStorage.setItem('tbm_admin_token', token);
}

function clearAdminToken() {
    localStorage.removeItem('tbm_admin_token');
}

// ==========================================
// Core Fetch Wrappers
// ==========================================
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    // If FormData (e.g., file upload), don't set Content-Type so browser sets boundary
    if (options.body instanceof FormData) {
        delete defaultHeaders['Content-Type'];
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        }
    };

    try {
        const response = await fetch(url, config);
        
        // Handle no content
        if (response.status === 204) return null;
        
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            // Throw custom error object containing status and backend detail
            throw {
                status: response.status,
                detail: data.detail || data || 'An error occurred',
                originalResponse: response
            };
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function fetchAdmin(endpoint, options = {}) {
    const token = getAdminToken();
    if (!token) {
        // Redirect to admin login if no token
        window.location.href = '/admin/login.html';
        return;
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    try {
        return await fetchAPI(endpoint, { ...options, headers });
    } catch (error) {
        if (error.status === 401) {
            clearAdminToken();
            window.location.href = '/admin/login.html';
        }
        throw error;
    }
}

// ==========================================
// API Services
// ==========================================
const api = {
    products: {
        list: (categoryId = null) => {
            const query = categoryId ? `?category_id=${categoryId}` : '';
            return fetchAPI(`/products${query}`);
        },
        get: (slug) => fetchAPI(`/products/${slug}`)
    },
    categories: {
        list: () => fetchAPI(`/categories`)
    },
    cart: {
        get: () => fetchAPI(`/cart/${getSessionId()}`),
        addItem: (productId, quantity) => fetchAPI(`/cart/${getSessionId()}/items`, {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, quantity })
        }),
        removeItem: (productId) => fetchAPI(`/cart/${getSessionId()}/items/${productId}`, {
            method: 'DELETE'
        })
    },
    orders: {
        create: (orderData) => fetchAPI(`/orders/`, {
            method: 'POST',
            body: JSON.stringify({ ...orderData, session_id: getSessionId() })
        })
    },
    leads: {
        create: (leadData) => fetchAPI(`/solar-leads`, {
            method: 'POST',
            body: JSON.stringify(leadData)
        })
    },
    admin: {
        login: (username, password) => {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            
            return fetchAPI('/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });
        },
        products: {
            create: (data) => fetchAdmin('/admin/products', {
                method: 'POST',
                body: JSON.stringify(data)
            }),
            update: (id, data) => fetchAdmin(`/admin/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            }),
            delete: (id) => fetchAdmin(`/admin/products/${id}`, {
                method: 'DELETE'
            }),
            uploadImage: (file) => {
                const formData = new FormData();
                formData.append('file', file);
                return fetchAdmin('/admin/products/upload-image', {
                    method: 'POST',
                    body: formData
                });
            }
        },
        orders: {
            list: (status = null) => {
                const query = status ? `?status=${status}` : '';
                return fetchAdmin(`/admin/orders${query}`);
            },
            updateStatus: (id, status) => fetchAdmin(`/admin/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            })
        },
        leads: {
            list: () => fetchAdmin('/admin/leads')
        },
        categories: {
            create: (data) => fetchAdmin('/admin/categories', {
                method: 'POST',
                body: JSON.stringify(data)
            })
        }
    }
};

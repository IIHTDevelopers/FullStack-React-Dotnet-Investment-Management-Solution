const API_BASE_URL = 'http://localhost:8081/investment/api/investments';

const getAllInvestments = async () => {
    const response = await fetch(API_BASE_URL);
    return response.json();
};

const getInvestmentById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return response.json();
};

const createInvestment = async (investment) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(investment),
    });
    return response.json();
};

const updateInvestment = async (id, investment) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(investment),
    });
    return response.json();
};

const deleteInvestment = async (id) => {
    await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
};

const fetchByCategories = async (category) => {
    const response = await fetch(`${API_BASE_URL}/category/${category}`, {
        method: 'GET',
    });
    return response.json();
};

export default {
    getAllInvestments,
    getInvestmentById,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    fetchByCategories
};

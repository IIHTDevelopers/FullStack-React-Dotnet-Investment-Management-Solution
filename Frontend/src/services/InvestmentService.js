const apiUrl = 'http://localhost:5000';

const getAllInvestments = async () => {
    const response = await fetch(`${apiUrl}/get-all-investments`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const getInvestmentById = async (id) => {
    const response = await fetch(`${apiUrl}/get-Investment-by-id?id=${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const createInvestment = async (investment) => {
    const response = await fetch(`${apiUrl}/create-investment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investment),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const updateInvestment = async (investment) => {
    const response = await fetch(`${apiUrl}/update-investment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investment),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const deleteInvestment = async (id) => {
    const response = await fetch(`${apiUrl}/delete-Investment?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export default {
    getAllInvestments,
    getInvestmentById,
    createInvestment,
    updateInvestment,
    deleteInvestment
};

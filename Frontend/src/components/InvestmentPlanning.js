import React, { useEffect, useState } from 'react';
import InvestmentService from '../services/InvestmentService';

const InvestmentPlanningComponent = () => {
    const [investments, setInvestments] = useState([]);
    const [investment, setInvestment] = useState({ name: '', amount: '', date: '', category: '' });
    const [selectedId, setSelectedId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        loadInvestments();
    }, []);

    const loadInvestments = () => {
        InvestmentService.getAllInvestments().then((data) => {
            setInvestments(data);
            const uniqueCategories = [...new Set(data.map(item => item.category))];
            setCategories(uniqueCategories);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvestment({ ...investment, [name]: value });
    };

    const isCreateButtonDisabled = () => {
        return !investment.name || isNaN(Number(investment.amount)) || isNaN(Date.parse(investment.date)) || !investment.category;
    };

    const handleCreateInvestment = () => {
        InvestmentService.createInvestment(investment).then(() => {
            loadInvestments();
            setInvestment({ name: '', amount: '', date: '', category: '' });
        });
    };

    const handleUpdateInvestment = () => {
        if (selectedId) {
            InvestmentService.updateInvestment(selectedId, investment).then(() => {
                loadInvestments();
                setInvestment({ name: '', amount: '', date: '', category: '' });
                setSelectedId(null);
            });
        }
    };

    const handleEditInvestment = (id) => {
        InvestmentService.getInvestmentById(id).then((data) => {
            const formattedDate = new Date(data.date).toISOString().split('T')[0];
            setInvestment({ ...data, date: formattedDate });
            setSelectedId(id);
        });
    };

    const handleDeleteInvestment = (id) => {
        InvestmentService.deleteInvestment(id).then(() => {
            loadInvestments();
            setInvestment({ name: '', amount: '', date: '', category: '' });
            setSelectedId(null);
        });
    };

    const handleFilterByCategory = () => {
        if (selectedCategory) {
            InvestmentService.fetchByCategories(selectedCategory).then((data) => setInvestments(data));
        } else {
            loadInvestments();
        }
    };

    return (
        <div>
            <h1>Investments</h1>
            <div>
                <label>Filter by:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <button onClick={handleFilterByCategory}>Apply Filter</button>
            </div>
            <ul>
                {investments.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.amount} - {item.date} - {item.category}
                        <button onClick={() => handleEditInvestment(item.id)}>Edit</button>
                        <button onClick={() => handleDeleteInvestment(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                <h2>Create/Update Investment</h2>
                <input type="text" name="name" value={investment.name} onChange={handleInputChange} placeholder="Name" />
                <input type="number" name="amount" value={investment.amount} onChange={handleInputChange} placeholder="Amount" />
                <input type="date" name="date" value={investment.date} onChange={handleInputChange} placeholder="Date" />
                <input type="text" name="category" value={investment.category} onChange={handleInputChange} placeholder="Category" />
                <button onClick={selectedId ? handleUpdateInvestment : handleCreateInvestment} disabled={isCreateButtonDisabled()}>
                    {selectedId ? 'Update' : 'Create'}
                </button>
            </div>
        </div>
    );
};

export default InvestmentPlanningComponent;
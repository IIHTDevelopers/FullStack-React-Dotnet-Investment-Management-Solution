import React, { useEffect, useState } from 'react';
import InvestmentService from '../services/InvestmentService';

const InvestmentPlanningComponent = () => {
    const [investments, setInvestments] = useState([]);
    const [filteredInvestments, setFilteredInvestments] = useState([]);
    const [investment, setInvestment] = useState({
        investmentId: 0,
        investmentName: '',
        initialInvestmentAmount: 0,
        investmentStartDate: new Date(),
        currentValue: 0,
        investorId: 0
    });
    const [selectedId, setSelectedId] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        loadInvestments();
    }, []);

    const loadInvestments = async () => {
        try {
            const data = await InvestmentService.getAllInvestments();
            setInvestments(data);
            setFilteredInvestments(data);
        } catch (error) {
            console.error('Error loading investments:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInvestment({
            ...investment,
            [name]: name === 'initialInvestmentAmount' || name === 'currentValue' || name === 'investorId'
                ? parseFloat(value)
                : name === 'investmentStartDate'
                    ? new Date(value)
                    : value
        });
    };

    const isCreateButtonDisabled = () => {
        return !investment.investmentName ||
            isNaN(investment.initialInvestmentAmount) ||
            isNaN(Date.parse(investment.investmentStartDate)) ||
            isNaN(investment.currentValue) ||
            isNaN(investment.investorId);
    };

    const handleCreateInvestment = async () => {
        try {
            await InvestmentService.createInvestment(investment);
            setResponseMessage('Investment created successfully!');
            loadInvestments();
            resetInvestmentForm();
        } catch (error) {
            setResponseMessage('Error creating investment: ' + error.message);
        }
    };

    const handleUpdateInvestment = async () => {
        if (selectedId) {
            try {
                await InvestmentService.updateInvestment(investment);
                setResponseMessage('Investment updated successfully!');
                loadInvestments();
                resetInvestmentForm();
                setSelectedId(null);
            } catch (error) {
                setResponseMessage('Error updating investment: ' + error.message);
            }
        }
    };

    const handleEditInvestment = async (id) => {
        try {
            const data = await InvestmentService.getInvestmentById(id);
            setInvestment({ ...data, investmentStartDate: new Date(data.investmentStartDate) });
            setSelectedId(id);
        } catch (error) {
            setResponseMessage(JSON.stringify(error));
        }
    };

    const handleDeleteInvestment = async (id) => {
        try {
            await InvestmentService.deleteInvestment(id);
            setResponseMessage('Investment deleted successfully!');
            loadInvestments();
            resetInvestmentForm();
            setSelectedId(null);
        } catch (error) {
            setResponseMessage('Error deleting investment: ' + error.message);
        }
    };

    const resetInvestmentForm = () => {
        setInvestment({
            investmentId: 0,
            investmentName: '',
            initialInvestmentAmount: 0,
            investmentStartDate: new Date(),
            currentValue: 0,
            investorId: 0
        });
    };

    return (
        <div>
            <h1>All Investments</h1>
            <ul>
                {filteredInvestments.map((item) => (
                    <li key={item.investmentId}>
                        {item.investmentName} - {item.initialInvestmentAmount} - {new Date(item.investmentStartDate).toLocaleDateString()} - {item.currentValue} - {item.investorId}
                        <button onClick={() => handleEditInvestment(item.investmentId)}>Edit</button>
                        <button onClick={() => handleDeleteInvestment(item.investmentId)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                <h2>Create/Update Investment</h2>
                <div>
                    <label htmlFor="investmentName">Investment Name:</label>
                    <input type="text" id="investmentName" name="investmentName" value={investment.investmentName} onChange={handleInputChange} placeholder="Investment Name" />
                </div>
                <div>
                    <label htmlFor="initialInvestmentAmount">Initial Amount:</label>
                    <input type="number" id="initialInvestmentAmount" name="initialInvestmentAmount" value={investment.initialInvestmentAmount} onChange={handleInputChange} placeholder="Initial Amount" />
                </div>
                <div>
                    <label htmlFor="investmentStartDate">Start Date:</label>
                    <input type="date" id="investmentStartDate" name="investmentStartDate" value={investment.investmentStartDate.toISOString().split('T')[0]} onChange={handleInputChange} placeholder="Start Date" />
                </div>
                <div>
                    <label htmlFor="currentValue">Current Value:</label>
                    <input type="number" id="currentValue" name="currentValue" value={investment.currentValue} onChange={handleInputChange} placeholder="Current Value" />
                </div>
                <div>
                    <label htmlFor="investorId">Investor ID:</label>
                    <input type="number" id="investorId" name="investorId" value={investment.investorId} onChange={handleInputChange} placeholder="Investor ID" />
                </div>
                <button onClick={selectedId ? handleUpdateInvestment : handleCreateInvestment} disabled={isCreateButtonDisabled()}>
                    {selectedId ? 'Update' : 'Create'}
                </button>
            </div>
            {responseMessage && <div className="response-message">{responseMessage}</div>}
        </div>
    );
};

export default InvestmentPlanningComponent;

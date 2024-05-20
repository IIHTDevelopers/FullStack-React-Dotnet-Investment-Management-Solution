import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InvestmentPlanningComponent from '../components/InvestmentPlanning';
import InvestmentService from '../services/InvestmentService';

let InvestmentPlanningComp = "InvestmentPlanningComponent";

jest.mock('../services/InvestmentService');

describe(InvestmentPlanningComp, () => {
    const mockInvestments = [
        { investmentId: 1, investmentName: 'Investment 1', initialInvestmentAmount: 100, investmentStartDate: '2023-01-01', currentValue: 150, investorId: 101 },
        { investmentId: 2, investmentName: 'Investment 2', initialInvestmentAmount: 200, investmentStartDate: '2023-02-01', currentValue: 250, investorId: 102 }
    ];

    beforeEach(() => {
        InvestmentService.getAllInvestments.mockResolvedValue(mockInvestments);
        InvestmentService.getInvestmentById.mockResolvedValue(mockInvestments[0]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('boundary', () => {
        test(`${InvestmentPlanningComp} boundary should display all investments on load`, async () => {
            render(<InvestmentPlanningComponent />);
            await waitFor(() => expect(InvestmentService.getAllInvestments).toHaveBeenCalledTimes(1));

            mockInvestments.forEach(investment => {
                expect(screen.getByText((content, element) => {
                    return element.tagName.toLowerCase() === 'li' && content.includes(investment.investmentName);
                })).toBeInTheDocument();

                expect(screen.getByText((content, element) => {
                    return element.tagName.toLowerCase() === 'li' && content.includes(investment.initialInvestmentAmount.toString());
                })).toBeInTheDocument();

                expect(screen.getByText((content, element) => {
                    return element.tagName.toLowerCase() === 'li' && content.includes(new Date(investment.investmentStartDate).toLocaleDateString());
                })).toBeInTheDocument();

                expect(screen.getByText((content, element) => {
                    return element.tagName.toLowerCase() === 'li' && content.includes(investment.currentValue.toString());
                })).toBeInTheDocument();

                expect(screen.getByText((content, element) => {
                    return element.tagName.toLowerCase() === 'li' && content.includes(investment.investorId.toString());
                })).toBeInTheDocument();
            });
        });

        test(`${InvestmentPlanningComp} boundary should have input fields and create/update button`, () => {
            render(<InvestmentPlanningComponent />);
            expect(screen.getByLabelText(/Investment Name:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Initial Amount:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Start Date:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Current Value:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Investor ID:/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
        });

        test(`${InvestmentPlanningComp} boundary should enable the create button when all fields are valid`, () => {
            render(<InvestmentPlanningComponent />);
            fireEvent.change(screen.getByLabelText(/Investment Name:/i), { target: { value: 'New Investment' } });
            fireEvent.change(screen.getByLabelText(/Initial Amount:/i), { target: { value: '1000' } });
            fireEvent.change(screen.getByLabelText(/Start Date:/i), { target: { value: '2023-01-01' } });
            fireEvent.change(screen.getByLabelText(/Current Value:/i), { target: { value: '1200' } });
            fireEvent.change(screen.getByLabelText(/Investor ID:/i), { target: { value: '103' } });

            expect(screen.getByRole('button', { name: /Create/i })).not.toBeDisabled();
        });

        test(`${InvestmentPlanningComp} boundary should handle create investment`, async () => {
            InvestmentService.createInvestment.mockResolvedValue({ message: 'Investment created successfully!' });

            render(<InvestmentPlanningComponent />);
            fireEvent.change(screen.getByLabelText(/Investment Name:/i), { target: { value: 'New Investment' } });
            fireEvent.change(screen.getByLabelText(/Initial Amount:/i), { target: { value: '1000' } });
            fireEvent.change(screen.getByLabelText(/Start Date:/i), { target: { value: '2023-01-01' } });
            fireEvent.change(screen.getByLabelText(/Current Value:/i), { target: { value: '1200' } });
            fireEvent.change(screen.getByLabelText(/Investor ID:/i), { target: { value: '103' } });

            fireEvent.click(screen.getByRole('button', { name: /Create/i }));

            await waitFor(() => expect(InvestmentService.createInvestment).toHaveBeenCalledTimes(1));
            expect(screen.getByText('Investment created successfully!')).toBeInTheDocument();
        });

        test(`${InvestmentPlanningComp} boundary should handle edit investment`, async () => {
            render(<InvestmentPlanningComponent />);
            await waitFor(() => expect(InvestmentService.getAllInvestments).toHaveBeenCalledTimes(1));

            const editButtons = screen.getAllByText(/Edit/i);
            expect(editButtons.length).toBeGreaterThan(0);

            fireEvent.click(editButtons[0]);
            await waitFor(() => expect(InvestmentService.getInvestmentById).toHaveBeenCalledWith(1));

            expect(screen.getByDisplayValue('Investment 1')).toBeInTheDocument();
            expect(screen.getByDisplayValue('100')).toBeInTheDocument();
            expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
            expect(screen.getByDisplayValue('150')).toBeInTheDocument();
            expect(screen.getByDisplayValue('101')).toBeInTheDocument();
        });

        test(`${InvestmentPlanningComp} boundary should handle update investment`, async () => {
            InvestmentService.updateInvestment.mockResolvedValue({ message: 'Investment updated successfully!' });

            render(<InvestmentPlanningComponent />);
            await waitFor(() => expect(InvestmentService.getAllInvestments).toHaveBeenCalledTimes(1));

            const editButtons = screen.getAllByText(/Edit/i);
            expect(editButtons.length).toBeGreaterThan(0);

            fireEvent.click(editButtons[0]);
            await waitFor(() => expect(InvestmentService.getInvestmentById).toHaveBeenCalledWith(1));

            fireEvent.change(screen.getByLabelText(/Investment Name:/i), { target: { value: 'Updated Investment' } });

            const updateButtons = screen.getAllByRole('button', { name: /Update/i });
            expect(updateButtons.length).toBeGreaterThan(0);

            fireEvent.click(updateButtons[0]);

            await waitFor(() => expect(InvestmentService.updateInvestment).toHaveBeenCalledTimes(1));
            expect(screen.getByText('Investment updated successfully!')).toBeInTheDocument();
        });

        test(`${InvestmentPlanningComp} boundary should handle delete investment`, async () => {
            InvestmentService.deleteInvestment.mockResolvedValue({ message: 'Investment deleted successfully!' });

            render(<InvestmentPlanningComponent />);
            await waitFor(() => expect(InvestmentService.getAllInvestments).toHaveBeenCalledTimes(1));

            const deleteButtons = screen.getAllByText(/Delete/i);
            expect(deleteButtons.length).toBeGreaterThan(0);

            fireEvent.click(deleteButtons[0]);
            await waitFor(() => expect(InvestmentService.deleteInvestment).toHaveBeenCalledWith(1));
            expect(screen.getByText('Investment deleted successfully!')).toBeInTheDocument();
        });
    });
});

import investmentService from "../services/InvestmentService";

let InvestmentService = "InvestmentService";

jest.mock("axios");

describe(InvestmentService, () => {
    const mockInvestments = [
        {
            _id: "1",
            name: "Investment 1",
            amount: 1000,
            description: "Description 1",
            category: "Category 1",
        },
        {
            _id: "2",
            name: "Investment 2",
            amount: 2000,
            description: "Description 2",
            category: "Category 2",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("functional", () => {
        test(`${InvestmentService} functional should get all investments`, async () => {
            let isNull = false;
            try {
                const response = await investmentService.getAllInvestments();
                isNull = response === null;
                throw new Error("Error in getAllInvestments()");
            } catch (error) {
                if (isNull) {
                    expect(error).toBeNull();
                } else {
                    investmentService.getAllInvestments = jest
                        .fn()
                        .mockResolvedValueOnce(mockInvestments);
                    const result = await investmentService.getAllInvestments();
                    expect(investmentService.getAllInvestments).toHaveBeenCalled();
                    expect(result).toEqual(mockInvestments);
                }
            }
        });

        test(`${InvestmentService} functional should get investment by ID`, async () => {
            let isNull = false;
            try {
                const response = await investmentService.getInvestmentById("1");
                isNull = response === null;
                throw new Error("Error in getInvestmentById()");
            } catch (error) {
                if (isNull) {
                    expect(error).toBeNull();
                } else {
                    investmentService.getInvestmentById = jest
                        .fn()
                        .mockResolvedValueOnce(mockInvestments[0]);
                    const result = await investmentService.getInvestmentById("1");
                    expect(investmentService.getInvestmentById).toHaveBeenCalledWith("1");
                    expect(result).toEqual(mockInvestments[0]);
                }
            }
        });

        test(`${InvestmentService} functional should delete investment by ID`, async () => {
            let isNull = false;
            try {
                const response = await investmentService.deleteInvestment("1");
                isNull = response === null;
                throw new Error("Error in deleteInvestment()");
            } catch (error) {
                if (isNull) {
                    expect(error).toBeNull();
                } else {
                    investmentService.deleteInvestment = jest
                        .fn()
                        .mockResolvedValueOnce(mockInvestments[0]);
                    const result = await investmentService.deleteInvestment("1");
                    expect(investmentService.deleteInvestment).toHaveBeenCalledWith("1");
                    expect(result).toEqual(mockInvestments[0]);
                }
            }
        });

        test(`${InvestmentService} functional should fetch investments by category`, async () => {
            let isNull = false;
            try {
                const response = await investmentService.fetchByCategories("Category 1");
                isNull = response === null;
                throw new Error("Error in fetchByCategories()");
            } catch (error) {
                if (isNull) {
                    expect(error).toBeNull();
                } else {
                    investmentService.fetchByCategories = jest
                        .fn()
                        .mockResolvedValueOnce([mockInvestments[0]]);
                    const result = await investmentService.fetchByCategories("Category 1");
                    expect(investmentService.fetchByCategories).toHaveBeenCalledWith("Category 1");
                    expect(result).toEqual([mockInvestments[0]]);
                }
            }
        });

        test(`${InvestmentService} functional should create a new investment`, async () => {
            const newInvestment = { name: "Investment 3", amount: 3000, description: "Description 3", category: "Category 3" };
            let isNull = false;
            try {
                const response = await investmentService.createInvestment(newInvestment);
                isNull = response === null;
                throw new Error("Error in createInvestment()");
            } catch (error) {
                if (isNull) {
                    expect(error).toBeNull();
                } else {
                    investmentService.createInvestment = jest
                        .fn()
                        .mockResolvedValueOnce(newInvestment);
                    const result = await investmentService.createInvestment(newInvestment);
                    expect(investmentService.createInvestment).toHaveBeenCalledWith(newInvestment);
                    expect(result).toEqual(newInvestment);
                }
            }
        });

        test(`${InvestmentService} functional should update investment by ID`, async () => {
            const updatedInvestment = { ...mockInvestments[0], name: "Updated Investment" };
            let isNull = false;
            try {
                const response = await investmentService.updateInvestment("1", updatedInvestment);
                isNull = response === null;
                throw new Error("Error in updateInvestment()");
            } catch (error) {
                if (isNull) {
                    expect(error).toBeNull();
                } else {
                    investmentService.updateInvestment = jest
                        .fn()
                        .mockResolvedValueOnce(updatedInvestment);
                    const result = await investmentService.updateInvestment("1", updatedInvestment);
                    expect(investmentService.updateInvestment).toHaveBeenCalledWith("1", updatedInvestment);
                    expect(result).toEqual(updatedInvestment);
                }
            }
        });
    });
});

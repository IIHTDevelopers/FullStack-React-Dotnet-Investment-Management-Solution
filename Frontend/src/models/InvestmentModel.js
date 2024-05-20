export default class Investment {
    constructor(investmentId, investmentName, initialInvestmentAmount, investmentStartDate, currentValue, investorId) {
        this.investmentId = investmentId;
        this.investmentName = investmentName;
        this.initialInvestmentAmount = initialInvestmentAmount;
        this.investmentStartDate = investmentStartDate;
        this.currentValue = currentValue;
        this.investorId = investorId;
    }
}

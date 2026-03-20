const SELECT = require("@sap/cds/lib/ql/SELECT");

module.exports = function(){
    const { RetailLedger,Departments,PassbookEntryTypes } = this.entities


    this.before('SAVE', 'RetailLedger', async (req) => {
        const { amount, department_ID } = req.data;

        // 1. Fetch the Department name to determine the math logic
        const deptRecord = await SELECT.one.from(Departments).where({ ID: department_ID });
        if (!deptRecord) return req.error(400, 'Invalid Department');

        const creditID = await SELECT.one.from(PassbookEntryTypes).where({entryType:'CREDIT'})
        if(!creditID) return req.error(400,'CREDIT not found')
        const debitID = await SELECT.one.from(PassbookEntryTypes).where({entryType:'DEBIT'})
        if(!debitID) return req.error(400,'DEBIT not found')

        // 2. Fetch the latest running balance from the last persistent entry
        const lastEntry = await SELECT.one.from(RetailLedger)
            .columns('currentBalance')
            .orderBy('createdAt desc');

        const previousBalance = lastEntry ? Number(lastEntry.currentBalance) : 0;
        const inputAmount = Number(amount) || 0;

        // // 3. Apply business logic: PROCUREMENT/MISC (Minus), SALES/INVESTMENT (Plus)
        let newBalance ;

        if (deptRecord.dept === 'PROCUREMENT' || deptRecord.dept === 'MISC') {
            newBalance = previousBalance-inputAmount;
            req.data.entryType_ID=debitID.ID
        } else if (deptRecord.dept === 'SALES' || deptRecord.dept === 'INVESTMENT') {
            newBalance = previousBalance+inputAmount;
            req.data.entryType_ID=creditID.ID
        }

        // 4. Inject the persistent balance into the request data
        req.data.currentBalance = newBalance;
    });
}
module.exports = function () {

    const { Categories, CategoryStatus, Items, Distributors, Purchases,ItemStatus } = this.entities;

    //instead of disabling or hiding delete button, a custom msg is shown when btn clicked

    // this.before('DELETE', ['Distributors', 'Categories', 'Items', 'Customers'], (req) => {
    //     const entity = req.target.name.split('.').pop(); // Gets the entity name
    //     const action = entity === 'Distributors' ? 'Inactivate' : 'Discontinue';
    //     req.reject(400, `${entity} cannot be deleted. Use ${action} action.`);
    // });


    this.before('DELETE', 'Distributors', (req) => {
        req.reject(400, 'Distributor cannot be deleted. Use Inactivate action.');
    });

    this.before('DELETE', 'Categories', (req) => {
        req.reject(400, 'Category cannot be deleted. Use Discontinue action.');
    });

    this.before('DELETE', 'Items', (req) => {
        req.reject(400, 'Item cannot be deleted. Use Discontinue action.');
    });

    this.before('DELETE', 'Customers', (req) => {
        req.reject(400, 'Customer cannot be deleted.');
    });


    this.on('discontinueCategory', async (req) => {
        const { ID } = req.params[0];
        const statusRecord = await SELECT.one.from('CategoryStatus').where({ catStatus: 'TEMPORARILY INACTIVE' });

        if (!statusRecord) return req.error(404, "Status 'TEMPORARILY INACTIVE' not found in master data");

        await UPDATE(Categories).set({ status_ID: statusRecord.ID }).where({ ID: ID });

        return SELECT.one.from(Categories).where({ ID: ID });
    })


    this.on('continueCategory', async (req) => {
        const { ID } = req.params[0]; //id of category
        const statusRecord = await SELECT.one.from('CategoryStatus').where({ catStatus: 'ACTIVE' });

        if (!statusRecord) return req.error(404, "Status 'ACTIVE' not found in master data");

        await UPDATE(Categories).set({ status_ID: statusRecord.ID }).where({ ID: ID });

        return SELECT.one.from(Categories).where({ ID: ID });
    })

    this.on('discontinueItems', async (req) => {
        //change status of items to discontinued only when its stocks are empty.
        const {ID}=req.params[0];  //id of the item
        const statusRecord = await SELECT.one.from('ItemStatus').where({itStatus:'DISCONTINUED'});
        if (!statusRecord) return req.error(404, "Status 'ACTIVE' not found in master data");

        const inventory = await SELECT.one.from('Inventory').where({inventoryItem_ID:ID})
        if(!inventory){
            return req.error(404,'Item Not found in Inventory');
        }

        if(inventory.quantity === 0){
            await UPDATE(Items).set({status_ID:statusRecord.ID}).where({ID:ID});
            return SELECT.one.from(Items).where({ ID: ID });
        }
        else{
            return req.error(400,'Item INSTOCK. Cant be Discontinued')
        }

        //if not empty, tell to empty it first 
    })


    this.on('continueItems', async (req) => {
        const {ID}=req.params[0];  //id of the item
        const statusRecord = await SELECT.one.from('ItemStatus').where({itStatus:'ACTIVE'});
        if (!statusRecord) return req.error(404, "Status 'ACTIVE' not found in master data");

        const inventory = await SELECT.one.from('Inventory').where({inventoryItem_ID:ID})
        if(!inventory){
            return req.error(404,'Item Not found in Inventory');
        }

            await UPDATE(Items).set({status_ID:statusRecord.ID}).where({ID:ID});
            return SELECT.one.from(Items).where({ ID: ID });

    })




    this.on('inActivateDistributor', async (req) => {
        //if retailer wants stop buying from that distributor,
        //once all bills of GR is cleared with that particular distributor associated with the PO only then can inactivate 
        //else clear all bills and then inactivate

        const {ID}=req.params[0]; //id of the distributor
        const statusRecord = await SELECT.one.from('DistributorStatus').where({distriStatus:'INACTIVE'}); 
        if (!statusRecord) return req.error(404, "Status 'INACTIVE' not found in master data");

        const PO = await SELECT.one.from('PO').where({supplier_ID:ID});
        if(!PO || PO.length===0){
            return req.error(404,'PO not there')
        }

        const grpayment = await SELECT.one.from('GRPaymentStatus').where({grPayStatus: 'PENDING'})
        if(!grpayment){
            return req.error(404,"Status 'PENDING' not found")
        }
        const gr =await SELECT.one.from('GR').where({originalPO_ID:PO.ID,paymentStatus_ID:grpayment.ID});
        if(gr.length === 0 ){
            await UPDATE(Distributors).set({status_ID:statusRecord.ID}).where({ID:ID});
        }
        else{
            return req.error(400,`Pay for all remaining ${gr.length} GRs, Then Inactivate`);
        }

    })

    this.on('activateDistributor', async (req) => {
        
        const {ID}=req.params[0]; //id of the distributor
        const statusRecord = await SELECT.one.from('DistributorStatus').where({distriStatus:'ACTIVE'}); 
        if (!statusRecord) return req.error(404, "Status 'ACTIVE' not found in master data");

        
            await UPDATE(Distributors).set({status_ID:statusRecord.ID}).where({ID:ID});
        

    })
}
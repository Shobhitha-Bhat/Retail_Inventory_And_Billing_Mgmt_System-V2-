module.exports = function () {

    //instead of disabling or hiding delete button, a custom msg is shown when btn clicked

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


    this.on('discontinueCategory',async(req)=>{
        //change status of categories entites to nomoresold
    })

    this.on('discontinueItems',async(req)=>{
        //change status of items to discontinued only when its stocks are empty.
        //if not empty, tell to empty it first and then discontnue.
    })

    this.on('inActivateDistributor',async(req)=>{
        //if retailer wants stop buying from that distributor,
        //once all bills of GR is cleared with that particular distributor associated with the PO only then can inactivate 
        //else clear all bills and then inactivate
    })
}
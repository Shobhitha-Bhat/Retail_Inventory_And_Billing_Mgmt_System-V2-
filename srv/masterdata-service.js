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
}
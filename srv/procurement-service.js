module.exports = function(){
    this.on('DELETE','PO',async(req)=>{
        req.reject(400,'PO cant be deleted. Close PO instead. ')
    })
}
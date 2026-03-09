const cds = require('@sap/cds')
const fs = require('fs')
const path = require('path')

cds.on('served', () => {
    console.log('--- 🚀 Backup System Active: Press CTRL+C once to save data ---')
})

process.on('SIGINT', async () => {
    console.log('\n[Backup] 🛑 Shutdown detected. Attempting to save data...')
    
    try {
        // Connect specifically to the local sqlite database
        const db = await cds.connect.to('db')
        const entities = [
    // Master Data
    'Categories', 'CategoryStatus', 
    'Items', 'ItemStatus', 
    'MockDistributors', 'DistributorStatus', 
    'MockCustomers',
    
    // Procurement
    'PO', 'POStatus', 'POItems',
    'GR', 'GRStatus', 'GRItems', 'GRPaymentStatus', 'GRItemInspectStatus',
    
    // Inventory
    'Inventory', 'InventoryStatus',
    
    // Sales
    'Sales', 'SalesPayStatus', 'SalesReturnStatus', 'SalesItems',
    'SalesReturns', 'SalesReturnItems',
    
    // Finance
    'RetailLedger', 'PassbookEntryTypes', 'Departments'
];
        
        for (const entityName of entities) {
            const fullName = `my.retailshop.${entityName}`
            console.log(`[Backup] Fetching: ${fullName}...`)
            
            // Fetch latest data
            const data = await db.run(SELECT.from(fullName))
            
            if (data && data.length > 0) {
                const fileName = `my.retailshop-${entityName}.csv`
                const dirPath = path.join(__dirname, '../db/data')
                const filePath = path.join(dirPath, fileName)

                // Create headers from keys
                const headers = Object.keys(data[0]).join(',')
                // Handle nulls/undefined for CSV safety
                const rows = data.map(row => 
                    Object.values(row).map(val => val === null ? '' : val).join(',')
                ).join('\n')
                
                const csvContent = `${headers}\n${rows}`
                
                // Use Sync write to force the file to save before exit
                fs.writeFileSync(filePath, csvContent, 'utf8')
                console.log(`[Backup] ✅ Saved ${data.length} records to ${fileName}`)
            } else {
                console.log(`[Backup] ℹ️ No data found for ${entityName}, skipping.`)
            }
        }
    } catch (err) {
        console.error('[Backup] ❌ Error during save:', err)
    } finally {
        // console.log('[Backup] 👋 Goodbye!')
        process.exit()
    }
})

module.exports = cds.server
// const cds = require('@sap/cds')
// const fs = require('fs')
// const path = require('path')

// cds.on('served', () => {
//     console.log('--- 🚀 Backup System Active: Press CTRL+C once to save data ---')
// })

// process.on('SIGINT', async () => {
//     console.log('\n[Backup] 🛑 Shutdown detected. Attempting to save data...')
    
//     try {
//         // Connect specifically to the local sqlite database
//         const db = await cds.connect.to('db')
//         const entities = [
//     // Master Data
//     'Categories', 'CategoryStatus', 
//     'Items', 'ItemStatus', 
//     'MockDistributors', 'DistributorStatus', 
//     'MockCustomers',
    
//     // Procurement
//     'PO', 'POStatus', 'POItems',
//     'GR', 'GRStatus', 'GRItems', 'GRPaymentStatus', 'GRItemInspectStatus',
    
//     // Inventory
//     'Inventory', 'InventoryStatus',
    
//     // Sales
//     'Sales', 'SalesPayStatus', 'SalesReturnStatus', 'SalesItems',
//     'SalesReturns', 'SalesReturnItems',
    
//     // Finance
//     'RetailLedger', 'PassbookEntryTypes', 'Departments'
// ];
        
//         for (const entityName of entities) {
//             const fullName = `my.retailshop.${entityName}`
//             console.log(`[Backup] Fetching: ${fullName}...`)
            
//             // Fetch latest data
//             const data = await db.run(SELECT.from(fullName))
            
//             if (data && data.length > 0) {
//                 const fileName = `my.retailshop-${entityName}.csv`
//                 const dirPath = path.join(__dirname, '../db/data')
//                 const filePath = path.join(dirPath, fileName)

//                 // Create headers from keys
//                 const headers = Object.keys(data[0]).join(',')
//                 // Handle nulls/undefined for CSV safety
//                 const rows = data.map(row => 
//                     Object.values(row).map(val => val === null ? '' : val).join(',')
//                 ).join('\n')
                
//                 const csvContent = `${headers}\n${rows}`
                
//                 // Use Sync write to force the file to save before exit
//                 fs.writeFileSync(filePath, csvContent, 'utf8')
//                 console.log(`[Backup] ✅ Saved ${data.length} records to ${fileName}`)
//             } else {
//                 console.log(`[Backup] ℹ️ No data found for ${entityName}, skipping.`)
//             }
//         }
//     } catch (err) {
//         console.error('[Backup] ❌ Error during save:', err)
//     } finally {
//         // console.log('[Backup] 👋 Goodbye!')
//         process.exit()
//     }
// })

// module.exports = cds.server





















const cds = require('@sap/cds')
const fs = require('fs')
const path = require('path')

/**
 * Helper to escape CSV values safely.
 * Handles commas, quotes, and nulls to prevent CSV corruption.
 */
const prepareCSVValue = (val) => {
    if (val === null || val === undefined) return '';
    let s = String(val).replace(/"/g, '""'); // Escape double quotes
    // Wrap in quotes if it contains commas, newlines, or quotes
    return (s.includes(',') || s.includes('\n') || s.includes('"')) ? `"${s}"` : s;
};

cds.on('served', () => {
    console.log(' Backup System Active: Press CTRL+C once to save data ---')
})

process.on('SIGINT', async () => {
    console.log('\n[Backup] Shutdown detected. Starting CSV export...')
    
    try {
        const db = await cds.connect.to('db')
        const dirPath = path.join(__dirname, '../db/data')
        
        // Ensure the export directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Get all entities belonging to your namespace dynamically
        const entities = Object.values(cds.entities)
            .filter(e => e.name.startsWith('my.retailshop.'))

        for (const entity of entities) {
            const shortName = entity.name.split('.').pop()
            
            // 1. Fetch data from the database
            const data = await db.run(SELECT.from(entity))
            
            if (data && data.length > 0) {
                const fileName = `${entity.name}.csv`
                const filePath = path.join(dirPath, fileName)

                // 2. Identify ONLY physical columns (Exclude virtual/calculated fields)
                // This prevents "totalCostprice" from breaking the CSV import later.
                const physicalColumns = Object.values(entity.elements)
                    .filter(el => !el.virtual && !el.value && !el.isAssociation)
                    .map(el => el.name);

                // 3. Create Header Row
                const headers = physicalColumns.join(',')

                // 4. Map Rows (Filtering data to match physical columns only)
                const rows = data.map(row => {
                    return physicalColumns.map(col => prepareCSVValue(row[col])).join(',');
                }).join('\n')
                
                // 5. Atomic Write to File
                fs.writeFileSync(filePath, `${headers}\n${rows}`, 'utf8')
                console.log(`[Backup]  Saved ${data.length} records to ${fileName}`)
            } else {
                console.log(`[Backup] Skipping ${shortName} (No data found)`)
            }
        }
    } catch (err) {
        console.error('[Backup]  Error during save:', err)
    } finally {
        console.log('[Backup]  Backup complete. Shutting down.')
        process.exit()
    }
})

module.exports = cds.server
## Retail Inventory and Billing Management System - V2

```cds init foldername```
```cd foldername```

If package.json was not created do:
```npm init -y```

To add node modules
```npm install @sap/cds```

To add dummy data add:
 only entity fields: ```cds add data``
 dummydata: ```cds add data --records noOfRecordsNeeded```

To move to sqlite sustaining app refreshes and restarts:
```npm add @cap-js/sqlite```

To reflect the changes done to schema.cds
```cds deploy --to sqlite```

Fiori Applications:
- manage-customers
- manage-distributors
- manage-items
- manage-categories
- manage-purchaseorders
- manage-goodsreceipts
- distributor-portal
- manage-inventory
- manage-finance(ledger)
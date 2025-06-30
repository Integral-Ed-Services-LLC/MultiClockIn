import Airtable from "airtable";

// Handle both Vite and Node.js environments
const apiKey = (typeof import.meta !== 'undefined' && import.meta.env) 
    ? import.meta.env.VITE_AIRTABLE_API_KEY 
    : process.env.VITE_AIRTABLE_API_KEY;

const timeSheetHoursBase = (typeof import.meta !== 'undefined' && import.meta.env)
    ? import.meta.env.VITE_AIRTABLE_BASE_ID 
    : process.env.VITE_AIRTABLE_BASE_ID || "appQKFazTfLQGbKyT";

let base = new Airtable({ apiKey: `${apiKey}` }).base(`${timeSheetHoursBase}`);

// Cache for schema data
let schemaCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 3600000; // 1 hour in milliseconds

export async function loadSchemaRegistry() {
    const now = Date.now();
    
    // Return cached data if still valid
    if (schemaCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
        return schemaCache;
    }

    try {
        const records = await new Promise((resolve, reject) => {
            const allRecords = [];
            
            base("Schema_Registry").select({
                view: "Grid view"
            }).eachPage((records, fetchNextPage) => {
                records.forEach(record => {
                    allRecords.push({
                        tableId: record.get("Table_ID"),
                        tableName: record.get("Table_Name"),
                        fieldId: record.get("Field_ID"),
                        fieldName: record.get("Field_Name"),
                        fieldType: record.get("Field_Type"),
                        isLinkedField: record.get("Is_Linked_Field"),
                        linkedTable: record.get("Linked_Table"),
                        linkedTableId: record.get("Linked_Table_ID")
                    });
                });
                fetchNextPage();
            }, (err) => {
                if (err) reject(err);
                else resolve(allRecords);
            });
        });

        // Organize schema by table
        const schemaByTable = {};
        records.forEach(record => {
            if (!schemaByTable[record.tableName]) {
                schemaByTable[record.tableName] = {
                    tableId: record.tableId,
                    fields: {}
                };
            }
            schemaByTable[record.tableName].fields[record.fieldName] = {
                fieldId: record.fieldId,
                fieldType: record.fieldType,
                isLinkedField: record.isLinkedField,
                linkedTable: record.linkedTable,
                linkedTableId: record.linkedTableId
            };
        });

        // Cache the organized schema
        schemaCache = schemaByTable;
        cacheTimestamp = now;
        
        console.log("✅ Schema registry loaded:", Object.keys(schemaByTable));
        return schemaByTable;
        
    } catch (error) {
        console.error("❌ Failed to load schema registry:", error);
        throw error;
    }
}

export function getTableSchema(tableName) {
    if (!schemaCache) {
        throw new Error("Schema not loaded. Call loadSchemaRegistry() first.");
    }
    return schemaCache[tableName];
}

export function getFieldId(tableName, fieldName) {
    const tableSchema = getTableSchema(tableName);
    if (!tableSchema || !tableSchema.fields[fieldName]) {
        throw new Error(`Field '${fieldName}' not found in table '${tableName}'`);
    }
    return tableSchema.fields[fieldName].fieldId;
}

export function getTableId(tableName) {
    const tableSchema = getTableSchema(tableName);
    if (!tableSchema) {
        throw new Error(`Table '${tableName}' not found in schema registry`);
    }
    return tableSchema.tableId;
} 
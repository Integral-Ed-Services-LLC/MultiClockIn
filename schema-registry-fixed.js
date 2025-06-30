// CONFIG — adjust only the table name if yours has a space
const CONFIG = {
  SCHEMA_TABLE: 'Schema_Registry',
  DEFAULT_TTL: 3600,
};

async function buildSchemaRegistry() {
  // 1. prepare tables
  const registry = base.getTable(CONFIG.SCHEMA_TABLE);
  const allTables = base.tables;

  // 2. delete existing registry entries
  const existing = await registry.selectRecordsAsync();
  while (existing.records.length) {
    await registry.deleteRecordsAsync(
      existing.records.slice(0, 50).map(r => r.id)
    );
    existing.records = existing.records.slice(50); // Create new array instead of modifying
  }

  // 3. collect new entries
  const toCreate = [];
  let totalCreated = 0; // Track total records created
  
  for (let tbl of allTables) {
    if (tbl.name === CONFIG.SCHEMA_TABLE) continue;
    for (let fld of tbl.fields) {
      const linkedTableId = fld.options?.linkedTableId ?? null;
      toCreate.push({
        fields: {
          Table_ID:       tbl.id,
          Table_Name:     tbl.name,
          Field_ID:       fld.id,
          Field_Name:     fld.name,
          Field_Type:     fld.type,
          Is_Linked_Field: Boolean(linkedTableId),
          Linked_Table:    linkedTableId
                              ? base.getTable(linkedTableId).name
                              : null,
          Linked_Table_ID: linkedTableId,
          Redis_Cache:     false,
          Redis_TTL:       CONFIG.DEFAULT_TTL,
        }
      });
      // batch‐write every 50
      if (toCreate.length === 50) {
        await registry.createRecordsAsync(toCreate);
        totalCreated += toCreate.length; // Add to total count
        toCreate.length = 0; // Reset array
      }
    }
  }

  // 4. write any remaining
  if (toCreate.length) {
    await registry.createRecordsAsync(toCreate);
    totalCreated += toCreate.length; // Add final batch to total
  }

  output.text(`✅ Built registry with ${totalCreated} total records.`);
}

// run
await buildSchemaRegistry(); 
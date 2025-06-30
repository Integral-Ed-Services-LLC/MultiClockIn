import { loadSchemaRegistry } from './src/helpers/schemaLoader.js';

async function testSchema() {
    try {
        console.log('🔄 Loading schema registry...');
        const schema = await loadSchemaRegistry();
        
        console.log('\n📊 Available Tables:');
        Object.keys(schema).forEach(tableName => {
            const table = schema[tableName];
            console.log(`\n🏢 ${tableName} (ID: ${table.tableId})`);
            console.log('   Fields:');
            Object.keys(table.fields).forEach(fieldName => {
                const field = table.fields[fieldName];
                console.log(`     - ${fieldName} (${field.fieldType}) [ID: ${field.fieldId}]`);
                if (field.isLinkedField) {
                    console.log(`       ↳ Linked to: ${field.linkedTable}`);
                }
            });
        });
        
        // Look for potential tables for our app
        console.log('\n🔍 Looking for relevant tables...');
        
        const teamTables = Object.keys(schema).filter(name => 
            name.toLowerCase().includes('team') || 
            name.toLowerCase().includes('user') || 
            name.toLowerCase().includes('member')
        );
        
        const projectTables = Object.keys(schema).filter(name => 
            name.toLowerCase().includes('project') || 
            name.toLowerCase().includes('job') || 
            name.toLowerCase().includes('client')
        );
        
        const timeTables = Object.keys(schema).filter(name => 
            name.toLowerCase().includes('time') || 
            name.toLowerCase().includes('timesheet') || 
            name.toLowerCase().includes('entry') ||
            name.toLowerCase().includes('hour')
        );
        
        if (teamTables.length > 0) {
            console.log('\n👥 Potential Team/User tables:', teamTables);
        }
        
        if (projectTables.length > 0) {
            console.log('\n🏗️ Potential Project/Job tables:', projectTables);
        }
        
        if (timeTables.length > 0) {
            console.log('\n⏰ Potential Time/Timesheet tables:', timeTables);
        }
        
    } catch (error) {
        console.error('❌ Error testing schema:', error);
    }
}

testSchema(); 
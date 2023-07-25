import { IBaseQueries, ContextValue } from '@sqltools/types';
import queryFactory from '@sqltools/base-driver/dist/lib/factory';

/** write your queries here go fetch desired data. This queries are just examples copied from SQLite driver */

const fetchDatabases: IBaseQueries['fetchDatabases'] = queryFactory`
select 
    table_catalog as "database_name"
from information_schema.tables
group by 1
`;

const fetchSchemas: IBaseQueries['fetchSchemas'] = queryFactory`
SELECT 
  table_catalog as "database",
  table_schema AS "label",
  table_schema AS "schema",
  '${ContextValue.SCHEMA}' as type,
  'group-by-ref-type' as iconId
FROM information_schema.tables
where database = '${p => p.database}'
group by 1,2
`;

const describeTable: IBaseQueries['describeTable'] = queryFactory`
  SELECT C.*
  FROM pragma_table_info('${p => p.label}') AS C
  ORDER BY C.cid ASC
`;

const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory`
SELECT 
  C.name AS label,
  C.*,
  C.type AS dataType,
  C."notnull" AS isNullable,
  C.pk AS isPk,
  '${ContextValue.NO_CHILD}' as childType,
  case 
    WHEN C.type IN ('BIGINT', 'INT8', 'LONG', 'SMALLINT', 'INT2', 'SHORT', 'TINYINT', 'HUGEINT', 'UBIGINT', 'UINTEGER', 'USMALLINT', 'UTINYINT', 'INTEGER', 'INT4', 'INT', 'SIGNED') THEN 'symbol-number'
    WHEN C.type IN ('DOUBLE', 'FLOAT8', 'NUMERIC', 'DECIMAL', 'REAL', 'FLOAT4', 'FLOAT') OR C.type LIKE 'DECIMAL(%' THEN 'symbol-number'
    WHEN C.type IN ('BIT', 'BITSTRING') THEN 'symbol-text'
    WHEN C.type IN ('BOOLEAN', 'BOOL', 'LOGICAL') THEN 'symbol-boolean'
    WHEN C.type IN ('BLOB', 'BYTEA', 'BINARY', 'VARBINARY') THEN 'symbol-binary'
    WHEN C.type = 'DATE' THEN 'calendar'
    WHEN C.type = 'TIME' THEN 'calendar'
    WHEN C.type IN ('TIMESTAMP', 'DATETIME') THEN 'calendar'
    WHEN C.type = 'TIMESTAMP WITH TIME ZONE' THEN 'calendar'
    WHEN C.type = 'UUID' THEN 'symbol-u'
    WHEN C.type IN ('VARCHAR', 'CHAR', 'BPCHAR', 'TEXT', 'STRING') THEN 'symbol-text'
  ELSE 'null'
    end as iconId,
  C.type AS detail,
  '${ContextValue.COLUMN}' as type
FROM pragma_table_info('${p => p.label}') AS C
ORDER BY cid ASC
`;

const fetchRecords: IBaseQueries['fetchRecords'] = queryFactory`
SELECT *
FROM ${p => (p.table.label || p.table)}
LIMIT ${p => p.limit || 50}
OFFSET ${p => p.offset || 0};
`;

const countRecords: IBaseQueries['countRecords'] = queryFactory`
SELECT count(1) AS total
FROM ${p => (p.table.label || p.table)};
`;

// const fetchTablesAndViews = (type: ContextValue, tableType = 'table'): IBaseQueries['fetchTables'] => queryFactory`
// SELECT name AS label,
//   '${type}' AS type
// FROM sqlite_master
// WHERE LOWER(type) LIKE '${tableType.toLowerCase()}'
//   AND name NOT LIKE 'sqlite_%'
// ORDER BY name
// `;

const fetchTablesAndViews = (type: ContextValue, tableType = 'base table'): IBaseQueries['fetchTables'] => queryFactory`
SELECT 
  table_name AS label,
  '${type}' AS type
FROM information_schema.tables
WHERE LOWER(table_type) LIKE '${tableType.toLowerCase()}'
  AND table_catalog = '${p => (p.database)}'
  --AND table_schema = '${p => (p.schema)}'
ORDER BY label
`;




const fetchTables: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.TABLE);
const fetchViews: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.VIEW , 'view');

const searchTables: IBaseQueries['searchTables'] = queryFactory`
SELECT name AS label,
  type
FROM sqlite_master
${p => p.search ? `WHERE LOWER(name) LIKE '%${p.search.toLowerCase()}%'` : ''}
ORDER BY name
`;
const searchColumns: IBaseQueries['searchColumns'] = queryFactory`
SELECT C.name AS label,
  T.name AS "table",
  C.type AS dataType,
  C."notnull" AS isNullable,
  C.pk AS isPk,
  '${ContextValue.COLUMN}' as type
FROM sqlite_master AS T
LEFT OUTER JOIN pragma_table_info((T.name)) AS C ON 1 = 1
WHERE 1 = 1
${p => p.tables.filter(t => !!t.label).length
  ? `AND LOWER(T.name) IN (${p.tables.filter(t => !!t.label).map(t => `'${t.label}'`.toLowerCase()).join(', ')})`
  : ''
}
${p => p.search
  ? `AND (
    LOWER(T.name || '.' || C.name) LIKE '%${p.search.toLowerCase()}%'
    OR LOWER(C.name) LIKE '%${p.search.toLowerCase()}%'
  )`
  : ''
}
ORDER BY C.name ASC,
  C.cid ASC
LIMIT ${p => p.limit || 100}
`;

export default {
  describeTable,
  countRecords,
  fetchColumns,
  fetchRecords,
  fetchTables,
  fetchViews,
  fetchSchemas,
  fetchDatabases,
  searchTables,
  searchColumns
}

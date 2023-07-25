import AbstractDriver from '@sqltools/base-driver';
import queries from './queries';
import { IConnectionDriver, MConnectionExplorer, NSDatabase, ContextValue, Arg0 } from '@sqltools/types';
import { v4 as generateId } from 'uuid';
import { Database, OPEN_READONLY, OPEN_READWRITE  } from 'duckdb-async';
import keywordsCompletion from './keywords';


type DriverLib = Database // fix this later?
type DriverOptions = any;



export default class DuckDBDriver extends AbstractDriver<DriverLib, DriverOptions> implements IConnectionDriver {

  /**
   * If you driver depends on node packages, list it below on `deps` prop.
   * It will be installed automatically on first use of your driver.
   */
  public readonly deps: typeof AbstractDriver.prototype['deps'] = [{
    type: AbstractDriver.CONSTANTS.DEPENDENCY_PACKAGE,
    name: 'duckdb-async',
    version: '0.8.1',
  }];

  queries = queries;  

  public async open(): Promise<Database> {
    if (this.connection) {
      return this.connection;
    }  
    try {
      const mode = this.credentials.databaseFilePath !== ':memory:' ? OPEN_READONLY : OPEN_READWRITE;  
      const db = Database.create(this.credentials.databaseFilePath, mode);
      this.connection = db;
      return Promise.resolve(db);
    } catch (error) {
      throw(error);
    }
  }

  public async close() {
    if(this.connection){
      const db = await this.connection;
      db.close();
      this.connection = null;
    }
  }

  public query: (typeof AbstractDriver)['prototype']['query'] = async (query, opt = {}) => {
    const db = await this.open();
    const { requestId } = opt;
    let resultsAgg: NSDatabase.IResult[] = [];
      const rows = await db.all(query.toString());
      const messages = [];
      resultsAgg.push(<NSDatabase.IResult>{
        requestId,
        resultId: generateId(),
        connId: this.getId(),
        cols: rows && rows.length ? Object.keys(rows[0]) : [],
        messages,
        query: query[0], // hack
        results: rows,
      });
    return resultsAgg;
  }

  /** if you need a different way to test your connection, you can set it here.
   * Otherwise by default we open and close the connection only
   */
  public async testConnection() {
    await this.open();
    await this.query('SELECT 1', {});
    await this.close();
  }

  public async getChildrenForItem({ item, parent }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.type) {
      case ContextValue.CONNECTION:
      case ContextValue.CONNECTED_CONNECTION:
        const results = await this.queryResults(this.queries.fetchDatabases());
        return results.map(database => ({
          ...database,
          label: database['database_name'],
          database: database['database_name'],
          schema: null,
          type: ContextValue.DATABASE
        }));
        case ContextValue.DATABASE:
          return this.queryResults(this.queries.fetchSchemas(item as NSDatabase.IDatabase));
        case ContextValue.SCHEMA:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TABLE },
          { label: 'Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.VIEW },
        ];
      case ContextValue.TABLE:
      case ContextValue.VIEW:
        return this.queryResults(this.queries.fetchColumns(item as NSDatabase.ITable));
      case ContextValue.RESOURCE_GROUP:
        return this.getChildrenForGroup({ item, parent });
    }
    return [];
  }

  private async getChildrenForGroup({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.childType) {
      case ContextValue.TABLE:
        return this.queryResults(this.queries.fetchTables(parent as NSDatabase.ISchema));
      case ContextValue.VIEW:
        return this.queryResults(this.queries.fetchViews(parent as NSDatabase.ISchema));
    }
    return [];
  }

  public searchItems(itemType: ContextValue, search: string, extraParams: any = {}): Promise<NSDatabase.SearchableItem[]> {
    switch (itemType) {
      case ContextValue.TABLE:
        return this.queryResults(this.queries.searchTables({ search }));
      case ContextValue.COLUMN:
        return this.queryResults(this.queries.searchColumns({ search, ...extraParams }));
    }
  }
  public getStaticCompletions = async () => {
    return keywordsCompletion;
  }
}
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# <img src="https://github.com/evidence-dev/sqltools-duckdb-driver/blob/master/icons/duckdb-logo.png?raw=true"  style="height:1em;"/> SQLTools for DuckDB 

Query and explore [DuckDB](https://duckdb.org/) databases in VSCode.
## Latest DuckDB Support: v0.8.1

A VSCode extension which extends [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools), with a driver for DuckDB.

This driver is maintained by [Evidence](https://evidence.dev): Publish BI reports with just SQL and Markdown.

## Features

- Latest DuckDB support (currently 0.8.1)
- **Connect** to a local, in-memory or MotherDuck (via service token) DuckDB instance
- **Run queries** against a DuckDB instance
- **Explore DB** tables and columns in the sidebar
- **View** table results by selecting them in the sidebar
- **Autocomplete** for common keywords (e.g. SELECT, FROM, WHERE) and table names

### Connect Local and In-Memory DBs

![Connect Local DB](https://github.com/evidence-dev/sqltools-duckdb-driver/blob/master/docs/images/connect-local-db.gif?raw=true)

![Connect In-Memory DB](https://github.com/evidence-dev/sqltools-duckdb-driver/blob/master/docs/images/connect-in-memory-db.gif?raw=true)
### Run Query

![Run Query](https://github.com/evidence-dev/sqltools-duckdb-driver/blob/master/docs/images/run-query.gif?raw=true)

### Explore DB

![Explore DB](https://github.com/evidence-dev/sqltools-duckdb-driver/blob/master/docs/images/explore-db.gif?raw=true)

### Autocomplete

![Autocomplete](https://github.com/evidence-dev/sqltools-duckdb-driver/blob/master/docs/images/autocomplete.gif?raw=true)

## Not Supported
- Loading extensions not included in the [default Node.js installation](#DuckDB-Extensions-Supported)

## DuckDB Extensions Supported

For clarity, the following DuckDB extensions are supported

| Extension        | Supported |
|------------------|-----------|
| arrow            |           |
| autocomplete     |           |
| fts              |           |
| httpfs           |           |
| icu              | 1         |
| inet             |           |
| jemalloc         |           |
| json             | 1         |
| motherduck       | 1         |
| parquet          | 1         |
| postgres_scanner |           |
| spatial          |           |
| sqlite_scanner   |           |
| tpcds            |           |
| tpch             |           |


## MotherDuck
To use MotherDuck, you need your [service token](https://motherduck.com/docs/authenticating-to-motherduck#fetching-the-service-token).

You should use the filename `md:?motherduck_token=<your token>` when connecting to MotherDuck.

## Contributing

- If you encounter bugs or have feature requests, feel free to open an issue.
- PRs welcome

### Maintained by [<img src="https://github.com/evidence-dev/sqltools-duckdb-driver/blob/master/docs/images/evidence.png?raw=true"  style="height:1em;"/>](https://www.evidence.dev)

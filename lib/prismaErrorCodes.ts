export const prismaErrorCodes = [
  {
    code: 'P1001',
    description:
      "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}.",
  },
  {
    code: 'P1002',
    description:
      'The database server at {database_host}:{database_port} was reached but timed out. Please try again. Please make sure your database server is running at {database_host}:{database_port}. ',
  },
  {
    code: 'P1003',
    description:
      'Database {database_file_name} does not exist at {database_file_path}',
  },
  { code: 'P1008', description: 'Operations timed out after {time}' },
  {
    code: 'P1009',
    description:
      'Database {database_name} already exists on the database server at {database_host}:{database_port}',
  },
  {
    code: 'P1010',
    description:
      'User {database_user} was denied access on the database {database_name}',
  },
  { code: 'P1011', description: 'Error opening a TLS connection: {message}' },
  {
    code: 'P1012',
    description:
      'Note: If you get error code P1012 after you upgrade Prisma to version 4.0.0 or later, see the version 4.0.0 upgrade guide. A schema that was valid before version 4.0.0 might be invalid in version 4.0.0 and later. The upgrade guide explains how to update your schema to make it valid.',
  },
  {
    code: 'P1014',
    description: 'The underlying {kind} for model {model} does not exist.',
  },
  {
    code: 'P1015',
    description:
      'Your Prisma schema is using features that are not supported for the version of the database.',
  },
  {
    code: 'P1016',
    description:
      'Your raw query had an incorrect number of parameters. Expected: {expected}, actual: {actual}.',
  },
  { code: 'P1017', description: 'Server has closed the connection.' },
  { code: 'Prisma Client (Query Engine)', description: 'P2000' },
  {
    code: 'P2001',
    description:
      'The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist',
  },
  {
    code: 'P2002',
    description: 'Unique constraint failed on the {constraint}',
  },
  {
    code: 'P2003',
    description: 'Foreign key constraint failed on the field: {field_name}',
  },
  {
    code: 'P2004',
    description: 'A constraint failed on the database: {database_error}',
  },
  {
    code: 'P2005',
    description:
      "The value {field_value} stored in the database for the field {field_name} is invalid for the field's type",
  },
  {
    code: 'P2006',
    description:
      'The provided value {field_value} for {model_name} field {field_name} is not valid',
  },
  { code: 'P2007', description: 'Data validation error {database_error}' },
  {
    code: 'P2008',
    description:
      'Failed to parse the query {query_parsing_error} at {query_position}',
  },
  {
    code: 'P2009',
    description:
      'Failed to validate the query: {query_validation_error} at {query_position}',
  },
  {
    code: 'P2010',
    description: 'Raw query failed. Code: {code}. Message: {message}',
  },
  {
    code: 'P2011',
    description: 'Null constraint violation on the {constraint}',
  },
  { code: 'P2012', description: 'Missing a required value at {path}' },
  {
    code: 'P2013',
    description:
      'Missing the required argument {argument_name} for field {field_name} on {object_name}.',
  },
  {
    code: 'P2014',
    description:
      "The change you are trying to make would violate the required relation '{relation_name}' between the {model_a_name} and {model_b_name} models.",
  },
  {
    code: 'P2015',
    description: 'A related record could not be found. {details}',
  },
  { code: 'P2016', description: 'Query interpretation error. {details}' },
  {
    code: 'P2017',
    description:
      'The records for relation {relation_name} between the {parent_name} and {child_name} models are not connected.',
  },
  {
    code: 'P2018',
    description: 'The required connected records were not found. {details}',
  },
  { code: 'P2019', description: 'Input error. {details}' },
  {
    code: 'P2020',
    description: 'Value out of range for the type. {details}',
  },
  {
    code: 'P2021',
    description: 'The table {table} does not exist in the current database.',
  },
  {
    code: 'P2022',
    description: 'The column {column} does not exist in the current database.',
  },
  { code: 'P2023', description: 'Inconsistent column data: {message}' },
  {
    code: 'P2024',
    description:
      'Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool (Current connection pool timeout: {timeout}, connection limit: {connection_limit})',
  },
  {
    code: 'P2025',
    description:
      'An operation failed because it depends on one or more records that were required but not found. {cause}',
  },
  {
    code: 'P2026',
    description:
      "The current database provider doesn't support a feature that the query used: {feature}",
  },
  {
    code: 'P2027',
    description:
      'Multiple errors occurred on the database during query execution: {errors}',
  },
  { code: 'P2028', description: 'Transaction API error: {error}' },
  {
    code: 'P2030',
    description:
      'Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema',
  },
  {
    code: 'P2031',
    description:
      'Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. See details: https://pris.ly/d/mongodb-replica-set',
  },
  {
    code: 'P2033',
    description:
      "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers",
  },
  {
    code: 'P2034',
    description:
      'Transaction failed due to a write conflict or a deadlock. Please retry your transaction',
  },
  {
    code: 'P3000',
    description: 'Failed to create database: {database_error}',
  },
  {
    code: 'P3001',
    description:
      'Migration possible with destructive changes and possible data loss: {migration_engine_destructive_details}',
  },
  {
    code: 'P3002',
    description: 'The attempted migration was rolled back: {database_error}',
  },
  {
    code: 'P3003',
    description:
      'The format of migrations changed, the saved migrations are no longer valid. To solve this problem, please follow the steps at: https://pris.ly/d/migrate',
  },
  {
    code: 'P3004',
    description:
      'The {database_name} database is a system database, it should not be altered with prisma migrate. Please connect to another database.',
  },
  {
    code: 'P3005',
    description:
      'The database schema is not empty. Read more about how to baseline an existing production database: https://pris.ly/d/migrate-baseline',
  },
  {
    code: 'P3006',
    description:
      'Migration {migration_name} failed to apply cleanly to the shadow database.',
  },
  {
    code: 'P3007',
    description:
      'Some of the requested preview features are not yet allowed in schema engine. Please remove them from your data model before using migrations. (blocked: {list_of_blocked_features})',
  },
  {
    code: 'P3008',
    description:
      'The migration {migration_name} is already recorded as applied in the database.',
  },
  {
    code: 'P3009',
    description:
      'migrate found failed migrations in the target database, new migrations will not be applied. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve',
  },
  {
    code: 'P3010',
    description:
      'The name of the migration is too long. It must not be longer than 200 characters (bytes).',
  },
  {
    code: 'P3011',
    description:
      'Migration {migration_name} cannot be rolled back because it was never applied to the database. Hint: did you pass in the whole migration name? (example: 20201207184859_initial_migration)',
  },
  {
    code: 'P3012',
    description:
      'Migration {migration_name} cannot be rolled back because it is not in a failed state.',
  },
  {
    code: 'P3013',
    description:
      'Datasource provider arrays are no longer supported in migrate. Please change your datasource to use a single provider. Read more at https://pris.ly/multi-provider-deprecation',
  },
  {
    code: 'P3014',
    description:
      'Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases. Read more about the shadow database (and workarounds) at https://pris.ly/d/migrate-shadow.',
  },
  {
    code: 'P3015',
    description:
      'Could not find the migration file at {migration_file_path}. Please delete the directory or restore the migration file.',
  },
  {
    code: 'P3016',
    description:
      'The fallback method for database resets failed, meaning Migrate could not clean up the database entirely. Original error: {error_code}',
  },
  {
    code: 'P3017',
    description:
      'The migration {migration_name} could not be found. Please make sure that the migration exists, and that you included the whole name of the directory. (example: 20201207184859_initial_migration)',
  },
  {
    code: 'P3018',
    description:
      'A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve',
  },
  {
    code: 'P3019',
    description:
      'The datasource provider {provider} specified in your schema does not match the one specified in the migration_lock.toml, {expected_provider}. Please remove your current migration directory and start a new migration history with prisma migrate dev. Read more: https://pris.ly/d/migrate-provider-switch',
  },
  {
    code: 'P3020',
    description:
      'The automatic creation of shadow databases is disabled on Azure SQL. Please set up a shadow database using the shadowDatabaseUrl datasource attribute.',
  },
  {
    code: 'P3021',
    description:
      'Foreign keys cannot be created on this database. Learn more how to handle this: https://pris.ly/d/migrate-no-foreign-keys',
  },
  {
    code: 'P3022',
    description:
      'Direct execution of DDL (Data Definition Language) SQL statements is disabled on this database. Please read more here about how to handle this: https://pris.ly/d/migrate-no-direct-ddl',
  },
  { code: 'prisma db pull', description: 'P4000' },
  { code: 'P4001', description: 'The introspected database was empty.' },
  {
    code: 'P4002',
    description:
      'The schema of the introspected database was inconsistent: {explanation}',
  },
  {
    code: 'Prisma Accelerate',
    description: 'Prisma Accelerate-related errors start with P6xxx.',
  },
  {
    code: 'P6000 (ServerError)',
    description: 'Generic error to catch all other errors.',
  },
  {
    code: 'P6001 (InvalidDataSource)',
    description:
      'The URL is malformed; for instance, it does not use the prisma:// protocol.',
  },
  {
    code: 'P6002 (Unauthorized)',
    description: 'The API Key in the connection string is invalid.',
  },
  {
    code: 'P6003 (PlanLimitReached)',
    description:
      'The included usage of the current plan has been exceeded. This can only occur on the free plan.',
  },
  {
    code: 'P6004 (QueryTimeout)',
    description:
      'The global timeout of Accelerate has been exceeded. You can find the limit here.',
  },
  {
    code: 'P6005 (InvalidParameters)',
    description:
      'The user supplied invalid parameters. Currently only relevant for transaction methods. For example, setting a timeout that is too high. You can find the limit here.',
  },
  {
    code: 'P6006 (VersionNotSupported)',
    description:
      'The chosen Prisma version is not compatible with Accelerate. This may occur when a user uses an unstable development version that we occasionally prune.',
  },
  {
    code: 'P6008 (ConnectionError|EngineStartError)',
    description:
      "The engine failed to start. For example, it couldn't establish a connection to the database.",
  },
  {
    code: 'P6009 (ResponseSizeLimitExceeded)',
    description:
      'The global response size limit of Accelerate has been exceeded. You can find the limit here.',
  },
]

export const getPrismaErrorCode = (code: string) =>
  prismaErrorCodes.find(e => e.code === code)

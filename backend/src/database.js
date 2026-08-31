import { ExecuteStatementCommand, RDSDataClient } from '@aws-sdk/client-rds-data';

const client = new RDSDataClient({});

function config() {
  return {
    resourceArn: process.env.DB_CLUSTER_ARN,
    secretArn: process.env.DB_SECRET_ARN,
    database: process.env.DB_NAME,
  };
}

export async function execute(sql, parameters = []) {
  const result = await client.send(new ExecuteStatementCommand({
    ...config(),
    sql,
    parameters,
    includeResultMetadata: true,
    formatRecordsAs: 'JSON',
  }));
  return result.formattedRecords ? JSON.parse(result.formattedRecords) : [];
}

export const textParam = (name, value) => ({ name, value: { stringValue: String(value) } });

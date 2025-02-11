import type { Transaction } from "dexie";
import type { Contract, Version } from "@constants/chains/types";
import { getEventTableNames, getTargetVersion } from "@utils/utlisDb";
import { dbBase } from "./dbBase";
import type { SchemaDefinition, VersionIdentifier } from "@db/dbTypes";
import {
  DB_NAME,
  DB_TABLE_NAMES,
  DB_VERSIONS,
  PK_AUTO_INCREMENTED,
} from "@db/constants";
import type { SyncStatusContract } from "@db/dbTypes";
import { extractEventContracts } from "@utils/utilsEthers";
import { getInitialDataOfSyncStatusContract } from "./dbEventLogsAddInitialData";

export class DbEventLogs extends dbBase {
  versionIdentifier: VersionIdentifier;
  constructor(versionIdentifier: VersionIdentifier) {
    const targetVersion: Version = getTargetVersion(versionIdentifier);
    const targetContracts: Contract[] = extractEventContracts(
      targetVersion.contracts,
    );

    //define DB name
    const dbNameElement: string[] = Object.values(versionIdentifier);
    dbNameElement.unshift(DB_NAME.secondNames.eventLog);
    super(dbNameElement);

    //define DB schema
    const schemaDefinition = this.getSchemaDefinition(targetContracts);
    this.version(DB_VERSIONS.EventLog).stores(schemaDefinition);

    //add initialData
    this.on("populate", async (tx: Transaction) => {
      await this.addInitialData(tx, targetContracts);
    });
    this.versionIdentifier = versionIdentifier;
  }
  protected getSchemaDefinition(targetContracts: Contract[]): SchemaDefinition {
    const schemaDefinition: SchemaDefinition = {};

    const eventTableNames: string[] = getEventTableNames(targetContracts);
    for (const eventTableName of eventTableNames) {
      schemaDefinition[eventTableName] = PK_AUTO_INCREMENTED;
    }
    schemaDefinition[DB_TABLE_NAMES.EventLog.syncStatus] = "name";

    return schemaDefinition;
  }
  protected async addInitialData(
    tx: Transaction,
    targetContracts: Contract[],
  ): Promise<void> {
    const arrayOfInitialData: SyncStatusContract[] = targetContracts.map(
      (targetContract) => getInitialDataOfSyncStatusContract(targetContract),
    );
    await tx
      .table(DB_TABLE_NAMES.EventLog.syncStatus)
      .bulkAdd(arrayOfInitialData);
  }
}

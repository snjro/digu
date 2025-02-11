import type { Contract, ContractName } from "@constants/chains/types";
import type { DbEventLogs } from "./dbEventLogs";
import type { Table } from "dexie";
// import type { Event as EthersEvent } from "ethers";
import { getEventLogTableName } from "@utils/utlisDb";
import { updateDbItemSyncStatus } from "./dbEventLogsDataHandlersSyncStatusUpdateDbItemSyncStatus";
import { customLogger } from "@utils/logger";
import type {
  ConvertedEventLog,
  GroupedEventLogs,
  SyncStatusesEvent,
  VersionIdentifier,
} from "./dbTypes";
import * as itSelf from "./dbEventLogsDataHandlersEventLog";
import { getUpdateTargetEventLogTables } from "./dbEventLogsGetUpdateTargetEventLogTables";
import { getDbItemSyncStatus } from "./dbEventLogsDataHandlersSyncStatusGetters";
//====================== table "eventLogs" =======================
export async function addEventLogs_updateFetchedBlockNumber(
  dbEventLogs: DbEventLogs,
  targetContract: Contract,
  groupedEventLogs: GroupedEventLogs,
  toBlockNumber: number,
): Promise<void> {
  const eventLogTables: Table[] = getUpdateTargetEventLogTables(
    dbEventLogs,
    targetContract.name,
    groupedEventLogs,
  );

  const eventLogTableNames = eventLogTables.map((eventLogTable: Table) => {
    return eventLogTable.name;
  });
  await dbEventLogs.transaction("rw", eventLogTableNames, async () => {
    if (Object.keys(groupedEventLogs).length > 0) {
      const promiseBulkAdds = [];
      const syncStatusesEvent: SyncStatusesEvent = await getDbItemSyncStatus(
        dbEventLogs,
        targetContract.name,
        "events",
      );

      const bulkPutInfo: (VersionIdentifier & {
        contractName: ContractName;
        eventName: string;
        tableName: string;
        numOfRecords: number;
      })[] = [];
      for (const eventName of Object.keys(groupedEventLogs)) {
        const tableName: string = getEventLogTableName(
          targetContract.name,
          eventName,
        );
        const numOfRecords: number = groupedEventLogs[eventName].length;
        promiseBulkAdds.push(
          dbEventLogs.table(tableName).bulkPut(groupedEventLogs[eventName]),
        );
        syncStatusesEvent[eventName].recordCount += numOfRecords;
        bulkPutInfo.push({
          ...dbEventLogs.versionIdentifier,
          contractName: targetContract.name,
          eventName: eventName,
          tableName: tableName,
          numOfRecords: numOfRecords,
        });
      }
      await Promise.all(promiseBulkAdds);
      if (bulkPutInfo.length)
        customLogger.success("BulkPut Event Logs.", bulkPutInfo);

      await updateDbItemSyncStatus(
        dbEventLogs,
        targetContract.name,
        "events",
        syncStatusesEvent,
      );
    }
    await updateDbItemSyncStatus(
      dbEventLogs,
      targetContract.name,
      "fetchedBlockNumber",
      toBlockNumber,
    );
  });
}

export async function getEventLogTableRecordCount(
  dbEventLogs: DbEventLogs,
  tableName: string,
): Promise<number> {
  return await dbEventLogs.table(tableName).count();
}
export async function getEventLogTableRecords(
  dbEventLogs: DbEventLogs,
  tableName: string,
  sortModifier: "asc" | "desc" | undefined,
): Promise<ConvertedEventLog[]> {
  let eventLogs: ConvertedEventLog[] = await dbEventLogs
    .table(tableName)
    .toArray();
  if (sortModifier) {
    eventLogs = itSelf.sortEventLogs(eventLogs, sortModifier);
  }
  return eventLogs;
}
export function sortEventLogs(
  convertedEventLogs: ConvertedEventLog[],
  sortModifier: "asc" | "desc",
): ConvertedEventLog[] {
  if (convertedEventLogs) {
    if (sortModifier === "asc") {
      convertedEventLogs.sort((a: ConvertedEventLog, b: ConvertedEventLog) => {
        if (a.blockNumber !== b.blockNumber) {
          return a.blockNumber - b.blockNumber;
        } else {
          return a.logIndex - b.logIndex;
        }
      });
    } else {
      convertedEventLogs.sort((a: ConvertedEventLog, b: ConvertedEventLog) => {
        if (b.blockNumber !== a.blockNumber) {
          return b.blockNumber - a.blockNumber;
        } else {
          return b.logIndex - a.logIndex;
        }
      });
    }
  }
  return convertedEventLogs;
}

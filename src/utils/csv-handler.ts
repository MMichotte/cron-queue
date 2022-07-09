import fs from "fs";
import * as csv from "fast-csv";
import { logger } from "./logger";

function rowCleanup(row: any): object {
  const cleanObject: any = {}
  Object.keys(row).forEach((key: string) => {
    const cleanKey = key.split('"').slice(1,-1).join('"');
    let cleanValue = row[key].split('"');
    if (cleanValue.length > 2) {
      cleanValue = cleanValue.slice(1,-1)
    }
    cleanObject[cleanKey] = cleanValue.join('"');
  });
  return cleanObject;
}

function csvToObjectArray<T>(csvPath: string, objectClass: {new(row: object): T}): Promise<T[]> {
  return new Promise( (resolve, reject) => {
    const objects: T[] = [];
  
    fs.createReadStream(csvPath)
      .pipe(csv.parse({ headers: true, trim: true, quote: "\\"}))
      .on("error", error => {
        logger.error(error);
        reject;
      })
      .on("data", row => {
        objects.push(new objectClass(rowCleanup(row)));
      })
      .on("end", (rowCount: number) => {
        logger.info(`Parsed ${rowCount} rows`);
        resolve(objects);
      });
  });
  

}

export {
  csvToObjectArray
}
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const pathDB = "./src/data/db.json";
if (!existsSync("./src/data")) mkdirSync("./src/data");
if (!existsSync(pathDB))
  writeFileSync(pathDB, JSON.stringify({ roles: [] }), "utf-8");

const db = JSON.parse(readFileSync(pathDB, "utf-8"));

export class JsonDB {
  findAll(table) {
    return this.#findTable(table);
  }

  findById(table, payload) {
    if (this.#checkPayload(payload).error) return this.#checkPayload(payload);

    const fTable = this.#findTable(table);
    if (fTable.error) return fTable;

    const data = [...fTable.result];
    const dataById = data.find((d) => d.id == payload.id);

    return { error: false, result: dataById ?? null };
  }

  add(table, payload) {
    if (this.#checkPayload(payload).error) return this.#checkPayload(payload);

    const fTable = this.#findTable(table);
    if (fTable.error) return fTable;

    const data = [...fTable.result];
    if (data.find((d) => d.id == payload.id))
      return { error: true, result: "พบข้อมูลซ้ำซ้อน" };

    data.push(payload);
    db[table] = data;
    writeFileSync(pathDB, JSON.stringify(db), "utf-8");
    return { error: false, result: "เพิ่มข้อมูลเรียบร้อย" };
  }

  update(table, payload) {
    if (this.#checkPayload(payload).error) return this.#checkPayload(payload);

    const fTable = this.#findTable(table);
    if (fTable.error) return fTable;

    const data = [...fTable.result];
    const index = data.findIndex((d) => d.id == payload.id);
    if (index === -1) return { error: true, result: "ไม่พบข้อมูล" };

    data[index] = payload;
    db[table] = data;
    writeFileSync(pathDB, JSON.stringify(db), "utf-8");
    return { error: false, result: "แก้ไขข้อมูลเรียบร้อย" };
  }

  deleteById(table, payload) {
    if (this.#checkPayload(payload).error) return this.#checkPayload(payload);

    const fTable = this.#findTable(table);
    if (fTable.error) return fTable;

    const data = [...fTable.result];
    const index = data.findIndex((d) => d.id == payload.id);
    if (index === -1) return { error: true, result: "ไม่พบข้อมูล" };

    data.splice(index, 1);
    db[table] = data;
    writeFileSync(pathDB, JSON.stringify(db), "utf-8");
    return { error: false, result: "ลบข้อมูลเรียบร้อย" };
  }

  #findTable(table) {
    return {
      error: !db[table],
      result: db[table] ?? `ไม่พบ Table`,
    };
  }

  #checkPayload(payload) {
    return {
      error: !payload?.id,
      result: payload?.id ? payload : `ไม่พบ id ใน payload`,
    };
  }
}

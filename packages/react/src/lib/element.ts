import { generateId } from "./utils";

export const getElementId = (id: string | undefined, name: string) =>
  typeof id !== "undefined" ? id : `${name}=${generateId(3)}`;
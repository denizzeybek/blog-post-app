import { EStorageKeys } from "@/constants/storageKeys";

export const authHeader = () => {
  const token = JSON.parse(localStorage.getItem(EStorageKeys.TOKEN)!);
  return { Authorization: "Bearer " + token };
};

import { func, rev } from "@components/Utils/matrixUtils";

export const getProgram = (id: number) => {
  if (id === 223 || id === 0) return "NA";
  return rev[id as keyof typeof rev]?.split("-")[1];
};

export const getDepartment = (id: number) => {
  if (id === 223 || id === 0) return "NA";
  return rev[id as keyof typeof rev]?.split("-")[0];
};

export const getDeptProgram = (id: number) => {
  if (id === 223 || id === 0) return "NA";
  return rev[id as keyof typeof rev];
};

export const getId = (program: string, department: string) => {
  if (
    program === "NA" ||
    department === "NA" ||
    program === undefined ||
    department === undefined
  )
    return 223;

  if (program === "" || department === "") return 0;
  const temp = func[department as keyof typeof func];
  const idx =
    func[department as keyof typeof func][program as keyof typeof temp];
  return parseInt(idx, 10);
};

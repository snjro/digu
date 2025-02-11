import { getFunctionSelectorWithSplitter } from "$lib/leftSidebar/Body/functionNameHandler";
import type { FunctionAbiFragment } from "@constants/chains/types";

export type FunctionRow = {
  functionName: FunctionAbiFragment["name"];
  functionStateMutability: FunctionAbiFragment["stateMutability"];
  functionSelector: FunctionAbiFragment["selector"];
  functionInputs: FunctionAbiFragment["inputs"];
  functionOutputs: FunctionAbiFragment["outputs"];
  functionSelectorWithSplitter: string;
};
export const gridRows = (
  targetFunctionAbiFragments: FunctionAbiFragment[],
): FunctionRow[] => {
  const functionRows: FunctionRow[] = [];
  for (const functionAbiFragment of targetFunctionAbiFragments) {
    const functionRow: FunctionRow = {
      functionName: functionAbiFragment.name,
      functionStateMutability: functionAbiFragment.stateMutability,
      functionSelector: functionAbiFragment.selector,
      functionInputs: functionAbiFragment.inputs,
      functionOutputs: functionAbiFragment.outputs,
      functionSelectorWithSplitter:
        getFunctionSelectorWithSplitter(functionAbiFragment),
    };
    functionRows.push(functionRow);
  }
  return functionRows;
};

import { ModelFile, ModelFileOptions, TemplateData } from "./ModelFile";
import {
  ModelPriorityFile,
  ModelPriorityFileOptions
} from "./ModelPriorityFile";

export { TemplateData };
export { Dir, FileNode, isDir, isFile } from "./FileNode";

export type File = ModelFile | ModelPriorityFile;

export function createFile(name: string, options: ModelFileOptions) {
  return new ModelFile(name, options);
}

export function createPriorityFile(
  name: string,
  options: ModelPriorityFileOptions
) {
  return new ModelPriorityFile(name, options);
}

export function isTemplateFile(obj: any): obj is ModelFile {
  return obj instanceof ModelFile;
}

export function isPriorityFile(obj: any): obj is ModelPriorityFile {
  return obj instanceof ModelPriorityFile;
}

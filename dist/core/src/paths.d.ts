import { Paths } from "./types/core";
interface PathsOpts {
    cwd: string;
    outputPath: string;
}
export declare function getPaths(opts: PathsOpts): Paths;
export {};
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolve_1 = __importDefault(require("resolve"));
function nodeExternals({ projectRoot }) {
    const externals = [];
    const normalNodeExternal = (context, request, callback) => {
        const notExternalModules = [];
        if (notExternalModules.indexOf(request) !== -1) {
            return callback(null, undefined);
        }
        let res;
        try {
            res = resolve_1.default.sync(request, { basedir: context });
        }
        catch (err) {
            // If the request cannot be resolved, we need to tell webpack to
            // "bundle" it so that webpack shows an error (that it cannot be
            // resolved).
            return callback(null, undefined);
        }
        if (!res) {
            return callback(null, undefined);
        }
        let baseRes;
        try {
            baseRes = resolve_1.default.sync(request, { basedir: projectRoot });
        }
        catch (err) { }
        // If the package, when required from the root, would be different from
        // what the real resolution would use, then we cannot externalize it
        // LASTJS_LINKED_PACKAGE__SECRET_DO_NOT_USE__ is a workaround when we test lastjs in locally by `yarn link`
        if (process.env.SHUVI__SECRET_DO_NOT_USE__LINKED_PACKAGE !== "true" &&
            baseRes !== res) {
            return callback(null, undefined);
        }
        // runtime have to be transpiled
        if (res.match(/node_modules[/\\]@shuvi[/\\]runtime/) ||
            res.match(/node_modules[/\\]@babel[/\\]runtime-corejs2[/\\]/)) {
            return callback(null, undefined);
        }
        // Webpack itself has to be compiled because it doesn't always use module relative paths
        if (res.match(/node_modules[/\\]webpack/) ||
            res.match(/node_modules[/\\]css-loader/)) {
            return callback(null, undefined);
        }
        // Anything else that is standard JavaScript within `node_modules`
        // can be externalized.
        if (res.match(/node_modules[/\\].*\.js$/)) {
            return callback(null, `commonjs ${request}`);
        }
        callback(null, undefined);
    };
    externals.push(normalNodeExternal);
    return externals;
}
exports.nodeExternals = nodeExternals;
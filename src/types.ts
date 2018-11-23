export namespace Config {
  export interface Generator {
    cwd?: string;
    /**
     * glob pattern for proto files, default to `**\/*proto`
     */
    protoPattern?: string;
    /**
     * An array of glob patterns to ignore for proto files,
     * default to ['**\/node_modules\/**]
     */
    protoIgnores?: string[];
  }
}

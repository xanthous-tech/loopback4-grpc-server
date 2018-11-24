"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const proto_loader_1 = require("@grpc/proto-loader");
const grpc = require("grpc");
const path = require("path");
const glob = require("glob");
const globAsync = util_1.promisify(glob);
const execAsync = util_1.promisify(child_process_1.exec);
class ProtoGenerator {
    constructor(config) {
        this.config = config;
    }
    async execute() {
        const protoPaths = await this.getProtoPaths();
        for (const protoPath in protoPaths) {
            await this.loadProto(protoPath);
            console.log(protoPath);
            await this.generateJS(protoPath);
            await this.generateTS(protoPath);
        }
    }
    async loadProto(protoPath) {
        return grpc.loadPackageDefinition(await proto_loader_1.load(protoPath));
    }
    async getProtoPaths() {
        const cwd = this.config && this.config.cwd;
        const protoPattern = this.config && this.config.protoPattern;
        const protoIgnores = this.config && this.config.protoIgnores;
        const pattern = protoPattern || '**/*.proto';
        const options = {
            cwd: cwd || process.cwd(),
            ignore: protoIgnores || ['**/node_modules/**'],
            nodir: true,
        };
        return globAsync(pattern, options);
    }
    async generateTS(proto) {
        const root = path.dirname(proto);
        await execAsync(`${path.join(__dirname, '../', '../', // Root of grpc module and not the dist dir
        'compilers', process.platform, 'bin', 'protoc')} --plugin=protoc-gen-ts=${path.join(process.cwd(), 'node_modules', '.bin', 'protoc-gen-ts')} --ts_out ${root} -I ${root} ${proto}`);
        await execAsync(`${path.join(__dirname, '../', '../', // Root of grpc module and not the dist dir
        'compilers', process.platform, 'bin', 'protoc')} --plugin=protoc-gen-ts=${path.join(process.cwd(), 'node_modules', '.bin', 'protoc-gen-ts')} --ts_out ${'dist/' + root} -I ${root} ${proto}`);
        return;
    }
    async generateJS(proto) {
        const root = path.dirname(proto);
        const protocPath = path.join(process.cwd(), 'node_modules', '.bin', 'grpc_tools_node_protoc');
        await execAsync(`${protocPath} --js_out=import_style=commonjs,binary:${'dist/' +
            root} --plugin=protoc-gen-gprc=${protocPath} --grpc_out=${'dist/' +
            root} -I ${root} ${proto}`);
        return;
    }
}
exports.ProtoGenerator = ProtoGenerator;
//# sourceMappingURL=proto.generator.js.map
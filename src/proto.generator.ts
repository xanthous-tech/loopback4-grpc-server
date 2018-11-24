import {exec} from 'child_process';
import {promisify} from 'util';
import {load as loadProto} from '@grpc/proto-loader';
import * as grpc from 'grpc';
import * as path from 'path';
import * as glob from 'glob';

import {Config} from './types';

const globAsync = promisify(glob);
const execAsync = promisify(exec);

export class ProtoGenerator {
  constructor(protected config?: Config.Generator) {}

  public async execute(): Promise<void> {
    const protoPaths: string[] = await this.getProtoPaths();
    for (const protoPath in protoPaths) {
      await this.loadProto(protoPath);
      console.log(protoPath);
      await this.generateJS(protoPath);
      await this.generateTS(protoPath);
    }
  }

  public async loadProto(protoPath: string): Promise<grpc.GrpcObject> {
    return grpc.loadPackageDefinition(await loadProto(protoPath));
  }

  public async getProtoPaths(): Promise<string[]> {
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

  private async generateTS(proto: string): Promise<void> {
    const root = path.dirname(proto);
    await execAsync(
      `${path.join(
        __dirname,
        '../',
        '../', // Root of grpc module and not the dist dir
        'compilers',
        process.platform,
        'bin',
        'protoc',
      )} --plugin=protoc-gen-ts=${path.join(
        process.cwd(),
        'node_modules',
        '.bin',
        'protoc-gen-ts',
      )} --ts_out ${root} -I ${root} ${proto}`,
    );
    await execAsync(
      `${path.join(
        __dirname,
        '../',
        '../', // Root of grpc module and not the dist dir
        'compilers',
        process.platform,
        'bin',
        'protoc',
      )} --plugin=protoc-gen-ts=${path.join(
        process.cwd(),
        'node_modules',
        '.bin',
        'protoc-gen-ts',
      )} --ts_out ${'dist/' + root} -I ${root} ${proto}`,
    );
    return;
  }

  private async generateJS(proto: string): Promise<void> {
    const root = path.dirname(proto);

    const protocPath = path.join(
      process.cwd(),
      'node_modules',
      '.bin',
      'grpc_tools_node_protoc',
    );

    await execAsync(
      `${protocPath} --js_out=import_style=commonjs,binary:${'dist/' +
        root} --plugin=protoc-gen-gprc=${protocPath} --grpc_out=${'dist/' +
        root} -I ${root} ${proto}`,
    );

    return;
  }
}

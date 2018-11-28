import { loadSync as loadProtoSync } from '@grpc/proto-loader';
import { execSync } from 'child_process';
import { GlobSync } from 'glob';
import * as grpc from 'grpc';
import * as path from 'path';

import { Config } from './types';

export class ProtoGenerator {
  protected config: Required<Config.Generator>;

  constructor(config?: Config.Generator) {
    this.config = <Required<Config.Generator>>Object.assign(
      {},
      config,
      Private.defaultConfig
    );
  }

  public execute(): void {
    console.log('generating protos');
    const protoPaths: string[] = this.getProtoPaths();

    for (const protoPath of protoPaths) {
      console.log(protoPath);

      this.loadProto(protoPath);
      this.generateJS(protoPath);
      this.generateTS(protoPath);
    }
  }

  public loadProto(protoPath: string): grpc.GrpcObject {
    return grpc.loadPackageDefinition(loadProtoSync(protoPath));
  }

  public getProtoPaths(): string[] {
    const {
      protoPattern: pattern,
      protoIgnores: ignore,
      cwd,
    } = this.config;

    const options = {
      cwd,
      ignore,
      nodir: true,
    };

    const glob = new GlobSync(pattern, options);
    return glob.found;
  }

  private generateTS(proto: string): void {
    const root = path.dirname(proto);

    const getCommand = (outDir: string): string => `${path.join(
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
    )} --ts_out ${outDir} -I ${root} ${proto}`;

    execSync(getCommand(root));
    execSync(getCommand('dist/' + root));
  }

  private generateJS(proto: string): void {
    const root = path.dirname(proto);

    const protocPath = path.join(
      process.cwd(),
      'node_modules',
      '.bin',
      'grpc_tools_node_protoc',
    );

    execSync(
      `${protocPath} --js_out=import_style=commonjs,binary:${'dist/' +
      root} --plugin=protoc-gen-gprc=${protocPath} --grpc_out=${'dist/' +
      root} -I ${root} ${proto}`,
    );
  }
}

namespace Private {
  export const defaultConfig = <Config.Generator>{
    protoPattern: '**\/*proto',
    protoIgnores: ['**\/node_modules\/**'],
    cwd: process.cwd(),
  }
}

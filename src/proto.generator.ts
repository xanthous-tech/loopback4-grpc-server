import {Config} from './types';
import {execSync} from 'child_process';
import * as grpc from 'grpc';
import * as path from 'path';
import * as glob from 'glob';
/**
 * @class GrpcGenerator
 * @author Jonathan Casarrubias <t: johncasarrubias>
 * @license MIT
 * @description GRPC TypeScript generator.
 * This class will iterate over a directory generating
 * corresponding typescript files from proto files.
 * Required for @grpc configuration and strict development.
 */
export class ProtoGenerator {
  /**
   * @property {[name: string]: grpc.GrpcObject} protos
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @description proto instances directory loaded during
   * boot time and later being used by implemented grpc
   * controllers.
   */
  private protos: {[name: string]: grpc.GrpcObject} = {};
  /**
   * @method constructor
   * @param config
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @description
   * Receives generator configurations
   */
  constructor(protected config?: Config.Generator) {}
  /**
   * @method execute
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will find and load all protos
   * contained within the project directory. Saving in memory
   * instances for those found protos for later usage.
   */
  public execute(): void {
    this.getProtoPaths().forEach((protoPath: string) => {
      const protoName: string = protoPath.split('/').pop() || '';
      this.protos[protoName] = this.loadProto(protoPath);
      this.generateJS(protoPath);
      this.generateTS(protoPath);
    });
  }
  /**
   * @method getProto
   * @param {string} name
   * @returns {grpc.GrpcObject}
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will return a proto instance
   * from the proto list directory, previously loaded during
   * boot time.
   */
  public getProto(name: string): grpc.GrpcObject {
    return this.protos[name];
  }
  /**
   * @method loadProto
   * @param {string} protoPath
   * @returns {grpc.GrpcObject}
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method receive a proto file path and
   * load that proto using the official grpc library.
   */
  public loadProto(protoPath: string): grpc.GrpcObject {
    const proto: grpc.GrpcObject = grpc.load(protoPath);
    return proto;
  }
  /**
   * @method getProtoPaths
   * @returns {string[]}
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will getProtoPaths a directory look ahead and
   * typescript files generations from found proto files.
   */
  public getProtoPaths(): string[] {
    const cwd = this.config && this.config.cwd;
    const protoPattern = this.config && this.config.protoPattern;
    const protoIgnores = this.config && this.config.protoIgnores;
    const pattern = protoPattern || '**/*.proto';
    const options = {
      cwd: cwd || process.cwd(),
      ignore: protoIgnores || ['**/node_modules/**'],
      nodir: true,
    };
    return glob.sync(pattern, options);
  }

  /**
   * @method generateTS
   * @param {string} proto
   * @returns {Buffer}
   * @author Jonathan Casarrubias <t: johncasarrubias>
   * @license MIT
   * @description This method will generate a typescript
   * file representing the provided proto file by calling
   * google's proto compiler and using @agreatfool's
   * protoc-ts plugin.
   */
  private generateTS(proto: string): Buffer {
    const root = path.dirname(proto);
    return execSync(
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
  }

  /**
   * @method generateJS
   * @param {string} proto
   * @returns {Buffer}
   * @author Simon Liang
   * @license MIT
   * @description This method will generate a javascript
   * file representing the provided proto file by calling
   * google's proto compiler and using @agreatfool's
   * protoc-ts plugin.
   */
  private generateJS(proto: string): Buffer {
    const root = path.dirname(proto);

    const protocPath = path.join(
      process.cwd(),
      'node_modules',
      '.bin',
      'grpc_tools_node_protoc',
    );

    return execSync(
      `${protocPath} --js_out=import_style=commonjs,binary:${root} --plugin=protoc-gen-gprc=${protocPath} --grpc_out=${root} -I ${root} ${proto}`,
    );
  }
}

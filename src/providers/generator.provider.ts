import {Provider, inject} from '@loopback/context';
import {ProtoGenerator} from '../proto.generator';
import {GrpcBindings} from '../grpc.bindings';
import {Config} from '../types';

export class GeneratorProvider implements Provider<ProtoGenerator> {
  private generator: ProtoGenerator;

  constructor(
    @inject(GrpcBindings.GENERATOR_CONFIG) protected config: Config.Generator,
  ) {
    this.generator = new ProtoGenerator(config);
  }

  async value(): Promise<ProtoGenerator> {
    return this.generator;
  }
}

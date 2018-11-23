import { Provider } from '@loopback/context';
import { ProtoGenerator } from '../proto.generator';
import { Config } from '../types';
export declare class GeneratorProvider implements Provider<ProtoGenerator> {
    protected config: Config.Generator;
    private generator;
    constructor(config: Config.Generator);
    value(): Promise<ProtoGenerator>;
}

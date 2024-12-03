import { DataResolverService } from './data-resolver.service';
export declare class DataResolverController {
    private readonly dataResolverService;
    constructor(dataResolverService: DataResolverService);
    getCoordinates(type: any): Promise<any>;
}

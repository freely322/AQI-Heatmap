import { HttpService } from '@nestjs/common';
export declare class DataResolverService {
    private _httpService;
    constructor(_httpService: HttpService);
    getCoordinates(type: any): Promise<any>;
}

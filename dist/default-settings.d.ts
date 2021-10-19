import { HttpErrorHandler } from './errors';
import { includeRelations } from './ra-jsonapi-provider';
export declare const defaultSettings: settings;
interface settings {
    total: string;
    headers: {};
    updateMethod: string;
    arrayFormat: string;
    includeRelations: includeRelations[];
    errorHandler: HttpErrorHandler;
    endpointToTypeStripLastLetters?: string[];
}
export {};

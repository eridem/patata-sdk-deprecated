import * as Models from '../patata.d';
import * as Q from 'q';

export class DefaultProvider implements Models.IProvider {
    private _opts: any;    
    
    constructor(opts: any) {
        this._opts = opts;
        return this;
    }
    
    public getBin():Q.IPromise<String> {
        var deferred = Q.defer();        
        deferred.resolve(this._opts.path);        
        return deferred.promise;
    }
}
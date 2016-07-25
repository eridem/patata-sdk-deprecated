/// <reference path="../../typings/q/Q.d.ts" />

import * as Models from '../patata.d';
import * as Q from 'q';
var fs = require('fs');

export class DefaultProvider implements Models.IProvider {
    private _opts: any;
    private _patata: Models.IPatata;

    constructor(patata: Models.IPatata, opts: any) {
        this._patata = patata;
        this._opts = opts;
        if (!this._opts.path) {
            throw this._patata.log.getError(`[Default provider] File cannot be null`);
        }
        return this;
    }

    public getBin(): Q.IPromise<String> {
        var deferred = Q.defer();
        var file = process.cwd() + '/' + this._opts.path;
        try {
            fs.statSync(file);
        } catch (err) {
            if (err.code == 'ENOENT') {
                throw this._patata.log.getError(`[Default provider] file not found [${file}]`);
            }
        }
        deferred.resolve(file);
        return deferred.promise;
    }
}
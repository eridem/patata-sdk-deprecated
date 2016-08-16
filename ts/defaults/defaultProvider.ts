import * as Models from '../patata.d';
var fs = require('fs');

export class DefaultProvider implements Models.IProvider {
    private _opts: any;
    private _patata: Models.IPatata;
    private get log(): Models.ILog { return this._patata.log; }

    constructor(patata: Models.IPatata, opts: any) {
        this._patata = patata;
        this._opts = opts;
        if (!this._opts.path) {
            throw this.log.getError(`[Default provider] File cannot be null`);
        }
        return this;
    }

    public getBin(): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            let file = process.cwd() + '/' + this._opts.path;
            try {
                fs.statSync(file);
            } catch (err) {
                if (err.code == 'ENOENT') {
                    throw this.log.getError(`[Default provider] file not found [${file}]`);
                }
            }
            resolve(file);
        })
    }
}
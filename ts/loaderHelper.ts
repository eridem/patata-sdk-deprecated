import * as Models from './patata.d';

export class LoaderHelper implements Models.ILoaderHelper {
    
    public loadAsFunctionModuleOrObject(what: any | string | (() => any)): any {
        if (typeof what === 'function') {
            return what();
        } else if (typeof what === 'string') {
            return require(what);
        }
        
        return what;
    }

    public obtainPlugin(what: any | string): any {
        if (typeof what === 'string') {
            var objs = require(what);
            for (var attr in objs) {
                what = objs[attr];
            }
        }
        return what;
    }    
}
import * as Models from '../patata.d';

export class Configuration implements Models.IConfiguration {
    private _capability: Models.ICapability;
    private _provider: Models.IProvider;
    private _servers: Array<Models.IServer>;
    
    public get capability(): Models.ICapability {
        return this._capability;
    }
    
    public get provider(): Models.IProvider {
        return this._provider;
    }
    
    public get servers(): Array<Models.IServer> {
        return this._servers;
    }
    
    constructor(path: String) {
        path = path || '';
        return this;
    }   
}
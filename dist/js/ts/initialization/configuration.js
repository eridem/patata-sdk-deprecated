export class Configuration {
    constructor(path) {
        path = path || '';
    }
    get capability() {
        return this._capability;
    }
    get provider() {
        return this._provider;
    }
    get servers() {
        return this._servers;
    }
}

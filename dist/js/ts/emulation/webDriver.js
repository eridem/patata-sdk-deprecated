export class WebDriver {
    constructor(configuration) {
        this._configuration = configuration;
    }
    start(binary) {
        for (let i; i < this._configuration.servers.length; i++) {
            var serverConfig = this._configuration.servers[i]; //.getServer.servers[options.SERVER];
            this._wd = require('wd').promiseChainRemote(serverConfig);
        }
        this._desired.app = binary;
        // Init driver
        return this._wd
            .init(this._desired);
    }
    quit() {
        this._wd
            .close()
            .quit();
        return this;
    }
}

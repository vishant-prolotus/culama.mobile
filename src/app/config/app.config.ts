import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AppConfig {

    private config: Object = null;
    private env: Object = null;
    private langVars: Object = null;

    constructor(private http: Http) {

    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public get(key: any) {
        return this.config[key];
    }

    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv(key: any) {
        return this.env[key];
    }
    /**
     * get API endpoints
     */
    public getApiHost(){
        return this.config['host']+"/"+this.config['basePath'];
    }
    /**
     * Get language variables from common pool
     * @param key 
     * @param languageCode
     */
    public getCommonLangVars(key: any, languageCode:any) {
        languageCode = languageCode.toString().toLowerCase();
        return this.langVars["common"][key][languageCode];
    }
    /**
     * Get Module specific language variables
     * @param moduleName 
     * @param key 
     * @param languageCode
     */
    public getModuleLangVars(moduleName: any, key:any, languageCode:any) {
        languageCode = languageCode.toString().toLowerCase();
        return this.langVars["modules"][moduleName][key][languageCode];
    }
    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     */
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('./assets/json/env.json').map(res => res.json()).catch((error: any): any => {
                console.log('Configuration file "env.json" could not be read');
                resolve(true);
                return Observable.throw(error.json().error || 'Server error');
            }).subscribe((envResponse: any) => {
                this.env = envResponse;
                let request: any = null;

                if (envResponse.env === "production" || envResponse.env === "development") {
                    request = this.http.get('./assets/json/' + envResponse.env + '.json');
                } else {
                    console.error('Environment file is not set or invalid');
                    resolve(true);
                }

                if (request) {
                    request
                        .map(res => res.json())
                        .catch((error: any) => {
                            console.error('Error reading ' + envResponse.env + ' configuration file');
                            //resolve(error);
                            return Observable.throw(error.json().error || 'Server error');
                        })
                        .subscribe((responseData) => {
                            this.config = responseData;
                            this.http.get('./assets/json/translations/translations.json')
                                .map(res => res.json())
                                .catch((error: any) => {
                                    console.error('Error reading translation file');
                                    resolve(error);
                                    return Observable.throw(error.json().error || 'Server error');
                                })
                                .subscribe((translationData) => {
                                    this.langVars = translationData;
                                    resolve(true);
                                });
                        });
                } else {
                    console.error('Env config file "env.json" is not valid');
                    resolve(true);
                }
            });

        });
    }
}
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { AppConfig } from '../../../../app/config/app.config';
@Injectable()
export class PhoneRegisterService {
    constructor(private http: Http, private _config: AppConfig) { }
    register(phoneInfo) {
        console.log(this._config.getApiHost());
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(phoneInfo);
        return this.http.post(this._config.getApiHost()+'/security/verifyphone', body, options).map((res: Response) => res );
    }
}

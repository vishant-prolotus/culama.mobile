import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from "../../../shared/services/app-data";

@Injectable()
export class HomeService {
    constructor(private http: Http, private _config: AppConfig, private appData: AppData) { }
    retriveUnreadItems(token:string, since:string) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            Token: token
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/messaging/unreaditems', body, options).map((res: Response) => res.json());
    }
}
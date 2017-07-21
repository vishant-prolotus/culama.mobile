import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from "../../../shared/services/app-data";

@Injectable()
export class WallService {
    constructor(private http: Http, private _config: AppConfig, private appData: AppData) { }
    retriveActiveItems(token: string) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            token: token,
            since: ""
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/walls/retrieveactiveitems', body, options).map((res: Response) => res.json());
    }
    retriveExistingWalls(token: string, mThreadId: string, dThreadId: number) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let data = {
            Token: token,
            WallId: mThreadId,
            FromPostId: 0
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/walls/retrievewall', body, options).map((res: Response) => res.json());
    }
}
//this is wall service page
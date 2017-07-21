import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { AppConfig } from '../../../app/config/app.config';
import { AppData } from "../../../shared/services/app-data";

@Injectable()
export class MessageService {
    constructor(private http: Http, private _config: AppConfig, private appData: AppData) { }
    retriveActiveItems(token: string) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            token: token,
            since: ""
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/messaging/retrieveactiveitems', body, options).map((res: Response) => res.json());
    }
    retriveMessages(token: string, mThreadId: string, dThreadId: number) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let data = {
            token: token,
            messageThreadId: mThreadId,
            fromDetailThreadId: 0,
            includeRecipientData: true
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/messaging/retrievemessage', body, options).map((res: Response) => res.json());
    }
    retriveRecipients(token: string) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            Token: token
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/messaging/getrecipients', body, options).map((res: Response) => res.json());
    }
    retriveRecipient(token: string, recipientId: string) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            Token: token,
            recipientId: recipientId
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/messaging/getrecipient', body, options).map((res: Response) => res.json());
    }
    createMessage(token: string, recipients: Array<String>, content: Array<Object>) {
        //master changes
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            Token: token,
            recipients: recipients,
            content: content
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/messaging/createmessage', body, options).map((res: Response) => res.json());
    }
    addtoMessages(token: string, id: string , content: Array<Object>) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            Token: token,
            MessageThreadId: id,
            Content: content
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/messaging/addtomessage', body, options).map((res: Response) => res.json());
    }
    markasRead(token: string, content: any) {
        let headers = new Headers({ 'content-type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            Token: token,
            Messages: content
        };
        let body = JSON.stringify(data);
        return this.http.post(this._config.getApiHost() + '/messaging/setread', body, options).map((res: Response) => res.json());
    }
}
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Token} from "../shared/Token";
import {RsiSettings} from "../shared/rsi-settings";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}


  fetchAccessToken(){
    return this.http.get<Token>(
      environment.apiPath + "/login/create"
    );
  }

  getUserAccessToken(): string{
    let token = localStorage.getItem('access_token');

    if(!token){
      token = "null";
    }
    return token;
  }

  sendRsiValuesToBackend(oversold:number, overbought:number, symbol:string){
    const data = {
      symbol: new HttpParams().set("symbol", symbol),
      oversold: oversold,
      overbought: overbought
    };
    let headers = new HttpHeaders().set("access_token", this.getUserAccessToken());
     return this.http.post(environment.apiPath + "/indicator/rsi", {data, headers});
  }

  getRsiValuesToFrontend(symbol:string){
    let headers = new HttpHeaders().set("access_token", this.getUserAccessToken());
    let params = new HttpParams().set("symbol", symbol);

    return this.http.get<RsiSettings>(environment.apiPath + "/indicator/rsi", {params,headers} );
  }
}

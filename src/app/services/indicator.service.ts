import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {RsiSettings} from "../shared/RsiSettings";
import {UserService} from "./user.service";

/*
* Stefan Ghergheles
* 16.06.2023
* stocknostic
*/

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  constructor(private http: HttpClient,
              private userService: UserService) { }

  sendRsiValuesToBackend(oversold:number, overbought:number, symbol:string){
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());
    let params = new HttpParams().set("symbol", symbol);

    return this.http.post(environment.apiPath + "/indicator/rsi/settings", {oversold: oversold, overbought: overbought}, {params, headers});
  }

  getRsiValuesToFrontend(symbol:string){
    let headers = new HttpHeaders().set("access_token", this.userService.getUserAccessToken());
    let params = new HttpParams().set("symbol", symbol);

    return this.http.get<RsiSettings>(environment.apiPath + "/indicator/rsi/settings", {params,headers} );
  }
}

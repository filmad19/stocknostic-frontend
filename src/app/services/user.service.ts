import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Token} from "../shared/Token";

/*
* Matthias Filzmaier
* 02.05.2023
* stocknostic
*/

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  login(){
    let headers = new HttpHeaders().set("access_token", this.getUserAccessToken());

    return this.http.get<Token>(
      environment.apiPath + "/login", {headers}
    );
  }

  getUserAccessToken(): string{
    let token = localStorage.getItem('access_token');

    //if there is no token return null as a string
    if(!token){
      token = "null";
    }
    return token;
  }
}

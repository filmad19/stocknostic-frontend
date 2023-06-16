import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Token} from "../shared/Token";

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

    if(!token){
      token = "null";
    }
    return token;
  }
}

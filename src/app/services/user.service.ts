import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Token} from "../shared/Token";

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
}

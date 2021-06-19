import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../model/user';
const baseUrl = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
  getAll() {
    return this.http.get<User[]>(baseUrl);
  }

  getById(id) {
    return this.http.get<User>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(baseUrl, params);
  }

  update(id, params: any) {
    return this.http.put(`${baseUrl}/${id}`, params);
  }

  delete(id) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}

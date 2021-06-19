import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const usersKey = 'empReg';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem(usersKey)) || [
  {
    id: 1,
    fullName: 'HarishKumar',
    email: 'harishkumark05@gmail.com',
    phone: 7402231685,
    salary: 1,
    report: 'VeeraBaskar',
    designation: 'softwareDeveloper',
    qualification: 'B.E'
  }
];

@Injectable()
export class fakeInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = req;
    return handleRoute();
    function handleRoute() {
      switch (true) {
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.endsWith('/users') && method === 'POST':
          return createUser();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        default:
          return next.handle(req);
      }
    }
    function getUsers() {
      return ok(users.map(x => basicDetails(x)));
    }
    function getUserById() {
      const user = users.find((x: { id: number }) => x.id === idFromUrl());
      return ok(basicDetails(user));
    }
    function createUser() {
      console.log(body);
      const user = body;
      user.id = newUserId();
      users.push(user);
      localStorage.setItem(usersKey, JSON.stringify(users));

      return ok();
    }
    function updateUser() {
      let params = body;
      let user = users.find(x => x.id === idFromUrl());
      Object.assign(user, params);
      localStorage.setItem(usersKey, JSON.stringify(users));

      return ok();
    }
    function deleteUser() {
      users = users.filter(x => x.id !== idFromUrl());
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }

    // helpers
    function ok(body?) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }
    function basicDetails(user) {
      const {
        id,
        fullName,
        email,
        phone,
        salary,
        report,
        designation,
        qualification
      } = user;
      return {
        id,
        fullName,
        email,
        phone,
        salary,
        report,
        designation,
        qualification
      };
    }
    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function newUserId() {
      return users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
    }
  }
}
export const fakeProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: fakeInterceptor,
  multi: true
};

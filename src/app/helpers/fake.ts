import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize, mergeMap } from 'rxjs/operators';

const usersKey = 'empReg';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem(usersKey)) || [
  {
    id: 1,
    fullName: 'HarishKumar',
    email: 'harishkumark05@gmail.com',
    phone: 7402231685,
    salary: 1,
    report: 'nandha',
    designation: 'ceo',
    qualification: 'BE'
  }
];

@Injectable()
export class fakeInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // throw new Error('Method not implemented.');
    const { url, method, headers, body } = req;
    // wrap in delayed observable to simulate server api call
    // return of(null)
    //     .pipe(mergeMap(handleRoute))
    //     .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    //     .pipe(delay(500))
    //     .pipe(dematerialize());

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
          // pass through any requests not handled above
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
      // delete user.confirmPassword;
      users.push(user);
      localStorage.setItem(usersKey, JSON.stringify(users));

      return ok();
    }
    function updateUser() {
      let params = body;
      let user = users.find(x => x.id === idFromUrl());
      // update and save user
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
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
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

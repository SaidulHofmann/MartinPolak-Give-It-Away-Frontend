import {Injectable} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../../shared/services/message.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {HttpResponsePermissions, Permission, PermissionFilter} from '../../../models/index.model';
import {HttpErrorArgs} from '../../../core/types.core';
import {ErrorCodeType} from '../../../core/enums.core';
import {AuthService} from '../../permission/services/auth.service';
import {apiUrl} from '../../../core/globals.core';


@Injectable({ providedIn: 'root' })
export class PermissionBackendService {
  private apiUrl = apiUrl;
  private permissionsUrl = `${this.apiUrl}/api/permissions`;

  private get httpHeaders() { return this.authService.getHttpHeaders(); }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private messageService: MessageService) {
  }

  private log(message: string) {
    this.messageService.add('User Service: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private handlePostError (error: HttpErrorResponse): Observable<never> {
    console.error('UserBackendService.handlePostError(): ', error);
    // Client-side or network errors.
    if(error.error instanceof ErrorEvent) {
      this.log('Die Anforderung konnte nicht zum Server gesendet werden: ' + error.error.message);
      return throwError(new HttpErrorArgs(error, ErrorCodeType.Client_Side_Or_Network_Error));

      // Server-side errors.
    } else {
      if(error.status === 401) {
        return throwError(new HttpErrorArgs(error, ErrorCodeType.Authentication_Failed));
      }

      if(error.error.message.includes(ErrorCodeType.DuplicateKeyError)) {
        return throwError(new HttpErrorArgs(error, ErrorCodeType.DuplicateKeyError));
      }

      // this.log('Die Anforderung konnte serverseitig nicht bearbeitet werden: ' + error.error.message);
      return throwError(new HttpErrorArgs(error));
    }
  }

  /** GET permissions. */
  public getPermissionsByFilter(permissionFilter: PermissionFilter): Observable<any> {
    let httpParams: HttpParams = null;
    if (permissionFilter) {
      let httpParamsObject: any = {};
      if (permissionFilter._id) { httpParamsObject._id = permissionFilter._id; }
      if (permissionFilter.name) { httpParamsObject.name = permissionFilter.name; }
      if (permissionFilter.isPredefined) { httpParamsObject.isPredefined = permissionFilter.isPredefined.toString(); }

      if (permissionFilter.filter) { httpParamsObject.filter = permissionFilter.filter; }
      if (permissionFilter.sort) { httpParamsObject.sort = permissionFilter.sort; }
      if (permissionFilter.limit) { httpParamsObject.limit = permissionFilter.limit.toString(); }
      if (permissionFilter.page) { httpParamsObject.page = permissionFilter.page.toString(); }

      httpParams = new HttpParams({fromObject: httpParamsObject});
    }
    return this.http.get(this.permissionsUrl, { headers: this.httpHeaders, params: httpParams }).pipe(
      map( res => res as HttpResponsePermissions),
      tap(res => this.log(`Berechtigungs-Einträge geladen.`)),
      catchError(this.handleError('getPermissionsByFilter', []))
    );
  }

  /** POST: create a new permission entry. */
  public createPermission(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.permissionsUrl, permission, { headers: this.httpHeaders }).pipe(
      map(res  => res['data'] as Permission),
      tap((createdPermission: Permission) => this.log(`Berechtigungs-Eintrag ${createdPermission.name} hinzugefügt.`))
    );
  }

  /** PUT: update a permission entry. */
  public updatePermission(permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(this.permissionsUrl, permission, { headers: this.httpHeaders }).pipe(
      map(res  => res['data'] as Permission),
      tap((updatedPermission: Permission) =>
        this.log(`Berechtigungs-Eintrag mit name = '${updatedPermission.name}' und id = '${updatedPermission._id}' wurde aktualisiert.`))
    );
  }

  /** DELETE: delete a permission entry in database. */
  public deletePermission(permission: Permission): Observable<Permission> {
    let { id, name } = { id: permission._id, name: permission.name };
    const url = `${this.permissionsUrl}/${id}`;

    return this.http.delete<Permission>(url, { headers: this.httpHeaders }).pipe(
      map(res  => res['data'] as Permission),
      tap(_ => this.log(`Berechtigungs-Eintrag mit name = '${name}' und id = '${id}' wurde gelöscht.`))
    );
  }


}

import { Injectable } from '@angular/core';
import {Article, ArticleFilter, HttpResponseArticles} from '../models/article.model';
import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserService} from './user.service';
import {ErrorCodeType} from '../models/enum.model';
import {HttpErrorArgs} from '../models/http-error-args.model';
import {Router} from '@angular/router';
import {Reservation, ReservationFilter} from '../models/reservation.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class ArticleService {

  private api_url = 'http://localhost:3003';
  private articlesUrl = `${this.api_url}/api/articles`;
  private reservationsUrl = `${this.api_url}/api/reservations`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService) { }

  private getHttpHeaders(): HttpHeaders {
    if (!this.userService.getCurrentUser()) {
      console.error('Server Anfrage nicht möglich weil Benutzer nicht angemeldet.');
      this.redirectToLoginPage();
    }
    return new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.userService.getCurrentUser().authToken
    });
  }

  private redirectToLoginPage() {
    this.router.navigate(['/login']);
  }

  /** GET articles. */
  getArticles(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.articlesUrl}/?page=${page}&limit=${limit}`,
      { headers: this.getHttpHeaders() })
      .pipe(
        tap(res => this.log(`Artikel geladen.`)),
        catchError(this.handleError('getArticles', []))
      );
  }

  /** GET articles filtered. */
  getArticlesByFilter(articleFilter: ArticleFilter): Observable<any> {
    let httpParams: HttpParams = null;
    if (articleFilter) {
      let httpParamsOject: any = {};
      if (articleFilter.name) { httpParamsOject.name = articleFilter.name; }
      if (articleFilter.category && articleFilter.category._id !== 'undefined') { httpParamsOject.category = articleFilter.category._id; }
      if (articleFilter.status && articleFilter.status._id !== 'undefined') { httpParamsOject.status = articleFilter.status._id; }
      if (articleFilter.sort && articleFilter.sort._id !== 'undefined') { httpParamsOject.sort = articleFilter.sort._id; }
      if (articleFilter.tags) { httpParamsOject.tags = articleFilter.tags; }

      if (articleFilter.page) { httpParamsOject.page = articleFilter.page.toString(); }
      if (articleFilter.limit) { httpParamsOject.limit = articleFilter.limit.toString(); }
      if (articleFilter.includeUsersReservation) { httpParamsOject.includeUsersReservation = articleFilter.includeUsersReservation.toString(); }
      if (articleFilter.selectReservedArticles) { httpParamsOject.selectReservedArticles = articleFilter.selectReservedArticles.toString(); }
      if (articleFilter.selectPublishedArticles) { httpParamsOject.selectPublishedArticles = articleFilter.selectPublishedArticles.toString(); }

      httpParams = new HttpParams({fromObject: httpParamsOject});
    }
    return this.http.get(this.articlesUrl, { headers: this.getHttpHeaders(), params: httpParams })
      .pipe(
        tap(res => { this.log(`Artikel geladen.`);
          // console.log('article res: ', res);
        }),
        catchError(this.handleError('getArticlesByFilter', []))
      );
  }

  /** GET article by id. Will 404 if id not found */
  getArticleById(id: string, includeUsersReservation: boolean = false): Observable<Article> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.get<Article>(url, {
      headers: this.getHttpHeaders(), params: { 'includeUsersReservation': includeUsersReservation.toString() } }).pipe(
      map(res  => res['data'] as Article),
      tap(article => this.log(`Àrtikel mit name = '${article.name}' und id = '${article._id}' wurde geladen.`)),
      catchError(this.handleError<Article>(`getArticle id=${id}`))
    );
  }

  /** GET articles whose name contains search term */
  searchArticles(term: string): Observable<Article[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Article[]>(`${this.articlesUrl}/?name=${term}`,
      { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'].docs as Article[]),
      tap(_ => this.log(`Übereinstimmende Artikel zum Filter "${term}" gefunden.`)),
      catchError(this.handleError<Article[]>('searchArticle', []))
    );
  }

  /** POST: add a new article. */
  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.articlesUrl, article, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Article),
      tap((resArticle: Article) => this.log(`Artikel mit name = '${resArticle.name}' und id = '${resArticle._id}' wurde hinzugefügt.`)),
      catchError(this.handleError<Article>('createArticle'))
    );
  }

  /** PUT: update an article. */
  updateArticle(article: Article): Observable<any> {
    return this.http.put(this.articlesUrl, article, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Article),
      tap(_ => this.log(`Artikel mit name = '${article.name}' und id = '${article._id}' wurde aktualisiert.`)),
      catchError(this.handleError<any>('updateArticle'))
    );
  }

  /** DELETE: delete an article in database. */
  deleteArticle(article: Article | string): Observable<Article> {
    let id, name = '';
    if (typeof article === 'string') {
      id = article;
    } else {
      id = article._id;
      name = article.name;
    }
    const url = `${this.articlesUrl}/${id}`;

    return this.http.delete<Article>(url, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Article),
      tap(_ => this.log(`Artikel mit name = '${name}' und id = '${id}' wurde gelöscht.`)),
      catchError(this.handleError<Article>('deleteArticle'))
    );
  }

  private log(message: string) {
    this.messageService.add('Artikel Service: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error('ArticleService.handleError(): ', error);

      this.log(`${operation} failed: ${error.message}`);

      if (error.status === 401) {
        this.router.navigate(['/login']);
        return;
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // Reservations
  // -----------------------------------------------------------------------------

  /** GET reservations */
  getReservations(reservationFilter: ReservationFilter): Observable<any> {
    let httpParamsOject: any = {};
    if (reservationFilter.user) { httpParamsOject.userId = reservationFilter.user._id; }
    if (reservationFilter.article) { httpParamsOject.articleId = reservationFilter.article._id; }
    if (reservationFilter.page) { httpParamsOject.page = reservationFilter.page.toString(); }
    if (reservationFilter.limit) { httpParamsOject.limit = reservationFilter.limit.toString(); }
    let httpParams = new HttpParams({fromObject: httpParamsOject});

    return this.http.get(this.reservationsUrl, { headers: this.getHttpHeaders(), params: httpParams })
      .pipe(
        tap(response => { this.log(`Reservationen geladen.`);
          // console.log('reservation response: ', response);
        }),
        catchError(this.handleError('getReservationsByFilter', []))
      );
  }

  /** POST: add a new reservation. */
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.reservationsUrl, reservation, { headers: this.getHttpHeaders() }).pipe(
      map((res) => {
        return res['data'] as Reservation;
      }),
      tap((resReservation: Reservation) => {
        this.log(`Reservation für den Artikel '${reservation.article.name}' wurde hinzugefügt.`);
      }),
      catchError(this.handleError<Reservation>('createReservation'))
    );
  }

  /** PUT: update a reservation. */
  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(this.reservationsUrl, reservation, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Reservation),
      tap((resReservation: Reservation) => {
        this.log(`Reservation für den Artikel '${reservation.article.name}', mit id = '${resReservation._id}' wurde aktualisiert.`);
      }),
      catchError(this.handleError<any>('updateReservation'))
    );
  }

  /** DELETE: delete a reservation. */
  deleteReservation(reservation: Reservation | string): Observable<Reservation> {
    let id, articleName = '';
    if (typeof reservation === 'string') {
      id = reservation;
    } else {
      id = reservation._id;
      articleName = reservation.article.name;
    }
    const url = `${this.reservationsUrl}/${id}`;

    return this.http.delete<Reservation>(url, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Reservation),
      tap(_ => this.log(`Reservation für den Artikel '${articleName}' mit id = '${id}' wurde gelöscht.`)),
      catchError(this.handleError<Reservation>('deleteReservation'))
    );
  }

}

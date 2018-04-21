import { Injectable } from '@angular/core';
import {Article, ArticleFilter, HttpResponseArticles} from '../models/article.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from '../message.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {UserService} from './user.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
}

@Injectable()
export class ArticleService {

  private api_url = 'http://localhost:3003';
  private articlesUrl = `${this.api_url}/api/articles`;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private messageService: MessageService) { }

  private getHttpHeaders(): HttpHeaders {
    if (!this.userService.getCurrentUser()) {
      throw Error('Server Anfrage nicht möglich weil Benutzer nicht angemeldet.');
    }
    return new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.userService.getCurrentUser().authToken
    });
  }

  /** GET articles from the server. */
  getArticles(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.articlesUrl}/?page=${page}&limit=${limit}`,
      { headers: this.getHttpHeaders() })
      .pipe(
        tap(res => this.log(`Artikel geladen.`)),
        catchError(this.handleError('getArticles', []))
      );
  }

  /** GET articles from the server. */
  getArticlesByFilter(articleFilter: ArticleFilter): Observable<any> {
    let httpParams = {};
    if(articleFilter) {
      httpParams = new HttpParams()
        .set('page', articleFilter.page.toString())
        .set('limit', articleFilter.limit.toString())
        .set('name', articleFilter.name)
        .set('category', articleFilter.category._id)
        .set('status', articleFilter.status._id)
        .set('sort', articleFilter.sort._id)
        .set('tags', articleFilter.tags);
    }
    return this.http.get(this.articlesUrl, { headers: this.getHttpHeaders(), params: httpParams })
      .pipe(
        tap(res => this.log(`Artikel geladen.`)),
        catchError(this.handleError('getArticles', []))
      );
  }

  /** GET article by id. Will 404 if id not found */
  getArticleById(id: string): Observable<Article> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.get<Article>(url, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Article),
      tap(article => this.log(`Àrtikel mit name = '${article.name}' und id = '${article._id}' wurde geladen.`)),
      catchError(this.handleError<Article>(`getArticle id=${id}`))
    );
  }

  /** GET articles whose name contains search term */
  searchArticles(term: string): Observable<Article[]> {
    if(!term.trim()) {
      return of([]);
    }
    return this.http.get<Article[]>(`${this.articlesUrl}/?name=${term}`,
      { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'].docs as Article[]),
      tap(_ => this.log(`Übereinstimmende Artikel zum Filter "${term}" gefunden.`)),
      catchError(this.handleError<Article[]>('searchArticle', []))
    );
  }

  /** PUT: update the article on the server */
  updateArticle(article: Article): Observable<any> {
    return this.http.put(this.articlesUrl, article, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Article),
      tap(_ => this.log(`Artikel mit name = '${article.name}' und id = '${article._id}' wurde aktualisiert.`)),
      catchError(this.handleError<any>('updateArticle'))
    );
  }

  /** POST: add a new article in database. */
  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.articlesUrl, article, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Article),
      tap((resArticle: Article) => this.log(`Artikel mit name = '${resArticle.name}' und id = '${resArticle._id}' wurde hinzugefügt.`)),
      catchError(this.handleError<Article>('createArticle'))
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

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

import { Injectable } from '@angular/core';
import { Article } from '../models/article.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from '../message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
}

@Injectable()
export class ArticleService {

  private api_url = 'http://localhost:3003';
  private articlesUrl = `${this.api_url}/api/articles`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  /** GET articles from the server. */
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.articlesUrl)
      .pipe(
        map(res  => res['data'].docs as Article[]),
        tap(articles => this.log(`Artikel geladen.`)),
        catchError(this.handleError('getArticles', []))
      );
  }

  /** GET article by id. Will 404 if id not found */
  getArticleById(id: string): Observable<Article> {
    const url = `${this.articlesUrl}/${id}`;
    return this.http.get<Article>(url).pipe(
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
    return this.http.get<Article[]>(`${this.articlesUrl}/?name=${term}`).pipe(
      map(res  => res['data'].docs as Article[]),
      tap(_ => this.log(`Übereinstimmende Artikel zum Filter "${term}" gefunden.`)),
      catchError(this.handleError<Article[]>('searchArticle', []))
    );
  }

  /** PUT: update the article on the server */
  updateArticle(article: Article): Observable<any> {
    return this.http.put(this.articlesUrl, article, httpOptions).pipe(
      map(res  => res['data'] as Article),
      tap(_ => this.log(`Artikel mit name = '${article.name}' und id = '${article._id}' wurde aktualisiert.`)),
      catchError(this.handleError<any>('updateArticle'))
    );
  }

  /** POST: add a new article to the server */
  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.articlesUrl, article, httpOptions).pipe(
      map(res  => res['data'] as Article),
      tap((resArticle: Article) => this.log(`Artikel mit name = '${resArticle.name}' und id = '${resArticle._id}' wurde hinzugefügt.`)),
      catchError(this.handleError<Article>('createArticle'))
    );
  }

  /** DELETE: delete the article from the server */
  deleteArticle(article: Article | string): Observable<Article> {
    let id, name = '';
    if (typeof article === 'string') {
      id = article;
    } else {
      id = article._id;
      name = article.name;
    }
    const url = `${this.articlesUrl}/${id}`;

    return this.http.delete<Article>(url, httpOptions).pipe(
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

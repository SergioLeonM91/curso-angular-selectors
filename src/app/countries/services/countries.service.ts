import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { CountrySmall, Country } from '../interfaces/countries.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _baseUrl: string = 'https://restcountries.com/v3.1';

  get regions(): string[] {
    return [...this._regions];
  }

  constructor(
    private _http: HttpClient
  ) { }

  getCountriesByRegion( region: string ): Observable<CountrySmall[] | null> {

    if( !region ) {
      return of(null)
    }

    const url: string = `${this._baseUrl}/region/${region}?fields=name,cca3`;
    return  this._http.get<CountrySmall[]>(url);
  }

  getCountryByCode( cca3: string ): Observable<Country[]> {

    if(!cca3) {
      return of([]);
    }

    const url: string = `${this._baseUrl}/alpha/${cca3}`;
    return  this._http.get<Country[]>(url);
  }

  getCountryByCodeSmall( cca3: string ): Observable<CountrySmall> {
    const url: string = `${this._baseUrl}/alpha/${cca3}?fields=name,cca3`;
    return  this._http.get<CountrySmall>(url);
  }

  getCountriesByCodes( borders: Country[] ): Observable<CountrySmall[]> {
    if (!borders[0]?.borders){
      return of([]);
    }

    const petitions: Observable<CountrySmall>[] = [];

    borders[0]?.borders.forEach(code => {
      const petition = this.getCountryByCodeSmall(code);
      petitions.push(petition);
    });

    return combineLatest(petitions);
  }

}

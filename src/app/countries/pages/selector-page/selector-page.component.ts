import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, pipe, switchMap, tap } from 'rxjs';
import { CountrySmall, Country } from '../../interfaces/countries.interface';
import { CountriesService } from '../../services/countries.service';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this._fb.group({
    region: [
      '',
      Validators.required
    ],
    country: [
      '',
      Validators.required
    ],
    border: [
      '',
      Validators.required
    ]
  })

  regions: string[] = [];
  countries: CountrySmall[] = [];
  borders: CountrySmall[] = [];

  loading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _countriesServices: CountriesService
  ) {}

  ngOnInit(): void {
    this.regions = this._countriesServices.regions;

    this.myForm.get('region')?.valueChanges.
      pipe(
        tap(() => {
          this.myForm.get('country')?.reset('');
          this.countries = [];
          this.loading = true;
        }),
        switchMap( region => this._countriesServices.getCountriesByRegion(region) )
      ).subscribe( (countries: CountrySmall[] | null) => {
        if(countries) {
          this.countries = countries;
          this.loading = false;
        }
      });

    this.myForm.get('country')?.valueChanges.
      pipe(
        tap(() => {
          this.myForm.get('border')?.reset('');
          this.borders = [];
          this.loading = true;
        }),
        switchMap( cca3 => this._countriesServices.getCountryByCode(cca3) ),
        switchMap( country => this._countriesServices.getCountriesByCodes( country ) )
      ).subscribe( (countries) => {
        if (countries.length > 0) {
          this.borders = countries;
          this.loading=false;
        }
        else{
          this.borders=[];
          this.loading=false;
        }
      });
    
  }

  save() {
    console.log(this.myForm.value);
  }
}

import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';

import { Continent } from './interfaces/continent.interface';
import { Country } from './interfaces/country.interface';

const GRAPHQL_API = 'https://countries.trevorblades.com/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';


@Injectable()
export class AppService { 
  async getContinentsData() {
    const q = `{
      continents {
        code
        name
      }
    }`;

    return axios.post(GRAPHQL_API, JSON.stringify({query: q }));
  }

  async getContinents(): Promise<Continent[]> {
    let result: Continent[] = [];

    await this.getContinentsData().then(response => {
      result = response.data.data.continents;
    })
    .catch(error => {
      console.log(error);
    });

    return result;
  }

  async getCountriesData(continentCode: string) {
    const q = `
    {
      continent(code: "${continentCode}") {
        countries {
          code
          name
          phone
          capital
          currency
          languages {
            name
          }
        }
      }
    }`;

    return axios.post(GRAPHQL_API, JSON.stringify({query: q}));
  }

  async getCountries(continentCode: string): Promise<Country[]> {
    let result: Country[] = [];

    await this.getCountriesData(continentCode).then(response => {
      result = response.data.data.continent.countries;
    })
    .catch(error => {
      console.log(error);
    });
    return result;
  }
}

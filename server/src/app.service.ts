import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { RedisService } from 'nestjs-redis';

import { Continent } from './interfaces/continent.interface';
import { Country } from './interfaces/country.interface';

const GRAPHQL_API = 'https://countries.trevorblades.com/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';


@Injectable()
export class AppService {
  redisClient = null;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

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
    let result: Continent[] = await this.redisClient.get('continents');

    if (result) {
      console.log('Continents data from cache');
    } else {
      await this.getContinentsData().then(response => {
        console.log('Continents data from external API');

        if (response.data.data.continents) {
          result = response.data.data.continents;
          this.redisClient.set('continents', JSON.stringify(result));
        }

      })
      .catch(error => {
        console.log(error);
      });
    }

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
    let result: Country[] = await this.redisClient.get(continentCode);

    if (result) {
      console.log(`${continentCode} countries data from cache`);
    } else {
      await this.getCountriesData(continentCode).then(response => {
        console.log(`${continentCode} countries data from external API`);

        if (response.data.data.continent) {
          result = response.data.data.continent.countries;
          this.redisClient.set(continentCode, JSON.stringify(result));
        }
      })
      .catch(error => {
        console.log(error);
      });
    }

    return result;
  }
}

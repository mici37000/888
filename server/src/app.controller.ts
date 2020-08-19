import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Continent } from './interfaces/continent.interface';
import { Country } from './interfaces/country.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('continents')
  getContinents(): Promise<Continent[]> {
    return this.appService.getContinents();
  }

  @Get('continent/:continentCode')
  getCountries(@Param('continentCode') continentCode: string): Promise<Country[]> {
    return this.appService.getCountries(continentCode);
  }
}

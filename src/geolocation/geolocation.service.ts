import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { FeatureCollection } from 'typeorm';

@Injectable()
export class GeolocationService {
  constructor(private readonly http: HttpService) {}

  async getGeolocation(query: string): Promise<FeatureCollection> {
    const { data } = await firstValueFrom(
      this.http.get<FeatureCollection>(
        `https://api-adresse.data.gouv.fr/search/`,
        {
          params: {
            q: query,
            limit: 10,
            type: 'housenumber',
          },
        },
      ),
    );

    return data;
  }

  async autocomplete(query: string): Promise<{ label: string }[]> {
    const data = await this.getGeolocation(query);
    return data.features.map((f) => {
      return {
        label: f.properties.label,
      };
    });
  }
}

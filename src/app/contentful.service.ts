import { Injectable } from '@angular/core';
import { createClient, Entry } from 'contentful';

const CONFIG = {
  space: 'gaci4i5m4n5q',
  accessToken: '28b0c2be8f57917c4f46cdcb75fc7c32ec1b7f337ee084f492d5b2b0f95a9482',

  contentTypeIds: {
    homeware: 'homeware',
    furniture: 'furniture'
  }
};

@Injectable()
export class ContentfulService {
  private cdaClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken
});

  constructor() { }

  getHomewareItems(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.homeware
    }, query))
      .then(res => res.items);
  }

  getFurnitureItems(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.furniture
    }, query))
      .then(res => res.items);
  }

}

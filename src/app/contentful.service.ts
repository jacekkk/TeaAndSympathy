import { Injectable } from '@angular/core';
import { createClient, Entry, Space, ContentfulClientApi  } from 'contentful';
import * as marked from 'marked';

const CONFIG = {
  credentials:{
  space: 'gaci4i5m4n5q',
  accessToken: '28b0c2be8f57917c4f46cdcb75fc7c32ec1b7f337ee084f492d5b2b0f95a9482',
  },

  contentTypeIds: {
    homeware: 'homeware',
    furniture: 'furniture',
    landing: 'landingContent',
    landingFurniture : 'landingFurniture',
    landingHomeware : 'landingHomeware',
    photeHome: 'headingPhotoHome',
    menuDrinks: 'menuDrinks',
    menuFood: 'menuFood',
    suppliersDescription:'suppliersText',
  }
};

@Injectable()
export class ContentfulService {
  cdaClient: ContentfulClientApi;
  config: {
    space: string,
    accessToken: string
  };

  titleHandlers: Function[]


  constructor() {
    try {
      this.config = JSON.parse(localStorage.catalogConfig);
    } catch (e) {
      this.config = CONFIG.credentials;
    }

    this.titleHandlers = [];
    this._createClient();
    this.getSpace();
}

  onTitleChange(fn): void {
    this.titleHandlers.push(fn)
  }

  // get the current space
  getSpace(): Promise<Space> {
    return this.cdaClient.getSpace()
      .then(space => {
        this.titleHandlers.forEach(handler => handler(space.name))

        return space;
      })
    }

  // fetch homeware items
  getHomewareItems(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.homeware
    }, query))
      .then(res => res.items);
  }


  getLandingContent(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.landing
    }, query))
      .then(res => res.items);
  }

  getLandingFurniture(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.landingFurniture
    }, query))
      .then(res => res.items);
  }

  getLandingHomeware(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.landingHomeware
    }, query))
      .then(res => res.items);
  }

  getHomePhoto(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.photeHome
    }, query))
      .then(res => res.items);
  }
  markdownToHtml(md:string){

    return marked(md);

  }

  getFurnitureItems(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.furniture
    }, query))
      .then(res => res.items);
  }


  // fetch items with a given slug
  // and return one of them
  getHomewareItem(slug: string): Promise<Entry<any>> {
    return this.getHomewareItems({ 'fields.slug': slug })
    .then(items => items[0])
  }

  getMenuDrinks(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.menuDrinks
    }, query))
      .then(res => res.items);
  }

  getMenuFood(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.menuFood
    }, query))
      .then(res => res.items);
  }

  getSuppliersDesc(query?: object): Promise<Entry<any>[]> {
    return this.cdaClient.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.suppliersDescription
    }, query))
      .then(res => res.items);
  }

    // return a custom config if available
    getConfig(): { space: string, accessToken: string } {
      return this.config !== CONFIG.credentials ?
        Object.assign({}, this.config) :
        { space: '', accessToken: '' };
    }

    // set a new config and store it in localStorage
    setConfig(config: {space: string, accessToken: string}) {
      localStorage.setItem('catalogConfig', JSON.stringify(config));
      this.config = config;

      this._createClient();
      this.getSpace();

      return Object.assign({}, this.config);
    }

   // set config back to default values
   resetConfig() {
    localStorage.removeItem('catalogConfig');
    this.config = CONFIG.credentials;

    this._createClient();
    this.getSpace();

    return Object.assign({}, this.config);
  }

  _createClient() {
    this.cdaClient = createClient({
      space: this.config.space,
      accessToken: this.config.accessToken
    });
  }

}





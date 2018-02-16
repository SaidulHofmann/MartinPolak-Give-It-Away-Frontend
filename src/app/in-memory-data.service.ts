import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const articles = [
      { id: 11, name: 'Staubsauger' },
      { id: 12, name: 'Rasenmäher' },
      { id: 13, name: 'Swatch Uhr' },
      { id: 14, name: 'Sofa' },
      { id: 15, name: 'Geschirrspüler' },
      { id: 16, name: 'iPhone 7' },
      { id: 17, name: 'Notebook' },
      { id: 18, name: 'Grill' },
      { id: 19, name: 'Schaukel' },
      { id: 20, name: 'Radio' }
    ];
    return {articles};
  }
}

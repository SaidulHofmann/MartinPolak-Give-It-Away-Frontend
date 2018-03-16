import {User, UserRef} from './user.model';
import {Article} from './article.model';
import {ArticleCategory} from './articleCategory.model';
import {ArticleStatus} from './articleStatus.model';

export const articleCategories: ArticleCategory[] = [
  {_id: 'others', name: 'Sonstiges'},
  {_id: 'mobility', name: 'Mobilität'},
  {_id: 'household', name: 'Haushalt'},
  {_id: 'garden', name: 'Garten'},
  {_id: 'nutrition', name: 'Ernährung'},
  {_id: 'office', name: 'Bürobedarf'},
  {_id: 'hygiene', name: 'Hygiene'},
  {_id: 'health', name: 'Gesundheit'},
  {_id: 'electronics', name: 'Elektronik'},
  {_id: 'leisure', name: 'Freizeit'}
];

export const articleStatus: ArticleStatus[] = [
  {_id: 'available', name: 'Verfügbar'},
  {_id: 'handoverPending', name: 'Übergabe pendent'},
  {_id: 'donated', name: 'Verschenkt'}
];

export const testUserRef: UserRef = {
  _id: '5aa00063b382de1478501ccd',
  firstname: 'Hans',
  lastname: 'Muster'
};

export const testUser: User = {
  _id: '5aa00063b382de1478501ccd',
  firstname: 'Hans',
  lastname: 'Muster',
  email: 'testuser1@testuser.com',
  password: 'pw',
  createdAt: new Date(2018, 3, 13),
  updatedAt: new Date(2018, 3, 13)
};

export const testArticle: Article = {
  _id: '5a9e4e65bdd7751e50331243',
  name: 'Motorrad 5',
  description:  'Yamaha 5000ccm',
  handover: 'Abholung durch den Kunden.',
  pictureOverview:  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
  pictures: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
    'http://www.motorcyclespecs.co.za/Gallery%20%20A/Yamaha%20XS650B%2075%20%201.jpg',
    'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0018_YME1-1024x812.jpg',
    'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0019_YME.jpg',
    'https://i.ytimg.com/vi/51h-ESZqIKg/maxresdefault.jpg'
  ],
  videos: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
    'http://www.motorcyclespecs.co.za/Gallery%20%20A/Yamaha%20XS650B%2075%20%201.jpg',
    'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0018_YME1-1024x812.jpg',
    'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0019_YME.jpg',
    'https://i.ytimg.com/vi/51h-ESZqIKg/maxresdefault.jpg'
  ],
  tags:  'Motorrad, Yamaha, Yamaha 5000ccm',
  donationDate: new Date(2018, 3, 15),

  publisher: this.testUserRef,
  donee: this.testUserRef,
  category: articleCategories[0],
  status: articleStatus[0],

  createdAt: new Date(2018, 3, 13),
  updatedAt: new Date(2018, 3, 13)
};

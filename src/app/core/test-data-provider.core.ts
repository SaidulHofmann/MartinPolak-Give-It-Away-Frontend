// Contains objects with test data.

import {Article, ArticleCategory, ArticleStatus, Permission, User, UserRef} from '../models/index.model';
import {IdNamePair} from './types.core';

export const testPermissionStandardbenutzer: Permission = {
  _id: '5b35430567dfb9160c2532bf',
  name: 'Standardbenutzer',
  isPredefined: true,

  articleOwnCreate: true,
  articleOwnUpdate: true,
  articleOwnDelete: true,
  articleOwnDonate: true,

  articleOtherUpdate: false,
  articleOtherDelete: false,
  articleOtherDonate: false,

  userCreate: false,
  userRead: false,
  userUpdate: false,
  userDelete: false,

  permissionCreate: false,
  permissionRead: false,
  permissionUpdate: false,
  permissionDelete: false,

  createdAt: new Date(2018, 3, 13),
  updatedAt: new Date(2018, 3, 13)
};

export const testUserRef: UserRef = {
  _id: '5aa00063b382de1478501ccd',
  firstname: 'Hans',
  lastname: 'Muster',
  fullname: 'Hans Muster'
};

export const testUser: User = {
  _id: '5aa00063b382de1478501ccd',
  firstname: 'Hans',
  lastname: 'Muster',
  fullname: 'Hans Muster',
  email: 'testuser1@testuser.com',
  password: 'pw',
  createdAt: new Date(2018, 3, 13),
  updatedAt: new Date(2018, 3, 13),
  authToken: '',
  permission: testPermissionStandardbenutzer
};

export const testArticle: Article = {
  _id: '5a9e4e65bdd7751e50331243',
  name: 'Motorrad 5',
  description:  'Yamaha 5000ccm',
  handover: 'Abholung durch den Kunden.',
  overviewImage:  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
  additionalImages: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
    'http://www.motorcyclespecs.co.za/Gallery%20%20A/Yamaha%20XS650B%2075%20%201.jpg',
    'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0018_YME1-1024x812.jpg',
    'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0019_YME.jpg',
    'https://i.ytimg.com/vi/51h-ESZqIKg/maxresdefault.jpg'
  ],
  tags:  'Motorrad, Yamaha, Yamaha 5000ccm',
  donationDate: new Date(2018, 3, 15),

  publisher: testUserRef,
  donee: testUserRef,
  category: {_id: 'others', name: 'Sonstiges'},
  status: {_id: 'available', name: 'Artikel verfügbar'},

  createdAt: new Date(2018, 3, 13),
  updatedAt: new Date(2018, 3, 13)
};

export const testArticleResponseObj = {
  'status': 200,
  'data': {
    'additionalImages': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
      'http://www.motorcyclespecs.co.za/Gallery%20%20A/Yamaha%20XS650B%2075%20%201.jpg',
      'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0018_YME1-1024x812.jpg',
      'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0019_YME.jpg',
      'https://i.ytimg.com/vi/51h-ESZqIKg/maxresdefault.jpg'
    ],
    '_id': '5a9e4e65bdd7751e5033123f',
    'name': 'Motorrad 1',
    'description': 'Yamaha 1000ccm',
    'handover': 'Abholung durch den Kunden.',
    'overviewImage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
    'tags': 'Motorrad, Yamaha, Yamaha 1000ccm',
    'donationDate': null,
    'publisher': {
      '_id': '5abc0267d608821850991037',
      'firstname': 'Hans',
      'lastname': 'Muster'
    },
    'donee': null,
    'category': {
      '_id': 'mobility',
      'name': 'Mobilität'
    },
    'status': {
      '_id': 'available',
      'name': 'Artikel verfügbar'
    },
    'createdAt': new Date(2018, 3, 28),
    'updatedAt': new Date(2018, 3, 28),
    '__v': 0
  },
  'message': 'Article received successfully.'
};

export const testArticleObj: Article = {
  'additionalImages': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
    'http://www.motorcyclespecs.co.za/Gallery%20%20A/Yamaha%20XS650B%2075%20%201.jpg',
    'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0018_YME1-1024x812.jpg',
    'http://nippon-classic.de/wp-content/uploads/2015/07/Yamaha_XS650_1970-1978_0019_YME.jpg',
    'https://i.ytimg.com/vi/51h-ESZqIKg/maxresdefault.jpg'
  ],
  '_id': '5a9e4e65bdd7751e5033123f',
  'name': 'Motorrad 1',
  'description': 'Yamaha 1000ccm',
  'handover': 'Abholung durch den Kunden.',
  'overviewImage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Yamaha_img_2227.jpg/1200px-Yamaha_img_2227.jpg',
  'tags': 'Motorrad, Yamaha, Yamaha 1000ccm',
  'donationDate': null,
  'publisher': {
    '_id': '5abc0267d608821850991037',
    'firstname': 'Hans',
    'lastname': 'Muster',
    'fullname': 'Hans Muster'
  },
  'donee': null,
  'category': {
    '_id': 'mobility',
    'name': 'Mobilität'
  },
  'status': {
    '_id': 'available',
    'name': 'Artikel verfügbar'
  },
  'createdAt': new Date(2018, 3, 28),
  'updatedAt': new Date(2018, 3, 28),
};

export const testArticleResponse = JSON.stringify(testArticleResponseObj);

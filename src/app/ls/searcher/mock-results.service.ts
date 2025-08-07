import { Injectable } from '@angular/core';


const people: any[] = [
  {
      name: 'A', 
      age: 10,
      citations: 10,
      hIndex: 10,
      university: {
        name: 'U1',
        address: 'A1' 
      },
      id: 1,
      researchAreas: ['A1', 'A2', 'A3']
    },{
      name: 'B', 
      age: 20,
      citations: 20,
      hIndex: 20,
      university: {
        name: 'U2',
        address: 'A2' 
      },
      id: 2,
      researchAreas: ['A1', 'A2', 'A3']
  },{
    name: 'C',
    age: 30,
    citations: 50,
    hIndex: 15,
    university: {
      name: 'U3',
      address: 'A3'
    },
    id: 3,
    researchAreas: ['A4', 'A5']
  },{
    name: 'D',
    age: 25,
    citations: 10,
    hIndex: 5,
    university: {
      name: 'U4',
      address: 'A4'
    },
    id: 4,
    researchAreas: ['A6', 'A7', 'A8']
  },{
    name: 'E',
    age: 40,
    citations: 100,
    hIndex: 25,
    university: {
      name: 'U5',
      address: 'A5'
    },
    id: 5,
    researchAreas: ['A9', 'A10']
  },{
    name: 'F',
    age: 35,
    citations: 80,
    hIndex: 20,
    university: {
      name: 'U6',
      address: 'A6'
    },
    id: 6,
    researchAreas: ['A11', 'A12', 'A13']
  },{
    name: 'G',
    age: 28,
    citations: 60,
    hIndex: 18,
    university: {
      name: 'U7',
      address: 'A7'
    },
    id: 7,
    researchAreas: ['A14', 'A15']
  },
  {
    name: 'H',
    age: 32,
    citations: 90,
    hIndex: 22,
    university: {
      name: 'U8',
      address: 'A8'
    },
    id: 8,
    researchAreas: ['A16', 'A17']
  },
  {
    name: 'I',
    age: 27,
    citations: 70,
    hIndex: 19,
    university: {
      name: 'U9',
      address: 'A9'
    },
    id: 9,
    researchAreas: ['A18', 'A19']
  },
  {
    name: 'J',
    age: 31,
    citations: 85,
    hIndex: 21,
    university: {
      name: 'U10',
      address: 'A10'
    },
    id: 10,
    researchAreas: ['A20', 'A21']
  }
]

export const availablePagingCounts = [5, 10, 15, 20];

@Injectable({
  providedIn: 'any'
})
export class MockResultsService {

  pagingCount = 10;

  getPagesCount(){
    return Math.ceil(people.length / this.pagingCount);
  }

  setPagingCount(count: number){
    if (availablePagingCounts.includes(count)) {
      this.pagingCount = count;
    }
  }

  getPeople(page: number = 1){
    if (page < 1) {
      page = 1;
    }
    const maxPage = this.getPagesCount();
    const desiredPage = (page > maxPage) ? maxPage : page;

    const startIndex = (desiredPage - 1) * this.pagingCount;
    const endIndex = desiredPage * this.pagingCount;
    const resultingPeople = people.slice(startIndex, endIndex);

    return resultingPeople;
  }

  getPerson(id: number){
    return people[id];
  }
}

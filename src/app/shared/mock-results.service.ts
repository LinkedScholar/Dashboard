import { Injectable } from '@angular/core';
import { Person, University } from './result-types/result-types.module';


const people: Person[] =  [
  {
    "name": "Amelia Brooks",
    "age": 10,
    "citations": 10,
    "hIndex": 10,
    "university": 1,
    "id": 1,
    "researchAreas": [
      "Computational Linguistics",
      "Quantum Computing",
      "Robotics"
    ]
  },
  {
    "name": "Elijah Reed",
    "age": 20,
    "citations": 20,
    "hIndex": 20,
    "university": 2,
    "id": 2,
    "researchAreas": [
      "Machine Learning",
      "Bioinformatics",
      "Network Security"
    ]
  },
  {
    "name": "Olivia Turner",
    "age": 30,
    "citations": 50,
    "hIndex": 15,
    "university": 3,
    "id": 3,
    "researchAreas": [
      "Data Science",
      "Human-Computer Interaction"
    ]
  },
  {
    "name": "Liam Clark",
    "age": 25,
    "citations": 10,
    "hIndex": 5,
    "university": 4,
    "id": 4,
    "researchAreas": [
      "Artificial Intelligence",
      "Computer Vision",
      "Cybersecurity"
    ]
  },
  {
    "name": "Sophia Martinez",
    "age": 40,
    "citations": 100,
    "hIndex": 25,
    "university": 5,
    "id": 5,
    "researchAreas": [
      "Biomedical Engineering",
      "Material Science"
    ]
  },
  {
    "name": "Noah Jones",
    "age": 35,
    "citations": 80,
    "hIndex": 20,
    "university": 6,
    "id": 6,
    "researchAreas": [
      "Software Engineering",
      "Cognitive Science",
      "User Experience"
    ]
  },
  {
    "name": "Isabella Brown",
    "age": 28,
    "citations": 60,
    "hIndex": 18,
    "university": 7,
    "id": 7,
    "researchAreas": [
      "Neuroscience",
      "Ecology"
    ]
  },
  {
    "name": "James Wilson",
    "age": 32,
    "citations": 90,
    "hIndex": 22,
    "university": 8,
    "id": 8,
    "researchAreas": [
      "Data Mining",
      "Geospatial Analysis"
    ]
  },
  {
    "name": "Ava Garcia",
    "age": 27,
    "citations": 70,
    "hIndex": 19,
    "university": 3,
    "id": 9,
    "researchAreas": [
      "Cloud Computing",
      "DevOps"
    ]
  },
  {
    "name": "Lucas Rodriguez",
    "age": 31,
    "citations": 85,
    "hIndex": 21,
    "university": 1,
    "id": 10,
    "researchAreas": [
      "Blockchain",
      "Fintech"
    ]
  }
]

const universities: any[] = [
  {
    "id": 1,
    "name": "Nautilus University",
    "address": "456 Oak Avenue"
  },
  {
    "id": 2,
    "name": "Starlight Institute of Technology",
    "address": "789 Pine Lane"
  },
  {
    "id": 3,
    "name": "Evergreen Research Center",
    "address": "101 Maple Boulevard"
  },
  {
    "id": 4,
    "name": "Crestview College",
    "address": "222 Birch Street"
  },
  {
    "id": 5,
    "name": "Horizon Polytechnic",
    "address": "333 Cedar Court"
  },
  {
    "id": 6,
    "name": "Summit University",
    "address": "444 Elm Drive"
  },
  {
    "id": 7,
    "name": "Riverbend Institute",
    "address": "555 Pine Street"
  },
  {
    "id": 8,
    "name": "Pinnacle College",
    "address": "666 Oak Drive"
  },
  {
    "id": 9,
    "name": "Oceanic University",
    "address": "777 Maple Avenue"
  },
  {
    "id": 10,
    "name": "Highland Technical College",
    "address": "888 Birch Lane"
  }
]

const links: any[] = [
    {
      "source": 1,
      "target": 5
    },
    {
      "source": 3,
      "target": 9
    },
    {
      "source": 4,
      "target": 8
    },
    {
      "source": 2,
      "target": 10
    },
    {
      "source": 6,
      "target": 7
    },
    {
      "source": 1,
      "target": 8
    },
    {
      "source": 3,
      "target": 5
    },
    {
      "source": 2,
      "target": 4
    },
    {
      "source": 9,
      "target": 10
    },
    {
      "source": 7,
      "target": 1
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

  search(query: string, maxItems: number = 5) : any[] {
    let resultingPeople = people.filter(person => person.name.toLowerCase().includes(query.toLowerCase()));
    let resultingUniversities = universities.filter(university => university.name.toLowerCase().includes(query.toLowerCase()));
    
    // return name + type tuple
    let result = [];
    resultingPeople.forEach(person => result.push({name: person.name, type: 'person', id: person.id}));
    resultingUniversities.forEach(university => result.push({name: university.name, type: 'institution', id: university.id}));
    return result.slice(0, maxItems);
  }

  getPerson(id: number) : Person | null {
    for (let person of people){
      if (person.id == id){
        return person;
      }
    }
    return null;
  }

  getUniversity(id: number) : University | null {
    for (let university of universities){
      if (university.id == id){
        return university;
      }
    }
    return null;
  }
}

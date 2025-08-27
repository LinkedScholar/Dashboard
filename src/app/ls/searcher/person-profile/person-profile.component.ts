import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockResultsService } from '../../../shared/mock-results.service';

@Component({
  selector: 'ls-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss']
})
export class PersonProfileComponent implements OnInit{

  personId: number;
  personName: string = "Loaded";
  personPicture: string = "https://avatars.githubusercontent.com/u/2131211"

  chartData = [
    { 
      category: '2019', 
      'Machine Learning': 45, 
      'Data Science': 32, 
      'Computer Vision': 28, 
      'Natural Language Processing': 21, 
      'Robotics': 15 
    },
    { 
      category: '2020', 
      'Machine Learning': 52, 
      'Data Science': 38, 
      'Computer Vision': 35, 
      'Natural Language Processing': 29, 
      'Robotics': 18 
    },
    { 
      category: '2021', 
      'Machine Learning': 68, 
      'Data Science': 45, 
      'Computer Vision': 42, 
      'Natural Language Processing': 38, 
      'Robotics': 25 
    },
    { 
      category: '2022', 
      'Machine Learning': 74, 
      'Data Science': 51, 
      'Computer Vision': 48, 
      'Natural Language Processing': 44, 
      'Robotics': 31 
    },
    { 
      category: '2023', 
      'Machine Learning': 89, 
      'Data Science': 62, 
      'Computer Vision': 55, 
      'Natural Language Processing': 53, 
      'Robotics': 37 
    },
    { 
      category: '2024', 
      'Machine Learning': 95, 
      'Data Science': 71, 
      'Computer Vision': 63, 
      'Natural Language Processing': 61, 
      'Robotics': 42 
    }
  ];

  
  constructor(private route : ActivatedRoute, private mockData : MockResultsService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.personId = +params['id']; // The '+' converts the string to a number
      // Now you can use this.personId to fetch data, etc.
      this.personName = this.mockData.getPerson(this.personId).name
    });
  }
}

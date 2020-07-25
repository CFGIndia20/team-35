import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allRecords:any=[];
  pieChartData:any=[];
  pieChartData2:any=[];
  highcharts=Highcharts;
  chartOptions:{};
  highcharts2=Highcharts;
  chartOptions2:{};
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getAllRecords();
  }

  getAllRecords()
  {
    return this.http.get('https://firestore.googleapis.com/v1/projects/cfgtest-36a9e/databases/(default)/documents/whatsapp?key=AIzaSyAKehNIq0yCW8_cfWNEpVqv8oG195wLupU')
    .subscribe((data:any)=>{
      this.allRecords=data.documents;
      console.log(data);

      this.allRecords.forEach(element => {
        //Category
        let categry=element.fields.description.stringValue; //change description to category
        var row=this.pieChartData.filter(x=>x.name===categry);
        console.log(row);
        if(row.length>0){
  
          row[0].y++;
        }
        else
        {
          this.pieChartData.push({name:categry,y:1})
        }

        //Platform
        let platofrm=element.fields.platform.stringValue; 
        var row2=this.pieChartData2.filter(x=>x.name===platofrm);
        console.log(row2);
        if(row2.length>0){
  
          row2[0].y++;
        }
        else
        {
          this.pieChartData2.push({name:platofrm,y:1})
        }
      });
      this.initializePieChart();
      this.initializePieChart2();
    });
    
  }

  initializePieChart()
  {
    
   this.chartOptions = {   
      chart : {
         plotBorderWidth: null,
         plotShadow: false
      },
      title : {
         text: 'Total complaints by category'   
      },
      tooltip : {
         pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
      },
      plotOptions : {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               format: '<b>{point.name}</b>: {point.percentage:.2f}%',
               style: {
                  color:
                  'black'
               }
            }
         }
      },
      series : [{
         type: 'pie',
         name: 'Browser share',
         data: this.pieChartData
      }]
   };
  }

  initializePieChart2()
  {
    
   this.chartOptions2 = {   
      chart : {
         plotBorderWidth: null,
         plotShadow: false
      },
      title : {
         text: 'Total complaints by platform'   
      },
      tooltip : {
         pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
      },
      plotOptions : {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               format: '<b>{point.name}</b>: {point.percentage:.2f}%',
               style: {
                  color:
                  'black'
               }
            }
         }
      },
      series : [{
         type: 'pie',
         name: 'Browser share',
         data: this.pieChartData2
      }]
   };
  }

}

import { Component, OnInit, ViewChild } from "@angular/core";
import * as Highcharts from "highcharts";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  @ViewChild("category", { static: true }) category;
  showPie = true;
  allRecords: any = [];
  pieChartData: any = [];
  pieChartData2: any = [];
  highcharts = Highcharts;
  chartOptions: {};
  highcharts2 = Highcharts;
  chartOptions2: {};
  activeTab: any;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllRecords();
  }
  ngAfterViewInit() {
    document.getElementById("dashboard").click();
  }

  showDash(event) {
    this.showPie = true;
    const navlinks = document.getElementsByClassName("nav-item");
    console.log(navlinks.length);
    for (let i = 0; i < navlinks.length; i++) {
      navlinks[i].className = navlinks[i].className.replace("active", "");
    }
    event.currentTarget.parentElement.className += " active";
    const text = `<div id="header" class="jumbotron jumbotron-fluid">
    <div class="container">
      <h1 class="display-4">Janaagraha</h1>
      <p class="lead">Janaagraha works  with  the  citizens  to  catalyse  active  citizenship  in  city  neighbourhoods  and  with the  government to  bring  about transformative change to city governance</p>
    </div>
  </div>`;

    // <div class="container-fluid">
    // <div class="row">
    // <div class="col-6">
    // <highcharts-chart
    // [Highcharts] = "highcharts"
    // [options] = "chartOptions"
    // style = "width: 100%; height: 400px; display: block;">
    // </highcharts-chart>
    // </div>

    // <div class="col-6">
    // <highcharts-chart
    // [Highcharts] = "highcharts2"
    // [options] = "chartOptions2"
    // style = "width: 100%; height: 400px; display: block;">
    // </highcharts-chart>
    // </div>
    // </div>
    // </div>
    document.getElementById("tab-content").innerHTML = text;
  }

  getAllRecords() {
    return this.http
      .get(
        "https://firestore.googleapis.com/v1/projects/cfgtest-36a9e/databases/(default)/documents/whatsapp"
      )
      .subscribe((data: any) => {
        this.allRecords = data.documents;
        console.log(data);

        this.allRecords.forEach((element) => {
          //Category
          let categry = element.fields.description.stringValue; //change description to category
          var row = this.pieChartData.filter((x) => x.name === categry);
          console.log(row);
          if (row.length > 0) {
            row[0].y++;
          } else {
            this.pieChartData.push({ name: categry, y: 1 });
          }

          //Platform
          let platofrm = element.fields.platform.stringValue;
          var row2 = this.pieChartData2.filter((x) => x.name === platofrm);
          console.log(row2);
          if (row2.length > 0) {
            row2[0].y++;
          } else {
            this.pieChartData2.push({ name: platofrm, y: 1 });
          }
        });
        this.initializePieChart();
        this.initializePieChart2();
      });
  }

  initializePieChart() {
    this.chartOptions = {
      chart: {
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: "Total complaints by category",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.2f}%</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.2f}%",
            style: {
              color: "black",
            },
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "Browser share",
          data: this.pieChartData,
        },
      ],
    };
  }

  initializePieChart2() {
    this.chartOptions2 = {
      chart: {
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: "Total complaints by platform",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.2f}%</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.2f}%",
            style: {
              color: "black",
            },
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "Browser share",
          data: this.pieChartData2,
        },
      ],
    };
  }

  changeTabs = (event, id) => {
    this.showPie = false;
    this.activeTab = id;
    let text = "";
    var xmlhttp = new XMLHttpRequest();

    document.getElementById("tab-content").innerHTML = "Loading Reports...";

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        myObj = myObj.documents;
        console.log(myObj);
        if (myObj.length == 0) {
          text += "<p>No Reports</p>";
        } else {
          for (let i = 0; i < myObj.length; i++) {
            if (myObj[i].fields.platform.stringValue == id) {
              var title =
                myObj[i].fields.description.stringValue.substring(0, 20) +
                "...";
              var desp =
                myObj[i].fields.description.stringValue.substring(0, 100) +
                "...";
              text += `<div class="col-lg-4 mb-4">
           <div class="card" style="height:100%">
              <div class="card-header">
                ${myObj[i].fields.category.stringValue}
              </div>
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${desp}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${
                  myObj[i].fields.location.stringValue
                }</p>
                <a href="details?id=${myObj[i].name.substring(
                  myObj[i].name.lastIndexOf("/") + 1
                )}" class="btn btn-outline-success btn-sm">View More</a>
              </div>
            </div>
          </div>`;
            }
          }
          document.getElementById("tab-content").innerHTML = text;
        }
      }
    };
    xmlhttp.open(
      "GET",
      `https://firestore.googleapis.com/v1/projects/cfgtest-36a9e/databases/(default)/documents/all-reports`,
      true
    );
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlhttp.send();

    const navlinks = document.getElementsByClassName("nav-item");
    console.log(navlinks.length);
    for (let i = 0; i < navlinks.length; i++) {
      navlinks[i].className = navlinks[i].className.replace("active", "");
    }
    event.currentTarget.parentElement.className += " active";
  };

  filter(event) {
    var category = event.target.value;
    console.log(category);
    // var currentTab = document.getElementsByClassName("active");
    var id = this.activeTab;
    let text = "";
    var xmlhttp = new XMLHttpRequest();

    document.getElementById("tab-content").innerHTML = "Loading Reports...";

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        console.log(myObj);
        if (myObj.length == 0) {
          text += "<p>No Reports</p>";
        } else {
          for (let i = 0; i < myObj.length; i++) {
            if (myObj[i].category == category) {
              text += `<div class="col-lg-4 mb-4">
               <div class="card">
                  <div class="card-header">
                    ${myObj[i].category}
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">${myObj[i].description}</h5>
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${myObj[i].location}</p>
                    <a href="details.html?id=${myObj[i].id}" class="btn btn-outline-success btn-sm">View More</a>
                  </div>
                </div>
              </div>`;
            }
          }
          document.getElementById("tab-content").innerHTML = text;
        }
      }
    };
    xmlhttp.open(
      "GET",
      `https://cfgtest-94f3c.firebaseio.com/${id}.json`,
      true
    );
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlhttp.send();
  }
}

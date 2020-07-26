import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
})
export class DetailsComponent implements OnInit {
  id: String;
  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit() {
    var queryString = decodeURIComponent(window.location.search);
    console.log(queryString);
    queryString = queryString.substring(1);
    console.log(queryString);
    var queries = queryString.split("=");
    var id = queries[1];
    console.log(id);

    let text = "";
    var xmlhttp = new XMLHttpRequest();
    document.getElementById("complaint").innerHTML = "Loading...";
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        console.log(myObj);
        if (myObj == undefined) {
          text +=
            "<p id='noMatch' style='text-align:center;display:none;'>No posts</p>";
        } else {
          // https://images.unsplash.com/photo-1593642532871-8b12e02d091c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60
          text += `<div class="col-sm-1"></div>
                            <div class="col-sm-10 mb-4 card px-0" style="width: 18rem;">
                                <img class="card-img-top" src="data:image/jpeg;base64,${myObj.fields.media_url.stringValue}" alt="Card image cap">
                                <div class="card-body">
                                <h5 class="card-title">#${myObj.fields.ticket_no.integerValue}</h5>
                                <p class="card-text">${myObj.fields.description.stringValue}</p>
                                <p>Platform: ${myObj.fields.platform.stringValue}</p>
                                <p><i class="fas fa-map-marker-alt"></i> ${myObj.fields.location.stringValue}</p>
                                <p>Category: <strong>${myObj.fields.category.stringValue}</strong></p>
                                <p>Status: <strong>${myObj.fields.status.stringValue}</strong></p>
                                <p><em>Submitted By ${myObj.fields.sender.stringValue}</em> on ${myObj.fields.date.stringValue}</p>
                                </div>
                            </div>
                        <div class="col-sm-1"></div>`;

          document.getElementById("complaint").innerHTML = text;
        }
      }
    };
    xmlhttp.open(
      "GET",
      `https://firestore.googleapis.com/v1/projects/cfgtest-36a9e/databases/(default)/documents/all-reports/${id}`,
      true
    );
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlhttp.send();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);

      this.id = params.id;
      console.log(this.id);
    });
  }
}

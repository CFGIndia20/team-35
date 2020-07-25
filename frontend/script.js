const changeTabs=(event,id)=>{
  document.getElementById("dropdown").style.display = "";
  let text="";
  var xmlhttp = new XMLHttpRequest();

document.getElementById("tab-content").innerHTML = "Loading Reports...";

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    myObj = myObj.documents;
    console.log(myObj);
    if (myObj.length == 0) {
      txt += "<p>No Reports</p>";
    } else {
      for (i = 0; i < myObj.length; i++) {
        if (myObj[i].fields.platform.stringValue == id) {
          var title =
            myObj[i].fields.description.stringValue.substring(0, 20) + "...";
          var desp =
            myObj[i].fields.description.stringValue.substring(0, 100) + "...";
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
            <a href="details.html?id=${myObj[i].name.substring(
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
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send();

navlinks = document.getElementsByClassName("nav-item");
console.log(navlinks.length);
for (i = 0; i < navlinks.length; i++) {
  navlinks[i].className = navlinks[i].className.replace("active", "");
}
event.currentTarget.parentElement.className += " active";
};

function filter() {
var category = document.getElementById("category").value;
console.log(category);
var currentTab = document.getElementsByClassName("active");
var id = currentTab[0].innerText.toLowerCase();
console.log(currentTab);
let text = "";
var xmlhttp = new XMLHttpRequest();

document.getElementById("tab-content").innerHTML = "Loading Reports...";

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    console.log(myObj);
    if (myObj.length == 0) {
      txt += "<p>No Reports</p>";
    } else {
      for (i = 0; i < myObj.length; i++) {
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
xmlhttp.open("GET", `https://cfgtest-94f3c.firebaseio.com/${id}.json`, true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send();
};

function onLoad() {
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
      txt += "<p id='noMatch' style='text-align:center;display:none;'>No posts</p>";
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
  xmlhttp.open("GET", `https://firestore.googleapis.com/v1/projects/cfgtest-36a9e/databases/(default)/documents/all-reports/${id}`, true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send();
}

function onIndexLoad(){
  document.getElementById("dropdown").style.display = "none";
  var text = `<div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Janaagraha</h1>
    <p class="lead">Janaagraha works  with  the  citizens  to  catalyse  active  citizenship  in  city  neighbourhoods  and  withthe  governmentto  bring  about transformative change to city governance</p>
  </div>
</div>`

document.getElementById("tab-content").innerHTML = text;
}
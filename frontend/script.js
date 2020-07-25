const changeTabs=(event,id)=>{
    let text="";
    var xmlhttp = new XMLHttpRequest();

    document.getElementById("tab-content").innerHTML = "Loading Reports...";

    xmlhttp.onreadystatechange = function() {
 if (this.readyState == 4 && this.status == 200) {
     var myObj = JSON.parse(this.responseText);
     console.log(myObj)
    if(myObj.length==0)
    {
        txt += "<p>No Reports</p>"
    }
     else
     {
         for(i=0;i<myObj.length;i++)
         {
          
             text+=`<div class="col-lg-4 mb-4">
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
        </div>`
         }
         document.getElementById("tab-content").innerHTML = text;
      

     }
 }
};
xmlhttp.open("GET",`https://cfgtest-94f3c.firebaseio.com/${id}.json`, true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send();

navlinks = document.getElementsByClassName("nav-item");
console.log(navlinks.length);
for (i = 0; i < navlinks.length; i++) {
navlinks[i].className = navlinks[i].className.replace("active", "");
}
event.currentTarget.parentElement.className += " active";
}

function filter(){
    var category = document.getElementById("category").value;
    console.log(category);
    var currentTab = document.getElementsByClassName("active");
    var id = currentTab[0].innerText.toLowerCase();
    console.log(currentTab);
    let text="";
        var xmlhttp = new XMLHttpRequest();

        document.getElementById("tab-content").innerHTML = "Loading Reports...";

        xmlhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
         var myObj = JSON.parse(this.responseText);
         console.log(myObj)
        if(myObj.length==0)
        {
            txt += "<p>No Reports</p>"
        }
         else
         {
             for(i=0;i<myObj.length;i++)
             {
                if(myObj[i].category == category){
                    text+=`<div class="col-lg-4 mb-4">
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
            </div>`
                }
                
             }
             document.getElementById("tab-content").innerHTML = text;
          

         }
     }
};
xmlhttp.open("GET",`https://cfgtest-94f3c.firebaseio.com/${id}.json`, true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send();

}

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
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            console.log(myObj)
            if (myObj.length == 0) {
                txt += "<p id='noMatch' style='text-align:center;display:none;'>No posts</p>"
            }
            else {
                for (i = 0; i < myObj.length; i++) {
                    if (myObj[i].id == id) {
                        text += `
             <div class="col-sm-1"></div>
                <div class="col-sm-10 mb-4 card px-0" style="width: 18rem;">
                    <img class="card-img-top" src="https://images.unsplash.com/photo-1593642532871-8b12e02d091c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60    " alt="Card image cap">
                    <div class="card-body">
                      <h5 class="card-title">${myObj[i].category}</h5>
                      <p class="card-text">${myObj[i].description}</p>
                      <p><i class="fas fa-map-marker-alt"></i> ${myObj[i].location}</p>
                    </div>
                  </div>
            <div class="col-sm-1"></div>`
                    }

                }
                document.getElementById("complaint").innerHTML = text;
            }
        }
    };
    xmlhttp.open("GET", 'https://cfgtest-94f3c.firebaseio.com/whatsapp.json', true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';

  ngAfterViewInit() {
    document.getElementById('whatsapp').click();
  }

  changeTabs(event, id) {
    //const id = event.target.attributes.id;
    let text = '';
    var xmlhttp = new XMLHttpRequest();

    document.getElementById('tab-content').innerHTML = 'Loading Reports...';

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let myObj = JSON.parse(this.responseText);
        console.log(myObj);
        if (myObj.length == 0) {
          text += '<p>No Reports</p>';
        } else {
          for (let i = 0; i < myObj.length; i++) {
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
          document.getElementById('tab-content').innerHTML = text;
        }
      }
    };
    xmlhttp.open(
      'GET',
      `https://cfgtest-94f3c.firebaseio.com/${id}.json`,
      true
    );
    xmlhttp.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded'
    );
    xmlhttp.send();

    const navlinks = document.getElementsByClassName('nav-item');
    console.log(navlinks.length);
    for (let i = 0; i < navlinks.length; i++) {
      navlinks[i].className = navlinks[i].className.replace('active', '');
    }
    event.currentTarget.parentElement.className += ' active';
  }
}

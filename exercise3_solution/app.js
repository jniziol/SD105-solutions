const API_KEY = "602ed25f158039686598fb8f";
const main = document.querySelector('main');

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = getImages;
httpRequest.open('GET', "https://dummyapi.io/data/api/post", true);
httpRequest.setRequestHeader("app-id", API_KEY);
httpRequest.send("limit=30");

function getImages() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      const json = JSON.parse(httpRequest.responseText)
      
      json.data.sort((a,b) => {
        return b.likes - a.likes
      })

      for (const post of json.data) {
        let tags = "";

        for (const tag of post.tags) {
          tags += `<li>${tag}</li>`
        }

        const postedTime = new Date(post.publishDate);
        
        main.insertAdjacentHTML('beforeend', `
          <article>
            <img src="${post.image}">
            <ul class="tags">
              ${tags}
            </ul>
            <div>
              <h2>${post.text}</h2>
              <div class="post-info">
                <div class="left">
                  <img src="${post.owner.picture}" alt="" class="author-image">
                  <div class="author-time">
                    <div class="name">${post.owner.firstName} ${post.owner.lastName}</div>
                    <div class="time">${postedTime.toLocaleDateString('en-us', {weekday: "long", month: "long", day: "numeric", year: "numeric"})}</div>
                  </div>
                </div>
        
                <div class="likes">
                  <div class="heart"></div>
                  <div class="amount"><span>${post.likes}</span><img src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-512.png" alt=""></div>
                </div>
              </div>
            </div>
          </article>
        `);
      }
    } else {
      console.log('There was a problem with the request.');
    }
  }
}
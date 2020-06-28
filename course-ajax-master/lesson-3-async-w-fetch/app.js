(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');



    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        function addImage(data) {
          console.log(data);

          let htmlContent = `<figure>
            <img src = '${data.results[0].urls.regular}'>
            <figcaption>${data.results[0].description}</figcaption>`

          responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function addArticles(data){
          let htmlContent = '';
          if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(function(article){ //must include return statement for this to work
              return `<li class = "article">
              <h2><a href = "${article.web_url}">${article.headline.main}</a></h2>
              <p>${article.snippet}</p>
              </li>`}).join('')+'</ul>'
            console.log(data);

          } else {htmlContent = `<div>There were no articles that matched your search</div>`}


          responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function requestError(e, part) { //'e' is referencing the error object created from error and the .catch() method will catch this value
          console.log(e);
          responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }

//requests image url with searchedForText
      fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
        headers: {
          Authorization: 'Client-ID F0TV651PGMBwTMYBTrKzPpQLgoFJD9BQeG1auLroUKY'
        },
        type: 'cors'

      }).catch(function(){
        console.log('error with GET request')

      }).then(function(response){
        return response.json();

      }).then(addImage)

      .catch(function(e){
        return requestError(e, 'image');
      })


      fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=JpnqgKw6hRM3RfCg9A04BV4cEj1l4Afx`)
        .then(function(response){
          return response.json()
        }).then(addArticles)
        .catch(function(e){
          responseContainer.insertAdjacentHTML('beforeend', '<p>Error in request for articles- Error printed in console</p>')
          console.log(e);
          }
        )


    });
})();

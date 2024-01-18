document.addEventListener('DOMContentloaded',function() {

  // const APIcontroller = (function() {
  
  //   const clientId = "0c76d90f65ea4b4bb5f976d33c428a63";
  //   const clientSecret = "deae7c9da6324738b3306a9a902fd74b";
  
  //   const getToken = async () => {
  //     const result = await fetch("https://accounts.spotify.com/api/token", {
  //       method: 'POST',
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
  //         // "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
  //       },
  //       body: "grant_type=client_credentials"
  //     });
  
  //     const data = await result.json();
  //     return data.access_token;
  //   }

  var client_id = 'PLEASE ENTER YOUR CREDENTIALS HERE';
  var client_secret = 'PLEASE ENTER YOUR CREDENTIALS HERE';

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    console.log(error);
    console.log(response);
    if (!error && response.statusCode === 200) {
      var token = body.access_token;
    }
  });


  

    // const getGenres = async (token) => {

    //   const result = await fetch ("https://api.spotify.com/v1/browse/categories?local=sv_UK", {
    //     method: 'GET',
    //     headers: {"Authorization" : "Bearer " + token}
    //   });
  
    //   const data = await result.json();
    //   return data.categories.items;
    // }
  
  // })

  // function createBtn(genreName){
  //   let newBtn = $(`<li class= list-group-item>${genreName}</li>`);
  //   historyList.append(newBtn);
  // }

  // $("#search-button").on("click", function(event){
  //   event.preventDefault();
  //   const searchInput = $("#search-input").val.trim();
  //   getGenres(searchInput);
  //   createBtn(searchInput);
  // })
 
});







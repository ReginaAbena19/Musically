document.addEventListener("DOMContentLoaded", function () {
  const APIcontroller = function () {
    const clientId = "";
    const clientSecret = "";

    const getToken = async () => {
      const result = await fetch("https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-wwww-form-urlencoded",
          Authorization: "Basic " +  btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
      }
      
      );
      const data = await result.json();
      return data.access_token;
    };

    const getGenres = async (token) => {
      const result = await fetch("https://api.spotify.com/v1/browse/categories?locale=sv_UK",
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token},
      }
      );

      const data = await result.json();
      return data.categories.items;
    };

    return {getToken, getGenres};
  };

  const apiContoller = APIcontroller();

  const historyList = $("#history-list");

  function createButton(genreName) {
    let newBtn = $(`<li class="list-group-item">${genreName}</li>`);
    historyList.append(newBtn);
  }

  $("#search-button").on("click", async function(event){
    event.preventDefault();
    const searchInput = $("#search-input").val().trim();

    try {
      const token = await apiContoller.getToken();
      const genres = await apiContoller.getGenres(token);
      console.log(genres);
      createBtn(searchInput);
    } catch (error) {
      console.log("Error:", error);
    }
  });
});
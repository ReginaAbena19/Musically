document.addEventListener("DOMContentLoaded", function () {
  const APIcontroller = function () {
      const clientId = "0c76d90f65ea4b4bb5f976d33c428a63";
      const clientSecret = "0fd06633daa54f21b4b9b9b1b328aacb";

      const getToken = async () => {
          const result = await fetch(
              "https://accounts.spotify.com/api/token",
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                      Authorization:
                          "Basic " +
                          btoa(clientId + ":" + clientSecret),
                  },
                  body: "grant_type=client_credentials",
              }
          );

          const data = await result.json();

          return data.access_token;
      };

      const getGenres = async (token) => {
          const result = await fetch(
              "https://api.spotify.com/v1/browse/categories?locale=sv_UK",
              {
                  method: "GET",
                  headers: { Authorization: "Bearer " + token },
              }
          );

          const data = await result.json();
          return data.categories.items;
      };

      return { getToken, getGenres };
  };

  const apiController = APIcontroller();

  const historyList = $("#history-list");

  function createBtn(genreName) {
      let newBtn = $(`<li class="list-group-item">${genreName}</li>`);
      historyList.append(newBtn);
  }

  $("#search-button").on("click", async function (event) {
    event.preventDefault();
    const searchInput = $("#search-input").val().trim();

    try {
        const token = await apiController.getToken();
        const genres = await apiController.getGenres(token);

        // Filter genres based on the search input
        const matchingGenres = genres.filter(genre => genre.name.toLowerCase().includes(searchInput.toLowerCase()));

        // Display matching genres in the console
        console.log(matchingGenres);

        // Create buttons for matching genres
        matchingGenres.forEach(genre => createBtn(genre.name));
    } catch (error) {
        console.error("Error:", error);
    }
});
});

let historyEl = $('.savedList');

const APIController = (function() {
    
    const clientId = "ENTER_YOUR_CLIENT_ID_HERE";
    const clientSecret = "ENTER_YOUR_CLIENT_SECRET_HERE";

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_UK`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 5;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 5;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }

})();

//youtube api
$(document).ready(function(){

    let API_KEY = "ENTER_YOUR_YOUTUBE_APIKEYS_HERE";
    let video = "";
  
    $("#form").submit(function(event){
        event.preventDefault()
  
        let search = $("#search").val()
  
        videoSearch(API_KEY, search, 10 )
    });
  
    $('#play').on('hidden.bs.modal', function () {
        $("#videos").empty();
        $("#search").val('');
  });
  
    function videoSearch(key,search,maxResults) {

        $("#videos").empty();
  
        UIController.resetTrackDetail();
  
        $.get("https://www.googleapis.com/youtube/v3/search?key="+ key + "&type=video&part=snippet&maxResult="+ maxResults + "&q=" + search,function(data){
            console.log(data)
  
            data.items.forEach(item => {
                video = `<iframe width="420 height="315 
                src="http://youtube.com/embed/${item.id.videoId}"
                frameborder="0" allowfullscreen></iframe>`
  
                $("#videos").append(video);
            });
            $("#search").val('');
    });
  }
  });

  
// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // need methods to create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create a track list group item 
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        

        // need method to create the song detail
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = `
            <div class="container">
                <div class="cards">
                <input type="radio" name="slider" id="s1" checked>
                <label for="s1" id="slide1">
                    <div class="card">
                    <div class="image">
                        <img src="${img}" alt="">
                        <div class="dots">
                        <div></div>
                        <div></div>
                        <div></div>
                        </div>
                    </div>
                    <div class="infos">
                        <span class="name">${artist}</span>
                        <span class="lorem">${title}</span>
                    </div>
                    <a id="details-colour" class="btn-contact">details</a>
                    <div class="socials">
                        <i class="fa fa-heart" id="heart" data-artist="${artist}" data-song="${title}"></i>
                    </div>
                    </div>
                </label>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)

            $("#heart").on("click", function() {
                // $(this).preventDefault();
                let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
                searchHistory.push($(this).data())
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                renderSearchHistory ();
            });

        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();


const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);
        //get the genres
        const genres = await APICtrl.getGenres(token);
        //populate our genres select element
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    // create genre change event listener
    DOMInputs.genre.addEventListener('change', async () => {
        //reset the playlist
        UICtrl.resetPlaylist();
        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token;        
        // get the genre select field
        const genreSelect = UICtrl.inputField().genre;       
        // get the genre id associated with the selected genre
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
        // ge the playlist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
        // create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });
     

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        // get the playlist field
        const playlistSelect = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
    });

    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        // load the track details
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });    

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();

function renderSearchHistory () {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach((songData) => {
        console.log(songData)
    })

    let historyList = $(`<ul class='list-group' id='searchHistoryList'></ul>`);
    searchHistory.forEach((songData) => {
        let listItem = $('<li class="list-group-item"></li>');
        listItem.text(songData.artist + ' - ' + songData.song);
        historyList.append(listItem);
    });
    
    historyEl.append(historyList);
};
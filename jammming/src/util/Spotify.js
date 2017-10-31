let accessToken;
const clientId = 'a5ae38763a5441929a9763e84866be55';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken: function(){
    if (accessToken) {
      return accessToken;
    } else {
      const token = window.location.href.match(/access_token=([^&]*)/);
      const expiration = window.location.href.match(/expires_in=([^&]*)/);
      if (token && expiration) {
        accessToken = token[1];
        const expiresIn = Number(expiration[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {
        window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectURI;
      }
    }
  },
  search: function(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then(function(response) {
      return response.json();
    }).then(function(jsonResponse) {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(function(track) {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        });
      } else {
        return [];
      }
    });
  },
  savePlaylist: function(playlistName, uris) {
    const spToken = Spotify.getAccessToken();
    const headers = {
        "Authorization": `Bearer ${spToken}`
    };
    let userId;
    if (playlistName && uris) {
      return fetch('https://api.spotify.com/v1/me', {
        headers: headers
      }).then(function(response) {
        return response.json();
      }).then(function(jsonResponse) {
        userId = jsonResponse.id;
        return fetch('https://api.spotify.com/v1/users/'+ userId +'/playlists', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: playlistName
          })
        }).then(function(response) {
          return response.json();
        }).then(function(jsonResponse) {
          let playlistId = jsonResponse.id;
          return fetch('https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks', {
            method: 'POST',
            headers:headers,
            body: JSON.stringify({
              uris: uris
            })
          }).then(function(response) {
            return response.json();
          }).then(function(jsonResponse) {
            let playlistId = jsonResponse.id;
          })
        })
      });

    } else {
      return;
    }
  }
};

export default Spotify;

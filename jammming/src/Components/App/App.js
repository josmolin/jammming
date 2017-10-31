import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'myplaylist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if (this.state.playlistTracks.indexOf(track.id) === -1) {
      let playTracks = this.state.playlistTracks;
      playTracks.push(track);
      this.setState({playListTracks: playTracks});
    }
  }
  removeTrack(track) {
    let filteredTracklist = this.state.playlistTracks.filter(function(elem) {
      return elem.id !== track.id;
    });
    this.setState({playlistTracks: filteredTracklist});
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(function(elem) {
      return elem.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(result => {
      this.setState({playlistName:'New PLaylist', searchResults:[]});
    })
  }
  search(searchTerm) {
    console.log(searchTerm);
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
};

export default App;

import React from 'react'
import {Component} from 'react';
import '../App.css';


export default class AudioFile extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            toggleButton:"►",
            currentTime:0,
            duration: null,
            bookName:'',
            author:'',
            genre:'',
            bookUri: '',
            imageUri:'',
            description:''
        }
    }
    
    // ImageURi: header for gogle drive https://drive.google.com/uc?export=view&id=
    // AudioBookUri:header for book https://docs.google.com/uc?export=download&id=
    
    playAudio = () => {
        const audioEl = document.querySelector(".viewer");
        console.log("Button prssed");
        if(audioEl.paused){
            audioEl.play();
            this.setState({toggleButton : "❚ ❚"});
        }
        else{
            audioEl.pause();
            this.setState({toggleButton : '►'});
        }
      }
    //Converts time in seconds from parameter to the desired format of min:seconds
    getTime = (time) => {
        if(!isNaN(time)){
            return(
                Math.floor(time/60) + ":" + ("0" + Math.floor(time%60)).slice(-2)
            );
        }
    }
    /*This is to forward or rewind the audio*/
     videoSkip = (e) => {
        const video = document.querySelector('.viewer');
        const skipValue = e.target.dataset.skip;
        video.currentTime+=parseFloat(skipValue);
    }

    //This function is for enabling keyboard shortcuts for play/pause, forward and rewind
    handleKeyDown = (e) => {
        switch(e.keyCode ) {
            //Spacebar key to play/pause
            case 32:
                this.playAudio();
                break;
            //F key for forward
            case 70:
                const video = document.querySelector('.viewer');
                video.currentTime+=parseFloat(25);
                break;
            //R key for rewind
            case 82:
                const audio = document.querySelector('.viewer');
                audio.currentTime+=parseFloat(-10);
                break;
            default: 
                break;
        }
    }
    /*Life cycle methods*/
    componentDidMount(){
        const uniqueId = this.props.id;
        let apiSearchEndpoint = 'http://localhost:8080/api/search/';
        apiSearchEndpoint+=uniqueId;
        axios.get(apiSearchEndpoint).then((response) => {
            this.setState({
                bookName:response.name,
                author:response.author,
                genre:response.genre,
                bookUri:response.bookUri,
                imageUri:response.imageUri,
                description:response.description,
            });
        });
        document.addEventListener('DOMContentLoaded',()=>{
            const video = document.querySelector('.viewer');
        video.addEventListener('timeupdate',this.progressUpdate);
        /*Updates the current time every second*/
        setInterval(() => this.setState({currentTime:this.getTime(video.currentTime)}),1000);
        video.addEventListener('loadedmetadata', (e) => {
            this.setState({duration:this.getTime(video.duration)});
          });
        document.addEventListener("keydown", this.handleKeyDown);
        });
        
    }

    
    
    componentWillUnmount(){
        const video = document.querySelector('.viewer');
        video.removeEventListener('timeupdate',this.progressUpdate);
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleRangeUpdate = (e) => {
        const video = document.querySelector('.viewer');
        video[e.target.name] = e.target.value;
    }
    progressUpdate = () => {
        const video = document.querySelector('.viewer')
        const progressBar = document.querySelector('.progress-filled')
        const percent = (video.currentTime/video.duration)*100;
        progressBar.style.flexBasis=`${percent}%`;
    }
    
    
    render(){
        return (
            <div>
                <h2 className = "book-name">{this.state.bookName}</h2>
                <h3 className = "author-name">{this.state.author}</h3>
                <h6 className = "audio-book-genre">{this.state.genre}</h6>
                {/* {window.location.origin + '/Audio/The Vamps-Wake Up.mp3'}  */}
                <div className = "player">
                    <audio className = "audio-player viewer" src = {this.state.bookUri} ></audio>
                    <img src={this.state.imageUri} alt= "Book image"/>
                </div>
                <div className="progress-bar" role="timer">
                    <div className="progress-filled"></div>
                    <span className = "current-duration" role="timer" aria-label="current duration">{this.state.currentTime}</span>
                    <span className = "total-duration" aria-label="Total duration">{this.state.duration}</span>
                </div>
                <div className="player-controls div-for-settings">
                    <button data-skip="-10" className="player-skip" onClick={this.videoSkip} aria-label="10 seconds rewind button">« 10s</button>
                    <button className="player-button toggle" title="Toggle Play" onClick={this.playAudio} aria-label="Play or pause button">{this.state.toggleButton}</button>
                    <button data-skip="25" className="player-skip" onClick={this.videoSkip} aria-label="25 seconds forward button">25s »</button>
                    <i className = "fa fa-cog" role="button"></i>
                </div>
                <div className="player-controls">
                    <label htmlFor ="volume" className = "range-label">Volume</label>
                    <select name ="volume" defaultValue="0.5" className="range-select" onChange = {this.handleRangeUpdate} aria-label="Volume dropdown">
                        <option value="0.1">10%</option>
                        <option value="0.2">20%</option>
                        <option value="0.3">30%</option>
                        <option value="0.4">40%</option>
                        <option value="0.5">50%</option>
                        <option value="0.6">60%</option>
                        <option value="0.7">70%</option>
                        <option value="0.8">80%</option>
                        <option value="0.9">90%</option>
                        <option value="1.0">100%</option>
                    </select>
                    
                    <label className = "range-label" htmlFor="playbackRate">Speed</label>
                    <select name ="playbackRate" defaultValue="1" className="range-select" onChange = {this.handleRangeUpdate} aria-label="Speed dropdown">
                        <option value="0.25">0.25x</option>
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="1.75">1.75x</option>
                        <option value="2.0">2x</option>
                    </select>
                </div>
                <div>
                    <h5 className="book-recommendation-heading">Description</h5>
                    <p className = "audio-description">
                        {this.state.description}
                    </p>
                </div>
                <div>
                    <hr className ="audio-page-hr"/>
                </div>
                <h6 className="book-recommendation-heading">YOU MAY ALSO LIKE:</h6>
                <div className="recommendation-div">

                </div>
            </div>
        );
    }
}
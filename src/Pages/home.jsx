import React, { Component } from "react";
import GMap from "../Components/GMap";

class HomePage extends Component {
  state = {
    loadMap: false
  };

  componentDidMount() {
    this.loadGoogleMapScript();
  }
  loadGoogleMapScript = () => {
    if (
      typeof window.google === "object" &&
      typeof window.google.maps === "object"
    ) {
      console.log("inside if block");
      this.setState({
        loadMap: true
      });
    } else {
      console.log("Inside else block");
      const googleMapScript = document.createElement("script");
      googleMapScript.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAbogkvQGdG6Q76nRTe5tyfNNEsW1r5nQw";
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener("load", () => {
        this.setState({
          loadMap: true
        });
      });
    }
  };
  render() {
    const { loadMap } = this.state;
    return (
      <>
        <div>{!loadMap ? <div>Loading...</div> : <GMap />}</div>
      </>
    );
  }
}

export default HomePage;

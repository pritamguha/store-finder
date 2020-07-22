import React, { Component } from "react";
import fire from "../firebase/fire";
import { deepClone } from "../helper-methods";

class GMap extends Component {
  state = { markerList: [], googleMap: null };

  constructor(props) {
    super(props);
    this.googleMapRef = React.createRef();
  }

  componentDidMount() {
    const { markerList, googleMap } = deepClone(this.state);

    let storeRef = fire
      .database()
      .ref("stores")
      .orderByKey();
    storeRef.on("child_added", snapshot => {
      markerList.push(snapshot.val());
      this.setState({ markerList }, async () => {
        await this.initGoogleMap();
        let bounds = new window.google.maps.LatLngBounds();
        if (markerList.length) {
          markerList.map((markerItem, index) => {
            let infoWindow = new window.google.maps.InfoWindow({
              content: markerItem.name
            });
            const marker = this.createMarker(markerItem);

            marker.addListener("click", () => {
              infoWindow.open(googleMap, marker);
            });
            bounds.extend(marker.position);
            if (index === markerList.length - 1) {
              this.state.googleMap.fitBounds(bounds);
            }
          });
        }
      });
    });
  }

  initGoogleMap = () => {
    return new Promise(resolve => {
      let { markerList, googleMap } = deepClone(this.state);

      if (googleMap) {
        resolve();
      } else {
        googleMap = markerList.length
          ? new window.google.maps.Map(this.googleMapRef.current, {
              center: { lat: markerList[0].lat, lng: markerList[0].long },
              zoom: 13
            })
          : new window.google.maps.Map(this.googleMapRef.current, {
              center: { lat: 0.0, lng: 0.0 },
              zoom: 13
            });
        this.setState({ googleMap }, () => {
          resolve();
        });
      }
    });
  };

  createMarker = markerObj => {
    // console.log("createMarker -> markerObj", markerObj);
    return new window.google.maps.Marker({
      position: new window.google.maps.LatLng(
        Number(markerObj.lat),
        Number(markerObj.long)
      ),
      map: this.state.googleMap
    });
  };

  render() {
    return (
      <div ref={this.googleMapRef} style={{ width: "100%", height: "100vh" }} />
    );
  }
}

export default GMap;

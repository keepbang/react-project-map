import React,{ useState } from 'react';
import '../css/BtnStyle.css';


import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Draw from 'ol/interaction/Draw';
import {fromLonLat} from 'ol/proj'


const MyMap = () => {
    let zoom = 4;
    
    let source = new VectorSource({wrapX: false});

    let vector = new VectorLayer({
        source: source
    });

    const map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ,vector],
        view: new View({
          projection: 'EPSG:3857',
          center: fromLonLat([127,36],"EPSG:3857"),
          zoom: zoom
        })
      });

    const zoomIn = () =>{
        if(zoom < 14){
            zoom = zoom + 1
            map.getView().setZoom(zoom);
            console.log(zoom);
        }else{
            console.log("zoom fail");
        }
    }

    const zoomOut = () =>{
        if(zoom > 4){
            zoom = zoom - 1
            map.getView().setZoom(zoom);
            console.log(zoom);
        }else{
            console.log("zoom fail");
        }
    }

    let draw = null;
    const addInteraction = (e) => {
        if(draw != null){
            map.removeInteraction(draw);
        }
        let value = e.target.getAttribute("name");
        if (value !== 'None') {
            draw = new Draw({
            source: source,
            type: e.target.getAttribute("name")
            });
            map.addInteraction(draw);
        }else{
            map.getLayers().array_[1].getSource().clear();
        }
    }

    return (
        <div className="btnArea">
            <span className="featureBtn" name="Point" onClick={addInteraction}>Point</span>
            <span className="featureBtn" name="LineString" onClick={addInteraction}>Line</span>
            <span className="featureBtn" name="Polygon" onClick={addInteraction}>Polygon</span>
            <span className="featureBtn" name="None" onClick={addInteraction}>None</span>
            <span className="featureBtn" name="ZoomIn" onClick = {zoomIn}>ZoomIn</span>
            <span className="featureBtn" name="ZoomOut" onClick = {zoomOut}>ZoomOut</span>
        </div>
    );
};



export default MyMap;
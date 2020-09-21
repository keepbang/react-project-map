import React,{ useState } from 'react';
import '../css/BtnStyle.css';
import marker from '../images/marker.png';


import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Draw from 'ol/interaction/Draw';
import {fromLonLat,transformExtent,transform} from 'ol/proj'
import {Circle as CircleStyle, Fill, Stroke, Style,Icon} from 'ol/style';

import Point from 'ol/geom/Point';

import Feature from 'ol/Feature';

const MyMap = () => {
    let zoom = 4;

    let layers = {
      vector : {}
    }
    
    let source = new VectorSource({wrapX: false});

    let vector = new VectorLayer({
        source: source
    });

    layers["drawVectorLayer"] = vector;

    const map = new Map({
        target: 'map',
        layers: [
            new TileLayer({
              source: new OSM()
            })
          ,layers["drawVectorLayer"]
        ],
        view: new View({
          projection: 'EPSG:3857',
          center: fromLonLat([127,36],"EPSG:3857"),
          zoom: zoom,
          extent: transformExtent([123.44238281249997, 32.74570253945518, 132.71484375, 39.00637903337457], 'EPSG:4326', 'EPSG:3857'),
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
        console.log(map);
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
            type: e.target.getAttribute("name"),
            style: new Style({
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                  color: '#ffcc33',
                  width: 2,
                }),
                image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({
                    color: '#ffcc33',
                  }),
                }),
              }),
            });
            map.addInteraction(draw);
        }else{
            map.getLayers().array_[1].getSource().clear();
        }
    }

    const getCenter = () => {

        let layerName = "iconLayer";

        map.removeLayer(layers[layerName]);

        console.log("test")
        var iconFeature = new Feature({
            geometry: new Point(map.getView().getCenter()),
            name: transform(map.getView().getCenter(),"EPSG:3857","EPSG:4326").toString(),
          });

        var iconStyle = new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#ff3366',
            width: 2,
          }),
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({
              color: '#ff3366',
            }),
          }),
        });

        iconFeature.setStyle(iconStyle);

        var iconSource = new VectorSource({
            features: [iconFeature]
        });

        
        var iconLayer = new VectorLayer({
          source: iconSource
        });
        layers[layerName] = iconLayer;

        map.addLayer(iconLayer);

    }

    return (
        <div className="btnArea">
            <span className="featureBtn" name="Point" onClick={addInteraction}>Point</span>
            <span className="featureBtn" name="LineString" onClick={addInteraction}>Line</span>
            <span className="featureBtn" name="Polygon" onClick={addInteraction}>Polygon</span>
            <span className="featureBtn" name="None" onClick={addInteraction}>None</span>
            <span className="featureBtn" name="None" onClick={getCenter}>Center</span>
            <span className="featureBtn" name="ZoomIn" onClick = {zoomIn}>ZoomIn</span>
            <span className="featureBtn" name="ZoomOut" onClick = {zoomOut}>ZoomOut</span>
        </div>
    );
};



export default MyMap;

import mapboxgl from 'mapbox-gl';
customElements.define("mapbox-el", class MapboxElement extends HTMLElement{
    constructor(){
        super()
    }
    connectedCallback(){
        this.render()
    }
    render(){
        this.innerHTML=`<div id="map" style="width: 100%; height:100vh"></div>
        `
        mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        zoom: 1.5,
        center: [30, 50],
        projection: 'globe'
        });
        map.on('style.load', () => {
          map.setFog({
              color: 'rgb(186, 210, 235)', // Lower atmosphere
              'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
              'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
              'space-color': 'rgb(32, 20, 48)', // Background color
              'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
          });
      });
    }
})
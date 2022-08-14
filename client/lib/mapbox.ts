import * as MapboxClient from "mapbox";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const mapboxClient = new MapboxClient(process.env.MAPBOX_ACCESS_TOKEN);
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

export async function initMapboxGlobe(el:Element){
  const newGlobe = await  new mapboxgl.Map({
    container: el,
    style: 'mapbox://styles/mapbox/outdoors-v11',
    zoom: 1.5,
    center: [30, 50],
    projection: 'globe'
    })
    newGlobe.on('style.load', () => {
      newGlobe.setFog({
          color: 'rgb(186, 210, 235)', // Lower atmosphere
          'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
          'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
          'space-color': 'rgb(32, 20, 48)', // Background color
          'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
      });
  });
  return newGlobe
}


export async function initMapboxMap(mapEl:Element, lat:Number, lng:Number) {
  console.log(mapboxgl.supported() );
  
    return await new mapboxgl.Map({
      container: mapEl,
      center: [lng, lat],
      zoom:14,
      style: "mapbox://styles/mapbox/streets-v11",
    });
  }

export async function mapboxSearch(location:string,callback){
    mapboxClient.geocodeForward(
        location,
        {
          country: "ar",
          autocomplete: true,
          language: "es",
        },
        function (err, data, res) {
          console.log(data);
          if (!err) callback(data.features);
        }
      );

}

// Control implemented as ES6 class

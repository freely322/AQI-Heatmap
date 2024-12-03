import React, { CSSProperties, FC, useCallback, useEffect, useState } from 'react';

import GoogleMapReact from 'google-map-react';
import axios, { AxiosResponse } from 'axios';
import interpolate from 'color-interpolate';

///// style
const selectBoxStyle: CSSProperties = {
  height: '50px',
  display: 'flex',
  cursor: 'pointer',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  color: 'gray'
}

const clearPStyle: CSSProperties = {
  margin: 0,
  padding: 0
}

const controlBoxStyle: CSSProperties = {
  width: '500px',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(0, 0, 0, 0.5)',
  backgroundColor: 'white',
  position: 'absolute',
  top: '5%',
  left: '5%',
}

const rangeControlBoxStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '35px'
}

const activeTextColor = 'black'
const textColor = 'gray'
const activeButtonColor = 'lightgray'
const buttonColor = 'white'

const getTextColor = (check: boolean): string => {
  if (check) return activeTextColor
  return textColor
}

const getButtonColor = (check: boolean): string => {
  if (check) return activeButtonColor
  return buttonColor
}
//////
///// methods and heatmap
enum Methods {
  LINEAR = 'LINEAR',
  NEAREST = 'NEAREST',
  CUBIC = 'CUBIC',
  ORIGINAL = 'ORIGINAL',
}

type MethodLabelsMap = {
  [key in Methods]: string
}

const methodLabelsMap: MethodLabelsMap = {
  [Methods.LINEAR]: 'Linear',
  [Methods.NEAREST]: 'Nearest',
  [Methods.CUBIC]: 'Cubic',
  [Methods.ORIGINAL]: 'Original',
}

enum Types {
  AQI = 'aqi',
  O3 = 'o3',
  CO = 'co',
  SO2 = 'so2',
  NO2 = 'no2',
  PM10 = 'pm10',
  PM25 = 'pm25',
}

type TypeLabelsMap = {
  [key in Types]: string
}

const typeLabelsMap: TypeLabelsMap = {
  [Types.AQI]: 'AQI',
  [Types.O3]: 'O3',
  [Types.CO]: 'CO',
  [Types.SO2]: 'SO2',
  [Types.NO2]: 'NO2',
  [Types.PM10]: 'PM10',
  [Types.PM25]: 'PM25',
}

type Marker = {
  lat: number
  lng: number
  weight: number
}

type Heatmaps = {
  [key in Methods]: Marker[]
}

let colormap = interpolate(['blue', 'chartreuse', 'yellow', 'red']);
let colormapOrig = interpolate(['blue', 'chartreuse', 'yellow', 'red']);
let colormapOrigTextShadow = interpolate(['white', 'black', 'black', 'white']);
const getOpacity = (index: number) => {
  let result: string = '0';
  switch(true) {
    case index < 0.25:
      result = '0.15';
      break;
    case index < 0.5:
      result = '0.2';
      break;
    case index < 0.75:
      result = '0.25';
      break;
    case index < 1:
      result = '0.3';
      break;
  }
  return result
}

const getOpacityOrig = (index: number) => {
  let result: string = '0';
  switch(true) {
    case index < 0.25:
      result = '0.45';
      break;
    case index < 0.5:
      result = '0.55';
      break;
    case index < 0.75:
      result = '0.75';
      break;
    case index < 1:
      result = '0.9';
      break;
  }
  return result
}

const MarkerComp: FC<any> = ({weight, lat, lng, index}) => {
  const earth = 6378.137;
  const latKm = 1 / ((2 * Math.PI / 360) * earth);
  const lngKm = latKm / Math.cos(lat * (Math.PI / 180));
  if (lngKm > 1) {
    return null
  }
  return (
  <div
    style={{
      overflow: 'hidden',
      width: `${3300 * latKm}px`,
      height: `${2200 * lngKm}px`,
      backgroundColor: colormap(index),
      border: `solid 1px ${colormap(index)}`,
      opacity: getOpacity(index),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}
  >
    {/*<span
      style={{
        fontSize: '10px',
        margin: 0,
        padding: 0
      }}
    >
      {weight.toFixed(0)}
    </span>*/}
  </div>
)}

const OrigMarkerComp: FC<any> = ({weight, lat, lng, index}) => {
  const earth = 6378.137;
  const latKm = 1 / ((2 * Math.PI / 360) * earth);
  const lngKm = latKm / Math.cos(lat * (Math.PI / 180));
  if (lngKm > 1) {
    return null
  }
  return (
    <div
      style={{
        overflow: 'hidden',
        width: `${3500 * latKm}px`,
        height: `${3500 * latKm}px`,
        boxShadow: `0 0 10px rgba(0, 0, 0, 0.5), inset 0 0 20px ${colormapOrig(index)}`,
        backgroundColor: 'white',
        border: `solid 3px white`,
        borderRadius: '50%',
        opacity: '0.8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'black'
      }}
    >
    <span
      style={{
        fontSize: '10px',
        margin: 0,
        padding: 0
      }}
    >
      {weight.toFixed(2)}
    </span>
    </div>
  )}

///////
function App() {
  const [method, setMethod] = useState<Methods>(Methods.CUBIC)
  const [pow, setPow] = useState<number>(1)
  const [radius, setRadius] = useState<number>(40)
  const [type, setType] = useState<Types>(Types.CO)
  const [origParams, setOrigParams] = useState({
    min: 0,
    max: 1000,
    normalizer: 0
  })
  const [heatmapParams, setHeatmapParams] = useState({
    min: 0,
    max: 1000,
    normalizer: 0
  })
  const [heatmap, setHeatmap] = useState<Marker[]>([])
  const [heatmaps, setHeatmaps] = useState<Heatmaps>({
    [Methods.LINEAR]: [],
    [Methods.NEAREST]: [],
    [Methods.CUBIC]: [],
    [Methods.ORIGINAL]: [],
  })
  useEffect(() => {
    console.log(type)
    axios.get('http://localhost:1050/data-resolver/coordinates', {
      params: {
        type
      }
    }).then((res: AxiosResponse<Heatmaps>) => {
      setHeatmaps(res.data);
      let tempMin = Infinity
      let tempMax = -Infinity
      res.data[Methods.ORIGINAL].map(point => {
        const weight = point.weight
        if (weight > tempMax) {
          tempMax = weight
        }
        if (weight < tempMin) {
          tempMin = weight
        }
        return ({
          ...point,
          weight,
        })
      })
      const normalizer = (0 - tempMin)
      console.log({
        min: tempMin,
        max: tempMax,
        normalizer
      })
      setOrigParams({
        min: tempMin,
        max: tempMax,
        normalizer
      })
    })
  }, [type]);
  useEffect(() => {
    let tempMin = Infinity
    let tempMax = -Infinity
    const temp = heatmaps[method].map(point => {
      const weight = Math.pow(point.weight, pow)
      if (weight > tempMax) {
        tempMax = weight
      }
      if (weight < tempMin) {
        tempMin = weight
      }
      return ({
        ...point,
        weight,
      })
    })
    const normalizer = (0 - tempMin)
    setHeatmapParams({
      min: tempMin,
      max: tempMax,
      normalizer
    })
    setHeatmap(temp)
  }, [method, heatmaps, pow])
  const normalize = useCallback((number: number) => number + heatmapParams.normalizer, [heatmapParams])
  const normalizeOrig = useCallback((number: number) => number + origParams.normalizer, [origParams])
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        defaultZoom={7}
        yesIWantToUseGoogleMapApiInternals
        defaultCenter={{
          lng: 115,
          lat: 35
        }}
        bootstrapURLKeys={{
          key: 'some_api_key',
          libraries: 'visualization'
        }}
      >
        {
          method !== Methods.ORIGINAL
          && heatmap.map((marker, i) => {
            const index = normalize(marker.weight) * 100 / normalize(heatmapParams.max) / 100
            return (
              <MarkerComp
                index={index}
                key={`marker-${i}`}
                lat={marker.lat}
                lng={marker.lng}
                weight={marker.weight}
              />
            )
          })
        }
        {
          method === Methods.ORIGINAL
          && heatmaps[Methods.ORIGINAL].map((marker, i) => {
            const index = normalizeOrig(marker.weight) * 100 / normalizeOrig(origParams.max) / 100
            return (
              <OrigMarkerComp
                index={index}
                key={`marker-${i}`}
                lat={marker.lat}
                lng={marker.lng}
                weight={marker.weight}
              />
            )
          })
        }
      </GoogleMapReact>
      <div
        style={controlBoxStyle}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          {
            (Object.values(Types) as Types[]).map((_type, i) => (
              <div
                key={`type-${_type}-${i}`}
                onClick={() => {
                  setType(_type)
                }}
                style={{
                  ...selectBoxStyle,
                  width: `${100 / Object.values(Types).length}%`,
                  color: getTextColor(type === _type),
                  backgroundColor: getButtonColor(type === _type),
                }}
              >
                <p style={clearPStyle}>
                  {typeLabelsMap[_type]}
                </p>
              </div>
            ))
          }
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          {
            (Object.values(Methods) as Methods[]).map((_method, i) => (
              <div
                key={`method-${_method}-${i}`}
                onClick={() => {
                  setMethod(_method)
                }}
                style={{
                  ...selectBoxStyle,
                  width: `${100 / Object.values(Methods).length}%`,
                  color: getTextColor(method === _method),
                  backgroundColor: getButtonColor(method === _method),
                }}
              >
                <p style={clearPStyle}>
                  {methodLabelsMap[_method]}
                </p>
              </div>
            ))
          }
        </div>
        <div
          style={rangeControlBoxStyle}
        >
          <p>Radius: {radius}</p>
          <input
            type='range'
            min={5}
            max={200}
            defaultValue={radius}
            onChange={(e) => {
              setRadius(Number(e.target.value))
            }}
          />
        </div>
        <div
          style={rangeControlBoxStyle}
        >
          <p>Pow: {pow}</p>
          <input
            type='range'
            min={1}
            max={7}
            step={0.1}
            defaultValue={pow}
            onChange={(e) => {
              setPow(Number(e.target.value))
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

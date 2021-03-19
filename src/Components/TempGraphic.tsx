import React from "react";
import { GridProps, LineChart } from "react-native-svg-charts";
import { Text, Image } from "react-native-svg";
import { View } from "react-native";
import { HourlyPrevisionItem } from "../contexts/WeatherContext";

interface TempGraphicProps {
  data: Array<HourlyPrevisionItem>;
  index: Number;
}

interface LabelProps {
  temperatures: Array<number>;
  rain: Array<Number>;
  icons: Array<string>;
  hours: Array<Number>;
}

export default function TempGraphic({ data, index }: TempGraphicProps) {
  let temperatures: Array<number> = [];
  let icons: Array<string> = [];
  let rain: Array<Number> = [];
  let hours: Array<Number> = [];
  let minTemperature: number;

  const initialHour = new Date(data[0].dt * 1000).getHours();
  const sliceAt = 30 - initialHour;

  const dayData = index === 0 ? data.slice(0, sliceAt) : data.slice(sliceAt, sliceAt + 24);

  minTemperature = dayData[0].temp;

  for (let i = 0; i < dayData.length; i++) {
    const element = dayData[i];
    let date = new Date(element.dt * 1000);
    
    temperatures.push(Math.round(element.temp));
    icons.push(`https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`);

    rain.push(element.rain?.["1h"] ? element.rain["1h"] : 0);
    hours.push(date.getHours());

    if (element.temp < minTemperature) {
      minTemperature = element.temp;
    }
  }

  const yMin = minTemperature - 10;

  return (
    <>
      <LineChart
        contentInset={{ top: 25, left: 25, right: 25, bottom: 0 }}
        style={{ height: '100%', margin: 20, width: dayData.length * 80 }}
        data={temperatures}
        svg={{ stroke: '#F0f0f0' }}
        yMin={yMin}
      >
        <Label temperatures={temperatures} icons={icons} rain={rain} hours={hours} />
      </LineChart>
    </>
  )
}

function Label(props: GridProps<Number> & LabelProps) {
  const Items =  props.temperatures.map((value, i) => (
    <View key={`${value}-${i}`}>
      <Text
        fill="#FFF"
        stroke="#FFF"
        fontSize="16"
        fontWeight="300"
        textAnchor="middle"
        x={props.x && props.x(i)}
        y={props.y && props.y(value) - 10}
      >
        {value}º
      </Text>

      {props.rain[i] > 0 && (
        <Text
          fill="#FFF"
          stroke="#FFF"
          fontSize="12"
          fontWeight="250"
          textAnchor="middle"
          x={props.x && props.x(i)}
          y="68%"
        >
          {`${props.rain[i].toFixed(1)} mm`}
        </Text>
      )}

      <Image
        x={props.x && props.x(i) - 25}
        y="70%"
        width={50}
        height={50}
        preserveAspectRatio="MidYMid slice"
        href={{uri: props.icons[i]}}
      />

      <Text
        fill="#FFF"
        stroke="#FFF"
        fontSize="12"
        fontWeight="250"
        textAnchor="middle"
        x={props.x && props.x(i)}
        y="90%"
      >
        {`${props.hours[i]}:00`}
      </Text>
    </View>
  ));

  return (
    <>
      {Items}
    </>
  );
}
import React, { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { WeatherContext } from "../contexts/WeatherContext";
import { LinearGradient } from "expo-linear-gradient";
import { formatDescription } from "../utils/formatDescription";
import { RootStackParamList } from "../routes";
import TempGraphic from "../Components/TempGraphic";
import { ScrollView } from "react-native-gesture-handler";

export default function Details(
  props: StackScreenProps<RootStackParamList, "Details">
) {
  const { data, weekDays, monthNames } = useContext(WeatherContext);
  const { week, hourly } = data;

  const index = props.route.params.index;
  const infoDay = week[index];
  const date = new Date(infoDay.dt * 1000);
  const day =
    weekDays[date.getDay()] +
    ", " +
    date.getDate() +
    " de " +
    monthNames[date.getMonth()];
  
  const sunsetDate = new Date(infoDay.sunset * 1000);
  const sunset = `${sunsetDate.getHours()}:${String(sunsetDate.getMinutes()).padStart(2, '0')}`;

  const sunriseDate = new Date(infoDay.sunrise * 1000);
  const sunrise = `${sunriseDate.getHours()}:${String(sunriseDate.getMinutes()).padStart(2, '0')}`;

  return (
    <LinearGradient colors={['#7dc8ff', '#0496c7']} style={styles.container}>
      <View style={styles.resumeContainer}>
        <View style={styles.resumeInfoContainer}>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${infoDay.weather[0].icon}@2x.png`,
            }}
            style={styles.icon}
          />
          <View>
            <Text style={styles.dayText}>{day}</Text>
            <Text style={styles.weatherDescriptionText}>
              {formatDescription(infoDay.weather[0].description)}
            </Text>
          </View>
        </View>

        <Text style={styles.temperatureText}>
          {Math.round(infoDay.temp.max)}º / {Math.round(infoDay.temp.min)}º
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.columnContent}>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Vento</Text>
            <Text style={styles.infoText}>{Math.round(infoDay.wind_speed)} km/h</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Nuvens</Text>
            <Text style={styles.infoText}>{infoDay.clouds}%</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Nascer do Sol</Text>
            <Text style={styles.infoText}>{sunrise}</Text>
          </View>
        </View>

        <View style={styles.columnContent}>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Umidade</Text>
            <Text style={styles.infoText}>{infoDay.humidity}%</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Chuva</Text>
            <Text style={styles.infoText}>{infoDay.rain ? infoDay.rain.toFixed(1) : 0} mm</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Pôr do Sol</Text>
            <Text style={styles.infoText}>{sunset}</Text>
          </View>
        </View>
      </View>

      <View style={styles.hourlyContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
          <TempGraphic data={hourly} index={index} />
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingTop: 45,
  },
  resumeContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  infoContainer: {
    flex: 3,
    width: "85%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginVertical: 15,
  },
  hourlyContainer: {
    flex: 4,
    width: "100%",
  },
  icon: {
    width: 80,
    height: 80,
    marginLeft: -15,
  },
  resumeInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  temperatureText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "800",
  },
  dayText: {
    color: "#fff",
    fontSize: 15,
  },
  weatherDescriptionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  columnContent: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  infoItem: {
    flexDirection: "column",
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    width: 140,
    borderRadius: 8,
  },
  infoTitle: {
    color: "#fff",
    fontSize: 12,
  },
  infoText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 3,
  },
});

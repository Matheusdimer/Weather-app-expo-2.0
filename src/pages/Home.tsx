import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

import { lightTheme as theme } from "../theme/config.json";
import { WeatherContext } from "../contexts/WeatherContext";
import { LinearGradient } from "expo-linear-gradient";
import { formatDescription } from "../utils/formatDescription";

interface HomeProps {
  navigation: StackNavigationProp<any, any>;
}

export default function Home({ navigation }: HomeProps) {
  const { data, city, loadingState, getByGeoLocation, searchCity, weekDays, monthNames, hasLocationError } = useContext(
    WeatherContext
  );

  useEffect(() => {
    getByGeoLocation();
  }, []);

  function WeekList() {
    function NavigateToDetails(index: number) {
      if (index < 2) {
        navigation.navigate("Details", { index });
      } else {
        ToastAndroid.show(
          "Previsão horária disponível somente para os primeiros dois dias.",
          ToastAndroid.LONG
        );
      }
    }

    const List = data.week.map((item, index) => {
      const date = new Date(item.dt * 1000);
      const weekDay = index === 0 ? "Hoje" : weekDays[date.getDay()];
      
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          key={index}
          onPress={() => NavigateToDetails(index)}
        >
          <View style={styles.weekItem}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "60%",
              }}
            >
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                }}
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: -10,
                }}
              />
              <View>
                <Text>
                  {weekDay}, {date.getDate()} de {monthNames[date.getMonth()]}
                </Text>
                <Text>{formatDescription(item.weather[0].description)}</Text>
              </View>
            </View>

            <View style={{ width: "25%" }}>
              <Text>Chuva:</Text>
              <Text>{item.rain ? item.rain.toFixed(1) : 0} mm</Text>
            </View>

            <View
              style={{
                width: 40,
              }}
            >
              <Text style={styles.tempMaxText}>
                {Math.round(item.temp.max)}º
              </Text>
              <View style={styles.tempBarDivisor} />
              <Text style={styles.tempMinText}>
                {Math.round(item.temp.min)}º
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });

    return (
      <>
        {List}
      </>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar cidade"
          keyboardType="web-search"
          onSubmitEditing={(event) => searchCity(event.nativeEvent.text)}
        />
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <View style={styles.mainContainer}>
        {loadingState && (
          <ActivityIndicator
            size="large"
            color={theme.background}
            style={styles.loading}
          />
        )}
        {(!loadingState && hasLocationError) && (
          <View style={styles.locationErrorContainer}>
            <MaterialIcons name="error-outline" size={40} color="#ff8c8c" />
            <Text style={{margin: 5}}>Não foi possível determinar sua localização.</Text>
            <Text>Por favor, digite sua cidade na barra de pesquisa.</Text>
          </View>
        )}
        {(!loadingState && !hasLocationError) && (
          <>
            <View style={styles.mainInfo}>
              <View style={styles.firstRowContainer}>
                <View style={styles.descriptionContainer}>
                  <Image
                    source={{
                      uri: `https://openweathermap.org/img/wn/${data.today.icon}@2x.png`,
                    }}
                    style={styles.todayIcon}
                  />
                  <View>
                    <Text style={{ color: theme.title }}>{city}</Text>
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {formatDescription(data.today.description)}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.tempNow}>{data.today.temp.now}ºC</Text>
                </View>
              </View>

              <View
                style={{
                  marginVertical: 15,
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5
                    name="temperature-high"
                    size={20}
                    color="#ff8c8c"
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      marginHorizontal: 10,
                      color: "#555",
                    }}
                  >
                    Máx: {data.today.temp.max}º / Mín: {data.today.temp.min}º
                  </Text>
                </View>
                <Text style={{ fontSize: 16, color: "#555", margin: 5 }}>
                  Sensação térmica: {data.today.temp.feelsLike}ºC
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.iconContainer}>
                  <Feather name="cloud-rain" size={24} color="#888" />
                  <Text style={styles.infoText}>
                    {data.today.rain ? data.today.rain : 0} mm
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <Feather name="cloud" size={24} color="#888" />
                  <Text style={styles.infoText}>{data.today.clouds} %</Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.iconContainer}>
                  <Feather name="wind" size={24} color="#888" />
                  <Text style={styles.infoText}>
                    {data.today.windSpeed} km/h
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="water" size={24} color="#888" />
                  <Text style={styles.infoText}>{data.today.humidity}%</Text>
                </View>
              </View>
            </View>
            <ScrollView style={styles.scroll}>
              <WeekList />
            </ScrollView>
            <LinearGradient
              colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
              style={{
                position: "absolute",
                bottom: 20,
                width: "100%",
                height: 20,
              }}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  searchBox: {
    width: "98%",
    height: 45,
    backgroundColor: theme.cards,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
  },
  input: {
    fontSize: 18,
    color: theme.text,
    width: "90%",
  },
  mainContainer: {
    width: "98%",
    height: "85%",
    maxHeight: 650,
    backgroundColor: theme.cards,
    marginTop: 20,
    borderRadius: 15,
    flexDirection: "column",
    overflow: "hidden",
  },
  mainInfo: {
    width: "100%",
    minHeight: 200,
    paddingHorizontal: 25,
    justifyContent: "space-evenly",
    paddingVertical: 15,
  },
  firstRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tempNow: {
    fontSize: 28,
    color: theme.title,
  },
  tempMaxText: {
    fontSize: 14,
    color: theme.title,
  },
  tempMinText: {
    fontSize: 14,
    color: theme.title,
    textAlign: "right",
  },
  todayIcon: {
    width: 70,
    height: 70,
    marginLeft: -15,
    marginRight: 5,
  },
  tempContainer: {
    position: "relative",
    width: 90,
    height: 60,
    justifyContent: "center",
  },
  tempBarDivisor: {
    position: "absolute",
    top: "35%",
    left: "0%",
    backgroundColor: "#999",
    width: 40,
    height: 1,
    transform: [{ rotate: "-40deg" }],
  },
  scroll: {
    height: "60%",
    marginTop: 12,
    marginBottom: 20,
  },
  loading: {
    flex: 1,
  },

  rowContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    margin: 5,
    fontSize: 16,
    color: "#555",
  },
  weekItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "rgba(55,55,55,0.1)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  locationErrorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { IFeatureCollection } from "@/Models/IFeatureCollection";
import Logger from "./Logger";
import { IDailyTemperature } from "@/Models/IDailyTemperature";

class WeatherService {
  //https://api.weather.gov/stations?state=CO&limit=500

  static async getStation(city: string) {
    // for the sake ov saving time, don't create types for the station response
    const response = await fetch(`https://api.weather.gov/stations?limit=500`, { cache: "no-store" });

    //TODO - to save time, check response here. If time allowed, create an interceptor service and check/log responses there.
    if (response.status != 200) {
      Logger.Error(`Error getting station: ${response.statusText}`);
      return [];
    }

    const result = await response.json();

    let station = "";

    for (const feature of result.features) {
      if (feature.properties.name.includes(city)) {
        station = feature.properties.stationIdentifier;
        break;
      }
    }
    return station;
  }

  static getDailyTemperatures = async (city: string) => {
    try {
      const station = await this.getStation(city);

      // use no-store option else next throws errors because the response is too large
      const response = await fetch(`https://api.weather.gov/stations/${station}/observations`, { cache: "no-store" });

      //TODO - to save time, check response here. If time allowed, create an interceptor service and check/log responses there.
      if (response.status != 200) {
        Logger.Error(`Error getting temperatures: ${response.statusText}`);
        return [];
      }

      const result: IFeatureCollection = await response.json();
      const dailyTemps = this.getMinMaxForEachDay(result);

      return dailyTemps;
    } catch (ex) {
      Logger.Error(ex);
    }
  };

  static getMinMaxForEachDay = (featureCollection: IFeatureCollection) => {
    let temperatures: IDailyTemperature[] = [];
    temperatures.push({
      dayOfWeek: new Date(featureCollection.features[0].properties.timestamp).getDay(),
      max: featureCollection.features[0].properties.temperature.value,
      min: featureCollection.features[0].properties.temperature.value,
      date: new Date(featureCollection.features[0].properties.timestamp),
    });

    let prevDate = new Date(featureCollection.features[0].properties.timestamp).getDay();

    featureCollection.features.forEach((feature) => {
      const temp = feature.properties.temperature.value;
      const date = new Date(feature.properties.timestamp).getDate();

      if (date != prevDate) {
        temperatures.push({
          dayOfWeek: date,
          max: feature.properties.temperature.value,
          min: feature.properties.temperature.value,
          date: new Date(feature.properties.timestamp),
        });

        prevDate = date;
      }
      temperatures.forEach((x, i) => {
        if (x.dayOfWeek === date) {
          if (temp !== null && temp < x.min) {
            x.min = temp;
          }
          if (temp && temp > x.max) {
            x.max = temp;
          }
        }
      });
    });

    return temperatures;
  };

  static convertToFahrenheit = (c: number) => {
    const f = (c * 9) / 5 + 32;
    return Math.round(f * 100) / 100;
  };
}

export default WeatherService;

import { render, screen } from "@testing-library/react";
import WeatherService from "../components/WeatherService";
import Logger from "../components/Logger";

const features = [];
features.push({
  properties: {
    timestamp: "2024-04-02T23:00:00+00:00",
    temperature: { value: 23 },
    name: "Montford Middle",
    stationIdentifier: "0007W",
  },
});

features.push({
  properties: {
    timestamp: "2024-04-02T22:50:00+00:00",
    temperature: { value: 15 },
    name: "Tiny Town",
    stationIdentifier: "378RC",
  },
});

features.push({
  properties: {
    timestamp: "2024-04-02T05:40:00+00:00",
    temperature: { value: 24 },
    name: "Central City",
    stationIdentifier: "009YU",
  },
});

const featuresCollection = { features: features };

describe("Should Get Weather", () => {
  test("GetWeather should return an array equal to 2", async () => {
    //Mock fetch so we aren't making a data request
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(featuresCollection),
      })
    );

    const result = await WeatherService.getDailyTemperatures("Montford Middle");

    expect(result.length).toBe(2);
  });
});

describe("Should Not Get Weather", () => {
  test("GetWeather() should call Logger.error() if an unknown station is used", async () => {
    const spy = jest.spyOn(Logger, "Error");

    //Mock a fetch error response
    global.fetch = jest.fn(() => Promise.reject(""));

    const result = await WeatherService.getDailyTemperatures("dummyStation");

    expect(spy).toHaveBeenCalled();
  });
});

describe("Should Get Min and Max Temperatures", () => {
  test("GetMinMaxForEachDay() should return the proper min and max values for given days", async () => {
    const mockResult = `[{"dayOfWeek":2,"max":23,"min":15,"date":"2024-04-02T23:00:00.000Z"},{"dayOfWeek":1,"max":24,"min":24,"date":"2024-04-02T05:40:00.000Z"}]`;

    const result = await WeatherService.getMinMaxForEachDay(featuresCollection);
    const json = JSON.stringify(result);

    expect(json).toBe(mockResult);
  });
});

describe("Should Convert Celsius to Fahrenheit", () => {
  test("convertToFahrenheit() should convert", async () => {
    const spy = jest.spyOn(Logger, "Error");

    const c = 23;
    const f = 73.4;
    const result = await WeatherService.convertToFahrenheit(c);

    expect(result).toBe(f);
  });
});

import WeatherService from "@/components/WeatherService";
import { IDailyTemperature } from "@/Models/IDailyTemperature";

export default async function Home() {
  const city = "Montford Middle";
  const temps = await WeatherService.getDailyTemperatures(city);
  return (
    <>
      <h3 className="p-5">{`Daily High and Low Temps for: ${city}`}</h3>
      <main className="flex min-h-screen flex-col-reverse justify-between p-5">
        {temps?.map((temp: IDailyTemperature, i) => (
          <div key={i} className="temperatureWrapper">
            <h2 className={`text-2xl font-semibold`}>{temp.date.toDateString()}</h2>
            <p className={`m-0 max-w-[30ch] text-sm text-balance`}>
              Min Temperature: {WeatherService.convertToFahrenheit(temp.min)}
            </p>
            <p className={`m-0 max-w-[30ch] text-sm text-balance`}>
              Max Temperature: {WeatherService.convertToFahrenheit(temp.max)}
            </p>
          </div>
        ))}
      </main>
    </>
  );
}

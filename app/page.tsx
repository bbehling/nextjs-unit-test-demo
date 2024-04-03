import WeatherService from "@/components/WeatherService";
import { IDailyTemperature } from "@/Models/IDailyTemperature";

function ConvertToFahrenheit(c: number) {
  const f = (c * 9) / 5 + 32;
  return Math.round(f * 100) / 100;
}

export default async function Home() {
  const station = "0007W";
  const temps = await WeatherService.GetDailyTemperatures("Denver");
  return (
    <>
      <h3 className="p-5">{`Daily High and Low Temps for Station: ${station}`}</h3>
      <main className="flex min-h-screen flex-col-reverse justify-between p-5">
        {temps?.map((temp: IDailyTemperature) => (
          <div className="temperatureWrapper">
            <h2 className={`text-2xl font-semibold`}>{temp.date.toDateString()}</h2>
            <p className={`m-0 max-w-[30ch] text-sm text-balance`}>Min Temperature: {ConvertToFahrenheit(temp.min)}</p>
            <p className={`m-0 max-w-[30ch] text-sm text-balance`}>Max Temperature: {ConvertToFahrenheit(temp.max)}</p>
          </div>
        ))}
      </main>
    </>
  );
}

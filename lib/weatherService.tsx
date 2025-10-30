import { Resend } from "resend";
import WeatherAlertEmail from "@/components/emails/WeatherAlertEmail";

export type WeatherData = {
  name: string;
  temp: number;
  description: string;
  icon: string;
};

const CITIES = {
  taguig: { lat: 14.5176, lon: 121.0509, name: "Taguig" },
  mandaluyong: { lat: 14.5794, lon: 121.0359, name: "Mandaluyong" },
};

const RAIN_CONDITIONS = ["Thunderstorm", "Drizzle", "Rain"];

const FORECAST_WINDOW_HOURS = 9;
const FORECAST_PERIODS_TO_CHECK = FORECAST_WINDOW_HOURS / 3;

export async function checkWeatherAndSendAlert() {
  const { OPENWEATHER_API_KEY, RESEND_API_KEY, EMAIL_TO_ADDRESS } = process.env;

  if (!OPENWEATHER_API_KEY || !RESEND_API_KEY || !EMAIL_TO_ADDRESS) {
    throw new Error("Missing environment variables.");
  }

  const weatherPromises = Object.values(CITIES).map(async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    if (!response.ok)
      throw new Error(`Failed to fetch weather forecast for ${city.name}`);

    const data = await response.json();

    const upcomingForecasts = data.list.slice(0, FORECAST_PERIODS_TO_CHECK);

    const firstRainyForecast = upcomingForecasts.find((forecast: any) =>
      RAIN_CONDITIONS.includes(forecast.weather[0].main)
    );

    if (firstRainyForecast) {
      return {
        name: city.name,
        temp: Math.round(firstRainyForecast.main.temp),
        description: firstRainyForecast.weather[0].main,
        icon: firstRainyForecast.weather[0].icon,
      } as WeatherData;
    }

    return null;
  });

  const allForecastData = await Promise.all(weatherPromises);

  const citiesWithRain = allForecastData.filter(
    (city): city is WeatherData => city !== null
  );

  if (citiesWithRain.length > 0) {
    const resend = new Resend(RESEND_API_KEY);
    const cityNames = citiesWithRain.map((c) => c.name).join(" and ");

    const { data, error } = await resend.emails.send({
      from: "Rain Alert <onboarding@resend.dev>",
      to: [EMAIL_TO_ADDRESS],
      // UPDATED: Subject line now says "Forecast"
      subject: `🌧️ Rain Forecast for ${cityNames}`,
      react: <WeatherAlertEmail citiesWithRain={citiesWithRain} />,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(error.message);
    }

    console.log(`Email sent successfully. ID: ${data?.id}`);
    return {
      status: "sent",
      message: `Rain forecasted in ${cityNames}. Alert email sent!`,
      citiesWithRain: citiesWithRain.map((c) => c.name),
    };
  }

  console.log("No rain forecasted. No email sent.");
  return {
    status: "no_rain",
    message: "Conditions are clear. No alert sent.",
    citiesWithRain: [],
  };
}

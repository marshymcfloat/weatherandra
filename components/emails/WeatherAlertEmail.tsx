import { WeatherData } from "@/lib/weatherService";
import * as React from "react";

interface EmailTemplateProps {
  citiesWithRain: WeatherData[];
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" };
const container = { margin: "0 auto", padding: "20px 0 48px", width: "580px" };
const card = {
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  padding: "20px",
};
const heading = { fontSize: "24px", fontWeight: "bold", color: "#333" };
const text = { fontSize: "16px", color: "#555", lineHeight: "1.5" };
const cityContainer = {
  padding: "15px 0",
  borderTop: "1px solid #e6ebf1",
  display: "flex",
  alignItems: "center",
};
const icon = { marginRight: "15px" };

const WeatherAlertEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  citiesWithRain,
}): React.JSX.Element => (
  <div style={main}>
    <div style={container}>
      <div style={card}>
        <h1 style={heading}>Heads up, baby ko!</h1>
        <p style={text}>
          Hi baby! I checked the weather for you. Mukhang may high chance of
          rain within the next 12 hours sa mga lugar na 'to:
        </p>
        {citiesWithRain.map((city, index) => (
          <div
            key={city.name}
            style={{
              ...cityContainer,
              borderTop: index === 0 ? "none" : "1px solid #e6ebf1",
            }}
          >
            <img
              style={icon}
              src={`http://openweathermap.org/img/wn/${city.icon}@2x.png`}
              width="50"
              height="50"
              alt={city.description}
            />
            <div>
              <p style={{ ...text, fontWeight: "bold", margin: 0 }}>
                {city.name}
              </p>
              <p style={{ ...text, margin: 0, fontSize: "14px" }}>
                {city.description} at {city.temp}°C
              </p>
            </div>
          </div>
        ))}
        <p style={text}>
          Kaya don't forget to bring your umbrella, ha? Ingat ka palagi pag
          aalis ka. I love you!
        </p>
      </div>
    </div>
  </div>
);

export default WeatherAlertEmail;

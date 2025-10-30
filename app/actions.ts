"use server";

import { checkWeatherAndSendAlert } from "@/lib/weatherService";

export async function manualWeatherCheck() {
  try {
    const result = await checkWeatherAndSendAlert();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Manual check failed:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred.",
    };
  }
}

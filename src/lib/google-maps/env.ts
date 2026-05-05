export function getGoogleMapsApiKey() {
  return process.env.GOOGLE_MAPS_API_KEY?.trim() ?? "";
}

export function hasGoogleMapsApiKey() {
  return getGoogleMapsApiKey().length > 0;
}

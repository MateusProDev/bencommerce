// Shared partners data (ids, names e URLs públicos)
// partner objects can include optional `affiliateUrl` (deeplink/affiliate link)
// If `affiliateUrl` is present it will be used; otherwise `url` is used.
const PARTNERS = [
  { id: 'booking-com', name: 'Booking.com', url: 'https://www.booking.com', affiliateUrl: null },
  { id: 'expedia', name: 'Expedia', url: 'https://www.expedia.com', affiliateUrl: null },
  { id: 'hotels-com', name: 'Hotels.com', url: 'https://www.hotels.com', affiliateUrl: null },
  { id: 'agoda', name: 'Agoda', url: 'https://www.agoda.com', affiliateUrl: null },
  { id: 'getyourguide', name: 'GetYourGuide', url: 'https://www.getyourguide.com', affiliateUrl: null },
  { id: 'tripadvisor', name: 'TripAdvisor', url: 'https://www.tripadvisor.com', affiliateUrl: null },
];

export default PARTNERS;

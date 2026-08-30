import { haversineDistance } from "@/hooks/useUserLocation";

describe("haversineDistance", () => {
  // Wang Sam Mo coordinates
  const WANG_SAM_MO = { lat: 17.0517, lng: 103.0985 };
  const NEARBY = { lat: 17.0489, lng: 103.0956 }; // ~0.4 km away
  const UDON_THANI = { lat: 17.4156, lng: 102.7869 }; // ~50 km away

  it("should return 0 for same point", () => {
    const dist = haversineDistance(
      WANG_SAM_MO.lat, WANG_SAM_MO.lng,
      WANG_SAM_MO.lat, WANG_SAM_MO.lng
    );
    expect(dist).toBeCloseTo(0, 5);
  });

  it("should calculate short distance correctly", () => {
    const dist = haversineDistance(
      WANG_SAM_MO.lat, WANG_SAM_MO.lng,
      NEARBY.lat, NEARBY.lng
    );
    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(1); // less than 1 km
  });

  it("should calculate long distance correctly", () => {
    const dist = haversineDistance(
      WANG_SAM_MO.lat, WANG_SAM_MO.lng,
      UDON_THANI.lat, UDON_THANI.lng
    );
    expect(dist).toBeGreaterThan(30); // more than 30 km
    expect(dist).toBeLessThan(70); // less than 70 km
  });

  it("should be symmetric (distance A→B = B→A)", () => {
    const dist1 = haversineDistance(
      WANG_SAM_MO.lat, WANG_SAM_MO.lng,
      NEARBY.lat, NEARBY.lng
    );
    const dist2 = haversineDistance(
      NEARBY.lat, NEARBY.lng,
      WANG_SAM_MO.lat, WANG_SAM_MO.lng
    );
    expect(dist1).toBeCloseTo(dist2, 5);
  });

  it("should handle Bangkok to Wang Sam Mo distance", () => {
    const BANGKOK = { lat: 13.7563, lng: 100.5018 };
    const dist = haversineDistance(
      BANGKOK.lat, BANGKOK.lng,
      WANG_SAM_MO.lat, WANG_SAM_MO.lng
    );
    // Bangkok to Wang Sam Mo is roughly 500-600 km
    expect(dist).toBeGreaterThan(400);
    expect(dist).toBeLessThan(700);
  });
});

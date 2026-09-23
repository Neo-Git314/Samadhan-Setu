import ExifReader from 'exif-reader';

/**
 * Computes great-circle distance between two geographic coordinates in kilometers (Haversine formula).
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in kilometers
 */
export const calculateHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 === null ||
    lat1 === undefined ||
    lon1 === null ||
    lon1 === undefined ||
    lat2 === null ||
    lat2 === undefined ||
    lon2 === null ||
    lon2 === undefined
  ) {
    return Infinity;
  }

  const toRad = (value) => (Number(value) * Math.PI) / 180;
  const R = 6371; // Earth's mean radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(3));
};

/**
 * Converts degrees, minutes, seconds array or decimal into decimal degrees.
 * @param {number|number[]} coordinate
 * @param {string} reference - 'N', 'S', 'E', 'W'
 * @returns {number|null}
 */
const convertToDecimalDegrees = (coordinate, reference) => {
  if (coordinate === null || coordinate === undefined) return null;

  let decimal = 0;
  if (Array.isArray(coordinate)) {
    const deg = Number(coordinate[0]) || 0;
    const min = Number(coordinate[1]) || 0;
    const sec = Number(coordinate[2]) || 0;
    decimal = deg + min / 60 + sec / 3600;
  } else if (typeof coordinate === 'number') {
    decimal = coordinate;
  } else {
    const parsed = parseFloat(coordinate);
    if (isNaN(parsed)) return null;
    decimal = parsed;
  }

  if (reference === 'S' || reference === 'W') {
    decimal = -Math.abs(decimal);
  } else if (reference === 'N' || reference === 'E') {
    decimal = Math.abs(decimal);
  }

  return Number(decimal.toFixed(6));
};

/**
 * Extracts GPS coordinates from an image file buffer.
 * Supports standard JPEG/TIFF APP1 EXIF segment (0xFFE1).
 * @param {Buffer} fileBuffer
 * @returns {{ lat: number, lng: number } | null}
 */
export const extractGpsFromBuffer = (fileBuffer) => {
  if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length < 16) {
    return null;
  }

  try {
    // Look for EXIF marker 0xFFE1 in JPEG
    const exifMarkerIndex = fileBuffer.indexOf(Buffer.from([0xff, 0xe1]));
    let parsed = null;

    if (exifMarkerIndex !== -1 && fileBuffer.length >= exifMarkerIndex + 4) {
      const exifLength = fileBuffer.readUInt16BE(exifMarkerIndex + 2);
      const exifBuffer = fileBuffer.subarray(
        exifMarkerIndex + 4,
        Math.min(fileBuffer.length, exifMarkerIndex + 2 + exifLength)
      );

      // Verify standard "Exif\0\0" header
      if (exifBuffer.length >= 6 && exifBuffer.toString('utf8', 0, 4) === 'Exif') {
        parsed = ExifReader(exifBuffer.subarray(6));
      }
    }

    // Direct buffer parse attempt if marker subarray wasn't used or returned null
    if (!parsed) {
      try {
        parsed = ExifReader(fileBuffer);
      } catch {
        // Non-fatal, handled below
      }
    }

    if (parsed && parsed.gps) {
      const rawLat = parsed.gps.GPSLatitude;
      const latRef = parsed.gps.GPSLatitudeRef;
      const rawLng = parsed.gps.GPSLongitude;
      const lngRef = parsed.gps.GPSLongitudeRef;

      if (rawLat !== undefined && rawLng !== undefined) {
        const lat = convertToDecimalDegrees(rawLat, latRef);
        const lng = convertToDecimalDegrees(rawLng, lngRef);

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
    }

    return null;
  } catch (err) {
    console.warn('[fraudService] Could not parse EXIF buffer:', err.message);
    return null;
  }
};

/**
 * Analyzes uploaded image buffers against citizen-selected form coordinates.
 * Flags potential fraud if distance > 1.0 km (Task 5.1).
 *
 * @param {Buffer[]} fileBuffers - Array of image buffers
 * @param {{ lat: number, lng: number }} formLocation - Citizen form coordinates
 * @returns {{
 *   imageGps: { lat: number|null, lng: number|null },
 *   locationVerification: { distanceKm: number|null, verified: boolean|null, status: 'verified'|'mismatch'|'gps_unavailable' },
 *   isPotentiallyFraudulent: boolean
 * }}
 */
export const verifyComplaintLocation = (fileBuffers = [], formLocation = {}) => {
  const result = {
    imageGps: { lat: null, lng: null },
    locationVerification: {
      distanceKm: null,
      verified: null,
      status: 'gps_unavailable'
    },
    isPotentiallyFraudulent: false
  };

  const buffers = Array.isArray(fileBuffers) ? fileBuffers : [fileBuffers].filter(Boolean);
  let detectedGps = null;

  for (const buffer of buffers) {
    if (buffer) {
      const gps = extractGpsFromBuffer(buffer);
      if (gps) {
        detectedGps = gps;
        break;
      }
    }
  }

  // If no GPS could be extracted from any image
  if (!detectedGps) {
    return result;
  }

  result.imageGps = detectedGps;

  const formLat = formLocation?.lat;
  const formLng = formLocation?.lng;

  // If form coordinates are present, compute distance
  if (
    formLat !== null &&
    formLat !== undefined &&
    formLng !== null &&
    formLng !== undefined &&
    !isNaN(Number(formLat)) &&
    !isNaN(Number(formLng))
  ) {
    const distanceKm = calculateHaversineDistanceKm(
      detectedGps.lat,
      detectedGps.lng,
      Number(formLat),
      Number(formLng)
    );

    result.locationVerification.distanceKm = distanceKm;

    if (distanceKm > 1.0) {
      // Greater than 1 km mismatch -> flag as fraud
      result.isPotentiallyFraudulent = true;
      result.locationVerification.verified = false;
      result.locationVerification.status = 'mismatch';
    } else {
      // Verified within 1 km
      result.isPotentiallyFraudulent = false;
      result.locationVerification.verified = true;
      result.locationVerification.status = 'verified';
    }
  }

  return result;
};

export default {
  calculateHaversineDistanceKm,
  extractGpsFromBuffer,
  verifyComplaintLocation
};

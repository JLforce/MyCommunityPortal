/**
 * Normalizes municipality names for comparison
 * Handles variations like "Cebu City" vs "City of Cebu", "Municipality of X" vs "X Municipality"
 */
export function normalizeMunicipalityName(name) {
  if (!name || typeof name !== 'string') return '';
  
  // Convert to lowercase and trim
  let normalized = name.toLowerCase().trim();
  
  // Handle "City of X" format - extract just the city name
  normalized = normalized.replace(/^city of (.+)$/i, '$1');
  
  // Handle "Municipality of X" format - extract just the municipality name
  normalized = normalized.replace(/^municipality of (.+)$/i, '$1');
  normalized = normalized.replace(/^mun\.?\s+of (.+)$/i, '$1');
  
  // Remove trailing "City" or "Municipality" suffixes
  normalized = normalized.replace(/\s+city$/i, '');
  normalized = normalized.replace(/\s+municipality$/i, '');
  normalized = normalized.replace(/\s+mun\.?$/i, '');
  
  // Remove standalone "City" or "Municipality" words (shouldn't happen but just in case)
  normalized = normalized.replace(/^city$/i, '');
  normalized = normalized.replace(/^municipality$/i, '');
  normalized = normalized.replace(/^mun\.?$/i, '');
  
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * Compares two municipality names with fuzzy matching
 * Returns true if they likely refer to the same place
 */
export function compareMunicipalities(name1, name2) {
  if (!name1 || !name2) return false;
  
  const normalized1 = normalizeMunicipalityName(name1);
  const normalized2 = normalizeMunicipalityName(name2);
  
  // Exact match after normalization
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other (handles "Cebu" vs "Cebu City")
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    // Only consider it a match if the shorter name is at least 3 characters
    const shorter = normalized1.length < normalized2.length ? normalized1 : normalized2;
    if (shorter.length >= 3) return true;
  }
  
  // Check for common Philippine city variations
  const commonCities = {
    'cebu': ['cebu city', 'city of cebu', 'cebu'],
    'manila': ['manila city', 'city of manila', 'manila'],
    'quezon': ['quezon city', 'qc', 'quezon'],
    'davao': ['davao city', 'city of davao', 'davao'],
    'makati': ['makati city', 'city of makati', 'makati'],
    'pasig': ['pasig city', 'city of pasig', 'pasig'],
    'taguig': ['taguig city', 'city of taguig', 'taguig'],
    // Add more as needed
  };
  
  // Check if both names refer to the same common city
  for (const [baseName, variants] of Object.entries(commonCities)) {
    const baseNorm = normalizeMunicipalityName(baseName);
    const norm1Matches = normalized1 === baseNorm || variants.some(v => normalizeMunicipalityName(v) === normalized1);
    const norm2Matches = normalized2 === baseNorm || variants.some(v => normalizeMunicipalityName(v) === normalized2);
    
    if (norm1Matches && norm2Matches) {
      return true;
    }
  }
  
  return false;
}

/**
 * Extracts municipality name from Nominatim reverse geocoding response
 * Tries multiple fields to find the municipality/city name
 */
export function extractMunicipalityFromNominatim(geoData) {
  if (!geoData || !geoData.address) return null;
  
  const addr = geoData.address;
  
  // Try multiple fields in order of preference
  const fields = [
    'city',
    'town',
    'municipality',
    'village',
    'county', // Sometimes used for municipalities
    'state_district',
  ];
  
  for (const field of fields) {
    if (addr[field]) {
      return addr[field];
    }
  }
  
  // Fallback: check if any address field contains "city" or "municipality"
  for (const [key, value] of Object.entries(addr)) {
    if (typeof value === 'string' && (value.toLowerCase().includes('city') || value.toLowerCase().includes('municipality'))) {
      return value;
    }
  }
  
  return null;
}


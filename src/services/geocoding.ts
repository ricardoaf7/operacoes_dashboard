// Serviço de geolocalização reversa usando Nominatim (OpenStreetMap)
export interface GeocodeResult {
  address: string;
  city: string;
  state: string;
  country: string;
  postcode?: string;
  neighbourhood?: string;
}

/**
 * Obtém o endereço a partir de coordenadas usando o serviço Nominatim
 * @param lat Latitude
 * @param lng Longitude
 * @returns Promise com os dados do endereço
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR,pt,en`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.address) {
      return null;
    }

    const address = data.address;
    
    // Construir endereço formatado
    const addressParts = [];
    
    if (address.road) {
      addressParts.push(address.road);
    }
    
    if (address.house_number) {
      addressParts.push(address.house_number);
    }

    const formattedAddress = addressParts.length > 0 
      ? addressParts.join(', ')
      : data.display_name.split(',')[0];

    return {
      address: formattedAddress,
      city: address.city || address.town || address.village || address.municipality || 'Não identificado',
      state: address.state || 'Não identificado',
      country: address.country || 'Brasil',
      postcode: address.postcode,
      neighbourhood: address.neighbourhood || address.suburb || address.quarter
    };

  } catch (error) {
    console.error('Erro na geolocalização reversa:', error);
    return null;
  }
}

/**
 * Obtém apenas o endereço formatado de forma simples
 * @param lat Latitude
 * @param lng Longitude
 * @returns Promise com o endereço formatado ou null
 */
export async function getSimpleAddress(lat: number, lng: number): Promise<string | null> {
  const result = await reverseGeocode(lat, lng);
  
  if (!result) {
    return null;
  }

  const parts = [result.address];
  
  if (result.neighbourhood) {
    parts.push(result.neighbourhood);
  }
  
  parts.push(result.city);

  return parts.join(', ');
}
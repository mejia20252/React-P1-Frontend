// src/utils/vehiculo-utils.ts

export const getVehiculoTipoDisplay = (tipo: string): string => {
  const mappings: Record<string, string> = {
    automovil: 'Automóvil',
    motocicleta: 'Motocicleta',
    camioneta: 'Camioneta',
    otro: 'Otro',
  };

  // Devuelve el nombre amigable si coincide, o capitaliza la primera letra
  return mappings[tipo.toLowerCase()] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
};
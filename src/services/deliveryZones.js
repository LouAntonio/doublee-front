import http from './http';

export const getActiveDeliveryZones = () => http.get('/delivery-zones');

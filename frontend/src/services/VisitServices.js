import api from './api';

export const fetchActiveVisits = () => {
  return api.get('/visits/active');
};

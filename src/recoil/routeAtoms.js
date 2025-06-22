import { atom } from 'recoil';

export const startPointState = atom({
  key: 'startPointState',
  default: null, 
});

export const endPointState = atom({
  key: 'endPointState',
  default: null,
});

export const tabIndexState = atom({
  key: 'tabIndexState',
  default: 1,
});

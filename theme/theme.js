export const ThemeColors = {
  primaryText: {
    light: 'black',
    dark: 'white',
  },
  primaryBackground: {
    light: 'white',
    dark: 'black',
  },
  paper: {
    light: '#fff',
    dark: '#141414',
  },
  blue: {
    light: '#003CFF',
    dark: '#2189FF',
  },
  grey1: {
    light: '#F8F8F8',
    dark: '#1D1D1D',
  },
  greyText1: {
    light: '#6B6B6B',
    dark: '#A4A4A4',
  },
  red: {
    light: '#FF2634',
    dark: '#FF5460',
  },
  yellow: {
    light: '#FFF700',
    dark: '#FFF957',
  },
  green: {
    light: '#33DC0B',
    dark: '#71D958',
  },
};

export const getTheme = (mode) => {
  let Theme = {};
  for (let key in ThemeColors) {
    Theme[key] = ThemeColors[key][mode];
  }
  return Theme;
};

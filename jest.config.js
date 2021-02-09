process.env.THERMO_HYGRO_ENABLED = '1';
process.env.PRESSURE_ENABLED = '1';
process.env.RAIN_ENABLED = '1';
process.env.WIND_ENABLED = '1';
process.env.INDOOR_THERMO_HYGRO_ENABLED = '1';

module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'js'],
};

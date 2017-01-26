var styleProperties = { 
  entities: {
    'glucose-meter': {
      properties: {
        state: {
          display: 'none'
        },
        concentration: {
          display: 'inline',
          significantDigits: 1,
          symbol: 'mg/dl'
        }
      }
    },
    'insulin-pump': {
      properties: {
        state: {
          display: 'none'
        },
        concentration: {
          display: 'inline',
          significantDigits: 1,
          symbol: 'mg/dl'
        }
      }
    },
    'industrial-monitor': {
      properties: {
        state: {
          display: 'none'
        },
        power: {
          display: 'inline',
          significantDigits: 2,
          symbol: 'kW'
        }
      }
    },
    photocell: {
      properties: {
        state: {
          display: 'none'
        },
        intensity: {
          display: 'inline',
          significantDigits: 3,
          symbol: 'lx'
        }
      }
    },
    automobile: {
      properties: {
        state: {
          display: 'none'
        },
        vehicleSpeed: {
          display: 'inline',
          significantDigits: 1,
          symbol: 'km/h'
        }
      }
    },
    thermometer: {
      properties: {
        state: {
          display: 'none'
        },
        temperature: {
          display: 'inline',
          significantDigits: 1,
          symbol: '°F'
        }
      }
    },
    thermostat: {
      properties: {
        state: {
          display: 'none'
        },
        setpoint: {
          display: 'inline',
          significantDigits: 1,
          symbol: '°F'
        }
      }
    }
  },
  properties: {}
};

module.exports = styleProperties;

export const createThemeOptions = (primary) => ({
    palette: {
      mode: 'light',
      primary: {
        // main: primary || '#415F9D',
        main: '#415F9D',
        contrastText: '#fff',
      },
      secondary: {
        main: '#40C9A2'
      },
      grey: {
        main: '#474747',
      },
      nav: {
        main: '#fff',
        secondary: '#233B6E',
        text: '#474747',
        hover: '#f3f3f3'
      },
      background: {
        paper: '#f8f8f8',
        default: '#ffffff',
      },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      h1: {
        fontSize: '1.5rem',
        lineHeight: 1.5,
        fontWeight: 500,
      },
      h2: {
        fontWeight: 400,
        fontSize: '1.5rem',
        lineHeight: 1.5,
      },
      h3: {
        fontSize: '1.15rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h4: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      fontWeightBold: 700,
      button: {
        fontSize: '1rem',
        fontWeight: 500,
        textTransform: 'none',
      },
      body1: { // standard
        fontSize: '1rem',
        fontWeight: 400
      },
      body2: { // Table
        fontSize: '1rem',
        fontWeight: 400
      }
    },
    formControl: {
      inputLabelRoot: {
        color: 'rgba(0,0,0,0.87)',
      }
    },
})
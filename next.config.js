const withPWA = require('next-pwa')({
  dest: 'public',
})

const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
])

module.exports = withTM(
  withPWA({
    swcMinify: true,
  }),
)

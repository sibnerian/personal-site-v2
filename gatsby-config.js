if (process.env.ENVIROMENT !== 'production') {
  require('dotenv').config();
}

const contentfulConfig = {
  spaceId: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
};

module.exports = {
  siteMetadata: {
    title: 'Ian Sibner',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'sibnerian',
        short_name: 'sibnerian',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'static/favicon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [
          'G-55DHFZVLW4', // Google Analytics / GA
        ],
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-typescript',
    'gatsby-transformer-remark',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
    'gatsby-plugin-sass',
  ],
};

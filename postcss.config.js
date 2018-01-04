module.exports = {
  plugins: [
    require('autoprefixer')(),
    require('postcss-sorting')({
      'properties-order': 'alphabetical'
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
};

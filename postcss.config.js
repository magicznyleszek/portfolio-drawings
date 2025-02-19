import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'

export default {
  map: 'inline',
  plugins: [autoprefixer, cssnano],
}

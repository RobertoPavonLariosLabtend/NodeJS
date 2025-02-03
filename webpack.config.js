import path from 'path'

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        add_img: './src/js/add_img.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}
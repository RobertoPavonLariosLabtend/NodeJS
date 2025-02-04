import path from 'path'

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        add_img: './src/js/add_img.js',
        show_map: './src/js/show_map.js',
        home_map: './src/js/home_map.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}
const path = require("path");
const webpack = require("webpack");

const vueLoader = require("vue-loader");

const VueLoaderPlugin = vueLoader.VueLoaderPlugin;

module.exports = {
    entry: "./vue",
    target: process.env.WP_TARGET || "web",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "ux-vue.min.js?[hash]",
        library: "UxVue",
        libraryTarget: "umd"
    },
    plugins: [new VueLoaderPlugin({})],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        js: "babel-loader!eslint-loader",
                        scss: "vue-style-loader!css-loader!sass-loader",
                        sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!ripe-sdk)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                process.env.NODE_ENV === "development"
                                    ? [
                                          "@babel/preset-env",
                                          {
                                              targets: {
                                                  browsers: ["last 2 years"]
                                              }
                                          }
                                      ]
                                    : "@babel/preset-env"
                            ]
                        }
                    },
                    {
                        loader: "eslint-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: "file-loader",
                options: {
                    name: (path, query) => {
                        if (process.env.NODE_ENV === "development") {
                            return "[path][name].[ext]?[hash]";
                        }
                        return "[contenthash].[ext]";
                    },
                    esModule: false
                }
            },
            {
                test: /\.(svga)$/,
                loader: "file-loader",
                options: {
                    name: (path, query) => {
                        if (process.env.NODE_ENV === "development") {
                            return "[path][name].svg?[hash]";
                        }
                        return "[contenthash].svg";
                    },
                    esModule: false
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader",
                options: {
                    esModule: false
                }
            }
        ]
    },
    resolve: {
        alias: {
            base$: "../../../js",
            vue$: "vue/dist/vue.esm.js"
        }
    },
    externals: {
        vue: "Vue.js"
    },
    performance: {
        hints: false
    },
    devtool: "inline-source-map"
};

if (process.env.NODE_ENV === "production") {
    module.exports.devtool = "source-map";
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]);
}

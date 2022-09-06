const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MinimizerCssWebpackPlugin = require("css-minimizer-webpack-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")

const isDev = process.env.NODE_ENV === "development"
const isProd = !isDev

const filename = (ext) => {
	if (isDev) {
		if (ext === "[ext]") return `[name].${ext}`
		return `[name].${ext}`
	}
	if (ext === "[ext]") return `[name].[contenthash]${ext}`
	return `[name].[contenthash].${ext}`
}

const optimization = () => {
	const configObj = {
		splitChunks: {
			chunks: "all",
		},
	}

	if (isProd) {
		configObj.minimizer = [
			new MinimizerCssWebpackPlugin(),
			new TerserWebpackPlugin(),
		]
	}

	return configObj
}

const plugins = () => {
	const basePlugins = [
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, "src/index.html"),
			filename: "index.html",
			chunks: ["index"],
			minify: {
				collapseWhitespace: isProd,
			},
		}),
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, "src/en/index.html"),
			filename: "./en/index.html",
			chunks: ["index"],
			minify: {
				collapseWhitespace: isProd,
			},
			path: "../",
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: `css/${filename("css")}`,
		}),
	]

	if (isProd) {
		basePlugins.push(
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							["gifsicle", { interlaced: true }],
							["jpegtran", { progressive: true }],
							["optipng", { optimizationLevel: 5 }],
							[
								"svgo",
								{
									name: "preset-default",
									params: {
										overrides: {
											convertShapeToPath: {
												convertArcs: true,
											},
										},
									},
								},
							],
						],
					}
				},
			}),
		)
	}

	return basePlugins
}

module.exports = {
	context: path.resolve(__dirname, "src"),
	mode: "development",
	entry: {
		index: "./js/index.js",
	},
	output: {
		filename: `js/${filename("js")}`,
		path: path.resolve(__dirname, "build"),
		publicPath: "/",
	},
	devServer: {
		historyApiFallback: true,
		static: path.resolve(__dirname, "build"),
		open: true,
		compress: true,
		hot: true,
		port: 3000,
	},
	optimization: optimization(),
	plugins: plugins(),
	devtool: isProd ? false : "source-map",
	module: {
		rules: [
			{
				test: /\.html$/,
				loader: "html-loader",
			},
			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev,
						},
					},
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: (resourcePath, context) => `${path.relative(path.dirname(resourcePath), context)}/`,
						},
					},
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			{
				test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
				type: "asset/resource",
				generator: {
					filename: `[path]${filename("[ext]")}`,
				},
			},
			{
				test: /\.(?:|woff|woff2)$/,
				type: "asset/resource",
				generator: {
					filename: `fonts/${filename("[ext]")}`,
				},
			},
		],
	},
}

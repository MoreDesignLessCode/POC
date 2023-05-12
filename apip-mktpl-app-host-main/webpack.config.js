const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:3000/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        host: "host@http://localhost:3000/remoteEntry.js", // referencing self
        dashboard: `promise new Promise(resolve => {
          const remoteUrl = 'http://localhost:3002/remoteEntry.js'
          const script = document.createElement('script')
          script.src = remoteUrl
          script.onload = () => {
            // the injected script has loaded and is available on window
            // we can now resolve this Promise
            const proxy = {
              get: (request) => window.dashboard.get(request),
              init: (arg) => {
                try {
                  return window.dashboard.init(arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            }
            resolve(proxy)
          }
          script.onerror = (error) => {
            console.error('error loading remote container (dashboard)')
            const proxy = {
              get: (request) => {
                // If the service is down it will render this content
                return Promise.resolve(() => () => "Dashboard Module is not running.");
              },
              init: (arg) => {
                return;
              }
            }
            resolve(proxy)
          }
          // inject this script with the src set to the remoteEntry.js
          document.head.appendChild(script);
        })
        `,
        discover: `promise new Promise(resolve => {
          const remoteUrl = 'http://localhost:3003/remoteEntry.js'
          const script = document.createElement('script')
          script.src = remoteUrl
          script.onload = () => {
            // the injected script has loaded and is available on window
            // we can now resolve this Promise
            const proxy = {
              get: (request) => window.discover.get(request),
              init: (arg) => {
                try {
                  return window.discover.init(arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            }
            resolve(proxy)
          }
          script.onerror = (error) => {
            console.error('error loading remote container (discover)')
            const proxy = {
              get: (request) => {
                // If the service is down it will render this content
                return Promise.resolve(() => () => "Discover Module is not running.");
              },
              init: (arg) => {
                return;
              }
            }
            resolve(proxy)
          }
          // inject this script with the src set to the remoteEntry.js
          document.head.appendChild(script);
        })
        `,
        analytics: `promise new Promise(resolve => {
          const remoteUrl = 'http://localhost:3004/remoteEntry.js'
          const script = document.createElement('script')
          script.src = remoteUrl
          script.onload = () => {
            // the injected script has loaded and is available on window
            // we can now resolve this Promise
            const proxy = {
              get: (request) => window.analytics.get(request),
              init: (arg) => {
                try {
                  return window.analytics.init(arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            }
            resolve(proxy)
          }
          script.onerror = (error) => {
            console.error('error loading remote container (analytics)')
            const proxy = {
              get: (request) => {
                // If the service is down it will render this content
                return Promise.resolve(() => () => "Analytics Module is not running.");
              },
              init: (arg) => {
                return;
              }
            }
            resolve(proxy)
          }
          // inject this script with the src set to the remoteEntry.js
          document.head.appendChild(script);
        })
        `,
        support: `promise new Promise(resolve => {
          const remoteUrl = 'http://localhost:3005/remoteEntry.js'
          const script = document.createElement('script')
          script.src = remoteUrl
          script.onload = () => {
            // the injected script has loaded and is available on window
            // we can now resolve this Promise
            const proxy = {
              get: (request) => window.support.get(request),
              init: (arg) => {
                try {
                  return window.support.init(arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            }
            resolve(proxy)
          }
          script.onerror = (error) => {
            console.error('error loading remote container (support)')
            const proxy = {
              get: (request) => {
                // If the service is down it will render this content
                return Promise.resolve(() => () => "support Module is not running.");
              },
              init: (arg) => {
                return;
              }
            }
            resolve(proxy)
          }
          // inject this script with the src set to the remoteEntry.js
          document.head.appendChild(script);
        })
        `,
        product: `promise new Promise(resolve => {
          const remoteUrl = 'http://localhost:3006/remoteEntry.js'
          const script = document.createElement('script')
          script.src = remoteUrl
          script.onload = () => {
            // the injected script has loaded and is available on window
            // we can now resolve this Promise
            const proxy = {
              get: (request) => window.product.get(request),
              init: (arg) => {
                try {
                  return window.product.init(arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            }
            resolve(proxy)
          }
          script.onerror = (error) => {
            console.error('error loading remote container (product)')
            const proxy = {
              get: (request) => {
                // If the service is down it will render this content
                return Promise.resolve(() => () => "product Module is not running.");
              },
              init: (arg) => {
                return;
              }
            }
            resolve(proxy)
          }
          // inject this script with the src set to the remoteEntry.js
          document.head.appendChild(script);
        })
        `,
        learn: `promise new Promise(resolve => {
          const remoteUrl = 'http://localhost:3007/remoteEntry.js'
          const script = document.createElement('script')
          script.src = remoteUrl
          script.onload = () => {
            // the injected script has loaded and is available on window
            // we can now resolve this Promise
            const proxy = {
              get: (request) => window.learn.get(request),
              init: (arg) => {
                try {
                  return window.learn.init(arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            }
            resolve(proxy)
          }
          script.onerror = (error) => {
            console.error('error loading remote container (learn)')
            const proxy = {
              get: (request) => {
                // If the service is down it will render this content
                return Promise.resolve(() => () => "learn Module is not running.");
              },
              init: (arg) => {
                return;
              }
            }
            resolve(proxy)
          }
          // inject this script with the src set to the remoteEntry.js
          document.head.appendChild(script);
        })
        `,
        register: `promise new Promise(resolve => {
          const remoteUrl = 'http://localhost:3009/remoteEntry.js'
          const script = document.createElement('script')
          script.src = remoteUrl
          script.onload = () => {
            // the injected script has loaded and is available on window
            // we can now resolve this Promise
            const proxy = {
              get: (request) => window.register.get(request),
              init: (arg) => {
                try {
                  return window.register.init(arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            }
            resolve(proxy)
          }
          script.onerror = (error) => {
            console.error('error loading remote container (register)')
            const proxy = {
              get: (request) => {
                // If the service is down it will render this content
                return Promise.resolve(() => () => "register Module is not running.");
              },
              init: (arg) => {
                return;
              }
            }
            resolve(proxy)
          }
          // inject this script with the src set to the remoteEntry.js
          document.head.appendChild(script);
        })
        `,
        feedback: "feedback@http://localhost:3008/remoteEntry.js"
        
      },
      exposes: {
        "./Layout": "./src/components/Layout.tsx",
        "./Header": "./src/components/Header.tsx",
        "./Sidebar": "./src/components/Sidebar.tsx",
        "./Footer": "./src/components/Footer.tsx",
        "./store": "./src/store.ts",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      favicon: "./public/favicon.ico",
    }),
  ],
};

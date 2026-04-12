/** @type {import('next').NextConfig} */
const isTurboDev =
  process.argv.includes("dev") && process.argv.some((a) => a === "--turbo" || a.startsWith("--turbo="));

const nextConfig = {
  /** Next 16: declarar turbopack evita conflito quando existe `webpack` custom. */
  turbopack: {},
};

/** Poll no Windows: só aplica em `next dev` sem `--turbo` (`npm run dev:webpack`). */
if (!isTurboDev) {
  nextConfig.webpack = (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  };
}

export default nextConfig;

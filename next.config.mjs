/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "7000", // optional, since you are using custom port
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_HOST?.replace("https://", "").replace(
          "http://",
          ""
        ),
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_HOST?.replace("https://", "").replace(
          "http://",
          ""
        ),
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "72.60.202.189",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;

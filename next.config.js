/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images:{
    domains:['images.mirror-media.xyz', 'ipfs.infura.io']
  },
  typescript:{
    ignoreBuildErrors:true
  },
   experimental: {
    scrollRestoration: true
  }
}

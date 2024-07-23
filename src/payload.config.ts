import path from 'path'


import { payloadCloud } from '@payloadcms/plugin-cloud'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import Tasks from './collections/Tasks'
//import Media from './collections/Media'
import { Media } from './collections/Media'



export default buildConfig({
  
  upload: {
    limits:{
      fileSize: 1500000
    }
  },

  admin: {
    user: Users.slug,
    bundler: webpackBundler()
  },
  editor: slateEditor({}),
  collections: [Users,
    Tasks,
    Media
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),


})

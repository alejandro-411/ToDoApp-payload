import { CollectionConfig } from "payload/types";

const Media: CollectionConfig = {
  slug: 'media',
  access:{
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  upload: {
    staticDir: 'media',
    staticURL: '/media',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'altText',
      type: 'text',
      required: true,
    },
  ],
};

export default Media;

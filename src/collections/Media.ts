import { CollectionConfig } from "payload/types";

const Media: CollectionConfig = {
  slug: 'media',
  access:{
    read:()=> true,
    create: () => true,
    update: () => true,
    delete: () => true
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
      required: false,
    },
  ],
};

export default Media;

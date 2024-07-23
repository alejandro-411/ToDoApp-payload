import { CollectionConfig } from "payload/types";   

const Tasks: CollectionConfig = {
    slug: 'tasks',
    access: {
    read:()=> true,
    create: () => true,
    update: () => true,
    delete: () => true
    },

    fields: [
        {
            name: 'title',
            type: 'text',
            required: true
        },
        {
            name: 'description',
            type:'textarea'
        },
        {
            name: 'completed',
            type: 'checkbox',
            defaultValue: false},
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: false
        },
    ]
};

export default Tasks;

import { CollectionConfig } from "payload/types";   
import  Media from "./Media";

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
        },



    ]
};

export default Tasks;
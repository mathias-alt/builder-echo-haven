import { builder } from '@builder.io/react';

// Initialize Builder.io with your API key from environment variable
const apiKey = import.meta.env.VITE_BUILDER_API_KEY || 'e97dd979b7da4412876f99b95385cfb6';
builder.init(apiKey);

export { builder };

import { Provider } from '@nestjs/common';
import { v2 } from 'cloudinary';

export const CloudinaryProvider: Provider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    console.log('cloud inject');
    return v2.config({
      cloud_name: process.env.CLOUD_N,
      api_key: process.env.CLOUD_K,
      api_secret: process.env.CLOUD_SK,
    });
  },
};

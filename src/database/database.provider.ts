import { DATA_SOURCE } from '@/common/constanst';
import { dataSource } from '@/typeorm';

export const databaseProvider = {
  provide: DATA_SOURCE,
  useFactory: async () => {
    try {
      if (!dataSource.isInitialized) {
        console.log('Initializing database connection...');
        await dataSource.initialize();
        console.log('Database connected successfully!');

        // Migrations are a one-off deployment job, never a side effect of a web replica boot.
      }
      return dataSource;
    } catch (error: any) {
      console.error('Database Connection Error:', error.message);
      console.error('Stack:', error.stack);
      console.log('Database Config:');
      console.log('- TYPEORM_HOST:', process.env.TYPEORM_HOST || 'NOT SET');
      console.log('- TYPEORM_PORT:', process.env.TYPEORM_PORT || 'NOT SET');
      console.log(
        '- TYPEORM_DATABASE:',
        process.env.TYPEORM_DATABASE || 'NOT SET',
      );
      console.log(
        '- DATABASE_URL:',
        process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      );

      throw error;
    }
  },
};

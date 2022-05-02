// Packages
import { ConnectionOptions } from 'typeorm';
// Configs
import ormConfig from './ormConfig';

const ormSeedConfig: ConnectionOptions = {
  ...ormConfig,
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/seeds',
  },
};

export default ormSeedConfig;

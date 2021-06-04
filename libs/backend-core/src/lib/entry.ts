import { CacheModule, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BackendCoreModule } from './backend-core.module';
import 'reflect-metadata'; import * as redisStore from 'cache-manager-redis';
import * as fsStore from 'cache-manager-fs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { tmpdir } from 'os';
import { join } from 'path';

export interface ComenBackendOptions {
    dev: boolean;
    frontendPath: string;
}

export async function bootstrapBackendCore(options: ComenBackendOptions) {
    initModuleDependencies(options);
    const app = await NestFactory.create(BackendCoreModule);
    const port = process.env.PORT || 4000;
    await app.listen(port, () => {
        Logger.log('Listening at http://localhost:' + port);
    });
}

function initModuleDependencies(options: ComenBackendOptions) {
    const modules = [CacheModule.registerAsync({
        useFactory: () => {
            if (process.env.REDIS_HOST) {
                return {
                    store: redisStore,
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT ?? "6379"),
                    auth_pass: process.env.REDIS_AUTH,
                    db: parseInt(process.env.REDIS_DB ?? "0")
                }
            }
            return {
                store: fsStore,
                maxsize: 1000 * 1000 * 1000, // 1Gib,
                path: tmpdir() + '/comen',
                preventfill: true
            };
        }
    })];
    if (!options.dev) {
        modules.push(
            ServeStaticModule.forRoot({
                rootPath: options.frontendPath
            }),
            ServeStaticModule.forRoot({
                rootPath: join(options.frontendPath, 'assets/css4obs'),
                serveRoot: '/css4obs'
            })
        );
    }
    Reflect.defineMetadata("imports", modules, BackendCoreModule);
}
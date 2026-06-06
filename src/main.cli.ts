#!/usr/bin/env node
/* eslint-disable node/no-unsupported-features/es-syntax */
import 'reflect-metadata';
import { CLIApplication } from './cli/index.js';
import { glob } from 'glob';
import { Command } from './cli/commands/command.interface.js';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

async function bootstrap() {
  const cliApplication = new CLIApplication();

  const importedCommands: Command[] = [];
  const files = glob.sync('src/cli/commands/*.command.ts');

  for (const file of files) {
    const modulePath = resolve(file);
    const moduleExportItems = await import(pathToFileURL(modulePath).href);

    for (const exportKey of Object.keys(moduleExportItems)) {
      const exportItem = moduleExportItems[exportKey];
      if (exportItem.prototype && typeof exportItem.prototype.execute === 'function') {
        const commandInstance = new exportItem();
        importedCommands.push(commandInstance);
      }
    }

  }

  cliApplication.registerCommands(importedCommands);

  cliApplication.processCommand(process.argv);
}

bootstrap();

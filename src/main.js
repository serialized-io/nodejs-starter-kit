import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import execa from 'execa';
import Listr from 'listr';
import {projectInstall} from 'pkg-install';
import {promisify} from 'util';
import ejs from 'ejs';

const access = promisify(fs.access);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function copyRootFile(options, filename, destinationFile) {
  const contents = await readFile(path.resolve(options.templateDirectory, filename), 'utf8');
  await writeFile(path.resolve(options.targetDirectory, destinationFile), contents)
}

async function copyTemplateFiles(options) {
  await copyRootFile(options, 'gitignore', '.gitignore')
  await copyRootFile(options, 'package-lock.json', 'package-lock.json')
  await copyRootFile(options, 'jest.config.js', 'jest.config.js')
  await copyRootFile(options, 'tsconfig.json', 'tsconfig.json')
  await copyRootFile(options, '.env', '.env')
  const targetSrcDir = path.join(options.targetDirectory, 'src');
  const targetSpecDir = path.resolve(options.targetDirectory, 'spec');
  const srcDir = path.resolve(options.templateDirectory, 'src');
  const specDir = path.resolve(options.templateDirectory, 'spec');
  await fs.mkdirSync(targetSrcDir)
  await fs.mkdirSync(targetSpecDir)

  const readAndReplace = async function (srcDir, targetDir, filename) {
    try {
      let fileContents = await readFile(path.resolve(srcDir, filename), 'utf8');
      await writeFile(path.resolve(targetDir, filename), ejs.render(fileContents, options),)
    } catch (e) {
      return Promise.reject("Failed to create " + filename + ": " + e)
    }
  }

  await readAndReplace(options.templateDirectory, options.targetDirectory, 'package.json')
  await readAndReplace(srcDir, targetSrcDir, 'model.ts')
  await readAndReplace(srcDir, targetSrcDir, 'server.ts')
  await readAndReplace(specDir, targetSpecDir, 'model.spec.ts')
}

async function initGit(options) {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
}


export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = path.resolve(__dirname, '..', 'templates', options.template.toLowerCase());
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Failed to read from template source directory', chalk.red.bold('ERROR'), chalk.red.bold(err));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Initialize git',
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: 'Install dependencies',
      task: () =>
          projectInstall({
            cwd: options.targetDirectory,
          }),
      skip: () =>
          !options.runInstall
              ? 'Pass --install to automatically install dependencies'
              : undefined,
    },
  ]);

  await tasks.run();
  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}

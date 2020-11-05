import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
      {
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        '--name': String,
        '--aggregateType': String,
        '-g': '--git',
        '-y': '--yes',
        '-i': '--install',
      },
      {
        argv: rawArgs.slice(2),
      }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    projectName: args['--name'] || '',
    aggregateType: args['--aggregateType'] || '',
    runInstall: args['--install'] || false
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'typescript';
  console.dir(options)
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['typescript'],
      default: defaultTemplate,
    });
  }

  if (!options.projectName) {
    questions.push({
      type: 'string',
      name: 'projectName',
      message: 'Choose a project name',
      default: 'project_name',
    });
  }

  if (!options.aggregateType) {
    questions.push({
      type: 'string',
      name: 'aggregateType',
      message: 'Choose an aggregate name',
      default: 'Game',
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    projectName: options.projectName || answers.projectName,
    aggregateType: options.aggregateType || answers.aggregateType,
    aggregateTypeSlug: options.aggregateType.toLowerCase() || answers.aggregateType.toLowerCase(),
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}

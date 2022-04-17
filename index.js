/**
 * create-warp-workflow
 #!/usr/bin/env node
 * Create workflows for the Warp terminal
 *
 * @author Brian Penner <https://www.planetnine.tech>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const prompts = require('prompts');
const YAML = require('yaml');
const { list } = require('prompts/dist/prompts');
const fs = require('fs');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	const questions = [
		{
			type: 'text',
			name: 'name',
			message: 'What is the name for the shortcut?'
		},
		{
			type: 'text',
			name: 'command',
			message: 'What is the command for this shortcut?',
			initial: prev => prev
		},
		{
			type: 'list',
			name: 'arguments',
			message: 'list all arguments separated by commas',
			separator: ','
		},
		{
			type: 'list',
			name: 'tags',
			message: 'Tags?'
		},
		{
			type: 'text',
			name: 'source_url',
			message: 'What is the source url of the shortcut?'
		},
		{
			type: 'text',
			name: 'author',
			message: 'Who is the author of the shortcut?'
		},
		{
			type: 'text',
			name: 'author_url',
			message: "What is the author's url?"
		},
		{
			type: 'multiselect',
			name: 'shells',
			message: 'Which shells does the script support?',
			choices: [
				{ title: 'zsh', value: 'zsh' },
				{ title: 'bash', value: 'bash' },
				{ title: 'fish', value: 'fish' }
			]
		}
	];

	const response = await prompts(questions);

	const argsArray = [];

	console.log('Argument details');

	for (const argName of response.arguments) {
		prompts.override({ name: argName });
		const arg = await prompts([
			{
				type: 'text',
				name: 'name',
				message: 'Argument Name',
				initial: argName
			},
			{
				type: 'text',
				name: 'description',
				message: `Argument "${argName}" description`
			},
			{
				type: 'text',
				name: 'default_value',
				message: `Default "${argName}" value`
			}
		]);
		argsArray.push(arg);
	}
	response.arguments = argsArray;
	// console.log(response)

	const fileQuestions = [
		{
			type: 'text',
			name: 'folder',
			message: 'Which folder do you want to put this workflow in?',
			initial: '~/.warp/workflows'
		},
		{
			type: 'text',
			name: 'fileName',
			message: 'What do you want to name the file?',
			initial: response.name
		}
	];
	const fileResponse = await prompts(fileQuestions);

	const yaml = YAML.stringify(response);
	console.log(yaml);

	await fs.writeFile(
		`${fileResponse.folder}/${fileResponse.fileName}.yaml`,
		yaml,
		function (err) {
			if (err) throw err;
			console.log('Saved workflow!');
		}
	);
	debug && log(flags);
})();

//   type: String | Function,
//   name: String | Function,
//   message: String | Function,

//   initial: String | Function | Async Function

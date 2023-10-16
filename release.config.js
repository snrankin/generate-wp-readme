/* eslint-disable no-template-curly-in-string */

const preset = 'conventionalcommits';

require('dotenv-vault').config();

console.log(process.env);

module.exports = {
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset,
				// presetConfig,
				// parserOpts: parserConfig,
				releaseRules: [
					{
						type: 'docs',
						scope: '*README*',
						release: 'patch',
					},
					{
						type: 'build',
						scope: 'deps',
						release: 'patch',
					},
					{
						type: 'docs',
						scope: '*readme*',
						release: 'patch',
					},
					{
						type: 'refactor',
						release: 'patch',
					},
					{
						type: 'chore',
						scope: 'release',
						release: false,
					},
					{
						scope: 'no-release',
						release: false,
					},
				],
			},
		],
		[
			'@semantic-release/release-notes-generator',
			{
				preset,
			},
		],
		'@semantic-release/changelog',
		[
			'@semantic-release/github',
			{
				successComment: ':bookmark: Version ${nextRelease.version} is now available on [GitHub release](<github_release_url>)',
				addReleases: 'top',
			},
		],
		'@semantic-release/npm',
	],
	branches: ['main'],
};

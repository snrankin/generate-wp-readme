/* eslint-disable no-template-curly-in-string */

const preset = 'conventionalcommits';

require('dotenv-vault').config();

console.log(process.env);

module.exports = {
	plugins: [
		'@semantic-release/commit-analyzer',
		[
			'@semantic-release/release-notes-generator',
			{
				preset,
			},
		],
		'@semantic-release/changelog',
		'@semantic-release/npm',
		[
			'@semantic-release/git',
			{
				assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}', //eslint-disable-line
			},
		],
		[
			'@semantic-release/github',
			{
				successComment: ':bookmark: Version ${nextRelease.version} is now available on [GitHub release](<github_release_url>)',
				addReleases: 'top',
			},
		],
	],
	branches: ['main'],
};

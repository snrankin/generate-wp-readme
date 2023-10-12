/* eslint-disable no-template-curly-in-string */

const preset = "conventionalcommits";

require("dotenv-vault").config();

console.log(process.env);

module.exports = {
	plugins: [
		[
			"@semantic-release/commit-analyzer",
			{
				preset,
				// presetConfig,
				// parserOpts: parserConfig,
				releaseRules: [
					{
						type: "docs",
						scope: "*README*",
						release: "patch",
					},
					{
						type: "build",
						scope: "deps",
						release: "patch",
					},
					{
						type: "docs",
						scope: "*readme*",
						release: "patch",
					},
					{
						type: "refactor",
						release: "patch",
					},
					{
						type: "chore",
						scope: "release",
						release: false,
					},
					{
						scope: "no-release",
						release: false,
					},
				],
			},
		],
		[
			"@google/semantic-release-replace-plugin",
			{
				replacements: [
					{
						files: ["hello-riester.php"],
						from: "Version: .*",
						to: "Version: ${nextRelease.version}", //eslint-disable-line
						results: [
							{
								file: "hello-riester.php",
								hasChanged: true,
								numMatches: 1,
								numReplacements: 1,
							},
						],
						countMatches: true,
					},
				],
			},
		],
		[
			"@semantic-release/release-notes-generator",
			{
				preset,
				// presetConfig,
				// parserOpts: parserConfig,
				// writerOpts: writerConfig,
			},
		],
		[
			"@semantic-release/changelog",
			{
				changelogFile: "CHANGELOG.md",
				changelogTitle: "# Hello RIESTER Changelog\n---",
			},
		],
		[
			"@semantic-release/exec",
			{
				prepareCmd: "npm run changelog",
			},
		],
		[
			"@semantic-release/npm",
			{
				npmPublish: false,
			},
		],
		[
			"@semantic-release/exec",
			{
				prepareCmd: "npm run readme",
			},
		],
		[
			"@semantic-release/exec",
			{
				prepareCmd: "npm run start-backup",
			},
		],
		[
			"@semantic-release/exec",
			{
				prepareCmd: "npm run archive",
			},
		],
		[
			"@semantic-release/git",
			{
				assets: [
					"package/hello-riester.zip",
					"CHANGELOG.md",
					"package.json",
					"package-lock.json",
					"hello-riester.php",
					"readme.txt",
					"README.md",
					"languages/hello-riester.pot",
				],
				message: "chore(release): ${nextRelease.version} [skip ci]", //eslint-disable-line
			},
		],
	],
	branches: ["main"],
};

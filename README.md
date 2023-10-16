<br/>
<p align="center">

  <h3 align="center">WordPress Plugin ReadME Generator</h3>

  <p align="center">
    Generates a conventional changelog, WordPress readme.txt and README.md from custom templates
    <br/>
    <br/>
    <a href="https://github.com/snrankin/generate-wp-readme">View Demo</a>
    .
    <a href="https://github.com/snrankin/generate-wp-readme/issues">Report Bug</a>
    .
    <a href="https://github.com/snrankin/generate-wp-readme/issues">Request Feature</a>
  </p>
</p>

![Downloads](https://img.shields.io/github/downloads/snrankin/generate-wp-readme/total) ![Contributors](https://img.shields.io/github/contributors/snrankin/generate-wp-readme?color=dark-green) ![Issues](https://img.shields.io/github/issues/snrankin/generate-wp-readme) ![License](https://img.shields.io/github/license/snrankin/generate-wp-readme)

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

![Screen Shot](images/screenshot.png)

I wanted an easy way to keep the WordPress `readme.txt` in sync with information from git. This CLI tool generates a conventionalcommit changelog file, a readme.txt file, and a README.md file. Enjoy!

## Built With

Typescript

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* npm

```sh
npm install npm@latest -g
```

### Installation

To install and set up the library, run:

```sh
$ npm install -S @snrankin/generate-wp-readme
```

Or if you prefer using Yarn:

```sh
$ yarn add -D @snrankin/generate-wp-readme
```

## Usage

Once installed via npm or yarn, simply run `generate-wp-readme` in your plugin folder and you're good to go! Make sure you have a `{plugin}.php`, a `package.json` and a template file

### Flags/Options

#### Version
Output the version number
```sh
$ generate-wp-readme -v
```

#### Output File
The output file name relative to the `cwd`. Defaults to `readme.txt`.

```sh
$ generate-wp-readme -o <filename>
```
#### Changelog File
The changelog file name relative to the `cwd`. Defaults to `CHANGELOG.md`

```sh
$ generate-wp-readme -c <filename>
```
#### Main PHP File
**Needs to exist prior to command execution**

The main php file name relative to the `cwd`. Defaults to `{process.cdw()}.php`

```sh
$ generate-wp-readme -m <filename>
```
#### Template File
**Needs to exist prior to command execution**

The template file name relative to the `cwd`. Can be any text file. Defaults to `.readme-template`

```sh
$ generate-wp-readme -t <filename>
```
#### Screenshots Directory
**Needs to exist prior to command execution**

The screenshots directory relative to the `cwd`. Defaults to `assets` as per the WordPress plugin standard

```sh
$ generate-wp-readme -s <directory>
```
#### Changelog Length
Specify the number of versions to display before truncating the changelog.

```sh
$ generate-wp-readme -l <number>
```
#### Conventional Commit Preset

Specify a conventional commits preset.

* angular
* atom
* codemirror
* conventionalcommits (default)
* ember
* eslint
* express
* jquery
* jshint

```sh
$ generate-wp-readme -p <preset>
```
### Merge Codes


| Merge Code | Description | Field | Source │
| --- | --- | --- | --- |
| `{{__PLUGIN_NAME__}}` | The name of the plugin | Plugin Name: | --main-file │
| `{{__PLUGIN_SLUG__}}` | Taken from the current working folder | | process.cwd() │
| `{{__PLUGIN_URI__}}` | The plugin homepage | Plugin URI:| --main-file   │
| `{{__PLUGIN_DESCRIPTION__}}`| Plugin Description | Description: | --main-file   │
| `{{__PLUGIN_VERSION__}}` | The current project version. | version:| --package-file│
| `{{__PLUGIN_LICENSE__}}` | The project's license.| License:| --main-file   │
| `{{__PLUGIN_LICENSE_URI__}}` | The URI to the project's license. | License URI:       | --main-file   │
| `{{__PLUGIN_MIN_WP__}}` | The minimum required WordPress core version.| Requires at least: | --main-file   │
| `{{__PLUGIN_MIN_PHP__}}` | The minimum required PHP version.| Requires PHP: | --main-file │
| `{{__PLUGIN_TESTED_WP__}}` | The latest WordPress core version the plugin has been tested against. | Tested up to:| --main-file │
| `{{__PLUGIN_DONATE__}}` | The plugin donation link.| funding:| --package-file │
| `{{__PLUGIN_CONTRIBUTORS__}}` | The plugin contributors (including author)| author:, contributors: | --package-file │
| `{{__PLUGIN_TAGS__}}` | The plugin tags | keywords:| --package-file │
| `{{__PLUGIN_CHANGELOG_URI__}}` | A link to the full project changelog.| | --changelog-file │
| `{{__PLUGIN_CHANGELOG__}}` | The most recent changelog entries. | | --changelog-file │

## Roadmap

See the [open issues](https://github.com/snrankin/generate-wp-readme/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/snrankin/generate-wp-readme/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/snrankin/generate-wp-readme/blob/main/LICENSE.md) for more information.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/snrankin/generate-wp-readme/tags).

## Authors

* **Sam Rankin** - [@snrankin](https://github.com/snrankin/) - *Initial Work*

## Acknowledgements

* [ImgShields](https://shields.io/)

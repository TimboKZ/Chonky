// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const branchName = process.env.GIT_BRANCH_NAME || process.env.GIT_BRANCH_NAME_OVERRIDE;
if (!branchName) throw new Error('`GIT_BRANCH_NAME` environment variable is not set.');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Chonky',
  tagline: 'A File Browser for React',
  url: 'https://chonky.io/',
  baseUrl: `/docs/${branchName}/`,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://chonky.io/chonky-static/chonky-sphere-v3.png',
  organizationName: 'TimboKZ',
  projectName: 'Chonky',

  themes: ['@docusaurus/theme-live-codeblock'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: `https://github.com/TimboKZ/Chonky/tree/${branchName}/websites/chonky-docs/docs`,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'github_issue',
        content:
          'Chonky 3.x is still under development, please <a target="_blank" rel="noopener noreferrer" ' +
          'href="https://github.com/TimboKZ/Chonky/issues">create an issue on GitHub</a> if you run into bugs or see ' +
          'errors in documentation.',
        backgroundColor: '#fafbfc',
        textColor: '#091E42',
        isCloseable: false,
      },
      colorMode: {
        disableSwitch: true,
      },
      navbar: {
        title: 'Chonky',
        logo: {
          alt: 'Chonky: A File Browser for React',
          src: 'https://chonky.io/chonky-static/chonky-sphere-v3.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: '3.x Docs',
          },
          {
            href: `https://chonky.io/storybook/${branchName}/`,
            label: '3.x Storybook',
            position: 'left',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/TimboKZ/Chonky',
            label: 'GitHub Repo',
            position: 'right',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        logo: {
          alt: 'Chonky v3 Logo',
          src: 'https://chonky.io/chonky-static/chonky-logo-v3.png',
          width: 200,
          height: 66,
        },
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
              {
                label: '3.x Storybook',
                href: `https://chonky.io/storybook/${branchName}/`,
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/4HJaFn9',
              },
              {
                label: 'GitHub Issues',
                href: 'https://github.com/TimboKZ/Chonky/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub Repo',
                href: 'https://github.com/TimboKZ/Chonky',
              },
            ],
          },
        ],
        copyright: `Copyright © 2020-${new Date().getFullYear()} Tim Kuzhagaliyev. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

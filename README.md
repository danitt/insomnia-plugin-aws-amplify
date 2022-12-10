# Insomnia Plugin - AWS Amplify

[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/danitt)

[Insomnia](https://insomnia.rest) plugin for signing in via AWS Amplify.

Inspired by [insomnia-plugin-aws-amplify-auth](https://github.com/mbise1993/insomnia-plugin-aws-amplify-auth), with the following enhancements added:

- plugin dependencies are now bundled, and no longer crashes on install when react-native is not globally available
- authentication returns JWT access token, as opposed to generated cookies
- flexible token caching expiry options added
- customisable return properties

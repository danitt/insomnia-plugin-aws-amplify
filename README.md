# Insomnia Plugin - AWS Amplify

[Insomnia](https://insomnia.rest) plugin for signing in via AWS Amplify.

Inspired by [insomnia-plugin-aws-amplify-auth](https://github.com/mbise1993/insomnia-plugin-aws-amplify-auth), with the following enhancements added:

- plugin dependencies are now bundled, and no longer crashes on install when react-native is not globally available
- authentication returns JWT access token, as opposed to generated cookies
- flexible token caching expiry options added

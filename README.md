# Insomnia Plugin - AWS Amplify

[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/danitt)

[Insomnia](https://insomnia.rest) plugin for signing in via AWS Amplify

**Key Features**

- Environment configuration GUI to input Amplify credentials.
- Automatic token caching and flexible expiry options.
- Customisable return properties (Access Token, ID Token, User ID, Auth ID).
- Multiple user pool support across environments.
- Two authentication methods: AWS Amplify with USER_SRP_AUTH or Cognito Identity Provider with ADMIN_USER_PASSWORD_AUTH

## Installation

1. Open Insomnia and go to plugin settings.
2. Add `insomnia-plugin-aws-amplify`.

## Usage

### AWS Amplify Provider (Default)

Uses client-side authentication flow. No AWS credentials required.

**Required fields:**

- username
- password
- region (e.g., `us-east-1`)
- userPoolId (e.g., `us-east-1_XXXXXXXXX`)
- clientId

### Cognito Identity Provider

Uses server-side AdminInitiateAuth flow. Retrieves AWS credentials from your local AWS CLI configuration.

**Required fields:**

- username
- password
- region (e.g., `us-east-1`)
- userPoolId (e.g., `us-east-1_XXXXXXXXX`)
- clientId
- **awsProfile**: AWS profile name (e.g., `staging`) - only shown when "Cognito Identity Provider" is selected

**Notes**:

- The plugin uses the AWS CLI to retrieve credentials, so you must have:
  1. AWS CLI installed and configured
  2. Valid SSO session (run `aws sso login --profile <profile-name>`)
- Your AWS profile/role must have permission to call `cognito-idp:AdminInitiateAuth`:

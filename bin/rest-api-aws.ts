#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {RestApiAwsStack} from '../lib/rest-api-aws-stack';

const app = new cdk.App();
const region = "us-east-1";
const account = "694301969346";
new RestApiAwsStack(app, 'RestApiAwsStack', {env: {region: region, account: account}});

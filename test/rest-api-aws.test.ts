import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as RestApiAws from '../lib/rest-api-aws-stack';

test('SQS Queue and SNS Topic Created', () => {
  const app = new cdk.App();
});

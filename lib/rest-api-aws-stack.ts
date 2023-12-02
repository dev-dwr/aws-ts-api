import {aws_dynamodb, aws_apigateway, aws_lambda_nodejs, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {createBlogPostHandler} from "./lambdas/blog-post-handler";

export class RestApiAwsStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const api = new aws_apigateway.RestApi(this, "blogPostApi")
        const table = new aws_dynamodb.Table(this, "blogPostTable", {
            tableName: "blogPostTable",
            partitionKey: {name: "id", type: aws_dynamodb.AttributeType.STRING},
        })
        const createBlogPostLambdaName = "createBlogPostHandler";
        const createBlogPostLambda = new aws_lambda_nodejs.NodejsFunction(this,
            createBlogPostLambdaName,
            {
                entry: "lib/lambdas/blog-post-handler.ts",
                handler: createBlogPostLambdaName,
                functionName: createBlogPostLambdaName,
                environment: {
                    TABLE_NAME: table.tableName
                }
            }
        )
        table.grantWriteData(createBlogPostLambda)

        const getBlogPostsLambdaName = "getBlogPostsHandler";
        const getBlogPostsLambda = new aws_lambda_nodejs.NodejsFunction(this,
            getBlogPostsLambdaName,
            {
                entry: "lib/lambdas/blog-post-handler.ts",
                handler: getBlogPostsLambdaName,
                functionName: getBlogPostsLambdaName,
                environment: {
                    TABLE_NAME: table.tableName
                }
            }
        );
        table.grantReadData(getBlogPostsLambda)

        const getBlogPostLambdaName = "getBlogPostHandler";
        const getBlogPostLambda = new aws_lambda_nodejs.NodejsFunction(this,
            getBlogPostLambdaName,
            {
                entry: "lib/lambdas/blog-post-handler.ts",
                handler: getBlogPostLambdaName,
                functionName: getBlogPostLambdaName,
                environment: {
                    TABLE_NAME: table.tableName
                }
            }
        );
        table.grantReadData(getBlogPostLambda)

        const deleteBlogPostLambdaName = "deleteBlogPostHandler";
        const deleteBlogPostLambda = new aws_lambda_nodejs.NodejsFunction(this,
            deleteBlogPostLambdaName,
            {
                entry: "lib/lambdas/blog-post-handler.ts",
                handler: deleteBlogPostLambdaName,
                functionName: deleteBlogPostLambdaName,
                environment: {
                    TABLE_NAME: table.tableName
                }
            }
        );
        table.grantWriteData(deleteBlogPostLambda)


        const blogPostPath = api.root.addResource("blogposts")
        // POST https://mydomain.com/blogposts
        blogPostPath.addMethod("POST", new aws_apigateway.LambdaIntegration(createBlogPostLambda))

        // GET https://mydomain.com/blogposts
        blogPostPath.addMethod("GET", new aws_apigateway.LambdaIntegration(getBlogPostsLambda),
            {
                requestParameters: {
                    "method.request.querystring.order": false
                }
            })

        // GET https://mydomain.com/blogposts/{id}
        const blogPostByIdPath = blogPostPath.addResource("{id}")
        blogPostByIdPath.addMethod("GET", new aws_apigateway.LambdaIntegration(getBlogPostLambda))

        // DELETE https://mydomain.com/blogposts/{id}
        blogPostByIdPath.addMethod("DELETE", new aws_apigateway.LambdaIntegration(deleteBlogPostLambda))
    }
}

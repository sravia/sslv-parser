serverless deploy serverless config credentials --provider aws --key XX --secret XX

root config.json:
{
"accessKeyId": "",
"secretAccessKey": "",
"region": "eu-west-2"
}

LOCAL DYNAMODB:

* java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
* dynamodb-admin

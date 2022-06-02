```serverless config credentials --provider aws --key XX --secret XX```

root/src/config.json:
```
{
    "accessKeyId": "",
    "secretAccessKey": "",
    "region": "eu-west-2",
    "webhooks": {
        "cars": "slack channel webhook"
    }
}
```
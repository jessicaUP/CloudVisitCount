# VISITOR COUNTER

[Live Link](https://z8fvetydvg.execute-api.us-east-1.amazonaws.com/stage/)

## SUMMARY

This application uses Pulumi to manage AWS cloud infrastructure.

#### AWS SERVICES:

* Backend:
  * DynamoDB
  * APIGateway
  * Lambda
* Frontend:
  * HTML
  * CSS

#### PULUMI LIBRARIES:

* @pulumi/aws
* @pulumi/awsx

### DYNAMODB

* Data Storage for the visitor count
| id            | count         |
| ------------- | ------------- |
| count         | 19            |

```typescript
let countTable = new aws.dynamodb.Table("countTable", {
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
});
```

### API GATEWAY

* REST api - handles request/response

```typescript
let endpoint = new awsx.apigateway.API("endpoint", {
  routes: [{
    path: "",
    method: "GET",
    ...
```

### LAMBDA

* Event driven
  * Allows me to run code when needed

```typescript
eventHandler: async (event) => {
      // CREATE client for DynamoDB
      let client = new aws.sdk.DynamoDB.DocumentClient();

      // GET current count data
      let countData = await client.get({
        TableName: countTable.name.get(),
        Key: { id: "count" },
        ConsistentRead: true,
      }).promise();
      ...
```

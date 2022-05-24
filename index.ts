import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";


// CREATE DynamoDB Table
let countTable = new aws.dynamodb.Table("countTable", {
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
});

// CREATE REST API endpoint
let endpoint = new awsx.apigateway.API("endpoint", {
  routes: [{
    path: "",
    method: "GET",
    eventHandler: async (event) => {
      // CREATE client for DynamoDB
      let client = new aws.sdk.DynamoDB.DocumentClient();

      // GET current count data
      let countData = await client.get({
        TableName: countTable.name.get(),
        Key: { id: "count" },
        ConsistentRead: true,
      }).promise();

      // UPDATE count
      let value = countData.Item;
      let count = (value && value.count) || 0;
      count++;

      // UPDATE database asynchronously
      client.put({
        TableName: countTable.name.get(),
        Item: { id: "count", count: count },
      }).promise();
      
      // CREATE html for body
      const html = `<!DOCTYPE html><html lang="en"><head><title>Visit Counter</title><meta charset="UTF-8"></head><body><div style="display:flex;position:absolute;background-color:black;top:0;right:0;bottom:0;left:0;align-items:flex-end;justify-content:right;"><p style="font-family:Helvetica,sans-serif;font-size:70vh;color:white;margin:0 5vh 0 0;">${count}</p></div></body></html>`

      // RETURN html
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: html

      };
    },
  }],
});

exports.endpoint = endpoint.url;

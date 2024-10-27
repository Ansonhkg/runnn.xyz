Below is the comprehensive JSON schema for the enhanced BullMQ system, incorporating all the components we discussed, including start conditions, actions (with support for webhooks and JavaScript code execution), end conditions, and payload (allowing arbitrary JavaScript code with parameters).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Enhanced BullMQ System - User Request Schema",
  "description": "Schema for user-submitted requests to start event listeners, define actions, and specify end conditions for BullMQ system.",
  "type": "object",
  "properties": {
    "start": {
      "type": "object",
      "description": "Conditions under which the listener should start.",
      "properties": {
        "type": {
          "type": "string",
          "description": "The type of start trigger. Could be 'time', 'event', or 'smartContract'.",
          "enum": ["time", "event", "smartContract"]
        },
        "time": {
          "type": "object",
          "description": "Time-based start condition.",
          "properties": {
            "startDate": {
              "type": "string",
              "format": "date-time",
              "description": "ISO date string indicating when to start the listener."
            }
          },
          "required": ["startDate"]
        },
        "event": {
          "type": "object",
          "description": "Event-based start condition.",
          "properties": {
            "contractAddress": {
              "type": "string",
              "description": "The address of the smart contract."
            },
            "eventName": {
              "type": "string",
              "description": "The name of the event to listen to."
            },
            "filters": {
              "type": "object",
              "description": "Optional filters for the event, such as filtering by 'from' or 'to' address in a Transfer event."
            }
          },
          "required": ["contractAddress", "eventName"]
        }
      },
      "oneOf": [
        { "$ref": "#/properties/start/properties/time" },
        { "$ref": "#/properties/start/properties/event" }
      ]
    },
    "action": {
      "type": "object",
      "description": "The action to take when the conditions are met.",
      "properties": {
        "type": {
          "type": "string",
          "description": "The type of action. Could be 'sendNotification', 'executeCode', 'apiCall', or 'webhook'.",
          "enum": ["sendNotification", "executeCode", "apiCall", "webhook"]
        },
        "details": {
          "type": "object",
          "description": "Additional details for the action based on its type.",
          "properties": {
            "message": {
              "type": "string",
              "description": "The message to send (if action is sendNotification)."
            },
            "url": {
              "type": "string",
              "description": "The URL to call (if action is apiCall or webhook)."
            },
            "method": {
              "type": "string",
              "description": "The HTTP method for the webhook or API call.",
              "enum": ["POST", "GET", "PUT", "DELETE"]
            }
          },
          "required": []
        }
      },
      "required": ["type"]
    },
    "end": {
      "type": "object",
      "description": "Conditions under which the listener should stop.",
      "properties": {
        "type": {
          "type": "string",
          "description": "The type of end condition. Could be 'maxExecutions', 'timeLimit', or 'customCondition'.",
          "enum": ["maxExecutions", "timeLimit", "customCondition"]
        },
        "maxExecutions": {
          "type": "integer",
          "description": "The maximum number of executions before stopping."
        },
        "timeLimit": {
          "type": "object",
          "description": "End the listener after a specific time period.",
          "properties": {
            "endDate": {
              "type": "string",
              "format": "date-time",
              "description": "The date and time after which the listener should stop."
            }
          },
          "required": ["endDate"]
        },
        "customCondition": {
          "type": "object",
          "description": "A custom condition for ending the listener.",
          "properties": {
            "comparisonOperator": {
              "type": "string",
              "enum": ["<", "<=", ">", ">=", "==", "!="],
              "description": "Comparison operator for custom condition."
            },
            "comparisonValue": {
              "type": "string",
              "description": "The value to compare against."
            }
          },
          "required": ["comparisonOperator", "comparisonValue"]
        }
      },
      "oneOf": [
        { "$ref": "#/properties/end/properties/maxExecutions" },
        { "$ref": "#/properties/end/properties/timeLimit" },
        { "$ref": "#/properties/end/properties/customCondition" }
      ]
    },
    "payload": {
      "type": "object",
      "description": "Arbitrary JavaScript code and its parameters to be executed.",
      "properties": {
        "code": {
          "type": "string",
          "description": "A string containing arbitrary JavaScript code."
        },
        "parameters": {
          "type": "array",
          "description": "An array of parameter names to be used in the JavaScript code.",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["code", "parameters"]
    }
  },
  "required": ["start", "action", "end", "payload"]
}
```

# Example of a User Request Based on the Schema

Here’s an example of a complete request using the schema. This request listens for a Transfer event on an Ethereum smart contract, executes JavaScript code when the event occurs, and stops after 5 executions:

```json
{
  "start": {
    "type": "smartContract",
    "contractAddress": "0xYourSmartContractAddress",
    "eventName": "Transfer",
    "filters": {
      "from": "0xSpecificAddress"
    }
  },
  "action": {
    "type": "executeCode",
    "details": {}
  },
  "end": {
    "type": "maxExecutions",
    "maxExecutions": 5
  },
  "payload": {
    "code": "return parameters.amount > 1000;",
    "parameters": ["amount"]
  }
}
```

# Example of a Webhook Request

Here’s an example request that triggers a webhook when a smart contract event occurs and stops after a specified time limit:

```json
{
  "start": {
    "type": "smartContract",
    "contractAddress": "0xAnotherSmartContractAddress",
    "eventName": "Approval",
    "filters": {
      "owner": "0xOwnerAddress"
    }
  },
  "action": {
    "type": "webhook",
    "details": {
      "url": "https://example.com/webhook",
      "method": "POST",
      "message": "Approval event detected"
    }
  },
  "end": {
    "type": "timeLimit",
    "timeLimit": {
      "endDate": "2024-12-31T23:59:59Z"
    }
  },
  "payload": {
    "code": "return true;",
    "parameters": []
  }
}
```

# Core funtionalities

# System queue

```ts
type SystemQueue = {
  litActions: LitAction{},
}
```

# System logs

```ts
type SystemLogs = {
  taskId: string;
  logMessage: string;
  timestamp: number;
  error?: Error;
}[];
```

# System Clients

```ts
type SystemClients = {
  litNodeClient: LitNodeClient;
  litContracts: LitContracts;
};
```

# System Worker

```ts
type SystemWorker = {
  signer: ethers.Singer;
};
```

# Conditions

## Unified Condition

```ts
type UnifiedCondition =
  | (BasicCondition & { type: "basic" })
  | IntervalCondition
  | (EventCondition & { type: "event" })
  | (WebhookCondition & { type: "webhook" });
```

## Basic Condition

```ts
type BasicCondition = {
  startDate: string;
  endDate: string;
  maxExecution: number;
  minExecution: number;
  condition: "==" | "!=" | "<=" | ">=" | "<" | ">";
  value: any;
};
```

## Interval Condition

```ts
type IntervalCondition = {
  type: "interval";
  interval: number;
};
```

## Contract condition

```ts
type EventCondition = {
  eventName: string;
};
```

## Webhook condition

```ts
type WebhookCondition = {
  url: string;
};
```

# Task

```ts
type LitActionTask = BasicCondition & {
  ipfsId: string;
  jsParams: {
    [key: string]: any;
    pkpPublicKey?: `0x${string}` | string;
  };
  conditions: Condition[];
};
```

### `push-telegram-notification`

A sample microservice demonstrating how to automate Telegram notifications using **AWS SNS**, **AWS Lambda**, and the **Telegram Bot API**.

#### Workflow

```text
Application
    │
    ▼
AWS SNS Topic
    │
    ▼
AWS Lambda
    │
    ▼
Telegram Bot API
    │
    ▼
Telegram Chat
```

#### What You'll Learn

- Publishing messages to an AWS SNS topic
- Triggering an AWS Lambda function from SNS
- Integrating Lambda with the Telegram Bot API
- Automating notifications using an event-driven architecture
- Managing secrets (Telegram Bot Token and Chat ID) securely with AWS Secrets Manager or environment variables

#### Use Cases

- Deployment notifications
- Order status updates
- System alerts
- Monitoring and health check notifications
- CI/CD pipeline events
- Custom application events
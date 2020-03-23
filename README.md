# Multi contanainer Fibonnaci Calculator

This is an overcomplicated Fibonnaci Calculator web app. 

The calculator has two modes:

### Index Calculator
Calculates the fibonnaci sequence value for the given index:

![index](images/index-calculator.png)

### Sequence Generator
Generates fibonnaci sequence with the defined number of elements:

![sequence](images/sequence-generator.png)

## Architecture
This web app is composed by the following containers:

- **client:** react app where are displayed the results of the calculations.
- **server:** a node.js server with a exposed REST API that handles the requests from the frontend, loading the already calculated
data or submiting new indexes into redis to be calculated by the worker. Inserts all the submited indexes into a Postgres database
- **worker:** subscribes on redis and calculates the fibonnaci values for the submited indexes.
- **nginx:** does the routing between the various modules of this project
- **postgres:** database where is stored all the "seen" indexes (indexes that were already submited).
- **redis:** stores all the temporary data need by the worker to calculate and publish the fibonnaci values.

**Note:** On the AWS enviroment, we don't use containers for postgres and redis. Postgres is RDS instance and Redis is created on ElastiCache

## CI/CD

The goal of this project was to setup an CI/CD workflow of a multiple container application:
1. Run Dev version of the app locally with docker-compose with hot reload feature inside the containers
2. Build and test app with travis-ci on merge/commit to master
3. If successful, deploy to AWS Elastic Beanstalk

Inspired by: https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide

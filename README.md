## Introduction
You are required to provide the code for an application that simulates a set of traffic lights at an intersection.

The traffic lights are designated (N, S) and (E, W) like a compass.

## Requirements
When switching from green to red, the yellow light must be displayed for 30 seconds prior to it switching to red. The lights will change automatically every 5 minutes.

You're not required to optimize the solution, just focus on a functional approach to requirements.

Provide the output for the light changes which occur during a given thirty minute period. You must provide unit tests for all logic.
Create a repo on bitbucket/github and provide the link as well as instructions on how to run.

## Assumes

*  For one intersection, we have two lights. They are light(N, S) and light(E, W).

* The lights are changing in this loop as these colors and durations:

	 ...-> Red (300s) -> Green () -> Yellow (0.5mins) -> Red (5mins) -> ...


* The two lights are orthogonal, which means when Light(N, S) begin to turn from Red to Green, the light(E, W) should begin to turn from Green to Red.

## How to run
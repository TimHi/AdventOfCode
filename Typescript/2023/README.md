# 2023

## Installation

Node is required, e.g through [nvm](https://github.com/nvm-sh/nvm).  
After cloning the repository run `npm i`.

## Starting

Running a day can be done by opening the file `${day}.ts` and pressing `F5`.

This requires a `.vscode/launch.json` and a `.vscode/tasks.json` to be preset. 

Sample `.vscode/launch.json`:

```JSON
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug",
            "type": "node",
            "request": "launch",
            "preLaunchTask": "Compile",
            // Debug current file in VSCode
            "program": "${workspaceFolder}/src/main.ts",
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            // Files to exclude from debugger (e.g. call stack)
            "skipFiles": [
                // Node.js internal core modules
                "<node_internals>/**",
                // Ignore all dependencies (optional)
                "${workspaceFolder}/node_modules/**",
            ],
        }
    ]
}
```

Sample `.vscode/tasks.json`:

```JSON
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Compile",
            "type": "npm",
            "script": "build",
            "problemMatcher": []
        }
    ]
}
```

Also see the package.json for further scripts. (Lint, Test, Fix-Lint)...

## Generating new days

To make the process of starting a new puzzle easier I've added an generator.

```bash
node generator.js 01
```

will generate all the needed files plus a unit test for the first day.

## Input Data

Copy your data into the generated files.

# 2023

## Installation

Node is required, e.g through [nvm](https://github.com/nvm-sh/nvm).  
After cloning the repository run `pnpm i`. After this you're done.

## Running

Running a day can be done by opening the file `${day}.ts` and pressing `F5`.

This requires a `.vscode/launch.json` to be preset. Here is a sample one:

```JSON
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug current file",
      "skipFiles": ["<node_internals>/**"],
      "program": "${file}",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "console": "integratedTerminal",
      "outFiles": ["${workspaceFolder}/dist/*.js"]
    }
  ]
}
```

Also see the package.json for further options. (Lint, Test, Fix-Lint)...

## Generating new days

To make the process of starting a new puzzle easier I've added an generator. 

```bash
node generator.js 01
``` 

will generate all the needed files and a unit test for the first day.

## Input Data

TBD
![MSUS Solution Accelerator](./images/MSUS%20Solution%20Accelerator%20Banner%20Two_981.png)

# AI Powered Call Center Intelligence Accelerator

The AI Powered Call Center Intelligence Accelerator drives huge cost saving in call center operations while improving call center efficiency & customer satisfaction.

It improves the manager, call center agent, and customer experience in real-time scenarios by supporting guidance into next-best action, next-best offer, cross-sell, and up-sell as well as enabling a more personalized and efficient experience.
Delivers deeper business insights for managers and enables them to evaluate call center performance far more efficiently and effectively in batch scenarios.  

This is a sample solution for Call Center Intelligence powered by Azure AI. It shows how Azure AI services could be used both in real-time and batch scenarios for an Intelligent Contact Center.

The diagram below depicts key components and Azure services used in this sample solution.

<img src="common/images/highleveloverview.PNG" align="center" />

## Contents

Outline the file contents of the repository. It helps users navigate the codebase, build configuration and any related assets.

| Folder                              | Description                                |
|-------------------|--------------------------------------------|
| [azure-custom-speech](azure-custom-speech)              | Sample data and instructions to create custom transcription model using Azure Speech service (Step 1 in above diagram). This step produces a sample custom speech model. This step also enables speech logging to capture real-time call audio.                  |
| [azure-speech-streaming-reactjs](azure-speech-streaming-reactjs)    | Java Script applications that simulates real-time call intelligence (Step 2 in above diagram). This application also captures audio conversation that could be used in the next step for batch call analytics.             |
| [call-batch-analytics](call-batch-analytics)      | ARM template file and deployment guide for performing ingestion & batch analytics of calls using various Azure AI services (Step 3 in above diagram). This part of the solution can be used either with data output from step 2 OR using sample call recordings (if you have that).   |
| [powerbi](powerbi)                  | Template files and deployment guide for visualizing call insights using Power BI (Step 4 in above diagram).      |


## Prerequisites

* An existing [Azure Account](https://azure.microsoft.com/free/)
* Ensure you have [Node.js](https://nodejs.org/en/download/) installed. Required for `Step 2` only.
* Ensure you have [Power BI](https://powerbi.microsoft.com/en-us/downloads/) installed. Required for `Step 4` only.


## Dependencies

This solution is modular and some part of the solution can be used independently and some components depends on other steps to be completed. In summary, real-time and batch call analytics can be used independently. Below is a list of dependencies:
* Step 2 depends on Step 1 to be completed. Custom Speech model created in Step 1 is used in Step 2. Step 2 can be used without step 1 with minor code modifications (for advanced users only).
* Step 3 and Step 4 can be used independently, if you have sample call recordings. If you don't have sample call recordings, then use Step 2 to simulate business conversations and capture the recording that you could use in this step.

## Getting started

Follow the individual instructions for each step of the solution provided within above `Folders`.

## License

Copyright (c) Microsoft Corporation

All rights reserved.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.

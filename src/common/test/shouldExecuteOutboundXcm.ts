const { exec } = require("child_process");

const shouldExecuteOutboundXcm = async (command): Promise<{ type: any, result: any }> => {
  return new Promise(async resolve => {
    exec(command, async (error, stdout, stderr) => {
        if (stdout) {
          console.log(stdout)
          resolve({type: 'outbound', result: stdout })
        }
    });
  })
}

export default shouldExecuteOutboundXcm
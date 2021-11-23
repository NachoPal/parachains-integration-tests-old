const { exec } = require("child_process");

const initChain = async (command) => {
  return new Promise(async resolve => {
    exec(command, async (error, stdout, stderr) => {
        if (stdout) {
          resolve(true)
        }
    });
  })
}

export const beforeInitChains = (sudo) => {
  return(
    before(async function() {
      await Promise.all([
        initChain(`yarn dev:init-chains -c relay -i ${this.paraId} -u ${sudo} -v 2`),
        initChain(`yarn dev:init-chains -c para -i ${this.paraId} -u ${sudo} -v 2`)
      ])
    })
  )
}

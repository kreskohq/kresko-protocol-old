import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const celoRegistry = await deploy('CeloRegistry', {
    from: deployer,
    log: true,
  });

  const decimalMath = await deploy('DecimalMath', {
    from: deployer,
    log: true,
  });

  await deploy('Kresko', {
    from: deployer,
    log: true,
    libraries: {
      CeloRegistry: celoRegistry.address,
      DecimalMath: decimalMath.address,
    }
  });
};
export default func;
func.tags = ['Kresko']
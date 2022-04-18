import { IIssuerDefinition } from '@energyweb/credential-governance';
import { providers } from 'ethers';
import { RoleDefinitionResolverV2__factory } from '@energyweb/credential-governance/ethers/factories/RoleDefinitionResolverV2__factory';
import { RoleDefinitionResolverV2 } from '@energyweb/credential-governance/ethers/RoleDefinitionResolverV2';

/**
 * An interface for Resolution of issuers for a namespace
 */
export interface IssuerDefinitionResolver {
  /**
   * Fetches authorised issuers for the provided namespace
   * @param namespace
   * @returns IIssuerDefinition for the namespace
   */
  getIssuerDefinition(namespace: string): Promise<IIssuerDefinition>;
}

/**
 * Resolves an issuer definition by reading smart contract state via an Ethers provider
 */
export class EthersProviderIssuerDefinitionResolver
  implements IssuerDefinitionResolver
{
  private _roleDefResolver: RoleDefinitionResolverV2;

  constructor(provider: providers.Provider, roleDefResolverAddr: string) {
    this._roleDefResolver = RoleDefinitionResolverV2__factory.connect(
      roleDefResolverAddr,
      provider
    );
  }

  /**
   *
   * @param namespace
   * @returns issuers for the namespace from blockchain contract
   */
  async getIssuerDefinition(namespace: string): Promise<IIssuerDefinition> {
    const issuers: IIssuerDefinition = {};
    const result = await this._roleDefResolver.issuers(namespace);
    const type = await this._roleDefResolver.issuerType(namespace);
    if (result.dids.length > 0 || result.role.length > 0) {
      issuers.did = result.dids;
      issuers.roleName = result.role;
      //confirm the type representation TODO
      issuers.issuerType = type.toString();
    }
    return issuers;
  }
}

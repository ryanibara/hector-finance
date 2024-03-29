import {
  createContext,
  useState,
  useEffect,
  FC,
  useMemo,
  useContext,
} from "react";
import * as Eip1193 from "src/providerEip1193";
import { assertNever } from "src/util";
import * as WalletConnect from "src/providerWalletConnect";

/** A React Provider of an Ethereum Wallet Provider. Weird name, but it makes sense.
 *
 * The Ethereum Provider should be a singleton provided at the root level of the application
 * so that any changes to the provider reflect across the entire application.
 */
export const ProviderProvider: FC = ({ children }) => {
  const [provider, setProvider] = useState<Eip1193.WalletProvider>();
  const [address, setAddress] = useState<string>();
  const [chain, setChain] = useState<number>();

  useEffect(() => {
    setAddress(undefined);
    setChain(undefined);
    if (!provider) {
      return;
    }

    Eip1193.getAccount(provider).then((result) => {
      if (!result.isOk) {
        return;
      }
      setAddress(result.value[0]);
    });

    Eip1193.getChain(provider).then((result) => {
      if (!result.isOk) {
        return;
      }
      setChain(parseInt(result.value, 16));
    });

    const onChainChanged = (chainId: string) => {
      setChain(parseInt(chainId, 16));
    };

    const onAccountsChanged = (accounts: string[]) => {
      setAddress(accounts[0]);
    };

    provider.on("chainChanged", onChainChanged);
    provider.on("accountsChanged", onAccountsChanged);
    return () => {
      provider.removeListener("chainChanged", onChainChanged);
      provider.removeListener("accountsChanged", onAccountsChanged);
    };
  }, [provider]);

  useEffect(() => {
    (async () => {
      const preferredProtocol = getPreferredProtocol();
      switch (preferredProtocol) {
        case ProviderProtocol.Eip1193:
          Eip1193.getProvider().then(setProvider);
          break;
        case undefined:
          Eip1193.getProvider().then(setProvider);
          break;
        case ProviderProtocol.WalletConnect:
          WalletConnect.getProvider().then(setProvider);
          break;
        case ProviderProtocol.Disconnect:
          break;
        default:
          assertNever(preferredProtocol);
      }
    })();
  }, []);

  // Memoizing the context might not be necessary, but just in case...
  const context: ProviderContextProps = useMemo(
    () => ({ provider, address, chain, setProvider }),
    [provider, address, chain, setProvider],
  );

  return (
    <ProviderContext.Provider value={context}>
      {children}
    </ProviderContext.Provider>
  );
};

type ProviderContextProps = {
  provider?: Eip1193.WalletProvider;
  address?: string;
  chain?: number;
  setProvider: (provider: Eip1193.WalletProvider | undefined) => void;
};

const ProviderContext = createContext<ProviderContextProps | undefined>(
  undefined,
);

/** Get the current provider. */
export function useProvider(): ProviderContextProps {
  const providerContext = useContext(ProviderContext);
  if (!providerContext) {
    throw new Error("`useProvider` must be used within a `ProviderProvider`");
  }
  return providerContext;
}

export enum ProviderProtocol {
  Eip1193 = "EIP-1193",
  WalletConnect = "WalletConnect",
  Disconnect = "Disconnect",
}

function isProviderProtocol(protocol: string): protocol is ProviderProtocol {
  return Object.keys(ProviderProtocol).includes(protocol);
}

export function getPreferredProtocol(): ProviderProtocol | undefined {
  const protocol = localStorage.getItem("PREFERRED_PROTOCOL");
  if (typeof protocol !== "string" || !isProviderProtocol(protocol)) {
    return;
  }
  return protocol;
}

export function setPreferredProtocol(protocol: ProviderProtocol): void {
  localStorage.setItem("PREFERRED_PROTOCOL", protocol);
}

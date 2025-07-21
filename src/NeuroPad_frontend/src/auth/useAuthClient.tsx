import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState  } from "react";
import { HttpAgent, Actor } from "@dfinity/agent";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import {
  createActor,
  idlFactory,
} from "../../../declarations/NeuroPad_backend/index";
import { idlFactory as DaoFactory } from "../../../declarations/agent_canister/index";
import { useSelector } from "react-redux";

const AuthContext : any = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30,
      disableDefaultIdleCallback: true, 
    },
  },
  loginOptionsii: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
  },
  loginOptionsnfid: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
        : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
  },
  loginOptionsPlug: {
    whitelist: [process.env.CANISTER_ID_NEUROPAD_BACKEND], // Whitelist the backend canister

    host:
      process.env.DFX_NETWORK === "ic"
        ? "https://ic0.app"
        : "http://localhost:3000",
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] : any = useState(false);
  const [accountIdString, setAccountIdString] : any = useState("");
  const [stringPrincipal, setStringPrincipal] : any = useState(null);
  const [authClient, setAuthClient] : any = useState(null);
  const [identity, setIdentity]: any = useState(null);
  const [principal, setPrincipal]: any = useState(null);
  const [backendActor, setBackendActor]: any = useState(null);
  const [accountId, setAccountId]: any = useState(null);
  const [connected, setConnected]: any = useState(false);
  const {
    isWalletCreated,
    isWalletModalOpen,
    isSwitchingWallet,
    connectedWallet,
  } = useSelector((state : any) => state.utility);
  const windows = window as any;
  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client : any) => {
      setAuthClient(client);

      const savedPrincipal = localStorage.getItem("plugPrincipal");
      if (savedPrincipal) {
        try {
          const isPlugConnected = await windows.ic?.plug?.isConnected();
          if (isPlugConnected) {
            const plugPrincipal = await windows.ic.plug.agent.getPrincipal();

            setPrincipal(plugPrincipal.toString());
            setIsAuthenticated(true);


            const accountId : any = AccountIdentifier.fromPrincipal({
              principal: plugPrincipal,
            });
            setAccountId(toHexString(accountId.bytes));
            setAccountIdString(toHexString(accountId.bytes));

            const backendActor = await windows.ic.plug.createActor({
              canisterId: process.env.CANISTER_ID_NEUROPAD_BACKEND,
              interfaceFactory: idlFactory,
            });
            setBackendActor(backendActor);
          } else {
            localStorage.removeItem("plugPrincipal");
          }
        } catch (error) {
          console.error("Error reconnecting to Plug:", error);
        }
      }
    });
  }, []);

  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client : any) => {
      setAuthClient(client);
      const savedPrincipal : any = localStorage.getItem("plugPrincipal");


      if (savedPrincipal) {
        setIsAuthenticated(true);
        setPrincipal(savedPrincipal);
        // Set to true only if authenticated
      } else {
        // Clear stored principal if not authenticated
        localStorage.removeItem("plugPrincipal");
      }

    });
  }, []);

  useEffect(() => {
    if (authClient) {
      updateClient(authClient);
    }
  }, [authClient]);

  // Helper function to convert binary data to a hex string
  const toHexString = (byteArray : any) => {
    return Array.from(byteArray, (byte : any ) =>
      ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
  };
  const createDaoActor = (canisterId : any) => {
    try {
      const agent = new HttpAgent({ identity });

      if (process.env.DFX_NETWORK !== 'production') {
        agent.fetchRootKey().catch(err => {
          console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
          console.error(err);
        });
      }

      return Actor.createActor(DaoFactory, { agent, canisterId });
    } catch (err) {
      console.error("Error creating DAO actor:", err);
    }
  };

  const login = async (provider : any) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          !(await authClient.getIdentity().getPrincipal().isAnonymous())
        ) {
          // If already authenticated and not anonymous, update and resolve
          updateClient(authClient);
          setIsAuthenticated(true); // Set isAuthenticated to true if not anonymous
          resolve(authClient);
        } else {
          const opt = getLoginOptions(provider);

          if (provider === "plug") {
            // Check if Plug wallet is available
            if (windows.ic?.plug) {
              // Request connection to Plug
              const connect = await windows.ic.plug.requestConnect({
                whitelist: [process.env.CANISTER_ID_NEUROPAD_BACKEND], // Whitelist the backend canister
                host:
                  process.env.DFX_NETWORK === "ic"
                    ? "https://ic0.app"
                    : "http://localhost:3000",
                // Use correct host for local vs mainnet
              });
              const connected : any = (async () => {
                const result = await windows.ic.plug.isConnected();
              })();
              setConnected(connected);
              if (connected) {
                // Set up Plug agent
                await windows.ic.plug.createAgent({
                  whitelist: [process.env.CANISTER_ID_NEUROPAD_BACKEND, "dmalx-m4aaa-aaaaa-qaanq-cai", "dxfxs-weaaa-aaaaa-qaapa-cai", "gl6nx-5maaa-aaaaa-qaaqq-cai"], // Whitelist the backend canister
                  host:
                    process.env.DFX_NETWORK === "ic"
                      ? "https://ic0.app"
                      : "http://localhost:3000"
                });

                // Get principal from Plug wallet
                const plugPrincipal = await windows.ic.plug.agent.getPrincipal();
                setPrincipal(plugPrincipal.toString());

                // Derive account ID from principal
                const accountId : any = AccountIdentifier.fromPrincipal({
                  principal: plugPrincipal,
                });

                // Store principal and account ID in localStorage
                localStorage.setItem("plugPrincipal", plugPrincipal.toString());
                setAccountId(toHexString(accountId.bytes));
                setAccountIdString(toHexString(accountId.bytes));
                const storedPrincipal = localStorage.getItem("plugPrincipal");
                if (storedPrincipal) {
                  setPrincipal(storedPrincipal);
                } else {
                  console.warn("Plug Principal not found in localStorage.");
                }



                // Create the backend actor using the IDL factory
                const backendActor = await windows.ic.plug.createActor({
                  canisterId: process.env.CANISTER_ID_NEUROPAD_BACKEND, // Backend canister ID
                  interfaceFactory: idlFactory, // IDL factory for backend canister
                });

                setBackendActor(backendActor);

                setIsAuthenticated(true); // Manually set to true after successfully retrieving principal
                if (backendActor) {
                  await checkUser(plugPrincipal.toString());
                }
                // updateClient(authClient); // Update the client session

                // Resolve the promise with the authClient after success
                resolve(authClient);
              } else {
                reject("Plug connection failed");
              }
            } else {
              // Plug wallet is not installed
              alert(
                "Plug wallet is not installed. Please install the Plug wallet extension."
              );
              reject("Plug wallet not installed");
            }
          } else {
            // If not Plug, handle other providers (e.g., Internet Identity)
            authClient.login({
              ...opt,
              onError: (error : any ) => reject(error),
              onSuccess: () => {
                updateClient(authClient);
                setIsAuthenticated(true); // Manually set isAuthenticated to true
                navigate("/"); // Redirect to dashboard after successful login
                resolve(authClient);
              },
            });
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        reject(error); // Reject promise in case of error
      }
    });
  };

  const getLoginOptions = (provider : any) => {
    switch (provider) {
      case "ii":
        return options.loginOptionsii;
      case "nfid":
        return options.loginOptionsnfid;
      case "plug":
        return options.loginOptionsPlug;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  };

  const logout = async () => {
    try {
      await authClient.logout();
      localStorage.removeItem("plugPrincipal"); // Clear the stored principal
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setBackendActor(null);
      setAccountId(null);
      if (!isSwitchingWallet) {
        windows.location.reload();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateClient = async (client : any) => {
    try {
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      const identity = client.getIdentity();
      setIdentity(identity);

      const principal = identity.getPrincipal();
      setPrincipal(principal.toString());
      setStringPrincipal(principal.toString());

      const accountId : any = AccountIdentifier.fromPrincipal({ principal });
      setAccountId(toHexString(accountId.bytes));
      setAccountIdString(toHexString(accountId.bytes));

      const agent = new HttpAgent({ identity });
      const id : any = process.env.CANISTER_ID_NEUROPAD_BACKEND
      const backendActor = createActor(
        id,
        { agent }
      );
      setBackendActor(backendActor);
      if (backendActor) {
        await checkUser(principal.toString());
      } else {
        console.error("Backend actor initialization failed.");
      }
    } catch (error) {
      console.error("Authentication update error:", error);
    }
  };
  const createLedgerActor = async (canisterId : any, IdlFac : any) => {
    let actor;
    let agent;

    try {
      if (windows.ic?.plug) {
        // Check if Plug is connected
        const isPlugConnected = await windows.ic.plug.isConnected();
        if (!isPlugConnected) {
          throw new Error("Plug wallet is not connected");
        }

        // Create Plug agent
        await windows.ic.plug.createAgent({
          whitelist: [canisterId],
          host:
            process.env.DFX_NETWORK === "ic"
              ? "https://ic0.app"
              : "http://localhost:3000",
        });

        agent = windows.ic.plug.agent;
        if (!agent) {
          throw new Error("Failed to create Plug agent");
        }
        // await windows?.ic?.plug?.requestConnect({
        //   whitelist: [canisterId],
        // });
        // Create actor with Plug
        actor = await windows.ic.plug.createActor({
          canisterId: canisterId,
          interfaceFactory: IdlFac,
          // agent: agent
        });
      } else {
        // Non-Plug case (e.g., Internet Identity)
        agent = new HttpAgent({ identity });

        if (process.env.DFX_NETWORK !== "ic") {
          agent.fetchRootKey().catch((err) => {
            console.warn("Unable to fetch root key. Is the local replica running?");
            console.error(err);
          });
        }

        // Create actor with HttpAgent
        actor = Actor.createActor(IdlFac, { agent, canisterId });
      }
      return actor;
    } catch (error) {
      console.error("Error creating ledger actor:", error);
    }
  };

  const reloadLogin = async () => {
    try {
      if (
        authClient.isAuthenticated() &&
        !(await authClient.getIdentity().getPrincipal().isAnonymous())
      ) {
        updateClient(authClient);
      }
    } catch (error) {
      console.error("Reload login error:", error);
    }
  };

  const checkUser = async (user: any ) => {
    if (!backendActor) {
      throw new Error("Backend actor not initialized");
    }
    try {
      const result = await backendActor?.check_user_existance(user);
      return result;
    } catch (error) {
      console.error("Error checking user:", error);
      throw error;
    }
  };


  const frontendCanisterId = process.env.CANISTER_ID_NEUROPAD_FRONTEND || process.env.CANISTER_ID;

  return {
    isAuthenticated,
    login,
    logout,
    updateClient,
    authClient,
    identity,
    principal,
    backendActor,
    accountId,
    createLedgerActor,
    reloadLogin,
    accountIdString,
    createDaoActor,
    checkUser,
    frontendCanisterId,
    stringPrincipal,

  };
};

// Authentication provider component
export const AuthProvider = ({ children } : any ) => {
  const auth = useAuthClient();

  if (!auth.authClient || !auth.backendActor) {
    return null; 
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to access authentication context
export const useAuth : any = () => useContext(AuthContext);
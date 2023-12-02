'use strict';
/**
 * CryptoProviderAPI - A manager for cryptocurrency API providers and configurations.
 *
 * Wally.id - Crypto API Manager draft1 by anoxydoxy{at}gmail.com
 *
 * Visit https://github.com/anoxxxy/wally.id or https://wally.id for more information.
 */
class CryptoProviderAPI {
  constructor() {
    this.CryptoAPIs = {
      utxo: {
        mainnet: {
          balance: {
            multiaddress: {
              providers: {
                'cryptoid.info': {
                  'url': 'https://chainz.cryptoid.info/{coin}/api.dws?q=multiaddr&active={address}&key={apikey}&n={time}',
                  'coin': null,
                  'delimiter': '|',
                  'apiKey': '',
                  'time': 0,
                },
                service2: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
              },
              coin_providers: {
                // Add coin-specific services for Bitcoin
                bitcoin: {
                  'blockchain.info': {
                    'url': 'https://blockchain.info/balance?active={address}&base=BTC&cors=true',
                    'coin': null,
                    'delimiter': ',',
                    'apiKey': null,
                    'time': null,
                  },
                  service1: {
                    url: '...',
                    delimiter: '|',
                    apiKey: '...',
                  },
                  // Add more coin-specific services for Bitcoin
                },
                // Add coin-specific services for Litecoin
                litecoin: {
                  service1: {
                    url: '...',
                    delimiter: '|',
                    apiKey: '...',
                  },
                  // Add more coin-specific services for Litecoin
                },
              },
              // Add more service providers for UTXO-based coins
            },
            custom_providers: {}, // User custom providers
          },
          listunspent: {
            providers: {
              service1: {
                url: '...',
                delimiter: ',',
                apiKey: '...',
              },
              service2: {
                url: '...',
                delimiter: '|',
                apiKey: '...',
              },
            },
            coin_providers: {
              // Add coin-specific services for Bitcoin
              bitcoin: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Bitcoin
              },
              // Add coin-specific services for Litecoin
              litecoin: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Litecoin
              },
            },
            // Add more service providers for UTXO-based coins
            custom_providers: {}, // User custom providers
          },
          pushrawtx: {
            providers: {
              service1: {
                url: '...',
                delimiter: ',',
                apiKey: '...',
              },
              service2: {
                url: '...',
                delimiter: '|',
                apiKey: '...',
              },
            },
            coin_providers: {
              // Add coin-specific services for Bitcoin
              bitcoin: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Bitcoin
              },
              // Add coin-specific services for Litecoin
              litecoin: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Litecoin
              },
            },
            // Add more service providers for UTXO-based coins
            custom_providers: {}, // User custom providers
          },
        },
        testnet: {
          balance: {
            multiaddress: {
              providers: {
                service1: {
                  url: '...',
                  delimiter: ',',
                  apiKey: '...',
                },
                service2: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
              },
              coin_providers: {
                // Add coin-specific services for Bitcoin
                bitcoin: {
                  service1: {
                    url: '...',
                    delimiter: '|',
                    apiKey: '...',
                  },
                  // Add more coin-specific services for Bitcoin
                },
                // Add coin-specific services for Litecoin
                litecoin: {
                  service1: {
                    url: '...',
                    delimiter: '|',
                    apiKey: '...',
                  },
                  // Add more coin-specific services for Litecoin
                },
              },
              // Add more service providers for UTXO-based coins
            },
            custom_providers: {}, // User custom providers
          },
          listunspent: {
            providers: {
              service1: {
                url: '...',
                delimiter: ',',
                apiKey: '...',
              },
              service2: {
                url: '...',
                delimiter: '|',
                apiKey: '...',
              },
            },
            coin_providers: {
              // Add coin-specific services for Bitcoin
              bitcoin: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Bitcoin
              },
              // Add coin-specific services for Litecoin
              litecoin: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Litecoin
              },
            },
            // Add more service providers for UTXO-based coins
            custom_providers: {}, // User custom providers
          },
          pushrawtx: {
            providers: {
              service1: {
                url: '...',
                delimiter: ',',
                apiKey: '...',
              },
              service2: {
                url: '...',
                delimiter: '|',
                apiKey: '...',
              },
            },
            coin_providers: {
              // Add coin-specific services for Bitcoin
              bitcoin: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Bitcoin
              },
              // Add coin-specific services for Litecoin
              litecoin: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Litecoin
              },
            },
            // Add more service providers for UTXO-based coins
            custom_providers: {}, // User custom providers
          },
        },
      },
      evm: {
        mainnet: {
          balance: {
            multiaddress: {
                //unified API for EVM, EVM has no unified providers yet!
              providers: {
                /*service1: {
                  url: '...',
                  delimiter: ',',
                  apiKey: '...',
                },
                service2: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                */
              },
              coin_providers: {
                // Add coin-specific services for EVM coins
                avax: {
                  'snowtrace.io': {
                    'url': 'https://api.snowtrace.io/api?module=account&action=balancemulti&address={address}&tag=latest&apikey={apikey}',
                    'delimiter': ',',
                    'apiKey': '',
                  },
                },
                bnb: {
                  'bscscan.com': {
                    'url': 'https://api.bscscan.com/api?module=account&action=balancemulti&address={address}&tag=latest&apikey={apikey}',
                    'delimiter': ',',
                    'apiKey': '',
                  },
                  // Add more coin-specific services for the coin
                },
                ethereum: {
                  'etherscan.io': {
                    'url': 'https://api.etherscan.io/api?module=account&action=balancemulti&address={address}&tag=latest&apikey={apikey}',
                    'delimiter': ',',
                    'apiKey': '',
                    'apiKey': '',
                    'apiKey': '',
                    

                  },
                  // Add more coin-specific services for the coin
                },
                matic: {
                  'polygonscan.com': {
                    'url': 'https://api.polygonscan.com/api?module=account&action=balancemulti&address={address}&tag=latest&apikey={apikey}',
                    'delimiter': ',',
                    'apiKey': '',
                  },
                  // Add more coin-specific services for the coin
                },
                // Add coin-specific services for EVM coins

              },
              // Add more service providers for EVM-based coins
            },
            custom_providers: {
                // for testing purpose
                /*ethereum: {
                  'etherscan.io-test': {
                    'url': 'https://api.etherscan1.io/api?module=account&action=balancemulti&address={address}&tag=latest&apikey={apikey}',
                    'delimiter': ',',
                    'apiKey': '',
                  },
                  'etherscan.io-test2': {
                    'url': 'https://api.etherscan2.io/api?module=account&action=balancemulti&address={address}&tag=latest&apikey={apikey}',
                    'delimiter': ',',
                    'apiKey': '',
                  },
                  
                  // Add more coin-specific services for the coin
                },
                */
                
            }, // User custom providers
          },
          pushrawtx: {
            providers: {
              service1: {
                url: '...',
                delimiter: ',',
                apiKey: '...',
              },
              service2: {
                url: '...',
                delimiter: '|',
                apiKey: '...',
              },
            },
            coin_providers: {
              // Add coin-specific services for Bitcoin
              ethereum: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Bitcoin
              },
              // Add coin-specific services for Litecoin
              bnb: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Litecoin
              },
            },
            // Add more service providers for EVM-based coins
            custom_providers: {}, // User custom providers 
          },
        },
        testnet: {
          balance: {
            multiaddress: {
              //unified API for EVM, EVM has no unified providers yet!
              providers: {
                /*

                service1: {
                  url: '...',
                  delimiter: ',',
                  apiKey: '...',
                },
                service2: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                */
              },
              coin_providers: {
                // Add coin-specific services for Ethereum
                ethereum: {
                  service1: {
                    url: '...',
                    delimiter: '|',
                    apiKey: '...',
                  },
                  // Add more coin-specific services for Ethereum
                },
                // Add coin-specific services for BNB
                bnb: {
                  service1: {
                    url: '...',
                    delimiter: '|',
                    apiKey: '...',
                  },
                  // Add more coin-specific services for BNB
                },
              },
              // Add more service providers for EVM-based coins
            },
            custom_providers: {}, // User custom providers
          },
          pushrawtx: {
            providers: {
              service1: {
                url: '...',
                delimiter: ',',
                apiKey: '...',
              },
              service2: {
                url: '...',
                delimiter: '|',
                apiKey: '...',
              },
            },
            coin_providers: {
              // Add coin-specific services for Bitcoin
              ethereum: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Bitcoin
              },
              // Add coin-specific services for Litecoin
              bnb: {
                service1: {
                  url: '...',
                  delimiter: '|',
                  apiKey: '...',
                },
                // Add more coin-specific services for Litecoin
              },
            },
            // Add more service providers for EVM-based coins
            custom_providers: {}, // User custom providers
          },
        },
      },
    };

    // apiServices categorizes supported blockchain services into "utxo" and "evm" chains, specifying available API calls for each chain.
    this.apiServices = {
      utxo: ['balance', 'pushrawtx', 'listunspent'],
      evm: ['balance', 'pushrawtx'],
    };
    this.version = '0.01'; //class version
    this.providerRateLimits = {}; // Track rate limiting data
    this.rateLimitInterval = 30000; // Rate limit interval in milliseconds
    /* Example of providerRateLimits
      this.providerRateLimits = {
      "provider1": {
          lastRequestTime: 1636558217000, // Timestamp when the last request was made
      },
      "provider2": {
          lastRequestTime: 1636558274000, // Timestamp when the last request was made
      },
      "custom-provider": {
          lastRequestTime: 1636558325000, // Timestamp when the last request was made for the custom provider
      },
      // Add more providers as needed
  };
  */
  }
  // Add a rate-limited request for a provider
  /**
   * Make a rate-limited request to a provider using the specified request function.
   * @param {string} provider - The provider's identifier.
   * @param {Function} requestFunction - The function that performs the request.
   * @returns {Promise<any|boolean>} A promise with the response data, or `false` if rate limit exceeded.
   */
  async makeRateLimitedRequest(provider, requestFunction) {
    // Get the current timestamp
    const currentTime = Date.now();
    
    // Get rate limit data for the provider or initialize with default values
    const rateLimitData = this.providerRateLimits[provider] || { lastRequestTime: 0 };

    if (currentTime - rateLimitData.lastRequestTime >= this.rateLimitInterval) {
      console.log('make api call');
      // Rate limit interval exceeded, make the request
      rateLimitData.lastRequestTime = currentTime;
      this.providerRateLimits[provider] = rateLimitData;
      return await requestFunction();
    } else {
      console.log('do not make api call');
      // Rate limit exceeded, don't make the request
      console.log('Rate limit exceeded, dont make the request');
      return false;
    }
  }



  /**
   * Example usage of rate-limited request to retrieve custom provider data.
   *
   * @param {string} chainType - The type of blockchain (e.g., 'utxo', 'evm').
   * @param {string} coin - The name of the coin or token.
   * @param {string} service - The service type (e.g., 'balance', 'pushrawtx').
   * @param {string} [network='mainnet'] - The network type (e.g., 'mainnet', 'testnet').
   * @returns {Promise<boolean|*>} - A Promise that resolves with the custom provider data if the rate limit
   *     allows the request, or `false` if the rate limit has been exceeded or if the custom provider is not found.
   */
  async getCustomProviderData(chainType, coin, service, network = 'mainnet') {
    const provider = this.getCustomProvider(chainType, coin, service, network);
    if (provider) {
      // Define the request function for the specific provider
      const requestFunction = async () => {
        // Make the actual API request here
        // Replace this with your actual API request code
        // For example, you can use fetch or an HTTP library to make the request
        //const response = await makeApiRequest(provider.url, provider.apiKey);
        //return response;
        return true;
      };
      // Make a rate-limited request
      const response = await this.makeRateLimitedRequest(provider.url, requestFunction);
      return response;
    }
    else {
      return false;
    }
  }
  /**
   * Get unified service providers for a specific chain on a given network.
   *
   * @param {string} chainType - The type of blockchain (e.g., 'utxo', 'evm').
   * @param {string} [network='mainnet'] - The network type (e.g., 'mainnet', 'testnet').
   * @returns {UtxoBalanceConfig|EvmBalanceConfig|false} - The unified service providers or false if not found.
   */
  getUnifiedProviders(chainType, network = 'mainnet') {
    if (this.CryptoAPIs[chainType] && this.CryptoAPIs[chainType][network] && this.CryptoAPIs[chainType][network].balance) {
      return this.CryptoAPIs[chainType][network].balance.multiaddress.providers;
    }
    return false;
  }
  /**
   * Get coin-specific service providers for a given coin on a specific chain and network.
   *
   * @param {string} coin - The name of the coin (e.g., 'bitcoin', 'litecoin', 'ethereum').
   * @param {string} chainType - The type of blockchain (e.g., 'utxo', 'evm').
   * @param {string} [network='mainnet'] - The network type (e.g., 'mainnet', 'testnet').
   * @returns {CoinProviders|false} - The coin-specific service providers or false if not found.
   */
  getCoinProviders(coin, chainType, network = 'mainnet') {
    if (this.CryptoAPIs[chainType] && this.CryptoAPIs[chainType][network] && this.CryptoAPIs[chainType][network].balance && this.CryptoAPIs[chainType][network].balance.multiaddress.coin_providers && this.CryptoAPIs[chainType][network].balance.multiaddress.coin_providers[coin]) {
      return this.CryptoAPIs[chainType][network].balance.multiaddress.coin_providers[coin];
    }
    return false;
  }
  /**
   * Add a user-defined provider for a specific chain, coin, and service.
   * @param {string} chainType - The type of blockchain (e.g., 'utxo' or 'evm').
   * @param {string} coin - The specific coin or token identifier.
   * @param {string} service - The service (e.g., 'balance' or 'pushrawtx').
   * @param {Object} provider - The provider details to be added.
   * @param {string} [network="mainnet"] - The network type (e.g., 'mainnet' or 'testnet').
   * @returns {boolean|void} - Returns false if the chain or service is invalid, or undefined on success.
   */
  addCustomProvider(chainType, coin, service, provider, network = 'mainnet') {
    const validApiServices = {
      utxo: ['balance', 'pushrawtx', 'listunspent'],
      evm: ['balance', 'pushrawtx'],
    };
    const validServices = this.apiServices[chainType];
    if (!validServices || !validServices.includes(service)) {
      return false;
    }
    if (!this.CryptoAPIs[chainType] || !this.CryptoAPIs[chainType][network]) {
      this.CryptoAPIs[chainType] = this.CryptoAPIs[chainType] || {};
      this.CryptoAPIs[chainType][network] = this.CryptoAPIs[chainType][network] || {};
    }
    if (!this.CryptoAPIs[chainType][network][service]) {
      this.CryptoAPIs[chainType][network][service] = {
        providers: {},
        coin_providers: {},
        custom_providers: {},
      };
    }
    // Custom provider validation
    if (!provider.url || !provider.delimiter || !provider.apiKey) {
      return false; // Invalid provider object
    }
    this.CryptoAPIs[chainType][network][service].custom_providers[coin] = provider;
    // Return true or any meaningful value on success if needed
    return true;
  }
  /**
   * Get a custom provider for a specific chain, service, and coin.
   * @param {string} chainType - The type of blockchain (e.g., 'utxo', 'evm').
   * @param {string} coin - The name of the coin or token.
   * @param {string} service - The service type (e.g., 'balance', 'pushrawtx').
   * @param {string} network - The network type (e.g., 'mainnet', 'testnet').
   * @returns {object|boolean} - The custom provider object if found, or false if not found.
   */
  getCustomProvider(chainType, coin, service, network = 'mainnet') {
    if (this.CryptoAPIs[chainType] && this.CryptoAPIs[chainType][network] && this.CryptoAPIs[chainType][network][service]) {
      const customProviders = this.CryptoAPIs[chainType][network][service].custom_providers;
      if (customProviders && customProviders[coin]) {
        return customProviders[coin];
      }
    }
    return false;
  }

  /**
   * Build a provider URL by replacing placeholders in the URL template.
   *
   * @param {object} provider - The provider object containing URL template, delimiter, and apiKey.
   * @param {object} customOptions - An object containing user-customized options for URL construction.
   * @param {string[]} customOptions.addresses - An array of addresses to replace '{address}' placeholder.
   * @param {string} [customOptions.customDelimiter] - Custom delimiter for addresses.
   * @param {string} [customOptions.customApiKey] - Custom API key.
   * @param {number|string} [customOptions.customTime] - Custom timestamp (UTC Unix timestamp).
   * @returns {string} - The constructed URL with placeholders replaced.
   */
  buildProviderURL(provider, customOptions) {
    // Use the provider's values if custom values are not provided
    const delimiter = customOptions.delimiter || provider.delimiter;
    const apiKey = customOptions.apiKey || provider.apiKey;
    const time = parseInt(customOptions.time) || Date.now(); // UTC Unix timestamp
    const coin = customOptions.coin || provider.coin;

    /*
    const {
      addresses,
      customDelimiter: delimiter,
      customApiKey: apiKey,
      customTime: time,
      coin
    } = customOptions;
    */
    // Join multiple addresses using the delimiter
    const addressesString = customOptions.address.join(delimiter);

    // Convert the coin ticker to lowercase
    const coinTicker = (coin || '').toLowerCase();


    console.log('buildProviderURL provider: ', provider);
    console.log('buildProviderURL provider.url: ', provider.url);
    // Replace placeholders in the URL
    let urlWithReplacements = provider.url.replace('{address}', addressesString);
    urlWithReplacements = urlWithReplacements.replace('{coin}', coinTicker);
    urlWithReplacements = urlWithReplacements.replace('{apikey}', apiKey);
    urlWithReplacements = urlWithReplacements.replace('{time}', time);

    return urlWithReplacements;
}

}


//*Dummy Samples API Function*//



// Test 1: Add and retrieve custom provider (Valid Service)
const apiProvider = new CryptoProviderAPI();
apiProvider.addCustomProvider('utxo', 'custom-coin', 'balance', {
  url: 'https://mybtcprovider.com',
  delimiter: ',',
  apiKey: 'myapikey123',
});
const customProvider = apiProvider.getCustomProvider('utxo', 'custom-coin', 'balance', 'mainnet');
if (customProvider) {
  console.log('Test 1: Custom Provider (Valid Service) - Test Passed');
}else {
  console.log('Test 1: Custom Provider not found for a valid service - Test Failed');
}
// Test 2: Add custom provider to an invalid service
const invalidServiceResult = apiProvider.addCustomProvider('utxo', 'custom-coin', 'invalid-service', {
  url: 'https://mybtcprovider.com',
  delimiter: ',',
  apiKey: 'myapikey123',
});
if (invalidServiceResult === false) {
  console.log('Test 2: Invalid service (Expected Result) - Test Passed');
}else {
  console.log('Test 2: Custom Provider added to an invalid service - Test Failed');
}
// Test 3: Add custom provider to an invalid chain type
const invalidChainTypeResult = apiProvider.addCustomProvider('unknown-chain', 'custom-coin', 'balance', {
  url: 'https://mybtcprovider.com',
  delimiter: ',',
  apiKey: 'myapikey123',
});
if (invalidChainTypeResult === false) {
  console.log('Test 3: Invalid chain type (Expected Result) - Test Passed');
}else {
  console.log('Test 3: Custom Provider added to an invalid chain type - Test Failed');
}
// Test 4: Get custom provider with an unknown network
const unknownNetworkProvider = apiProvider.getCustomProvider('utxo', 'custom-coin', 'balance', 'unknown-network');
if (unknownNetworkProvider === false) {
  console.log('Test 4: Custom Provider not found for unknown network - Test Passed');
}else {
  console.log('Test 4: Unexpected result - Test Failed');
}
// Test 5: Get custom provider with an unknown service
const unknownServiceProvider = apiProvider.getCustomProvider('utxo', 'custom-coin', 'unknown-service', 'mainnet');
if (unknownServiceProvider === false) {
  console.log('Test 5: Custom Provider not found for unknown service - Test Passed');
}else {
  console.log('Test 5: Unexpected result - Test Failed');
}
// Test 6: Get custom provider with an unknown coin
const unknownCoinProvider = apiProvider.getCustomProvider('utxo', 'unknown-coin', 'balance', 'mainnet');
if (unknownCoinProvider === false) {
  console.log('Test 6: Custom Provider not found for unknown coin - Test Passed');
}else {
  console.log('Test 6: Unexpected result - Test Failed');
}
// Test 7: Get custom provider data (Success Example 2)
const successExample2 = apiProvider.getCustomProviderData('evm', 'custom-coin', 'pushrawtx', 'mainnet');
if (successExample2) {
  console.log('Test 7: Success Example 2 - Custom Provider Data - Test Failed');
}else {
  console.log('Test 7: Success Example 2 - Custom Provider Data not found - Test Passed');
}
// Test 8: Add and retrieve custom provider (Valid Service) on testnet
apiProvider.addCustomProvider('evm', 'custom-coin2', 'pushrawtx', {
  url: 'https://etherscan.com',
  delimiter: ',',
  apiKey: 'myapikey123',
}, 'testnet');
// Test 9: Get custom provider data (Success Example 3)
const successExample3 = apiProvider.getCustomProviderData('evm', 'custom-coin2', 'pushrawtx', 'testnet');
if (successExample3) {
  console.log('Test 9: Success Example 3 - Custom Provider Data - Test Passed');
}else {
  console.log('Test 9: Success Example 3 - Custom Provider Data not found - Test Failed');
}
// Test 10: Get custom provider data (Failed Example - Custom provider does not exist)
const failedExample = apiProvider.getCustomProviderData('utxo', 'unknown-coin', 'balance', 'mainnet');
if (failedExample === false) {
  console.log('Test 10: Failed Example - Custom Provider Data not found - Test Passed');
}else {
  console.log('Test 10: Failed Example - Unexpected result - Test Failed');
}


// Using buildProviderURL with getUnifiedProviders:

// Get unified providers for Ethereum on the mainnet
const unifiedProviders = apiProvider.getUnifiedProviders('utxo', 'mainnet');
console.log('buildProviderURL 1 - getUnifiedProviders: ', unifiedProviders);
if (unifiedProviders) {
  const provider = unifiedProviders['cryptoid.info'];
  const customOptions = {
    coin: 'btc',
    address: ['0xd41c057fd1c78805AAC12B0A94a405c0461A6FBb', '0x8735015837bD10e05d9cf5EA43A2486Bf4Be156F'],
  };

  const url = apiProvider.buildProviderURL(provider, customOptions);
  console.log('buildProviderURL 1 - getUnifiedProviders: Unified Providers URL (Test Passed):', url);
} else {
  console.log('buildProviderURL 1 - getUnifiedProvidersL: Unified Providers not found (Test Failed).');
}

/*
const unifiedProviders = apiProvider.getUnifiedProviders('evm', 'mainnet');
console.log('buildProviderURL 1 - getUnifiedProviders: ', unifiedProviders);
if (unifiedProviders) {
  const provider = unifiedProviders['etherscan.io'];
  const customOptions = {
    address: ['0xd41c057fd1c78805AAC12B0A94a405c0461A6FBb', '0x8735015837bD10e05d9cf5EA43A2486Bf4Be156F'],
  };

  const url = apiProvider.buildProviderURL(provider, customOptions);
  console.log('buildProviderURL 1 - getUnifiedProviders: Unified Providers URL (Test Passed):', url);
} else {
  console.log('buildProvaiderUR 1 - getUnifiedProvidersL: Unified Providers not found (Test Failed).');
}
*/
/*
// Using buildProviderURL with getCoinProviders:
// Get coin-specific providers for Ethereum on the mainnet
const coinProviders = apiProvider.getCoinProviders('ethereum', 'evm', 'mainnet');
console.log('buildProviderURL 2 - coinProviders: ', coinProviders);
if (coinProviders) {
  const provider = coinProviders['etherscan.io'];
  const customOptions = {
    address: ['0xd41c057fd1c78805AAC12B0A94a405c0461A6FBb', '0x8735015837bD10e05d9cf5EA43A2486Bf4Be156F'],
  };

  const url = apiProvider.buildProviderURL(provider, customOptions);
  console.log('buildProviderURL 2 - getCoinProviders: Coin Providers URL (Test Passed):', url);
} else {
  console.log('buildProviderURL 2 - getCoinProviders: Coin Providers not found. (Test Failed)');
}

//  Using buildProviderURL with getCustomProvider
// Get a custom provider for a specific chain, service, and coin
const customProvider3 = apiProvider.getCustomProvider('evm', 'ethereum', 'balance', 'mainnet');
console.log('buildProviderURL 3 - getCustomProvider: ', customProvider3);
if (customProvider3) {
  const firstProvider = Object.values(customProvider3)[0];
  const customOptions = {
    address: ['0xd41c057fd1c78805AAC12B0A94a405c0461A6FBb', '0x8735015837bD10e05d9cf5EA43A2486Bf4Be156F'],
    time: 12345,
    apiKey: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  };
  console.log('customProvider3: ', customProvider3);

  const url = apiProvider.buildProviderURL(firstProvider, customOptions);
  console.log('buildProviderURL 3 - getCustomProvider: Custom Provider URL (Test Passed):', url);
} else {
  console.log('buildProviderURL 3 - getCustomProvider: Custom Provider not found (Test Failed).');
}


/*

function getProviderForAssetAndApiService(asset, apiService, chainType, network) {
  const providersKey = wally_fn.networks[network][asset].asset.providers[apiService];

  if (providersKey) {
    // Check if there are any unified providers for the specified ApiService
    const unifiedProviders = apiProvider.getUnifiedProviders(chainType, network);

    for (const providerName in providersKey) {
      if (unifiedProviders && unifiedProviders[providerName]) {
        // Return the unified provider name and mark it as a unified provider
        return { name: providerName, type: 'unified' };
      }
    }
  }

  // If there are no unified providers, check for custom providers for the specified ApiService
  const customProviders = apiProvider.getCoinProviders(asset, chainType, network);

  for (const providerName in customProviders) {
    // Return the custom provider name and mark it as a coin-specific provider
    return { name: providerName, type: 'coin-specific' };
  }

  // If no providers are found, return null
  return null;
}

// Example usage:
const asset = 'bitcoin';
const apiService = 'balance'; // 'balance', 'listunspent', etc.
const chainType = 'utxo'; // 'utxo', 'evm', etc.
const network = wally_fn.network; // 'mainnet' or 'testnet'

const selectedProvider = getProviderForAssetAndApiService(asset, apiService, chainType, network);
if (selectedProvider) {
  console.log(`Selected provider for ${asset} (${network}) - ${apiService}: ${selectedProvider.name}`);
  console.log(`Provider type: ${selectedProvider.type}`);
} else {
  console.log(`No providers found for ${asset} (${network}) - ${apiService}`);
}



*/






/*
function getUnifiedProviderForAsset(asset, apiService, chainType, network) {
  const providersKey = wally_fn.networks[network][asset].asset.providers[apiService];

  if (providersKey) {
    // Check if there are any unified providers for the specified ApiService
    const unifiedProviders = apiProvider.getUnifiedProviders(chainType, network);

    for (const providerName in providersKey) {
      if (unifiedProviders && unifiedProviders[providerName]) {
        // Return the unified provider name and mark it as a unified provider
        return { name: providerName, type: 'unified' };
      }
    }
  }

  // If no suitable unified providers are found, return null
  return null;
}

function getCoinProviderForAsset(asset, apiService, chainType, network) {
  const providersKey = wally_fn.networks[network][asset].asset.providers[apiService];

  if (providersKey) {
    // Check if there are any coin-specific providers for the specified ApiService
    const coinProviders = apiProvider.getCoinProviders(asset, chainType, network);

    for (const providerName in providersKey) {
      if (coinProviders && coinProviders[providerName]) {
        // Return the coin-specific provider name and mark it as a coin-specific provider
        return { name: providerName, type: 'coin-specific' };
      }
    }
  }

  // If no suitable coin-specific providers are found, return null
  return null;
}

// Example usage:
const asset = 'bitcoin';
const apiService = 'balance'; // 'balance', 'listunspent', etc.
const chainType = 'utxo'; // 'utxo', 'evm', etc.
const network = wally_fn.network; // 'mainnet' or 'testnet'

const selectedUnifiedProvider = getUnifiedProviderForAsset(asset, apiService, chainType, network);
const selectedCoinProvider = getCoinProviderForAsset(asset, apiService, chainType, network);

console.log(`Unified Provider type: ${selectedUnifiedProvider.type}`);
console.log(`Coin Provider type: ${selectedCoinProvider.type}`);

if (selectedUnifiedProvider) {
  console.log(`Selected unified provider for ${asset} (${network}) - ${apiService}: ${selectedUnifiedProvider.name}`);
  console.log(`Provider type: ${selectedUnifiedProvider.type}`);
} else if (selectedCoinProvider) {
  console.log(`Selected coin-specific provider for ${asset} (${network}) - ${apiService}: ${selectedCoinProvider.name}`);
  console.log(`Provider type: ${selectedCoinProvider.type}`);
} else {
  console.log(`No providers found for ${asset} (${network}) - ${apiService}`);
}

*/
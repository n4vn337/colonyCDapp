import { ColonyNetworkClient, Network } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { call, put, select } from 'redux-saga/effects';

import { GasPricesProps } from '../../immutable';
import { ContextModule, getContext } from '~context';
import { log } from '~utils/debug';
import { DEFAULT_NETWORK } from '~constants';
import { ETH_GAS_STATION, XDAI_GAS_STATION } from '~constants/externalUrls';

import { gasPrices as gasPricesSelector } from '../../selectors';
import { updateGasPrices } from '../../actionCreators';

interface EthGasStationAPIResponse {
  average: number;
  avgWait: number;
  // eslint-disable-next-line camelcase
  block_time: number;
  blockNum: number;
  fast: number;
  fastest: number;
  fastWait: number;
  fastestWait: number;
  safeLow: number;
  safeLowWait: number;
  speed: number;
}

interface BlockscoutGasStationAPIResponse {
  average: number;
  fast: number;
  slow: number;
}

const DEFAULT_GAS_PRICE = BigNumber.from('1000000000');

const fetchGasPrices = async (
  networkClient: ColonyNetworkClient,
): Promise<GasPricesProps> => {
  let networkGasPrice = DEFAULT_GAS_PRICE;

  const defaultGasPrices = {
    timestamp: Date.now(),
    network: networkGasPrice,

    suggested: DEFAULT_GAS_PRICE,
    cheaper: DEFAULT_GAS_PRICE,
    faster: DEFAULT_GAS_PRICE,

    suggestedWait: 60,
    cheaperWait: 60,
    fasterWait: 60,
  };

  try {
    networkGasPrice = await networkClient.provider.getGasPrice();

    let response;

    if (DEFAULT_NETWORK === Network.Mainnet) {
      response = await fetch(ETH_GAS_STATION);
    }
    if (
      DEFAULT_NETWORK === Network.Xdai ||
      DEFAULT_NETWORK === Network.XdaiQa
    ) {
      response = await fetch(XDAI_GAS_STATION);
    }

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (DEFAULT_NETWORK === Network.Mainnet) {
      const data: EthGasStationAPIResponse = await response.json();
      // API prices are in 10Gwei, so they need to be normalised
      const pointOneGwei = BigNumber.from(10 ** 8);

      return {
        ...defaultGasPrices,

        suggested: BigNumber.from(data.average).mul(pointOneGwei),
        cheaper: BigNumber.from(data.safeLow).mul(pointOneGwei),
        faster: BigNumber.from(data.fast).mul(pointOneGwei),

        suggestedWait: data.avgWait * 60,
        cheaperWait: data.safeLowWait * 60,
        fasterWait: data.fastWait * 60,
      };
    }

    if (
      DEFAULT_NETWORK === Network.Xdai ||
      DEFAULT_NETWORK === Network.XdaiQa
    ) {
      const data: BlockscoutGasStationAPIResponse = await response.json();
      // API prices are in Gwei, so they need to be normalised
      const oneGwei = BigNumber.from(10 ** 9);

      /*
       * @NOTE Split the values into integer and remainder
       * (1.22 becomes 1 and 22)
       *
       * The integer part gets multiplied by 1 gwei, while the remainder
       * gets padded with 9 zeros. Everything will be added together.
       */
      const [averageInteger, averageRemainder = 0] = String(data.average).split(
        '.',
      );
      const [slowInteger, slowRemainder = 0] = String(data.slow).split('.');
      const [fastInteger, fastRemainder = 0] = String(data.fast).split('.');

      return {
        ...defaultGasPrices,

        suggested: BigNumber.from(averageInteger)
          .mul(oneGwei)
          .add(String(averageRemainder).padEnd(9, '0')),
        cheaper: BigNumber.from(slowInteger)
          .mul(oneGwei)
          .add(String(slowRemainder).padEnd(9, '0')),
        faster: BigNumber.from(fastInteger)
          .mul(oneGwei)
          .add(String(fastRemainder).padEnd(9, '0')),
      };
    }

    return defaultGasPrices;
  } catch (caughtError) {
    log.warn(
      `Could not get ${DEFAULT_NETWORK} network gas prices: ${caughtError.message}`,
    );
    // Default values
    return {
      ...defaultGasPrices,
      timestamp: -Infinity, // Do not cache this
    };
  }
};

export default function* getGasPrices() {
  const cachedPrices = yield select(gasPricesSelector);

  if (Date.now() - cachedPrices.timestamp < 15 * 60 * 1000) {
    return cachedPrices;
  }

  const { networkClient } = getContext(ContextModule.ColonyManager);

  const gasPrices: GasPricesProps = yield call(fetchGasPrices, networkClient);

  yield put(updateGasPrices(gasPrices));

  return gasPrices;
}

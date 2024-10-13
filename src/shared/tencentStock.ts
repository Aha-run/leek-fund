import Axios from 'axios';
import Log from './log';
import { decode } from 'iconv-lite';

const searchUrl = 'https://proxy.finance.qq.com/ifzqgtimg/appstock/smartbox/search/get';
const stockDataUrl = 'https://qt.gtimg.cn/q=';
export const searchStockList = async (keyword: string) => {
  Log.info('searchStockList keyword: ', keyword);
  const stockResponse = await Axios.get(searchUrl, {
    params: {
      q: keyword,
    },
  });
  Log.info('stockResponse: ', stockResponse.data);
  const stockListArray = stockResponse?.data?.data?.stock || [];
  Log.info('stockListStr: ', stockListArray, keyword);
  const stockList = stockListArray.map((stockItemArr: string[]) => {
    return {
      code: stockItemArr[1].toLowerCase(),
      name: stockItemArr[2],
      market: stockItemArr[0],
      abbreviation: stockItemArr[3],
    };
  });
  Log.info('stockList: ', stockList, keyword);
  return stockList;
};

export const getTencentHKStockData = async (codes: string[]) => {
  Log.info('getStockData codes: ', codes);
  const stockDataResponse = await Axios.get(stockDataUrl, {
    responseType: 'arraybuffer',
    transformResponse: [
      (data) => {
        const body = decode(data, 'GB18030');
        return body;
      },
    ],
    params: {
      q: codes.join(','),
    },
  });
  Log.info('stockDataResponse: ', stockDataResponse.data);
  const stockDataList = (stockDataResponse.data || '').split(';').map((stockItemStr: string) => {
    const stockItemArr = stockItemStr.split('~');
    return {
      code: 'hk' + stockItemArr[2],
      name: stockItemArr[1],
      price: stockItemArr[3],
      yestclose: stockItemArr[4],
      open: stockItemArr[5],
      high: stockItemArr[33],
      low: stockItemArr[34],
      volume: stockItemArr[36],
      amount: stockItemArr[37],
      buy1: stockItemArr[9],
      sell1: stockItemArr[19],
      time: stockItemArr[30],
    };
  });
  Log.info('stockDataList: ', stockDataList, codes);
  return stockDataList;
};
